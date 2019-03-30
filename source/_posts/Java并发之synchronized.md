---
title: Java并发之synchronized
date: 2019-02-18 14:24:12
tags: [Java,Java基础,Java多线程,面试]
categories: [Java]
---

# 锁机制的特性

- 互斥性
- 可见性

# 用法

## 修饰代码块

```java
synchronized(object) {}
```

```java
synchronized(类.class) {}
```
## 修饰方法

- 成员方法

```java
synchronized void method1() {}
```
等同于

```java
void method1() {
	synchronized(this) {}
}
```

- 静态方法

```java
synchronized static void method2() {}
```

等同于

```java
static void method2() {
	synchronized(该类.class) {}
}
```

# 锁的是对象还是代码？

- **synchronized 锁的是对象**，线程只有拿到了锁对象才能执行 synchronized 那段代码，否则阻塞等待。

也就是说，如果锁对象是 this，那么同步机制仅对该对象有效。

- 线程拿到锁对象后，**其他线程可以执行非 synchronized 代码**。

- 同时访问 static synchronized 方法和 synchronized 方法可以并行。

前者锁对象是 Class 对象，后者锁对象是 this，锁对象不同，两个方法可以并行。

## 如果想锁全局怎么办

- **锁住该类对应的 Class 对象。**

Class 类比较特殊，每个类都会有一个对应的 Class 对象且唯一，由 JVM 维护。

- 提供一个公用的锁对象。（例如声明为 static 的字段）

# synchronized 的性质

## 可重入性

- **同一线程的外层函数获得锁之后，内层函数可以直接再次获取该锁。**

- 可避免死锁、提升封装性。

线程从 A 方法进入 B 方法时不需要释放锁后重新申请，可直接获得锁对象。

```java
synchronized void methodA() {
	methodB();
}

synchronized void methodB() {}
```

- 同一个方法是可重入的。

- **可重入不要求是同一个方法。**

- **可重入不要求是同一个类中的。**

## 不可中断性

- 如果锁对象被其他线程获得，只能阻塞等待。

- 如果锁对象永远不被释放，只能永远等待。

# 其他注意事项

- **锁对象不能为 null。**

- **synchronized 关键字不能被继承。**

父类中的 synchronized 修饰方法，子类重写该方法时，默认情况不同步，必须显示的使用 synchronized 关键字。

- 抽象方法不能使用 synchronized 关键字。

- 构造方法不能使用 synchronized 关键字，但可以使用 `synchronized(this) {}`。

- synchronized 有系统开销，尽量减小锁的粒度（作用域范围）。

- 避免死锁。

# synchronized 实现原理（字节码）

> [详细实现原理](/2018/10/17/笔记-深入拆解Java虚拟机-14Java虚拟机是怎么实现synchronized的？)

- 同步块使用 monitorenter 和 moniterexit 指令。

- 同步方法使用修饰符 ACC_SYNCHRONIZED 。

- 同步本质上都是通过监视器（monitor）提供支持。

- 所有对象都有一个自己的监视器（monitor）。

- 本地内存中共享变量副本发生变化后，解锁之前将本地内存中共享变量的值刷新到主存。

- 其他线程获取到锁后，去主内存中读取该共享变量的新值。

## 可重入性原理

- 锁对象监视器计数为 0 时，线程进入监视器，并设置计数器 为 1。（monitorenter）

- 线程重入监视器时，计数器 +1。（monitorenter）

- 线程退出监视器时，计数器 -1。（monitorexit）

- 如果监视器与其他线程关联，该线程阻塞等待，直到监视器计数器为 0。

# synchronized 的缺陷

- **效率低**：试图获得锁时**不能设定超时**，**不能中断**。

- **不灵活**：加锁和解锁的**时机和条件单一**。

- **无法知道是否成功获取到锁。**

# 参考

https://juejin.im/post/594a24defe88c2006aa01f1c

https://blog.csdn.net/xiao__gui/article/details/8188833

https://www.jianshu.com/p/a499d13ca702