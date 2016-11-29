# php trait类的多继承

## trait类的多继承 基本用法

```php
<?php
class Base {
    public function sayHello() {
        echo 'Hello ';
    }
}
//这里相当与如果定义了一个sayHello的方法继承体
//相当于 `@Override`  如果子类方法不存在这个方法就直接调用本方法
//这里parent::sayHello();是调用继承的父亲方法
trait SayWorld {
    public function sayHello() {
        parent::sayHello();
        echo 'World!';
    }
}
//这个类继承了父类
class MyHelloWorld extends Base {
    use SayWorld;//引用了SayWorld重载
}

$o = new MyHelloWorld();
$o->sayHello();
?>
```

## train可以相互包含

```php
<?php
trait Hello {
    public function sayHello() {
        echo 'Hello ';
    }
}

trait World {
    public function sayWorld() {
        echo 'World!';
    }
}

trait HelloWorld {
    use Hello, World;
}

class MyHelloWorld {
    use HelloWorld;
}

$o = new MyHelloWorld();
$o->sayHello();
$o->sayWorld();
?>
```

## trait可以定义抽象方法和静态方法

### 抽象

```php
<?php
trait Hello {
    final public function hello($s) { print "$s, hello!"; }
    public function sayHelloWorld() {
        echo 'Hello'.$this->getWorld();
    }
    abstract public function getWorld();
}

class MyHelloWorld {
    private $world;
    use Hello;
    use Foo;
    // Overwrite, no error
    final public function hello($s) { print "hello, $s!"; }
    public function getWorld() {
        return $this->world;
    }
    public function setWorld($val) {
        $this->world = $val;
    }
}
?>
```
### 静态

```php
<?php
trait Counter {
    public function inc() {
        static $c = 0;
        $c = $c + 1;
        echo "$c\n";
    }
}

class C1 {
    use Counter;
}

class C2 {
    use Counter;
}

$o = new C1(); $o->inc(); // echo 1
$p = new C2(); $p->inc(); // echo 1
?>
```

