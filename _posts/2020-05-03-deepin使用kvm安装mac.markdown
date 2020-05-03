---
layout:     post
title:      "使用kvm安装mac"
subtitle:   "使用kvm安装mac"
date:       2020-05-03
author:     "Lerko"
header-img: "http://q8mq1hi36.bkt.clouddn.com/blog/20200503170742.png"
catalog: true
multilingual: false
tags:
    - kvm
---

## 安装工具

`https://github.com/foxlet/macOS-Simple-KVM` 

克隆上面仓库

## 安装依赖

```
sudo apt-get install qemu-system qemu-utils python3 python3-pip  # for Ubuntu, Debian, Mint, and PopOS.
```

## 下来系统文件

需要注意的是 `--high-sierra` 版本的mac才支持nvidia的显卡
另外的选项有 `--mojave` `--catalina`

```
./jumpstart.sh --high-sierra
```

## 创建磁盘文件

```
qemu-img create -f qcow2 MyDisk.qcow2 64G
```

并添加

```
    -drive id=SystemDisk,if=none,file=MyDisk.qcow2 \
    -device ide-hd,bus=sata.4,drive=SystemDisk \
```

## 显卡直通（PCIe Passthrough）

使用kvm可以通过PCI硬件直通技术提高虚拟系统的效率
需要的同学可以看看

**需要硬件支持vt**
可使用命令查看 egrep -o '(vmx|svm)' /proc/cpuinfo

直通环境 
系统：deepin
机器：华为matebook

如图：（gtx940m已经被卸载了所以看不到了）

![20200503164203](http://q8mq1hi36.bkt.clouddn.com/blog/20200503164203.png)

需要准备的事情有：
    1.开启内核的 iommu
    2.开启vfio-pci
    3.查看穿通的硬件地址
    4.禁用原来的显卡驱动
    5.卸载硬件
    6.添加硬件直通到运行脚本

### 开启内核的

```
# Written by com.deepin.daemon.Grub2
DEEPIN_GFXMODE_DETECT=2
GRUB_CMDLINE_LINUX=""
GRUB_CMDLINE_LINUX_DEFAULT="splash quiet intel_iommu=on"
GRUB_DEFAULT=0
GRUB_DISTRIBUTOR="`/usr/bin/lsb_release -d -s 2>/dev/null || echo Deepin`"
GRUB_GFXMODE=1920x1080,1680x1050,1600x1024,1400x1050,1600x900,1280x1024,1440x900,1400x900,1280x960,1440x810,1368x768,1360x768,1280x800,1152x864,1280x720,1024x768,auto
GRUB_THEME="/boot/grub/themes/deepin-fallback/theme.txt"
GRUB_TIMEOUT=5
```

GRUB_CMDLINE_LINUX_DEFAULT 添加 intel_iommu=on 开启 iommu内核特性

接着更新grud

```
grub-mkconfig -o /boot/grub/grub.cfg
```

reboot

使用dmesg | grep IOMMU 或dmesg | grep -e DMAR -e IOMMU检查VT-d（AMD芯片时是 IOV）是否工作。若没有相应输出，需要重新检查之前的步骤。

### 开启vfio-pci

查看配置文件中是否有vfio的对应的配置

```
lerko@lerko-PC:~$ cat /etc/modules
# /etc/modules: kernel modules to load at boot time.
#
# This file contains the names of kernel modules that should be loaded
# at boot time, one per line. Lines beginning with "#" are ignored.
# 下面几个是要开启的
vfio
vfio_iommu_type1
vfio_pci
vfio_virqfd 
```

### 指定穿透硬件的地址

我的机器是NVIDIA显卡所以使用一下命令查看硬件信息

```
lspci -nn | grep NVIDIA
```

我们可以看到对应的硬件信息
```
01:00.0 3D controller [0302]: NVIDIA Corporation GM108M [GeForce 940MX] [10de:134d] (rev a2)
```
重要的信息是 `01:00.0` `10de:134d`

**注意：** 因为我的笔记本只有一个显卡硬件，而且没有携带声卡，所以就只有一个硬件地址。如果是台式的独立显卡可能会携带有声卡硬件地址
这个也需要一起操作下面的解绑硬件步骤

如果是其他品牌的可以使用对应关键字查看

### 禁用原来的显卡驱动

然后必须要禁用原来的显卡驱动
deepin的禁用方式是：

```
sudo vi /etc/modprobe.d/blacklist.conf  添加：blacklist nouveau
```

reboot重启电脑

其他的系统可以另外百度方法

### 卸载硬件指定vfio

然后我们就可以解绑硬件了

```
modprobe pci_stub
echo "10de 134d" > /sys/bus/pci/drivers/pci-stub/new_id
echo 0000:01:00.0 > /sys/bus/pci/devices/0000:01:00.0/driver/unbind  //如果这里卡主的话说明驱动没有禁用，重复一下上面的步骤
echo 0000:01:00.0 > /sys/bus/pci/drivers/pci-stub/bind
```

然后重启之后再添加vfio-pci配置到grud

```
iommu=pt intel_iommu=on vfio-pci.ids=1002:66af,1002:ab20
```

### 添加硬件直通到运行脚本

然后再启动脚本 basic.sh 中添加这个代码
```
    -vga none \
    -device pcie-root-port,bus=pcie.0,multifunction=on,port=1,chassis=1,id=port.1 \
    -device vfio-pci,host=26:00.0,bus=port.1,multifunction=on,romfile=/path/to/card.rom \
    -device vfio-pci,host=26:00.1,bus=port.1 \
```

## 最后

运行basic.sh，你就得到了一个mac基于内核的虚拟机

```
sudo ./basic.sh
```