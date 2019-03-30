---
title: 笔记-深入拆解Java虚拟机-2829基准测试框架JMH
date: 2018-12-04 17:12:22
tags: JVM
categories: Java虚拟机
---

通过 ```System.nanoTime``` 或者 ```System.currentTimeMillis``` 来测量程序所花费的时间过于理性化，忽略了 Java 虚拟机、操作系统，硬件系统所带来的影响。

# 性能测试的坑

## Java 虚拟机的影响

- Java 虚拟机堆空间的自适配
- 即时编译
- 循环展开
- 等

## 操作系统和硬件系统的影响

- 电源管理策略
- CPU 缓存
- 分支预测器
- 超线程技术
- 等

# JMH（Java Microbenchmark Harness）

>  OpenJDK 中的开源项目。是一个面向 Java 语言或者其他 Java 虚拟机语言的性能基准测试框架。

- JMH 内置许多功能来控制即时编译器的优化。
- 其他影响性能评测的因素也提供了不少策略降低影响，甚至彻底解决。

# 如何使用 JMH

www.baidu.com
www.google.com

# 引用

> https://time.geekbang.org/column/article/40275
> https://time.geekbang.org/column/article/40281