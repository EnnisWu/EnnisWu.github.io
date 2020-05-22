---
title: '「深入拆解 Java 虚拟机」36 SubstrateVM：AOT 编译框架'
date: 2018-12-19 10:54:30
tags: [JVM,看不懂]
categories: 《深入拆解 Java 虚拟机》
---

原文：https://time.geekbang.org/column/article/41582


# AOT（Ahead-Of-Time）编译

- **程序运行之前，将字节码转换为机器码的过程。**

- 编译后可以需要链接至托管环境中的动态共享库，也可以是独立运行的可执行文件。

- 狭义的 AOT 编译针对的目标代码是可以被即时编译的代码。

- 可以简单地理解为类似 GCC 的静态编译器。

## 优点

- 无须在运行时耗费 CPU 资源进行即时编译。

- 程序能在**启动时就达到理想的性能**。

## 缺点

- 无法得知程序运行时的信息。

- 无法进行基于类层次分析的完全虚方法内联。（不懂）

- 无法进行基于程序 profile 的投机性优化。（不懂）

- **影响程序的峰值性能。**

# [jaotc](http://openjdk.java.net/jeps/295)

> Java 9 引入的实验性 AOT 编译工具。

- 借助 Graal 编译器，将类文件转换为机器码，存放在生成的动态共享库中。

- **在方法调用时切入**，能够去优化至解释执行。

- 由于 JVM 可能通过 Java agent 或者 C agent 改动加载的字节码，或者这份 AOT 编译生成的机器码针对的是旧版本的 Java 类，因此它**需要额外的验证机制**，来保证即将链接的机器码的语义与对应的 Java 类的语义是一致的。

## 类指纹（class fingerprinting）

- 在动态共享库中保存被编译的 Java 类的摘要信息。

- JVM 比较摘要信息和已加载的 Java 类。

- 不匹配则舍弃。

## 应用

- **编译 java.base module**（Java 核心类库中最为基础的类）。

- 这些类可能被应用程序调用，但频率未必高到能触发即时编译。

- 将它们**提前编译为机器码**，**避免**在执行即时编译生成的机器码时，因为调用到这些基础类，而需要**切换至解释执行的性能惩罚**。

# SubstrateVM 的设计与实现

> 设计初衷是提供一个高启动性能、低内存开销，并且能够无缝衔接 C 代码的 Java 运行时。

## SubstrateVM 的限制

> [文档](https://github.com/oracle/graal/blob/master/substratevm/LIMITATIONS.md)

- **脱离 HotSpot 虚拟机，拥有独立运行时**（包含异常处理，同步，线程管理，内存管理（垃圾回收）和 JNI 等组件）。

- **要求目标程序是封闭的，不能动态加载其他类库等。**

- 探索整个编译空间，通过静态分析推算所有虚方法调用的目标方法。

- 将所有可能执行到的方法都纳入编译范围，避免实现解释执行器。

- 主要用于 JVM 语言的 AOT 编译。

- Truffle 语言实现可以在 SubstrateVM 上运行，但不会 AOT 编译。

## native image generator

- 是一个 Java 程序。

- 包含 AOT 编译逻辑。

- 采用指针分析（points-to analysis），从程序入口出发，探索所有可达代码。

- 执行初始化代码。

- 最终生成可执行文件时，将已初始化的堆保存至一个堆快照之中。

## SubstrateVM 运行时

- 精简运行时，经过 AOT 编译的目标程序将跑在该运行时之上。

- 直接从目标程序开始运行，无须进行 JVM 初始化。

# SubstrateVM 的启动时间与内存开销

- **启动时间和内存开销非常少。**

- 适合嵌入其他系统中。

# [Metropolis 项目](http://openjdk.java.net/projects/metropolis/)

> 实现**“Java-on-Java”**的目标。

Oracle 的架构师 John Rose 提出的使用 Java 开发 Java 虚拟机的好处：

1. 能够完全控制编译 Java 虚拟机时所使用的优化技术。

2. 能够与 C++ 语言的更新解耦合。

3. 能够减轻开发人员以及维护人员的负担。

4. 能够以更为敏捷的方式实现 Java 的新功能。

- [JikesRVM 项目](https://www.jikesrvm.org/)和[Maxine VM 项目](https://github.com/beehive-lab/Maxine-VM)已用 Java 完整地实现了一套 Java 虚拟机（后者的即时编译器 C1X 是 Graal 编译器的前身）。

- Java-on-Java 技术通常会干扰应用程序的垃圾回收、即时编译优化。

- 严重影响 JVM 的启动性能。

# 深入拆解Java虚拟机完结