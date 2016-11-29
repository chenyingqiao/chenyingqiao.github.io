# php包管理工具composer

##composer.json

>这个文件声明了依赖的关系
>通过这个配置可以安装不同的包

## 安装composer的执行文件

###安装分为两种
* 局部安装
	
	>curl -sS https://getcomposer.org/installer | php
	>这个会下载composer.phar归档文件
	>可以通过curl -sS https://getcomposer.org/installer | php -- --install-dir=bin
	>来指定下载的phar文件的目录

* 全局安装

	> 通过上面的方式下载到了composer之后
	> 吧composer.phar移动到你的环境变量目录就可以直接在控制台里面使用了
	> `mv composer.phar /usr/local/bin/composer`

>需要注意的是外国镜像一般用不了
>说以我们要更换到国内镜像

-必须要有composer.json文件才行

*局部更换

	>composer config repo.packagist composer https://packagist.phpcomposer.com

*全局更换
	
	>composer config -g repo.packagist composer https://packagist.phpcomposer.com

*更新composer
	>composer self-update

## 安装和管理依赖

## 关于自动加载和php规范

	> PSR-0 自动加载
	> PSR-1 基本代码规范
	> PSR-2 代码样式
	> PSR-3 日志接口	
	> 2013年底，新出了第5个规范—— PSR-4 。
	> 一个自动加载的规范他与PSR-0有所不同

- PSR-0
```
vendor/
    vendor_name/
        package_name/
            src/
                Vendor_Name/
                    Package_Name/
                        ClassName.php       # Vendor_Name\Package_Name\ClassName
            tests/
                Vendor_Name/
                    Package_Name/
                        ClassNameTest.php   # Vendor_Name\Package_Name\ClassName
```

- PSR-4
```
vendor/
    vendor_name/
        package_name/
            src/
                ClassName.php       # Vendor_Name\Package_Name\ClassName
            tests/
                ClassNameTest.php   # Vendor_Name\Package_Name\ClassNameTest
```

>我们可以看出PSR-4更加的简洁