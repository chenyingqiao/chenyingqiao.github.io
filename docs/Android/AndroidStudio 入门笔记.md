#AndroidStudio入门笔记
<a href="http://blog.csdn.net/innost/article/details/48228651">Graoovy语言  </a>
<a href="http://blog.csdn.net/lincyang/article/details/43853259">gradle和android studio</a>

## 认识Gradle

>  Gradle是一个jvm的构建工具
>  他可以描述在什么情况下面编译什么文件或者包含什么jar包
>  这个让他区别maven(使用的是xml文件描述需要的依赖)
>  他使用的语言是Groovy  (其实Gradle是一个Groovy语言的编程框架)

>我们需要了解下面几点

1. Groovy，由于它基于Java，所以我们仅介绍Java之外的东西。了解Groovy语言是掌握Gradle的基础。
2. Gradle作为一个工具，它的行话和它“为人处事”的原则。

### Groovy

> 基本语法和实例程序

```Groovy
l Groovy注释标记和Java一样，支持//或者/**/  
l Groovy语句可以不用分号结尾。Groovy为了尽量减少代码的输入，确实煞费苦心  
l Groovy中支持动态类型，即定义变量的时候可以不指定其类型。
Groovy中，变量定义可以使用关键字def。注意，虽然def不是必须的，但是为了代码清晰，建议还是使用def关键字  
   def variable1 = 1   //可以不使用分号结尾  
   def varable2 = "I ama person"  
  def  int x = 1  //变量定义时，也可以直接指定类型  
l   函数定义时，参数的类型也可以不指定。比如  
String testFunction(arg1,arg2){//无需指定参数类型  
  ...  
}  
l 除了变量定义可以不指定类型外，Groovy中函数的返回值也可以是无类型的。比如：  
//无类型的函数定义，必须使用def关键字  
def  nonReturnTypeFunc(){  
    last_line   //最后一行代码的执行结果就是本函数的返回值  
}  
//如果指定了函数返回类型，则可不必加def关键字来定义函数  
String getString(){  
   return"I am a string"  
}  
```


```Groovy
l 函数返回值：Groovy的函数里，可以不使用returnxxx来设置xxx为函数返回值。如果不使用return语句的话，则函数里最后一句代码的执行结果被设置成返回值。比如  
//下面这个函数的返回值是字符串"getSomething return value"  
def getSomething(){  
     "getSomething return value" //如果这是最后一行代码，则返回类型为String  
      1000//如果这是最后一行代码，则返回类型为Integer  
}  
```

```Groovy
l 函数返回值：Groovy的函数里，可以不使用returnxxx来设置xxx为函数返回值。如果不使用return语句的话，则函数里最后一句代码的执行结果被设置成返回值。比如  
//下面这个函数的返回值是字符串"getSomething return value"  
def getSomething(){  
     "getSomething return value" //如果这是最后一行代码，则返回类型为String  
      1000//如果这是最后一行代码，则返回类型为Integer  
}  
```

```Groovy
l Groovy对字符串支持相当强大，充分吸收了一些脚本语言的优点：  
1  单引号''中的内容严格对应Java中的String，不对$符号进行转义  
   defsingleQuote='I am $ dolloar'  //输出就是I am $ dolloar  
2  双引号""的内容则和脚本语言的处理有点像，如果字符中有$号的话，则它会$表达式先求值。  
   defdoubleQuoteWithoutDollar = "I am one dollar" //输出 I am one dollar  
   def x = 1  
   defdoubleQuoteWithDollar = "I am $x dolloar" //输出I am 1 dolloar  
3 三个引号'''xxx'''中的字符串支持随意换行 比如  
   defmultieLines = ''' begin  
     line  1  
     line  2  
     end '''  
l 最后，除了每行代码不用加分号外，Groovy中函数调用的时候还可以不加括号。比如：  
println("test") ---> println"test"  
注意，虽然写代码的时候，对于函数调用可以不带括号，但是Groovy经常把属性和函数调用混淆。比如  
def getSomething(){  
  "hello"  
}  
```


##基本组件

```
Gradle是一个框架，它定义一套自己的游戏规则。我们要玩转Gradle，必须要遵守它设计的规则。下面我们来讲讲Gradle的基本组件：
Gradle中，每一个待编译的工程都叫一个Project。每一个Project在构建的时候都包含一系列的Task。
比如一个Android APK的编译可能包含：
Java源码编译Task、资源编译Task、JNI编译Task、lint检查Task、打包生成APK的Task、签名Task等。
一个Project到底包含多少个Task，其实是由编译脚本指定的插件决定。插件是什么呢？插件就是用来定义Task，并具体执行这些Task的东西。
刚才说了，Gradle是一个框架，作为框架，它负责定义流程和规则。而具体的编译工作则是通过插件的方式来完成的。
比如编译Java有Java插件，编译Groovy有Groovy插件，编译Android APP有Android APP插件，编译Android Library有Android Library插件
好了。到现在为止，你知道Gradle中每一个待编译的工程都是一个Project，一个具体的编译过程是由一个一个的Task来定义和执行的。
```

##体验gradle项目管理

>新建一个java包的目录结构

```
mkdir -p src/main/java/com/test; vim src/main/java/com/test/HelloWorld.java
```

> 新建build.gradle（src同级目录）

```
vim build.gradle
```

>执行编译

```
chen@chen-pc:~/AndroidStudioProjects/gradleTest$ gradle build
Picked up _JAVA_OPTIONS:   -Dawt.useSystemAAFontSettings=gasp
:compileJava
:processResources UP-TO-DATE
:classes
:jar
:assemble
:compileTestJava UP-TO-DATE
:processTestResources UP-TO-DATE
:testClasses UP-TO-DATE
:test UP-TO-DATE
:check UP-TO-DATE
:build

BUILD SUCCESSFUL

Total time: 5.246 secs

This build could be faster, please consider using the Gradle Daemon: https://docs.gradle.org/2.10/userguide/gradle_daemon.html
```

> 编译完成 目录结构

```
chen@chen-pc:~/AndroidStudioProjects/gradleTest$ tree -L 6
.
├── build
│   ├── classes
│   │   └── main
│   │       └── com
│   │           └── test
│   │               └── HelloWorld.class
│   ├── dependency-cache
│   ├── libs
│   │   └── gradleTest.jar
│   └── tmp
│       ├── compileJava
│       └── jar
│           └── MANIFEST.MF
├── build.gradle
└── src
    └── main
        └── java
            └── com
                └── test
                    └── HelloWorld.java

15 directories, 5 files

```

> 运行编译之后的程序

```
chen@chen-pc:~/AndroidStudioProjects/gradleTest/build$ java -cp classes/main/ com.test.HelloWorld 
Picked up _JAVA_OPTIONS:   -Dawt.useSystemAAFontSettings=gasp
hello, world
```