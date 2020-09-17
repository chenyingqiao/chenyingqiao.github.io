---
layout:     post
title:      "Innodb与MyISAM的区别总结"
subtitle:   "Innodb与MyISAM的区别总结"
date:       2020-09-16
author:     "Lerko"
header-img: "/img/post-bg-e2e-ux.jpg"
catalog: true
multilingual: false
tags:
    - mysql
---


# 锁

MyISAM:表级锁
Innodb:行锁（记录锁），页锁，间隙锁

间隙锁：用来防止插入的，主要是用来解决幻读

# 事务

MyISAM：不支持事务
Innodb:支持事务，并保有ACID完整性（原子性，隔离性，持久性，一致性）

# 外键

MyISAM：不支持外键
Innodb：支持外键


# 索引

MyISAM

不支持FULLTEXT,按照插入顺序排序

二级索引是直接指向数据的

Innodb

支持FULLTEXT，主键索引按照插入的主键大小排序

二级索引指向一级索引，通过一级索引查找数据

# 文件结构

MyISAM:

第一个文件的名字以表的名字开始，扩展名指出文件类型，.frm文件存储表定义。
第二个文件是数据文件，其扩展名为.MYD (MYData)。
第三个文件是索引文件，其扩展名是.MYI (MYIndex)。

Innodb:

基于磁盘的资源是InnoDB表空间数据文件和它的日志文件，InnoDB 表的 大小只受限于操作系统文件的大小，一般为 2GB。

# 如何选择

MyISAM适合：

（1）做很多count 的计算；
（2）插入不频繁，查询非常频繁，如果执行大量的SELECT，MyISAM是更好的选择；
（3）没有事务。
InnoDB适合：

（1）可靠性要求比较高，或者要求事务；
（2）表更新和查询都相当的频繁，并且表锁定的机会比较大的情况指定数据引擎的创建；
（3）如果你的数据执行大量的INSERT或UPDATE，出于性能方面的考虑，应该使用InnoDB表；
（4）DELETE FROM table时，InnoDB不会重新建立表，而是一行一行的 删除；
（5）LOAD TABLE FROM MASTER操作对InnoDB是不起作用的，解决方法是首先把InnoDB表改成MyISAM表，导入数据后再改成InnoDB表，但是对于使用的额外的InnoDB特性（例如外键）的表不适用。