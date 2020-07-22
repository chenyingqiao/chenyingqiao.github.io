---
layout:     post
title:      "Kubernetes 基础架构"
subtitle:   "Kubernetes 基础架构"
date:       2020-07-23
author:     "Lerko"
header-img: "/img/post-bg-e2e-ux.jpg"
catalog: true
multilingual: false
tags:
    - K8S
    - 分布式
---


# 基本组成


![20200722145543](http://img.chenyingqiao.top/blog/20200722145543.png)

![20200722145512](http://img.chenyingqiao.top/blog/20200722145512.png)

![20200722145628](http://img.chenyingqiao.top/blog/20200722145628.png)


![20200722145704](http://img.chenyingqiao.top/blog/20200722145704.png)


# 调用流程

![20200722145852](http://img.chenyingqiao.top/blog/20200722145852.png)


# Pods

## Pods基本定义

![20200722150305](http://img.chenyingqiao.top/blog/20200722150305.png)


![20200722150546](http://img.chenyingqiao.top/blog/20200722150546.png)

## Pods生命周期

![20200722150647](http://img.chenyingqiao.top/blog/20200722150647.png)


## 创建Pods

![20200722151248](http://img.chenyingqiao.top/blog/20200722151248.png)

# Labels和Selectors

> labels可以对容器进行标记

![20200722152532](http://img.chenyingqiao.top/blog/20200722152532.png)


![20200722152625](http://img.chenyingqiao.top/blog/20200722152625.png)

# ReplicaSet

用于控制副本数量，比如设置副本数量是3个，删除一个会自动在创建一个出来
保证是3个

![20200722152801](http://img.chenyingqiao.top/blog/20200722152801.png)


# Deployments

![20200722152919](http://img.chenyingqiao.top/blog/20200722152919.png)

如果只使用ReplicaSet的缺点

![20200722153254](http://img.chenyingqiao.top/blog/20200722153254.png)


关于部署的可以看一下这个链接

<a href="https://www.cnblogs.com/chenliangcl/p/10142241.html">
https://www.cnblogs.com/chenliangcl/p/10142241.html</a>


![20200722154114](http://img.chenyingqiao.top/blog/20200722154114.png)

![20200722154317](http://img.chenyingqiao.top/blog/20200722154317.png)

![20200722154417](http://img.chenyingqiao.top/blog/20200722154417.png)

![20200722155904](http://img.chenyingqiao.top/blog/20200722155904.png)


# Service

![20200722161035](http://img.chenyingqiao.top/blog/20200722161035.png)

![20200722161810](http://img.chenyingqiao.top/blog/20200722161810.png)

# Service 服务发现

![20200722162300](http://img.chenyingqiao.top/blog/20200722162300.png)

# Service 服务发布

![20200722162411](http://img.chenyingqiao.top/blog/20200722162411.png)

# Service 的网络

![20200722163027](http://img.chenyingqiao.top/blog/20200722163027.png)

# 数据管理

k8s的数据管理有多种形式，包括：

```
1、Volume
  1.1、emptyDir
    是最基础的Volume类型，一个empryDir Volume是Host上的一个空目录。
    emptyDir Volume的生命周期与Pod一致。
  1.2、hostPath
    hostPath Volume的作用是将Docker Host文件系统中已经存在的目录mount给Pod的容器。
2、外部Storage Provider
    如果k8s部署在公有云上，可以直接使用云硬盘作为Volume。
3、PersistentVolume(pv)和PersistentVolumeClaim(pvc) --重点--
```
