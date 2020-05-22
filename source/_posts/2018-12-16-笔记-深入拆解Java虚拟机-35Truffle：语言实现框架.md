---
title: '「深入拆解 Java 虚拟机」35 Truffle：语言实现框架'
date: 2018-12-16 11:28:43
tags: JVM
categories: 《深入拆解 Java 虚拟机》
---

原文：https://time.geekbang.org/column/article/41347

# 语言实现

## [编译型语言](https://en.wikipedia.org/wiki/Compiled_language)

- 实现一门新编程语言的传统做法是**实现一个编译器**。

- 编译器分为前端和后端：

	- 前端：负责词法分析、语法分析、类型检查和中间代码生成。

	- 后端：负责编译优化和目标代码生成。

- 另一种做法是将新语言**编译成某种已知语言**，或者已知的中间形式（如 Java 字节码）。

- 可以直接享用 JVM 自带的各项优化（即时编译、自动内存管理等等）。

## [解释型语言](https://en.wikipedia.org/wiki/Interpreted_language)

- 无须编译步骤，依赖于**解释执行器**进行**解析并执行**。

- 通常将其包装在虚拟机里（实现如即时编译、垃圾回收等其他组件）。

- 理想情况下，希望不同的语言实现中复用这些组件，只要实现解释执行器。

# Truffle 项目简介

- **用 Java 写的语言实现框架。**

- 基于 Truffle 的语言可以享用由 Truffle 提供的各项运行时优化。需实现：

	- 用 Java 实现词法分析

	- 语法分析

	- 针对语法分析所生成的抽象语法树（Abstract Syntax Tree，AST）的解释执行器

- **可以运行在任何 JVM 上。**

- 如果 Truffle 运行在附带了 Graal 编译器的 Java 虚拟机之上，它将调用 Graal 编译器所提供的 API，**主动触发对 Truffle 语言的即时编译**，将对 AST 的解释执行转换为执行即时编译后的机器码。

- **对于解释型语言**，经由 Graal 编译器加速的 Truffle 语言解释器的**性能十分优越**。

- **对于拥有专业即时编译器语言，仍处于追赶者的位置。**

# Partial Evaluation

- 将 P: I -> O 转化为 P': ID -> O

- P' 是 P 的特化（Specialization）。

| 符号 | 含义 | 对应关系 |
| ----- | -----| --------- |
| P | 程序 | Truffle 语言的解释执行器 |
| P' | 等价的另一段程序 | 通过 Partial Evaluation 特化为P' |
| I | 输入 | |
| IS | 已知常量 | Truffle 语言写的程序 |
| ID | 未知变量 | |
| O | 输出 | |

- 可以利用 Graal 编译器将 P' 编译为二进制码。

# 节点重写（node rewriting）

- 动态语言中，需要在运行时动态确定操作数的具体类型。

- 在运行时选择语义的节点，不利于即时编译，严重影响到程序的性能。

- Truffle 语言解释器会收集每个 AST 节点所代表的操作的类型，**在即时编译时作出 profile 的特化**（specialization）。

- 在即时编译过后，如果运行过程中发现**实际类型和假设类型不同**，会**去优化**返回至解释执行状态，并且**重新收集 AST 节点的类型信息**。

# Polyglot

- **允许在同一段代码中混用不同的编程语言。**

- Truffle 语言之间能够**共用对象**（与其他 Polyglot 框架的区别）。

- Truffle 的 Polyglot 在**切换语言**时，**性能开销非常小**，甚至**零开销**。

- 通过 Polyglot API 来实现。
