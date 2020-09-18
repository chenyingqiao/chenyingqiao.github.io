---
layout:     post
title:      "Mysql队列表优化"
subtitle:   "Mysql队列表优化"
date:       2020-09-16
author:     "Lerko"
header-img: "/img/post-bg-e2e-ux.jpg"
catalog: true
multilingual: false
tags:
    - mysql
---


# 队列表低效率实现

1. 队列处理逻辑包裹事务
2. 使用select * from queue for update //对查询进行加锁


# 这样实现的缺点

使用for update的话，如果是上面按个语句会对真个表进行加锁处理。
这样会导致大量的事务堆积。或者造成死锁导致无法消费队列数据

这里提一下消息队列堆积的处理方案

1. 上游接口进行限流熔断
2. 消息设置过期年龄，如果太大就抛弃，以免导致堆积过多崩溃
3. 加大消费端处理能力
4. 多队列模式（队列性能弱的情况下


# 新的实现方案

使