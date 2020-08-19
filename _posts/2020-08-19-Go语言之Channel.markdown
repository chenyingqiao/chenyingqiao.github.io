---
layout:     post
title:      "Go语言之Channel"
subtitle:   "Go语言之Channel"
date:       2020-08-19
author:     "Lerko"
header-img: "http://img.chenyingqiao.top/blog/20200814155942.png"
catalog: true
multilingual: false
tags:
    - go
---

## channel本质

channel其实就是传统语言的阻塞消息队列

## 结构体

```go
type hchan struct {
	qcount   uint           // 队列中的总数据 
	dataqsiz uint           // 循环队列大小
	buf      unsafe.Pointer // 指向循环队列（dataqsiz）的元素数组
	elemsize uint16
	closed   uint32
	elemtype *_type // 元素类型
	sendx    uint   // 发送索引
	recvx    uint   // 接收索引
	recvq    waitq  // 接收的waitq列表
	sendq    waitq  // 发送的waitq列表

	//锁保护hchan中的所有字段，以及几个
	//在此通道上阻止的sudogs中的字段。
	//
	//按住此锁定时不要更改另一个G的状态
	//（特别是不要准备G），因为这可能会导致死锁
	lock mutex
}

type waitq struct {
	first *sudog
	last  *sudog
}
```

```golang
//sudog在等待列表中表示g，例如用于发送/接收
//在channel上
//
//sudog是必需的，因为g↔同步对象关系
//是多对多。 g可以出现在许多等待列表中，因此可能有
//一克有许多sudogs；而许多gs可能正在等待
//同步对象，因此一个对象可能有许多sudog。
//
//sudog是从特殊池中分配的。使用acquireSudog和
//releaseSudog分配和释放它们。
type sudog struct {
	//以下字段受hchan.lock的保护
	//引导此sudog阻塞。收缩堆栈取决于
	//这适用于参与频道操作的sudog。

	g *g

	next *sudog
	prev *sudog
	elem unsafe.Pointer //数据元素（可能指向堆栈）

	//以下字段永远不会同时访问。
	//对于通道，waitlink仅由g访问。
	//对于信号量，所有字段（包括上面的字段）
	//仅在持有semaRoot锁时才能访问。

	acquiretime int64
	releasetime int64
	ticket      uint32

	//isSelect表示g正在参与选择，因此
	//必须添加g.selectDone才能赢得唤醒。
	isSelect bool

	parent   *sudog // semaRoot二叉树
	waitlink *sudog // g。等待列表或semaRoot
	waittail *sudog // semaRoot
	c        *hchan // channel
}
```