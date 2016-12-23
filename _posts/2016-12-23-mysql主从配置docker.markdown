
---
layout:     post
title:      "mysql 主从复制"
subtitle:   "使用Docker创建本地mysql主从,实现主从分离"
date:       2016-12-15
author:     "Lerko"
header-img: "img/post-bg-unix-linux.jpg"
catalog: true
tags:
    - database
---

## docker创建环境

### 使用docker创建两个mysql容器

> docker 镜像可以使用网易蜂巢的mysql的docker镜像
> MYSQL_ROOT_PASSWORD是设置docker容器中mysql的root账户的密码

```
docker run --name mysql-master -v /home/docker/file/:/home/ -e MYSQL_ROOT_PASSWORD=111111 -d mysql
docker run --name mysql-slave -v /home/docker/file/:/home/ -e MYSQL_ROOT_PASSWORD=111111 -d mysql
#这里一般都要挂载一下外部目录这样docker才能和外部机器共享文件
```

### 今日容器之后需要准备的事情

> 由于镜像中没有提供vim 而且 镜像中的源是使用ubuntu的官方源 
> 如果我们没有使用科学上网apt-get update 将会非常慢
> 我使用的是deepin 我就吧deepin的源替换进去

```
# 拷贝deepin的源
sudo cp /etc/apt/source.list /home/docker/file/
#进入容器
docker exec -it mysql-master bash
```

```
# 进入容器之后 我们从共享的文件目录获取deepin的源 然后覆盖到容器中的源
cat /home/source.list > /etc/apt/source.list
apt-get update
apt-get upgrade
apt-get install vim
```

> mysql-slave 也是同样的更新一下源

## 开始配置mysql主从

> 每台mysql主机都有master和slave的概念
> 其实他是两个工作线程

> 将Mysql的数据分布到多个系统上去，这种分布的机制，是通过将Mysql的某一台主机的数据复制到其>它主机（slaves）上，并重新执行一遍来实现的。复制过程中一个服务器充当主服务器，而一个或多个其它服务器充当从服务器。主服务器将更新写入二进制日志文件，并维护文件的一个索引以跟踪日志循环。这些日志可以记录发送到从服务器的更新。当一个从服务器连接主服务器时，它通知主服务器从服务器在日志中读取的最后一次成功更新的位置。从服务器接收从那时起发生的任何更新，然后封锁并等待主服务器通知新的更新。

> 请注意当你进行复制时，所有对复制中的表的更新必须在主服务器上进行。否则，你必须要小心，以避免用户对主服务器上的表进行的更新与对从服务器上的表所进行的更新之间的冲突。

> 复制过程有一个很重要的限制——复制在slave上是串行化的，也就是说master上的并行更新操作不能在slave上并行操作。

### 从添加用户开始

> 我们需要添加一个mysql用户让slave来使用

**mysql-master 容器**
```shell
mysql -u root -p
#输入密码后进入mysql

#创建一个用户名为lerko密码为111111的可以使用任意ip访问的用户
create user  'lerko'@'%' IDENTIFIED BY '111111';

# 为用户开启curd权限
# 如果没有开启的话会导致 Slave_IO_Running :no
# 权限有select,insert,update,delete,create,drop, all privilege[表示给所有的权限]
#命令格式: `grant 权限1,权限2,…权限n on 数据库名称.表名称 to 用户名@用户地址 identified by ‘连接口令’;`
grant select,insert,update,delete,create,drop on *.* to lerko@'%' identified by '111111';
```

> 另外如果你没有开启权限就吧从库链接主库了
> 你要重新链接一次 因为主库的Position会变化
> 重新链接要使用stop slave结束丛库的slave

### 开启主和从服务器的二进制日志

**mysql-master**

```
# 修改mysql的配置文件开启二进制日志
vim /etc/mysql/my.cnf
#添加如下内容
[mysqld]
log-bin=mysql-bin   //[必须]启用二进制日志
server-id=1      //[必须]服务器唯一ID，默认是1，一般取IP最后一段
```

**mysql-slave**

```
# 修改mysql的配置文件开启二进制日志
vim /etc/mysql/my.cnf
#添加如下内容
[mysqld]
log-bin=mysql-bin   //[必须]启用二进制日志
server-id=1      //[必须]服务器唯一ID，默认是1，一般取IP最后一段
```

### 重启两个容器的mysql进程

> 这个会直接吧容器给停了  之后再start一下容器就行

```
service mysql restart;
```

### 查看主库的master以及从库的slave

**进入mysql**

```
show master status；
+------------------+----------+--------------+------------------+-------------------+
| File             | Position | Binlog_Do_DB | Binlog_Ignore_DB | Executed_Gtid_Set |
+------------------+----------+--------------+------------------+-------------------+
| mysql-bin.000001 |      681 |              |                  |                   |
+------------------+----------+--------------+------------------+-------------------+
```




### 从库把master链接到主库

> 这里我们只需要一个命令就可以

```shell
# master_log_file => 指向胡二进制文件
# master_log_pos => 二进制文件胡读取位置
change master to master_host='172.17.0.2',master_user='lerko',master_password='111111',master_log_file='mysql-bin.000001',master_log_pos=681;
```

> 主从ip可以使用`docker inspect [容器id]`来查看

### 去从服务器查看同步状态

```shell
# 进入mysql命令行
show slave status\G

*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: 172.17.0.2
                  Master_User: lerko
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000001
          Read_Master_Log_Pos: 1045
               Relay_Log_File: 68903b92c3ea-relay-bin.000003
                Relay_Log_Pos: 320
        Relay_Master_Log_File: mysql-bin.000001
             Slave_IO_Running: Yes [这个必须要yes]
            Slave_SQL_Running: Yes [这个必须要yes]
              Replicate_Do_DB: 
          Replicate_Ignore_DB: 
           Replicate_Do_Table: 
       Replicate_Ignore_Table: 
      Replicate_Wild_Do_Table: 
  Replicate_Wild_Ignore_Table: 
                   Last_Errno: 0
                   Last_Error: 
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 1045
              Relay_Log_Space: 534
              Until_Condition: None
               Until_Log_File: 
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File: 
           Master_SSL_CA_Path: 
              Master_SSL_Cert: 
            Master_SSL_Cipher: 
               Master_SSL_Key: 
        Seconds_Behind_Master: 0 [这个可以查看主从是否延迟]
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error: 
               Last_SQL_Errno: 0
               Last_SQL_Error: 
  Replicate_Ignore_Server_Ids: 
             Master_Server_Id: 1
                  Master_UUID: 38487393-c72a-11e6-a1c8-0242ac110002
             Master_Info_File: /var/lib/mysql/master.info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: Slave has read all relay log; waiting for more updates
           Master_Retry_Count: 86400
                  Master_Bind: 
      Last_IO_Error_Timestamp: 
     Last_SQL_Error_Timestamp: 
               Master_SSL_Crl: 
           Master_SSL_Crlpath: 
           Retrieved_Gtid_Set: 
            Executed_Gtid_Set: 
                Auto_Position: 0
         Replicate_Rewrite_DB: 
                 Channel_Name: 
           Master_TLS_Version: 
1 row in set (0.00 sec)

ERROR: 
No query specified

```


















