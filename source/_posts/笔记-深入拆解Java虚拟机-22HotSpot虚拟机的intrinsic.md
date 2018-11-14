---
title: 笔记-深入拆解Java虚拟机-22HotSpot虚拟机的intrinsic
date: 2018-11-14 19:14:48
tags: JVM
categories: Java虚拟机
---

- HotSpot 虚拟机中，所有被标注 @HotSpotIntrinsicCandidate 注解的方法都是 HotSpot intrinsic。
- 这些方法的调用，会被 HotSpot 虚拟机**替换成高效的指令序列**。**原本的方法实现**则会被**忽略**掉。
- 如果 Java 核心类库的开发者更改了原本的实现，虚拟机中的高效实现也需要进行相应的修改。
- **其他虚拟机不一定维护**了这些 intrinsic 的高效实现。
- 这些高效实现通常**依赖于具体的 CPU 指令**，而这些 CPU 指令不好在 Java 源程序中表达。
- 如果换了一个体系架构，可能没有对应的 CPU 指令，无法进行 intrinsic 优化。

<!-- # intrinsic 与 CPU 指令 -->

<!-- 看看即可 -->

# intrinsic 与方法内联

## 独立的桩程序

- 可以被解释执行器利用，直接替换对原方法的调用。
- 可以被即时编译器所利用，把代表对原方法的调用的 IR 节点，替换为对这些桩程序的调用的 IR 节点。
- 这种形式实现的比较少，主要包括 Math 类的一些方法。

## 特殊的编译器 IR 节点

- 只能被即时编译器所用。
- 将对原方法的调用的 IR 节点，替换成特殊的 IR 节点，并参与接下来的优化过程。
- 替换过程是在方法内联时进行。
- native 方法被标记为 intrinsic 也能够 " 内联 " 进来，并插入特殊的 IR 节点。
- 即时编译器的后端根据这些特殊的 IR 节点，生成指定的 CPU 指令。
-native 方法经过 intrinsic 优化之后，JNI 开销直接消失不见，最终的结果十分高效。
- 大部分实现通过这种形式。

# 已有 intrinsic 简介

- 最新版本的 HotSpot 虚拟机定义了三百多个 intrinsic（Java 10.0.2）。
- 有三成以上是Unsafe类的方法。

<!-- 其他看看即可 -->

# 引用

> https://time.geekbang.org/column/article/18046