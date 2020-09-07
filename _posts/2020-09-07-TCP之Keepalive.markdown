---
layout:     post
title:      "TCP之Keepalive"
subtitle:   "TCP之Keepalive"
date:       2020-09-07
author:     "Lerko"
header-img: "http://img.chenyingqiao.top/blog/20200907114445.png"
catalog: true
multilingual: false
tags:
    - TCP
---

# Keepalive起源

tcp其实也有短连接和长链接的两种场景

![20200907113952](http://img.chenyingqiao.top/blog/20200907113952.png)

**短链接**

我们模拟一下TCP短连接的情况，client向server发起连接请求，server接到请求，然后双方建立连接。client向server发送消息，server回应client，然后一次读写就完成了，这时候双方任何一个都可以发起close操作，不过一般都是client先发起close操作。为什么呢，一般的server不会回复完client后立即关闭连接的，当然不排除有特殊的情况。从上面的描述看，短连接一般只会在client/server间传递一次读写操作

**长链接**

首先说一下TCP/IP详解上讲到的TCP保活功能，保活功能主要为服务器应用提供，服务器应用希望知道客户主机是否崩溃，从而可以代表客户使用资源。如果客户已经消失，使得服务器上保留一个半开放的连接，而服务器又在等待来自客户端的数据，则服务器将应远等待客户端的数据，保活功能就是试图在服务器端检测到这种半开放的连接。

长连接中需要有一个保活机制，以应链接两端宕机或者网络设备损坏的情况。
于是有了 `Keeplive`

# TCP Keepalive工作原理

tcp 链接后，启用 TCP Keepalive 的一端便会启动一个计时器，经过tcp_keep-alive_time时间后如果没有任何动作，Tcp会发出一个探测包。
这个 TCP 探测包是一个纯 ACK 包（规范建议，不应该包含任何数据，但也可以包含1个无意义的字节，比如0x0。），其 Seq号 与上一个包是重复的，所以其实探测保活报文不在窗口控制范围内

对应的反应有这几种状态

1. 客户机器依然运行
2. 客户机崩溃，或者服务器不可达
3. 客户机崩溃并且重启复位了

对应的有几个参数设置

1. tcp_keepalive_time 在TCP保活打开的情况下，最后一次数据交换到TCP发送第一个保活探测包的间隔 默认值为7200s（2h）
2. tcp_keepalive_probes 没有接收到对方确认，继续发送保活探测包次数，默认值为9（次）
3. tcp_keepalive_intvl 没有接收到对方确认，继续发送保活探测包的发送频率，默认值为75s。


# Keeplive作用

1. 探测连接的对端是否存活 及时释放
2. 防止中间设备因超时删除连接相关的连接表


# Keepalive可能导致的问题

1. 在短暂的故障期间，Keepalive设置不合理时可能会因为短暂的网络波动而断开健康的TCP连接
2. 需要消耗额外的宽带和流量
3. 在以流量计费的互联网环境中增加了费用开销

所以我们应该根据业务调整keeplive的几个参数，以达到平衡这些问题的效果

# TCP Keepalive HTTP Keep-Alive 的关系

很多人会把TCP Keepalive 和 HTTP Keep-Alive 这两个概念搞混淆。

在HTTP/1.0中，默认使用的是短连接。也就是说，浏览器和服务器每进行一次HTTP操作，就建立一次连接，但任务结束就中断连接。如果客户端浏览器访问的某个HTML或其他类型的 Web页中包含有其他的Web资源，如JavaScript文件、图像文件、CSS文件等；当浏览器每遇到这样一个Web资源，就会建立一个HTTP会话。

**HTTP Keep-Alive** 意图在于TCP连接复用，同一个连接上串行方式传递请求-响应数据；

**TCP Keepalive** 机制意图在于探测连接的对端是否存活。