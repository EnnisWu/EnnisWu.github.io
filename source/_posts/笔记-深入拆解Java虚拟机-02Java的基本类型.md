---
title: 笔记-深入拆解Java虚拟机-02Java的基本类型
date: 2018-07-28 14:46:02
tags: JVM
categories: Java虚拟机
---

在 Smalltalk 中，所有的值都是对象。因此，许多人认为它是一门纯粹的面向对象语言。

Java 则不同，它引进了**八个基本类型**，来支持数值计算。Java 这么做的原因主要是工程上的考虑，因为使用**基本类型能够在执行效率以及内存使用两方面提升软件性能**。

# Java虚拟机的 boolean类型

```java
public class Foo {
	public static void main(String[] args) {
		boolean 吃过饭没 = 2; // 直接编译的话 javac 会报错
		if (吃过饭没) 
			System.out.println(" 吃了 ");
		if (true == 吃过饭没) 
			System.out.println(" 真吃了 ");
	}
}
```

Java语言规范中，boolean类型的值只有两种，用“true”和“false”表示。

**Java虚拟机规范中，boolean类型被映射成int类型，“true”映射为整数1，“false”映射为整数0。**

```
# Foo.main 编译后的字节码
 0: iconst_2       // 我们用 AsmTools 更改了这一指令
 1: istore_1
 2: iload_1
 3: ifeq 14        // 第一个 if 语句，即操作数栈上数值为 0 时跳转
 6: getstatic java.lang.System.out
 9: ldc " 吃了 "
11: invokevirtual java.io.PrintStream.println
14: iload_1
15: iconst_1
16: if_icmpne 27   // 第二个 if 语句，即操作数栈上两个数值不相同时跳转
19: getstatic java.lang.System.out
22: ldc " 真吃了 "
24: invokevirtual java.io.PrintStream.println
27: return
```

在前面的例子中，第一个 if 语句会被编译成条件跳转字节码 ifeq，翻译成人话就是说，如果局部变量“吃过饭没”的值为 0，那么跳过打印“吃了”的语句。  

而第二个 if 语句则会被编译成条件跳转字节码 if_icmpne，也就是说，如果局部变量的值和整数 1 不相等，那么跳过打印“真吃了”的语句。  

# Java的基本类型

![primitive_types](/images/posts/JVM/02/primitive_types.png)

## 默认值

**在内存中，默认值都是0。**

## 取值范围

- boolean和char是唯二的无符号类型。
- boolean类型的取值范围是0或1。
- char类型的取值范围是[0, 65535]。

boolean, byte, char, short的**局部变量储存可以超过取值范围**。

**正常使用Java编译器的情况下，生成的字节码会遵守Java虚拟机规范对编译器的约束。**

## 浮点数

浮点数类型采用IEEE 754 浮点数格式。

以float为例，**浮点类型通常有两个0，+0.0F 和 \-0.0F**。

在Java里，前者为0，后者符号位为1，其他位为0。

虽然内存数值不同，但 +0.0F == -0.0F 会返回true。

```java
float a = +0.0f;
float b = -0.0f;
float c = Float.intBitsToFloat(0x80000000);
```

**在内存中，正无穷等于0x7F800000，负无穷等于0xFF800000。**

**[0x7F800001, 0x7FFFFFFF] 和 [0xFF800001, 0xFFFFFFFF] 对应NaN （Not-a-Number）。**

一般我们计算得出的NaN（+0.0F/+0.0F），在内存中为0x7FC00000。

这个数值称为标准的NaN，其他的称为不标准的NaN。

**NaN有一个特性：“!=” 始终返回true，其他比较结果都回返回false。**

# Java基本类型的大小

Java虚拟机没调用一个Java方法，便会创建一个栈帧，这里**只讨论供解释器使用的解释栈帧（interpreted frame）**。

## 解释栈帧

这种栈帧有两个主要组成部分：广义的局部变量区，字节码的操作栈。

广义局部变量包含：普遍意义的局部变量，this指针，方法参数。

## 局部变量

在Java虚拟机规范中，**局部变量区等价于一个数组**。除了long、double的值用两个数组单元存储，其他基本类型以及引用类型的值均占用一个数组单元。

**boolean、byte、char、short在栈上占用的空间和int、引用类型一样。**32位HotSpot中占用4字节，64位HotSport中，占用8字节。这种情况**仅存在于局部变量，不会出现在存储于堆中的字段或数组元素**。

## 存储

**将int类型的值存到其他类型的字段或数组时，相当于做了一次隐式的掩码操作。**

把0xFFFFFFFF(-1)储存到一个声明为char类型的字段里时，高两位字节被截取掉，存入“\uFFFF”。

HotSpot在**存储boolean时显示进行掩码操作**，只取最后一位的值存入boolean字段或数组中。

HotSpot中boolean字段占用一字节，boolean数组直接用byte数组实现。

## 加载

Java虚拟机的算数运算几乎全部依赖于操作数栈，堆中的boolean、byte、char和short加载到操作数栈上，当成int类型运算。

对于boolean、char这两个无符号类型，加载伴随零扩展。

对于byte、short加载伴随符号扩展。

# 将boolean类型的值存入字段中时，Java 虚拟机所做的掩码操作

```java
public class Foo {

	static boolean boolValue;

	public static void main(String[] args) {
		boolValue = true; // 将这个 true 替换为 2 或者 3，再看看打印结果
		if (boolValue) 
			System.out.println("Hello, Java!");
		if (boolValue == true) 
			System.out.println("Hello, JVM!");
	}
}
```

**当替换为2的时候无输出**
**当替换为3的时候打印HelloJava及HelloJVM**
因为将boolean 保存在静态域中,指定了其类型为'Z',当修改为2时取低位最后一位为0,当修改为3时取低位最后一位为1
则说明boolean的掩码处理是取低位的最后一位

# 问题

Q：“也就是说，boolean、byte、char、short 这四种类型，在栈上占用的空间和 int 是一样的，和引用类型也是一样的。因此，在 32 位的 HotSpot 中，这些类型在栈上将占用 4 个字节；而在 64 位的 HotSpot 中，他们将占 8 个字节。”

但是我记得boolean在内存中占1字节，char占2字节，这里是什么个意思？

A：你说的是在堆里的情况。在解释器栈上是不一样的。至于原因吗，主要是**变长数组不好控制**，所以就选择浪费一些空间，以便访问时直接通过下标来计算地址。

***

Q：使用基本类型能够在执行效率以及内存使用两方面提升软件性能。具体是什么原理呢？

A：**占的空间更小，不需要类型转换**。

# 参考

> https://time.geekbang.org/column/article/11503