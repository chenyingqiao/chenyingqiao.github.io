# webLib说明

> 开启一个页面都要初始化一个webLib对象
> 然后调用init方法初始化(这样才会有token)

```javascript
var wl=new webLib();
wl.init();
```

>获取token

```javascript
var token = window.webEvn.token;
```

>执行ajax

```javascript
var wl=new webLib();
wl.init();
var data=new Object();
data.url="http://xxxxx";//必须包含这个变量
data.username="xxxx";
wl.Ajax(data,function(data){
    //data是ajax返回的数据  json对象
});
```