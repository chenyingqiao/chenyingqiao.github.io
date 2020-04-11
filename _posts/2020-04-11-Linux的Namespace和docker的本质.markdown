---
layout:     post
title:      "Linux的Namespace,cgroup,chroot和docker的本质"
subtitle:   "docker的本质"
date:       2020-04-06
author:     "Lerko"
header-img: "img/post-bg-e2e-ux.jpg"
catalog: true
tags:
    - docker
---

# Linux的namespace

## namespace 的概念

namespace 是 Linux 内核用来隔离内核资源的方式,隔离进程依靠这个抽象出看不到其他进程的内核进程。

> 通过 namespace 可以让一些进程只能看到与自己相关的一部分资源，而另外一些进程也只能看到与它们自己相关的资源，这两拨进程根本就感觉不到对方的存在。具体的实现方式是把一个或多个进程的相关资源指定在同一个 namespace 中。Linux namespaces 是对全局系统资源的一种封装隔离，使得处于不同 namespace 的进程拥有独立的全局系统资源，改变一个 namespace 中的系统资源只会影响当前 namespace 里的进程，对其他 namespace 中的进程没有影响。

## namespace  的发展历史

Linux 在很早的版本中就实现了部分的 namespace，比如内核 2.4 就实现了 mount namespace。大多数的 namespace 支持是在内核 2.6 中完成的，比如 IPC、Network、PID、和 UTS。还有个别的 namespace 比较特殊，比如 User，从内核 2.6 就开始实现了，但在内核 3.8 中才宣布完成。同时，随着 Linux 自身的发展以及容器技术持续发展带来的需求，也会有新的 namespace 被支持，比如在内核 4.6 中就添加了 Cgroup namespace。

Linux 提供了多个 API 用来操作 namespace，它们是 clone()、setns() 和 unshare() 函数，为了确定隔离的到底是哪项 namespace，在使用这些 API 时，通常需要指定一些调用参数：CLONE_NEWIPC、CLONE_NEWNET、CLONE_NEWNS、CLONE_NEWPID、CLONE_NEWUSER、CLONE_NEWUTS 和 CLONE_NEWCGROUP。如果要同时隔离多个 namespace，可以使用 \| (按位或)组合这些参数。同时我们还可以通过 /proc 下面的一些文件来操作 namespace。下面就让让我们看看这些接口的简要用法。


## 查看进程所属的 namespace

从版本号为 3.8 的内核开始，/proc/[pid]/ns 目录下会包含进程所属的 namespace 信息，使用下面的命令可以查看当前进程所属的 namespace 信息：

```
ll /proc/$$/ns
```

首先，这些 namespace 文件都是链接文件。链接文件的内容的格式为 xxx:[inode number]。其中的 xxx 为 namespace 的类型，inode number 则用来标识一个 namespace，我们也可以把它理解为 namespace 的 ID。如果两个进程的某个 namespace 文件指向同一个链接文件，说明其相关资源在同一个 namespace 中。

其次，在 /proc/[pid]/ns 里放置这些链接文件的另外一个作用是，一旦这些链接文件被打开，只要打开的文件描述符(fd)存在，那么就算该 namespace 下的所有进程都已结束，这个 namespace 也会一直存在，后续的进程还可以再加入进来。


## 一些对应的c函数

### clone() 函数

我们可以通过 clone() 在创建新进程的同时创建 namespace。clone() 在 C 语言库中的声明如下：

```
/* Prototype for the glibc wrapper function */
#define _GNU_SOURCE
#include <sched.h>
int clone(int (*fn)(void *), void *child_stack, int flags, void *arg);
```

实际上，clone() 是在 C 语言库中定义的一个封装(wrapper)函数，它负责建立新进程的堆栈并且调用对编程者隐藏的 clone() 系统调用。Clone() 其实是 linux 系统调用 fork() 的一种更通用的实现方式，它可以通过 flags 来控制使用多少功能。一共有 20 多种 CLONE_ 开头的 falg(标志位) 参数用来控制 clone 进程的方方面面(比如是否与父进程共享虚拟内存等)，下面我们只介绍与 namespace 相关的 4 个参数：

