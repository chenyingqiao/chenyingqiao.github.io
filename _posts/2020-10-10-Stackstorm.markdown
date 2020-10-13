---
layout:     post
title:      "Stackstorm快速开始"
subtitle:   "Stackstorm快速开始"
date:       2020-09-21
author:     "Lerko"
header-img: "/img/post-bg-e2e-ux.jpg"
catalog: true
multilingual: false
tags:
    - Devpos
---


# Stackstorm

# 基本介绍

Stackstorm 是一个分布式自动化平台

可以定义工作流进行自动化操作，工作流由多个动作组成，各个动作之间可以有参数互相传递。

基本流程是

```
传感器感知 -->  执行触发器  --> 触发规则(规则检查条件) --匹配--> 运行工作流或者动作
										|
										-- 不匹配 --> 结束
```

# 基本组件

- 传感器（Sensors）是用于分别接收或监视事件的入站或出站集成的Python插件。 当来自外部系统的事件发生并由传感器处理时，StackStorm触发器将发射到系统中。
触发器（Triggers）是外部事件的StackStorm表示形式。 有通用触发器（例如定时器，webhooks）和集成触发器（例如，Sensu告警，JIRA问题更新）。 通过编写传感器插件可以定义新的触发器类型。

- 动作（Actions）是StackStorm出站集成。 有通用动作（ssh，REST调用），集成（OpenStack，Docker，Puppet）或自定义操作。 动作是Python插件或任何脚本，通过添加几行元数据将其消耗到StackStorm中。 动作可以由用户通过CLI或API直接调用，或者作为规则和工作流程的一部分使用和调用。
规则（Rules）将触发器映射到动作（或工作流），应用匹配条件并将触发器加载到动作输入中。

- 工作流（Workflows）将动作拼接成“超级动作”，定义顺序，转换条件以及传递数据。 大多数自动化不止一步，因此需要多个动作。 工作流就像“原子”动作一样，可在Action库中使用，并且可以手动调用或由规则触发。

- 包（Packs）是内容部署的单位。 它们通过对集成（触发器和动作）和自动化（规则和工作流）进行分组，简化了StackStorm可插拔内容的管理和共享。 StackStorm Exchange上有越来越多的包可用。 用户可以创建自己的包，在Github上共享它们，或者提交给StackStorm Exchange.

- 审计跟踪（Audit Trail）记录并存储手动或自动操作执行的审计跟踪，并存储触发上下文和执行结果的全部细节。 它还被记录在审计日志中，用于集成外部日志记录和分析工具：LogStash，Splunk，statsd，syslog



# 动作

表示一个操作，我们可以通过命令查看对应的动作

```shell
$root@2a95cfad87bc:/opt/stackstorm# st2 action list --pack=linux
+-----------------------+-------+------------------------------------+
| ref                   | pack  | description                        |
+-----------------------+-------+------------------------------------+
| linux.check_loadavg   | linux | 检查主机上的CPU平均负载              |
| linux.check_processes | linux | 检查有趣的过程                      |
| linux.cp              | linux | 复制文件                            |
| linux.diag_loadavg    | linux | 高负载的诊断工作流程                 |
|                       |       | 警报                                |
| linux.dig             | linux | 挖掘动作                            |
| linux.file_touch      | linux | 触摸文件                            |
| linux.lsof            | linux | 运行lsof                           |
| linux.lsof_pids       | linux | 对一组PID运行lsof					 |
| linux.mv              | linux | 移动文件							 |
| linux.netstat         | linux | 运行netstat						 |
| linux.netstat_grep    | linux | Grep Netstat结果                   |
| linux.pkill           | linux | 使用pkill杀死进程                   |
| linux.rm              | linux | 删除文件                           |
| linux.rsync           | linux | 将文件从一个地方复制到               |
|                       |       | 另一个w /rsync                      |
| linux.scp             | linux | 安全复制文件                        |
| linux.service         | linux | 停止，启动或重新启动,服务            |
| linux.traceroute      | linux | 路由主机                            |
| linux.vmstat          | linux | 运行vmstat                         |
| linux.wait_for_ssh    | linux | 等待SSH的操作                       |
|                       |       | 服务器变得可访问。通过               |
|                       |       | 默认，如果没有凭据                   |
|                       |       | 提供，此操作将尝试                   |
|                       |       | 使用系统用户进行身份验证              |
|                       |       | 用户名和密钥文件。                   |
+-----------------------+-------+------------------------------------+
```

如果我们要执行动作的话我们可以使用下面的命令执行动作

```
# 通过 -- 指定命令
st2 run core.local -- ls -al

# 通过cmd指定命令
st2 run core.local cmd="ls -al"

# 复杂命令通过cmd
st2 run core.remote hosts='localhost' cmd="for u in bob phill luke; do echo \"Logins by \$u per day:\"; grep \$u /var/log/secure | grep opened | awk '{print \$1 \"-\" \$2}' | uniq -c | sort; done;"
```

# 规则

我们可以定义一个规则

```yaml
---
    name: "sample_rule_with_webhook" //规则名称
    pack: "examples" //规则对应的包
    description: "Sample rule dumping webhook payload to a file." //规则描述
    enabled: true // 是否开启规则

    trigger: //对应触发器
        type: "core.st2.webhook" //触发器类型
        parameters: //参数
            url: "sample"

    criteria: //条件
        trigger.body.name:
            pattern: "st2"
            type: "equals"

    action: //动作
        ref: "core.local"
        parameters:
            cmd: "echo \"{{trigger.body}}\" >> ~/st2.webhook_sample.out ; sync"
```

本例中的 webhook 设置为在 https://{ host }/api/v1/webhooks/sample 监听 sample 子 url。当对此 URL 生成 POST 时，触发器将触发。如果条件匹配(在这种情况下，payload 中的值为 st2) ，那么该有效负载将被附加到 st2.webhook _ sample.out 文件中 StackStorm 系统用户的 home 目录中。默认情况下，这是 stanley，因此文件位于/home/stanley/st2。样本。出去。详细规则解剖见规则。

触发器有效负载由{{ trigger }引用。如果触发器有效负载是一个有效的 JSON 对象，那么将对其进行解析，并且可以像{ trigger.path.to.parameter }那样进行访问。

规则中可用的触发器是什么？就像操作一样，使用 CLI 浏览触发器，了解触发器的作用，如何配置它，以及有效负载结构是什么:

```shell
# List all available triggers
st2 trigger list

# Check details on Interval Timer trigger
st2 trigger get core.st2.IntervalTimer

# Check details on the Webhook trigger
st2 trigger get core.st2.webhook
```

如何部署一个规则？


```shell
# 创建一个规则
st2 rule create /usr/share/doc/st2/examples/rules/sample_rule_with_webhook.yaml

# 查看规则列表
st2 rule list

# 列出示例包的规则
st2 rule list --pack=examples

# 获取刚刚创建的规则
st2 rule get examples.sample_rule_with_webhook
```

我们可以通过这样来触发这个rule

![20201012205651](http://img.chenyingqiao.top/20201012205651.png)

![20201012205625](http://img.chenyingqiao.top/20201012205625.png)



