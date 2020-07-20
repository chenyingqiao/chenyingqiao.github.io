---
layout:     post
title:      "Go语言之Context"
subtitle:   "Go语言之Context的源码解析"
date:       2020-07-18
author:     "Lerko"
header-img: "http://img.chenyingqiao.top/blog/20200720160959.png"
catalog: true
multilingual: false
tags:
    - golang
---


# Go语言之Context

## 两个重要的接口

```golang

type Context interface {
	//Deadline返回绑定当前context的任务被取消的截止时间；如果没有设定期限，将返回ok == false
	Deadline() (deadline time.Time, ok bool)

    //这个函数返回一个chan用于通知对应的goroutine进行相应的处理，如果chan有值表示的是context已经结束。
	Done() <-chan struct{}

	//Err 如果Done返回的channel没有关闭，将返回nil;如果Done返回的channel已经关闭，将返回非空的值表示任务结束的原因。如果是context被取消，Err将返回Canceled；如果是context超时，Err将返回DeadlineExceeded。
	Err() error

    //Value 返回context存储的键值对中当前key对应的值，如果没有对应的key,则返回nil。
	Value(key interface{}) interface{}
}

```

```golang

//如果是实现了canceler就是代表这个是一个可以取消的context
type canceler interface {
    //调用cancel去结束context
    cancel(removeFromParent bool, err error)
    //和context一致
	Done() <-chan struct{}
}
```

> 这边我们就大致知道了两种context

| 类型 | 相关结构体 |相关创建方法|
|--|--|--|
| 可取消(Contenxt&&canceler) | cancelCtx，timerCtx | WithDeadline，WithTimeout，WithCancel |
| 无法取消(Context) | valueCtx | WithValue |


## 可取消的Context的取消流程

> 以cancelCtx为例

```golang
type cancelCtx struct {
	Context

	mu       sync.Mutex            //保护以下字段
	done     chan struct{}         //延迟创建，先取消后关闭chan
	children map[canceler]struct{} 
	err      error                 
}


func (c *cancelCtx) cancel(removeFromParent bool, err error) {
    //判断是否有错误
	if err == nil {
		panic("context: internal error: missing cancel error")
    }
    //context加锁
	c.mu.Lock()
	if c.err != nil {
		c.mu.Unlock()
		return // already canceled
	}
    c.err = err
    //判断当前done是否为空，为空的话赋值一个空chan
	if c.done == nil {
		c.done = closedchan
	} else {
		close(c.done)
    }
    //停止所有的子context
	for child := range c.children {
		// NOTE: 持有父母的锁的同时获得孩子的锁.
		child.cancel(false, err)
	}
	c.children = nil
	c.mu.Unlock()

    //从children中吧对应的context移除
	if removeFromParent {
		removeChild(c.Context, c)
	}
}
```
