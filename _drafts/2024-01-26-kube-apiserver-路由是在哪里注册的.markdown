---
layout:     post
title:      "kube-apiserver 是再哪里注册路由的？"
subtitle:  "kube-apiserver 是再哪里注册路由的？" 
date:       2024-01-25
author:     "Lerko"
header-img: "/img/post-bg-e2e-ux.jpg"
catalog: true
multilingual: false
tags:
    - kubernetes
---

# 注册流程

```
  1000: handler3.(*OpenAPIService).RegisterOpenAPIV3VersionedService@handler.go:293
  1001: routes.OpenAPI.InstallV3@openapi.go:55
  1002: server.(*GenericAPIServer).PrepareRun@genericapiserver.go:426
  1003: server.(*GenericAPIServer).PrepareRun@genericapiserver.go:415
  1004: server.(*GenericAPIServer).PrepareRun@genericapiserver.go:415
  1005: apiserver.(*APIAggregator).PrepareRun@apiserver.go:433
  1006: app.Run@server.go:165
  1007: app.NewAPIServerCommand.func2@server.go:118
  1008: cobra.(*Command).execute@command.go:940
  1009: cobra.(*Command).ExecuteC@command.go:1068
  1010: cobra.(*Command).Execute@command.go:992
  1011: cli.run@run.go:146
  1012: cli.Run@run.go:46
  1013: main.main@apiserver.go:34
```
