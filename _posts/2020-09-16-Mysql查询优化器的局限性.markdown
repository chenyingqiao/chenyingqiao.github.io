---
layout:     post
title:      "Mysql查询优化器的局限性和Hint"
subtitle:   "Mysql查询优化器的局限性和Hint"
date:       2020-09-16
author:     "Lerko"
header-img: "/img/post-bg-e2e-ux.jpg"
catalog: true
multilingual: false
tags:
    - mysql
---


# 局限性

* 对关联子查询支持比较糟糕，特别是IN这种子查询。mysql 不会将数据查出来之后在进行二次查询，而是将子查询的逻辑压入外层查询。

比如 select * from outTable where cid in（select * from innerTable where cid=1）

会被改造成为 select * from outTable where exists (select * from cidTable where cid = 1 and outTable.cid = innerTable.cd )

* union限制。有时候Mysql无法将限制条件从外层下推到内层

比如

（select * from t1）union all (select * from t2) limit 20

需要在每个内层加上限制条件

（select * from t1 limit 20）union all (select * from t2 limit 20) limit 20


* 并行执行

mysql 无法利用多核心来进行并行执行查询

* 表join无法使用hash关联，但是其中MariaDb这个引擎实现了真正的Hash关联

* **松散索引扫描** [高性能Mysql 230页]

mysql 一般无法支持松散索引扫描，只支持紧凑索引扫描

这也是mysql有**最左前缀匹配**的原因

在5.0之后下列情况可以支持

在下面一些情况下是可以使用松散索引扫描的：
* 查询针对一个单表。
* GROUP BY包括索引的第1个连续部分(如果对于GROUP BY，查询有一个DISTINCT子句，则所有DISTINCT的属性指向索引开头)。
* 只使用累积函数(如果有)MIN()和MAX()，并且它们均指向相同的列。
* 索引的任何其它部分（除了那些来自查询中引用的GROUP BY）必须为常数(也就是说，必须按常量数量来引用它们)，但MIN()或MAX() 函数的参数例外。
 

 # 查询优化器提示

 **优先操作 HIGH_PRIORITY**

 HIGH_PRIORITY可以使用在select和insert操作中，让MYSQL知道，这个操作优先进行。
 
```sql
SELECT HIGH_PRIORITY * FROM TABLE1;
```

**滞后操作 LOW_PRIORITY**

LOW_PRIORITY可以使用在select,delete,insert和update操作中，让mysql知道，这个操作滞后。

```
update LOW_PRIORITY table1 set field1= where field1= …
```


> HIGH_PRIORITY LOW_PRIORITY
> 这两个提示都只在基于表锁的存储引擎非常有效。在innoDB和其他基于行锁的存储引擎，你可能永远用不上。在MyISAM中使用它们时，也要十分小心，因为它们会让并发插入失效，可能会严重下降性能。


**延时插入 DELAYED**

这个操作只能用于 insert 和 replace

```sql
INSERT DELAYED INTO table1 set field1= …
```

INSERT DELAYED INTO，是客户端提交数据给MySQL，MySQL返回OK状态给客户端。而这是并不是已经将数据插入表，而是存储在内存里面等待排队。
当mysql有 空余时，再插入。另一个重要的好处是，来自许多客户端的插入被集中在一起，并被编写入一个块。这比执行许多独立的插入要快很多。
坏处是，不能返回自动递增 的ID，以及系统崩溃时，MySQL还没有来得及插入数据的话，这些数据将会丢失。并且导致last_insert_id()无法正常工作。

**强制连接顺序straight_join**

```sql
SELECT TABLE1.FIELD1, TABLE2.FIELD2 FROM TABLE1 STRAIGHT_JOIN TABLE2 WHERE...;
```

由上面的SQL语句可知，通过STRAIGHT_JOIN强迫MySQL按TABLE1、TABLE2的顺序连接表。如果你认为按自己的顺序比MySQL推荐的顺序进行连接的效率高的话，就可以通过STRAIGHT_JOIN来确定连接顺序。


**分组使用临时表 SQL_BIG_RESULT和SQL_SMALL_RESULT**

```sql
SELECT SQL_BUFFER_RESULT FIELD1, COUNT(*) FROM TABLE1 GROUP BY FIELD1;
```

这两个提示只对select语句有效，它们告诉优化器对 group by 或者 distinct 查询如何使用临时表及排序。
sql_small_result 告诉优化器结果集会很小，可以将结果集放在内存中的索引临时表，以避免排序操作；
sql_big_result 则告诉优化器结果集会很大，建议使用磁盘临时表做排序操作；


**强制使用临时表sql_buffer_result**

```sql
SELECT SQL_BUFFER_RESULT * FROM TABLE1 WHERE …;
```

这个提示告诉优化器将查询放入到一个临时表，然后尽可能地释放锁。这和前面提到的由客户端缓存结果不同。当你设法使用客户端缓存的时候，使用服务器端的缓存通常很有效。
带来的好处是无须在客户端消耗太多的内存，还可以尽可能快的释放对应的表锁。代价是，服务器端需要更多的内存。