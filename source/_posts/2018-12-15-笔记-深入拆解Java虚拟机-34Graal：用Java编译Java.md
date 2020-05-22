---
title: '「深入拆解 Java 虚拟机」34 Graal：用 Java 编译 Java'
date: 2018-12-15 13:49:51
tags: JVM
categories: 《深入拆解 Java 虚拟机》
---

原文：https://time.geekbang.org/column/article/41245

# GraalVM

> GraalVM 是一个高性能的、支持多种编程语言的执行环境。它既可以在传统的 OpenJDK 上运行，也可以通过 AOT（Ahead-Of-Time）编译成可执行文件单独运行，甚至可以集成至数据库中运行。

> 除此之外，它还移除了编程语言之间的边界，并且支持通过即时编译技术，将混杂了不同的编程语言的代码编译到同一段二进制码之中，从而实现不同语言之间的无缝切换。

# Graal 编译器

> 用 Java 写就的即时编译器，它从 Java 9u 开始便被集成自 JDK 中，作为实验性质的即时编译器。

- 启用时将替换掉 HotSpot 中的 C2 编译器。

- 响应原本 C2 负责的编译请求。

# Graal 和 Java 虚拟机的交互

即时编译器与 JVM 的交互可以分为三个方面：

1. 响应编译请求。

2. 获取编译所需的元数据（如类、方法、字段）和反映程序执行状态的 profile。

3. 将生成的二进制码部署至代码缓存（code cache）里。

- 传统情况，**即时编译器是与 JVM 紧耦合**。

- 更改即时编译器需要重新编译整个 JVM。

- 引入 [JVM 编译器接口](http://openjdk.java.net/jeps/243)（JVM Compiler Interface，JVMCI）解耦合 JVM 和 Graal。

- **Java 程序可以直接调用 Graal**，编译并部署指定方法（因为 JVMCI）。

- Graal 的单元测试和 Truffle 语言实现框架基于上述技术。

# Graal 和 C2 的区别

- Graal 由 **Java 编写**，C2 由 C++ 编写。

- Graal **更加模块化，更容易开发与维护**。

- Graal 中被证实有效的部分逃逸分析（partial escape analysis）未被移植到 C2 中。

- Graal 的**内联算法对新语法、新语言更加友好**。

# Graal 的实现

- 编译过程分为前端和后端。

- **前端**实现**平台无关**的优化（如方法内联），和小部分平台相关的优化。

- **后端**实现大部分**平台相关**优化（如寄存器分配），和**生成机器码**。

- 前端的 IR 称为 High-level IR（HIR）（如Sea-of-Nodes IR），后端的 IR 称为 Low-level IR（LIR）。

- 前端由一个个单独的优化阶段（optimization phase）构成。

- 前端编译阶段除了少数几个关键的之外，其余均可以通过配置选项开启或关闭。

- **Graal 比 C2 更加激进**，设计上**十分青睐基于假设的优化手段**。

- Graal 支持自定义假设，和直接与去优化节点相关联。

- Graal 实现高性能的 intrinsic 方法相对简单。

# 问题

Q：GraalVM 和 JVM 是什么关系？

A：可以将 GraalVM 看成泛指带 Graal 编译器的虚拟机。

---

Q：**可不可以把 profile 和编译的机器码保存到磁盘**，在代码和运行平台不变的情况下，下次启动（或部署多实例）的时候直接装载这部分数据？这算作是一种系统预热的可行性方案吗？

A：**已经有这种做法**，但同时需要承担 profile 不能反映当前执行状态的风险。

---

Q：**Graal 自身的及时编译是调用 Graal 自身吗？如果这么做会不会出现无穷递归？**

A：默认情况下，**由 C1 编译Graal。调用 Graal 编译 Graal 并不会造成无穷递归。**因为 JVM 里有解释执行器，能够执行 Graal 代码。