fn：指定一个由新进程执行的函数。当这个函数返回时，子进程终止。该函数返回一个整数，表示子进程的退出代码。
child_stack：传入子进程使用的栈空间，也就是把用户态堆栈指针赋给子进程的 esp 寄存器。调用进程(指调用 clone() 的进程)应该总是为子进程分配新的堆栈。
flags：表示使用哪些 CLONE_ 开头的标志位，与 namespace 相关的有CLONE_NEWIPC、CLONE_NEWNET、CLONE_NEWNS、CLONE_NEWPID、CLONE_NEWUSER、CLONE_NEWUTS 和 CLONE_NEWCGROUP。
arg：指向传递给 fn() 函数的参数。


### setns() 函数

通过 setns() 函数可以将当前进程加入到已有的 namespace 中。setns() 在 C 语言库中的声明如下：

```
#define _GNU_SOURCE
#include <sched.h>
int setns(int fd, int nstype);
```

和 clone() 函数一样，C 语言库中的 setns() 函数也是对 setns() 系统调用的封装：

fd：表示要加入 namespace 的文件描述符。它是一个指向 /proc/[pid]/ns 目录中文件的文件描述符，可以通过直接打开该目录下的链接文件或者打开一个挂载了该目录下链接文件的文件得到。
nstype：参数 nstype 让调用者可以检查 fd 指向的 namespace 类型是否符合实际要求。若把该参数设置为 0 表示不检查。


### unshare() 函数 和 unshare 命令

通过 unshare 函数可以在原进程上进行 namespace 隔离。也就是创建并加入新的 namespace 。unshare() 在 C 语言库中的声明如下：

```
#define _GNU_SOURCE
#include <sched.h>
int unshare(int flags);
```

和前面两个函数一样，C 语言库中的 unshare() 函数也是对 unshare() 系统调用的封装。调用 unshare() 的主要作用就是：不启动新的进程就可以起到资源隔离的效果，相当于跳出原先的 namespace 进行操作。

系统还默认提供了一个叫 unshare 的命令，其实就是在调用  unshare() 系统调用。
下面这个就是吧whoami这个程序的运行进程的namespace设置成root

```
lerko@lerko-PC:~$ unshare --map-root-user --user sh -c whoami lerko_namespace
root
```

# chroot  

chroot，即 change root directory (更改 root 目录)。在 linux 系统中，系统默认的目录结构都是以 `/`，即是以根 (root) 开始的。而在使用 chroot 之后，系统的目录结构将以指定的位置作为 `/` 位置。

