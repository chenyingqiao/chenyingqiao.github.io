# android webview 混合开发

##登陆问题

> 有几个解决方案

    1.通过sessionid保持登陆   服务器端要将session存储到固定容器中{如php的session_set_save_handler实现存储}
    2,自己生成token 每次请求都要携带token到服务器端

## js 与 java的交互

>在webview中进行文件上传的api不稳定
>所以使用java上传

>需要注意的几个问题

    1.由于漏洞的关系js调用java可能无法在某些机子上面成功运行
    2.js和java之间需要进行数据交互才能实现大部分功能

>上面的问题可以用git上的一个开源项目解决`JsBridge`

>项目地址<a href="https://github.com/lzyzsd/JsBridge">https://github.com/lzyzsd/JsBridge</a>


