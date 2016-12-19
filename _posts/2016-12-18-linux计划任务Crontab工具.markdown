---
layout:     post
title:      "crontab工具的使用"
subtitle:   "crontab是一个linux重要的计划任务工具"
date:       2016-12-18
author:     "Lerko"
header-img: "img/post-bg-digital-native.jpg"
catalog: true
tags:
    - server
---

## 如何查看crontab是否安装？以及初次使用
 > 我们可以铜鼓 crontab -l就可以查看是否crontab这个工具是否有安装
 
 ```

crontab -l
如果出现 no crontab for root的话输入
crontab -e
会有如下的选项
no crontab for root - using an empty one

Select an editor.  To change later, run 'select-editor'.
  1. /bin/ed
  2. /bin/nano        <---- easiest
  3. /usr/bin/vim.basic
  4. /usr/bin/vim.tiny

Choose 1-4 [2]: 4     ---->我们一般选择的是第4个配置文件

之后我们就可以输入crontab -e对配置文件进行编辑

配置文件默认的内容是一些注释的说明 可以删除
-----------------------
# Edit this file to introduce tasks to be run by cron.
#
# Each task to run has to be defined through a single line
# indicating with different fields when the task will be run
# and what command to run for the task
#
# To define the time you can provide concrete values for
# minute (m), hour (h), day of month (dom), month (mon),
# and day of week (dow) or use '*' in these fields (for 'any').#
# Notice that tasks will be started based on the cron's system
# daemon's notion of time and timezones.
#
# Output of the crontab jobs (including errors) is sent through
# email to the user the crontab file belongs to (unless redirected).
#
# For example, you can run a backup of all your user accounts
# at 5 a.m every week with:
# 0 5 * * 1 tar -zcf /var/backups/home.tgz /home/
#
# For more information see the manual pages of crontab(5) and cron(8)
#
# m h  dom mon dow   command
-----------------------

比如我们要创建一个任务 
    {每分钟执行往tmp目录下的某个文件写如当前日期信息}
我们就可以这样写（>>标示的是将data输出的内容保存到文件中）
*/1 * * * * date >> /tmp/crontab_log.txt

 ```

 ## crontab -e 中配置文件的配置格式

```shell

* * * * * command
第一个× ：分钟 0-59
第二个× ：小时0-23
第三个× ：日期1-31
第四个× ：月份1-12
第五个× ：星期0-7

下面有几个实例
每晚的21:30 从其apache
    30 21 * * *　　service httpd restart
每月1好10号22号的４：４５重启apache
    45 4 1,10,22 * * service httpd result
每月的1-10号de 4:45 重启apache
    45 4 1-10 * * service httpd result
每分钟从启apache
    */2 * * * * service httpd restart
    1-59/2 * * * * service httpd restart
晚上１１点到早上７点之间，每个一小时从启ａｐａｃｈｅ
    0 23-7/1 * * * service httpd restart
每天固定2点时间启动ｐｙｔｈｏｎ脚本
    0 2 * * * python xxx.py

```