---
layout:     post
title:      "mysql的profiles"
subtitle:   "mysql的profiles"
date:       2020-09-16
author:     "Lerko"
header-img: "/img/post-bg-e2e-ux.jpg"
catalog: true
multilingual: false
tags:
    - leetcode
---

## profiles能做什么

显示sql执行过程中各个环节的消耗情况，例如cpu使用情况，打开表、检查权限、执行优化器、返回数据等分别用了多长时间，可以分析语句执行慢的瓶颈在哪。

## 如何使用

如果要使用这个命令首先要设置profiling为on，mysql默认设置为off;


```sql
select @@profiling //查看profiling

set profiling =1;//打开profiling（当前会话）
set profiling=0;//关闭profiling（当前会话）

show profiles; //查看所有的语句的profile
show profile for query [id]; //查看某个query的具体执行情况
show profile all for query [id];//查看某个query的全部具体执行情况
```

```md
Status              |Duration|CPU_user|CPU_system|Context_voluntary|Context_involuntary|Block_ops_in|Block_ops_out|Messages_sent|Messages_received|Page_faults_major|Page_faults_minor|Swaps|Source_function      |Source_file         |Source_line|
--------------------|--------|--------|----------|-----------------|-------------------|------------|-------------|-------------|-----------------|-----------------|-----------------|-----|---------------------|--------------------|-----------|
starting            |0.000035|0.000000|  0.000034|                0|                  0|           0|            0|            0|                0|                0|                0|    0|                     |                    |           |
checking permissions|0.000005|0.000000|  0.000005|                0|                  0|           0|            0|            0|                0|                0|                0|    0|check_access         |sql_authorization.cc|        809|
Opening tables      |0.000011|0.000000|  0.000011|                0|                  0|           0|            0|            0|                0|                0|                0|    0|open_tables          |sql_base.cc         |       5781|
init                |0.000011|0.000000|  0.000011|                0|                  0|           0|            0|            0|                0|                0|                0|    0|handle_query         |sql_select.cc       |        128|
System lock         |0.000005|0.000000|  0.000005|                0|                  0|           0|            0|            0|                0|                0|                0|    0|mysql_lock_tables    |lock.cc             |        330|
optimizing          |0.000003|0.000000|  0.000003|                0|                  0|           0|            0|            0|                0|                0|                0|    0|optimize             |sql_optimizer.cc    |        158|
statistics          |0.000015|0.000000|  0.000016|                0|                  0|           0|            0|            0|                0|                0|                0|    0|optimize             |sql_optimizer.cc    |        374|
preparing           |0.000007|0.000000|  0.000007|                0|                  0|           0|            0|            0|                0|                0|                0|    0|optimize             |sql_optimizer.cc    |        482|
executing           |0.000002|0.000000|  0.000002|                0|                  0|           0|            0|            0|                0|                0|                0|    0|exec                 |sql_executor.cc     |        126|
Sending data        |0.000026|0.000000|  0.000026|                0|                  0|           0|            0|            0|                0|                0|                0|    0|exec                 |sql_executor.cc     |        202|
end                 |0.000003|0.000000|  0.000003|                0|                  0|           0|            0|            0|                0|                0|                0|    0|handle_query         |sql_select.cc       |        206|
query end           |0.000004|0.000000|  0.000004|                0|                  0|           0|            0|            0|                0|                0|                0|    0|mysql_execute_command|sql_parse.cc        |       4956|
closing tables      |0.000004|0.000000|  0.000004|                0|                  0|           0|            0|            0|                0|                0|                0|    0|mysql_execute_command|sql_parse.cc        |       5009|
freeing items       |0.000023|0.000000|  0.000014|                0|                  0|           0|            0|            0|                0|                0|                0|    0|mysql_parse          |sql_parse.cc        |       5622|
cleaning up         |0.000008|0.000000|  0.000008|                0|                  0|           0|            0|            0|                0|                0|                0|    0|dispatch_command     |sql_parse.cc        |       1931|
```

表格元数据

![20200917082435](http://chenyingqiao.github.io/img/20200917082435.png)

```
"Status": "query end", 状态
"Duration": "1.751142", 持续时间
"CPU_user": "0.008999", cpu用户
"CPU_system": "0.003999", cpu系统
"Context_voluntary": "98", 上下文主动切换
"Context_involuntary": "0", 上下文被动切换
"Block_ops_in": "8", 阻塞的输入操作
"Block_ops_out": "32", 阻塞的输出操作
"Messages_sent": "0", 消息发出
"Messages_received": "0", 消息接受
"Page_faults_major": "0", 主分页错误
"Page_faults_minor": "0", 次分页错误
"Swaps": "0", 交换次数
"Source_function": "mysql_execute_command", 源功能
"Source_file": "sql_parse.cc", 源文件
"Source_line": "4465" 源代码行
```


行数据解释

```
starting：开始
checking permissions：检查权限
Opening tables：打开表
init ： 初始化
System lock ：系统锁
optimizing ： 优化
statistics ： 统计
preparing ：准备
executing ：执行
Sending data ：发送数据
Sorting result ：排序
end ：结束
query end ：查询 结束
closing tables ： 关闭表 ／去除TMP 表
freeing items ： 释放项目
cleaning up ：清理
```


![20200917085410](http://chenyingqiao.github.io/img/20200917085410.png)

