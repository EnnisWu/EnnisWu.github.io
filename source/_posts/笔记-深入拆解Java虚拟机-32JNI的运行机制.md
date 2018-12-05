---
title: 笔记-深入拆解Java虚拟机-32JNI的运行机制
date: 2018-12-05 16:27:03
tags: JVM
categories: Java虚拟机
---

# Java 无法表达的场景

- 使用汇编语言提升关键代码的性能。
- 调用 Java 核心类库无法提供的，某个体系架构或者操作系统特有的功能。
- 牺牲可移植性，在 Java 代码中调用 C/C++ 代码实现。

这种跨语言调用，需要借助 Java Native Interface 机制。

# native 方法的链接

- 动态链接库的名字以 lib 为前缀，以 .dylib 或 .so 为扩展名。
- 通过 ```System.loadLibrary("---")``` 方法加载 lib---.dylib。
- 如果库不在当前路径下，可以配置 java.library.path 参数指向路径（JVM 启动时）。

## JVM 自动查找符合默认命名规范的 C 函数并链接

- ```javac -h``` 命令可以根据 native 方法声明，自动生成包含符合命名规范的 C 函数的头文件。

### 命名规范

-  函数都要以Java_为前缀，后跟完整的包名和方法名。
	- 路径中 / 转换为 \_
	- 原方法名中 \_ 转换为 \_1
- 有重载 native 方法时，自动链接对象时的考虑参数类型。
- 重载方法函数名在原本基础上追加 __ 以及方法描述符作为后缀。
- 方法描述符的特殊符号会被替换。
	- 引用类型中 ; 替换为 \_2
	- 数组类型中 [ 替换为 \_3

## 在 C 代码中主动链接

- 对 C 函数名没有要求。
- 通常使用一个名为 registerNatives 的 native 方法，按照第一种链接方式定义所能自动链接的 C 函数。在该函数中，手动链接该类的其他 native 方法。
- 需要在其他 native 方法被调用之前完成链接。
- 通常在类的初始化方法里调用该 registerNatives 方法。

# JNI 的 API

- **C 代码中可以使用 Java 的语言特性**（如 instanceof，通过特殊的 JNI 函数实现）。

## JNIEnv

- JVM 会将所有 JNI 函数的函数指针聚合到一个名为 JNIEnv 的数据结构中。
- **JNIEnv 线程私有**，每个线程都拥有一个 JNIEnv。
- 规定 C 代码**不能共享 JNIEnv 给其他线程**，否则 JNI 函数无法保证正确性。

### 原因：

1. 给 JNI 函数提供一个单独命名空间。
2. 允许 JVM 通过更改函数指针替换 JNI 函数的具体实现。

## Java 类型与本地类型

- JNI 会**将 Java 层面的基本类型以及引用类型映射为另一套可供 C 代码使用的数据结构**。

基本类型对应关系：

| Java类型 | 本地类型 | 位（bit） |
| --------- | --------- | ---------- |
| boolean | jboolean | 8, unsigned |
| byte | jbyte | 8 |
| char | jchar | 16, unsigned |
| short | jshort | 16 |
| int | jint | 32 |
| long | jlong | 64 |
| float | jfloat | 32 |
| double | jdouble | 64 |
| void | void | n/a |

引用类型对应数据结构的继承关系：

```
jobject
|- jclass (java.lang.Class objects)
|- jstring (java.lang.String objects)
|- jthrowable (java.lang.Throwable objects)
|- jarray (arrays)
   |- jobjectArray (object arrays)
   |- jbooleanArray (boolean arrays)
   |- jbyteArray (byte arrays)
   |- jcharArray (char arrays)
   |- jshortArray (short arrays)
   |- jintArray (int arrays)
   |- jlongArray (long arrays)
   |- jfloatArray (float arrays)
   |- jdoubleArray (double arrays)
```

- JNI 访问字段类似反射 API。

# 异常

- **调用 JNI 函数时，JVM 便已生成异常实例，并缓存在内存中。**
- 不会显式地跳转至异常处理器或者调用者中，而是继续执行接下来的 C 代码。
- 从可能触发异常的 JNI 函数返回时，需要**通过 JNI 函数 ExceptionOccurred 检查是否发生了异常**，并且作出相应的处理。
- 如果无须抛出该异常，需要**通过 JNI 函数 ExceptionClear 显式地清空已缓存的异常**。

# 局部引用（Local Reference）与全局引用（Global Reference）

- C 代码中可以访问所传入的引用类型参数。
- 可以通过 JNI 函数创建新的 Java 对象。
- JVM 需要一种机制告知垃圾回收算法不要回收 C 代码中可能引用到的 Java 对象。
- 垃圾回收算法会将被**局部引用**和**全局引用**指向的对象标记为**不可回收**。
- 无论是传入的引用类型参数，还是通过 JNI 函数（除NewGlobalRef及NewWeakGlobalRef之外）返回的引用类型对象，都属于局部引用。
- **从 C 函数中返回至 Java 方法中，局部引用将失效**。
- 不能缓存局部引用，以供另一 C 线程或下一次 native 方法调用时使用。
- 通过 JNI 函数 NewGlobalRef，将该局部引用转换为全局引用。
- 通过 JNI 函数 DeleteGlobalRef 消除全局引用。
- C 函数运行时间极其长时，应该考虑通过 JNI 函数DeleteLocalRef，消除不再使用的局部引用。

# 句柄（handle）

> 句柄指的是内存中 Java 对象的指针的指针。
>> 垃圾回收器可能会移动对象在内存中的位置，JVM 需要另一种机制保证局部引用或者全局引用将正确地指向移动过后的对象。HotSpot 虚拟机是通过句柄（handle）来完成。

- **局部引用和全局引用都是句柄。**
- 局部引用句柄的两种存储方式
	1. 在本地方法栈帧中：主要用于存放 C 函数所接收的来自 Java 层面的引用类型参数。
	2. 在线程私有的句柄块：主要用于存放 C 函数中创建的局部引用。
- 从 C 函数返回至 Java 方法时，**本地方法栈帧**中的句柄将会被**自动清除**。
- **线程私有句柄块**需要 JVM **显式清理**。

# JNI 调用的额外性能开销

- **进入 C 函数时对引用类型参数的句柄化。**
- **调整参数位置**（C 调用和 Java 调用传参的方式不一样）。
- **从 C 函数返回时清理线程私有句柄块。**

# 引用

> https://time.geekbang.org/column/article/40839