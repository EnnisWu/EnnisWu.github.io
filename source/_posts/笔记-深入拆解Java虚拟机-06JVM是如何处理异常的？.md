---
title: 笔记-深入拆解Java虚拟机-06JVM是如何处理异常的？
date: 2018-08-01 14:41:48
tags: JVM
categories: Java虚拟机
---

# 异常的基本概念

![image](http://pcrioz2ch.bkt.clouddn.com/JVM/06/throwable.png)

- Error：涵盖程序不应捕获的异常（JVM抛出）。
程序出发Error时，执行状态已经无法恢复，需要终止线程甚至终止虚拟机。

- Exception：涵盖程序可能需要捕获且处理的异常。
- RuntimeException：表示“程序虽然无法继续执行，但是还能抢救一下”的情况。
- **RuntimeException和Error非检查异常（unchecked exception）。其他异常属于检查异常（checked exception）。**
- 检查异常需要程序显式地捕获，或者在方法声明中用throws关键字再次抛出。


## 常实例的构造十分昂贵。

在构造异常实例时，Java虚拟机需要**生成该异常的栈轨迹**（stack trace）。

- 逐一访问当前线程的Java栈帧。
- 记录下各种调试信息（方法名，方法所在类名，文件名，代码中第几行）。
- Java虚拟机会**忽略异常构造器和填充栈帧的Java方法**（Throwable.fillInStackTrace），直接从新建异常位置开始算起。
- Java虚拟机会**忽略标记为不可见的Java方法栈帧**。

### 是否可以缓存异常实例，在需要用到的时候直接抛出？

- 从语法角度上，是允许的。
- **对应的栈轨迹并非throw语句的位置，而是新建异常的位置。**

# Java虚拟机是如何捕获异常的？

编译生成的字节码中，**每个方法都附带一个异常表**。

异常表中每一个条目代表一个异常处理器。

异常处理器的组成：

- from指针
- to指针
- target指针
- 所捕获的异常类型

注：指针的值是字节码索引（bytecode index，bci），用来定位字节码。

**from指针和to指针：标示异常处理器所监控的范围（如try代码块范围）。**

**target指针：指向异常处理器的起始位置（如catch代码块起始位置）。**

## 触发异常的处理流程

1. Java虚拟机**从上至下遍历异常表**中的所有条目。
2. **触发异常**的字节码的索引值**在某个异常表条目的监控范围内**，Java虚拟机判断所抛出的异常和该条目想要捕获的异常**是否匹配**。
2. 如果**匹配**，Java 虚拟机将控制流**转移至该条目target指针指向**的字节码。
3. 如果**遍历完所有**异常表条目，仍**未匹配**到异常处理器，**弹出当前方法对应的Java栈帧，在调用者（caller）中重复上述操作**。
4. finally代码块的编译，当前版本Java编译器，是**复制finally代码块的内容，分别放在try-catch代码块所有正常执行路径和异常执行路径的出口中**。

![image](http://pcrioz2ch.bkt.clouddn.com/JVM/06/trigger_exception.png)

针对异常执行路径，Java编译器会生成一个或多个异常表条目，监控整个try-catch代码块，并且捕获所有种类的异常（在 javap 中以 any 指代）。

这些异常表条目的 target 指针将指向另一份复制的finally代码块。

在这个finally代码块的最后，Java编译器会重新抛出所捕获的异常。

**如果catch代码块捕获了异常，并且触发了另一个异常，那么finally捕获并且重抛后者，忽略前者。**

# Java7的Suppressed异常以及语法糖

## Suppressed异常

允许将一个异常附于另一个异常之上。

**抛出的异常可以附带多个异常信息。**

finally代码块缺少指向所捕获异常的引用，这个新特性使用起来非常繁琐。

## try-with-resources

```java
try (  ); // try-with-resources
```

在字节码层面自动使用Suppressed异常。

**自动关闭资源**（实现AutoCloseable接口）。

## 同一catch代码块捕获多种异常

```java
try {
  
} catch (SomeException | OtherException e) {
  
}
```

# 参考

> https://time.geekbang.org/column/article/12134