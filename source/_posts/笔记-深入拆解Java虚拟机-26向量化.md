---
title: 笔记-深入拆解Java虚拟机-26向量化
date: 2018-12-03 10:25:32
tags: JVM
categories: Java虚拟机
---

# SIMD

| 寄存器名称 | 所属指令集 | 位数 | 备注 |
| ------------ | ----------- | ----- | ---- |
| XMM 寄存器 | SSE（Streaming SIMD Extensions）指令集 | 128 位 | |
| YMM 寄存器 | AVX（Advanced Vector Extensions）指令集 | 256 位 | XMM升级版 |
| ZMM 寄存器 | AVX512 指令集 | 512 位 | YMM升级版 |

原本使用 XMM 寄存器的指令，使用 YMM 寄存器的低 128 位。

支持 AVX512 指令集的 CPU 都比较贵，目前在生产环境中很少见到。

HotSpot 虚拟机更新了不少基于 AVX512 指令集以及 ZMM 寄存器的优化。

> 单指令流多数据流（Single Instruction Multiple Data，SIMD）：即通过单条指令操控多组数据的计算操作。这些指令称之为 SIMD 指令。

- SIMD 指令将上述寄存器中的**值看成多个整数或者浮点数组成的向量**，进行**批量计算**。

	- 128 位 XMM 寄存器里的值可以看成 16 个 byte 值组成的向量，或者 8 个 short 值组成的向量，4 个 int 值组成的向量，两个 long 值组成的向量。

- SIMD 指令PADDB、PADDW、PADDD以及PADDQ，将分别实现 byte 值、short 值、int 值或者 long 值的向量加法。

- SIMD 指令也被看成 **CPU 指令级别的并行**。

# 使用 SIMD 指令的 HotSpot Intrinsic

- SIMD 指令虽然非常高效，但是**使用很麻烦**。

- 不同的 CPU 所支持的 SIMD 指令可能不同。

- **Java 程序无法像 C++ 程序那样**，直接**使用由 Intel 提供的**，将被替换为具体 SIMD 指令的 **intrinsic 方法**。

- **HotSpot 虚拟机提供 Java 层面的 intrinsic 方法**，这些 intrinsic 方法的语义要**比单个 SIMD 指令复杂得多**。

- 使用 SIMD 指令的 HotSpot intrinsic 是虚拟机开发人员根据其语义定制的，因而性能相当优越。

- 由于**开发及维护成本较高**，这种类型的 intrinsic 屈指可数。

- **intrinsic 方法只能做到点覆盖**，在多数情况下，应用程序不会用到这些 intrinsic 的语义，却又存在向量化优化的机会（借助自动向量化）。

# 自动向量化（auto vectorization）

- 即时编译器的自动向量化将针对**能够展开的计数循环，进行向量化优化**。

- [计数循环的判定](/2018/11/24/笔记-深入拆解Java虚拟机-25循环优化/#计数循环需满足的-4-个条件)

- 自动向量化的条件较为苛刻。

- **C2 支持的整数向量化操作不多**（加法，减法，按位与、或、异或，以及批量移位和批量乘法）。

- C2 支持**向量点积的自动向量化**，需要多条 SIMD 指令完成，并不是十分高效。

<!-- - 为了解决向量化 intrinsic 以及自动向量化覆盖面过窄的问题，在 OpenJDK 的 [Paname 项目](http://openjdk.java.net/projects/panama/) 中尝试引入开发人员可控的向量化抽象（[参考 Vladimir Ivanov 2018 年在 JVMLS 上的演讲](http://cr.openjdk.java.net/~vlivanov/talks/2018_JVMLS_VectorAPI.pdf)）。-->

## 自动向量化的条件

1. 循环变量的**增量为 1**（能够遍历整个数组）。
2. 循环变量**不能为 long 类型**（ C2 无法将循环识别为计数循环）。
3. 循环**迭代之间最好不要有数据依赖**（循环展开之后，循环体内存在数据依赖，C2 无法进行自动向量化）。
4. 循环体内**不要有分支跳转**。
5. **不要手工进行循环展开**（如果 C2 无法自动展开，也无法进行自动向量化）。

# 引用

> https://time.geekbang.org/column/article/39838