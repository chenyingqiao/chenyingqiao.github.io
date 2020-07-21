---
layout:     post
title:      "ArchLinux下安装Minikube"
subtitle:   "Minikube的安装和遇到的问题"
date:       2020-07-21
author:     "Lerko"
header-img: "http://img.chenyingqiao.top/blog/20200721111153.png"
catalog: true
multilingual: false
tags:
    - Arch Linux K8S
---


# 安装

```sheel
sudo pacman -S minikube kubectl
```

# 启动kubernetes

```shell
//--image-mirror-country 表示使用中国镜像
sudo minikube start --driver=none --image-mirror-country='cn'
```

# 问题

如果遇到提示

    😄  Arch rolling 上的 minikube v1.11.0

    ✨  根据用户配置使用 none 驱动程序

    💣  Sorry, Kubernetes 1.18.3 requires conntrack to be installed in root's path

那么你需要安装一下 conntrack-tools 软件包

```shell
sudo pacman -S --noconfirm conntrack-tools
```


# 参考资料

https://kubernetes.io/docs/tasks/tools/install-minikube/
https://amasuda.xyz/post/2020-04-04-minikube-on-archlinux/