具体可以查看这个文章：[理解 chroot](https://www.ibm.com/developerworks/cn/linux/l-cn-chroot/index.html)

# Cgroup
Cgroup 是 Linux kernel 的一项功能：它是在一个系统中运行的层级制进程组，你可对其进行资源分配（如 CPU 时间、系统内存、网络带宽或者这些资源的组合）。通过使用 cgroup，系统管理员在分配、排序、拒绝、管理和监控系统资源等方面，可以进行精细化控制。硬件资源可以在应用程序和用户间智能分配，从而增加整体效率。

cgroup 和 namespace 类似，也是将进程进行分组，但它的目的和 namespace 不一样，namespace 是为了隔离进程组之间的资源，而 cgroup 是为了对一组进程进行统一的资源监控和限制。

# Docker的本质

根据上面的了解我们知道了：**docker的本质其实是一个进程**

> Docker 是“新瓶装旧酒”的产物，依赖于 Linux 内核技术 chroot 、namespace 和 cgroup。

我们如果查看一下docker的进程我们可以看到：

```shell
lerko@lerko-PC:~$ ps -aux|grep docker
root       777  0.4  0.6 1363980 50124 ?       Sl   10:38   0:01 dockerd
root      1788  0.2  0.3 676320 25200 ?        Ssl  10:38   0:01 containerd --config /var/run/docker/containerd/containerd.toml --log-level info
root      4736  0.0  0.0   7500  3824 ?        Sl   10:38   0:00 containerd-shim -namespace moby -workdir /var/lib/docker/containerd/daemon/io.containerd.runtime.v1.linux/moby/9b90e859f19318fa83109d063ed7047a5226efacf56228e38c65f268c279d2ba -address /var/run/docker/containerd/containerd.sock -containerd-binary /usr/bin/containerd -runtime-root /var/run/docker/runtime-runc
root      4800  0.0  0.0   7564  3828 ?        Sl   10:38   0:00 containerd-shim -namespace moby -workdir /var/lib/docker/containerd/daemon/io.containerd.runtime.v1.linux/moby/3b26630400e83a5578647967a32132d95256b6f51f4fd4b3027280181d07ac82 -address /var/run/docker/containerd/containerd.sock -containerd-binary /usr/bin/containerd -runtime-root /var/run/docker/runtime-runc
root      4882  0.0  0.0   7500  4500 ?        Sl   10:38   0:00 containerd-shim -namespace moby -workdir /var/lib/docker/containerd/daemon/io.containerd.runtime.v1.linux/moby/21b91e057029870b649ebff53756d7ac9ad8fc7d279e5b3057065c3f6618ca3b -address /var/run/docker/containerd/containerd.sock -containerd-binary /usr/bin/containerd -runtime-root /var/run/docker/runtime-runc
root      4969  0.0  0.0   7500  4748 ?        Sl   10:38   0:00 containerd-shim -namespace moby -workdir /var/lib/docker/containerd/daemon/io.containerd.runtime.v1.linux/moby/d09425a8a3718f0a8dd8c312744ea48a2db535cccfe8b9282c6a024185ca2492 -address /var/run/docker/containerd/containerd.sock -containerd-binary /usr/bin/containerd -runtime-root /var/run/docker/runtime-runc
root      5062  0.0  0.0   7500  3928 ?        Sl   10:38   0:00 containerd-shim -namespace moby -workdir /var/lib/docker/containerd/daemon/io.containerd.runtime.v1.linux/moby/d62a81ac997408b8e7cd517ac19ab49e3584cd76f744a212a7ef439cff5bc943 -address /var/run/docker/containerd/containerd.sock -containerd-binary /usr/bin/containerd -runtime-root /var/run/docker/runtime-runc
root      5063  0.0  0.0   7500  4200 ?        Sl   10:38   0:00 containerd-shim -namespace moby -workdir /var/lib/docker/containerd/daemon/io.containerd.runtime.v1.linux/moby/6cc856f4a901b9560dd44706889122728fe447510a78c7929992a7099fd6fb6a -address /var/run/docker/containerd/containerd.sock -containerd-binary /usr/bin/containerd -runtime-root /var/run/docker/runtime-runc
lerko     9251  0.0  0.0  14664  1036 pts/0    S+   10:45   0:00 grep docker
```


我们看到这里面有一个引用程序`containerd系列程序`。

**containerd简介：**

> Containerd是一个工业标准的容器运行时，重点是它简洁，健壮，便携，在Linux和window上可以作为一个守护进程运行，它可以管理主机系统上容器的完整的生命周期：镜像传输和存储，容器的执行和监控，低级别的存储和网络。

这里引申出：docker的整体框架分析，后续补充

dockerd 底层运行容器需要依赖多个二级制组件：docker daemon, containerd, container-shim, runC， 
代码实现上，containerd包含了container-shim代码。同一份代码，通过Makefile编译控制，编译成两个二级制文件。

**通信流程：**

1. docker daemon 模块通过 grpc 和 containerd模块通信：dockerd 由libcontainerd负责和containerd模块进行交换， dockerd 和 containerd 通信socket文件：docker-containerd.sock 
2. containerd 在dockerd 启动时被启动，启动时，启动grpc请求监听。containerd处理grpc请求，根据请求做相应动作； 
3. 若是start或是exec 容器，containerd 拉起一个container-shim , 并通过exit 、control 文件（每个容器独有）通信； 
4. container-shim别拉起后，start/exec/create拉起runC进程，通过exit、control文件和containerd通信，通过父子进程关系和SIGCHLD监控容器中进程状态； 
5. 若是top等命令，containerd通过runC二级制组件直接和容器交换； 
6. 在整个容器生命周期中，containerd通过 epoll 监控容器文件，监控容器的OOM等事件；



containerd-shim 有一个namespace的参数是moby，这个就是指定namespace.
