---
title: '「深入拆解 Java 虚拟机」03 Java 虚拟机是如何加载 Java 类的？'
date: 2018-07-29 15:02:28
tags: JVM
categories: 《深入拆解 Java 虚拟机》
---

原文：https://time.geekbang.org/column/article/11523

Java 语言的类型：基本类型（primitive types）和引用类型（reference types）。

- 基本类型由 Java 虚拟机预先定义好。

- 引用类型：类、接口、数组类和泛型参数。

- 泛型参数会在编译过程中被擦除，Java 虚拟机上实际只有三种。

- 数组类是由 Java 虚拟机直接生成，其他两种有对应的字节流。

字节流形式：

- class 文件。

- 程序内部直接生成。

- 从网络中获取。

字节流加载到 Java 虚拟机中，成为类或接口。

# 加载

> 查找字节流，并且据此创建类的过程。

- 对于数组类，它没有对应的字节流，由 Java 虚拟机直接生成。

- 对于其他类，Java 虚拟机需要借助类加载器完成查找字节流的过程。

## java 9 之前

### 启动类加载器（boot class loader）

**启动类加载器由 C++ 实现**，没有对应的 Java 对象，Java 中只能用 null 来指代。

**启动类加载器加载最为基础、最为重要的类。**如：存放在 jre 的 lib 目录加 jar 包中的类（以及由虚拟机参数-Xbootclasspath 指定的类）

**其他类加载器都是 java.lang.ClassLoader 的子类。**类加载器需要先由另一个类加载器加载至 Java 虚拟机中，才能执行类加载。

### 扩展类加载器（extension class loader）

父类加载器：启动类加载器。

**加载相对次要、但又通用的类。**如：存放在 jre 的 lib/ext 目录下 jar 包中的类（以及由系统变量 java.ext.dirs 指定的类）。

### 应用类加载器（application class loader）

父类加载器：扩展类加载器。

**加载应用程序路径下的类。**（这里的应用程序路径，便是指虚拟机参数 -cp/-classpath、系统变量 java.class.path 或环境变量 CLASSPATH 所指定的路径。）默认情况下，应用程序中包含的类便是由应用类加载器加载的。

## java 9 之后

Java 9 引入了模块系统，并且略微更改了上述的类加载器。

扩展类加载器被改名为平台类加载器（platform class loader）。

Java SE 中除了少数几个关键模块，比如说 java.base 是由启动类加载器加载之外，其他的模块均由平台类加载器所加载。

## 双亲委派模型

**没当一个类加载器接收到加载请求时，它会先将请求转发给父类加载器。在父类加载器没有找到所请求的类情况下，该类加载器才会尝试去加载。**

**注：父类加载器不是继承关系！！！**

## 其他

- **可以加入自定义的类加载器**，来实现特殊的加载方式。

如：可以对 class 文件进行加密，加载时再利用自定义的类加载器对其解密。

- 类加载器还提供了命名空间的作用。

- 在 Java 虚拟机中，**类的唯一性是由类加载器实例以及类的全名一同确定的**。

即便是同一串字节流，经由不同的类加载器加载，也会得到两个不同的类。

# 链接

> 将创建成的类合并至 Java 虚拟机中，使之能够只够执行的过程。它可分为验证、准备以及解析三个阶段。

## 验证

> 确保被加载类能够满足 Java 虚拟机的约束条件。

通常而言，Java 编译器生成的类文件必然满足 Java 虚拟机的约束条件。

## 准备

> 为被加载类的静态字段分配内存。

部分 Java 虚拟机会在此阶段构造其他跟类层次相关的数据结构，比如用来实现虚方法的动态绑定的方法表。

## 解析（非必需）

在 class 文件被加载至 Java 虚拟机之前，这个类无法知道其他类（甚至自己）的方法、字段所对应的具体地址。引用时，Java 编译器会生成一个符号引用。在运行阶段，这个符号引用一般都能无歧义地定位到具体目标上。

**将这些符号引用解析成为实际引用。**

如果符号引用指向一个未被加载的类，或者未被加载类的字段或方法，那么解析将触发这个类的加载（但未必触发这个类的链接以及初始化。）

**Java 虚拟机规范并没有要求在链接过程中完成解析。**它仅规定了：如果某些字节码使用了符号引用，那么在执行这些字节码之前，需要完成对这些符号引用的解析。

# 初始化

如果直接赋值的静态字段：

- 被 final 所修饰

- 类型是基本类型或字符串时

该字段便会被 Java 编译器标记成**常量值（ConstantValue），初始化直接由 Java 虚拟机完成**。

**除此之外的直接赋值操作，所有静态代码块中的代码，会被 Java 编译器置于同一方法中，并把它命名为 <clinit\>。**

<clinit\> 方法仅被执行一次。

**JVM 规范枚举了下述多种触发类初始化的情况：**

1. 当虚拟机启动时，初始化用户指定的主类。

2. 当遇到用以新建目标类实例的 new 指令时，初始化 new 指令的目标类。

3. 当遇到调用静态方法的指令时，初始化该静态方法所在的类。

4. 当遇到访问静态字段的指令时，初始化该静态字段所在的类。

5. 子类的初始化会触发父类的初始化。

6. 如果一个接口定义了 default 方法，那么直接实现或者间接实现该接口的类的初始化，会触发该接口的初始化。

7. 使用反射 API 对某个类进行反射调用时，初始化这个类。

8. 当初次调用 MethodHandle 实例时，初始化该 MethodHandle 指向的方法所在的类。

# 问题

Q：**加载阶段都加载哪些类呢，那么多类，全部加载吗？**

A：**加载阶段是针对单个类的**，一般用到的类才会被加载。大部分情况下，不同类的加载阶段是不同的。

***

Q：有一个零值 (0/null) 初始化，针对于类的静态成员变量，如果是 final 修饰的静态成员变量，也就是常量，是初始化为代码中指定的值比如 10。非 final 修饰的静态成员变量，在 clinit 执行过程中赋值为代码中指定的值，是这样的吗？

A：**被 final 修饰的静态成员变量，如果不是基本类型或者字符串，也会放在 clinit 来做。**
