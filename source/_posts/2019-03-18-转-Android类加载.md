---
title: 转-Android类加载
date: 2019-03-18 19:11:04
tags: Android
categories: Android
---

转自：https://juejin.im/post/5c31c3ebf265da614e2c3b68

# JVM 类加载机制

JVM 将描述类的数据从 Class 文件加载到内存，并对数据进行校验、转换解析和初始化，最终形成可以被虚拟机直接使用的 Java 类型。

## 类的生命周期

> 类从被加载到虚拟机内存中开始，到卸载出内存为止。

整个生命周期包括 7 个阶段：**加载（Loading）、验证（Verification）、准备（Preparation）、解析（Resolution）、初始化（Initialization）、使用（Using）和卸载（Unloading）**。

验证、准备、解析3个部分统称为连接（Linking）。

![各阶段发生顺序](/images/posts/android/类加载/class_lifecycle.jpg "各阶段发生顺序")

## 类加载器

- **对于任意一个类，需要由加载它的类加载器和这个类本身一同确立其在 JVM 中的唯一性。**

- 每一个类加载器，都拥有一个独立的类名称空间。

> 比较两个类是否“相等”，只有在这两个类是由同一个类加载器加载的前提下才有意义，否则，即使这两个类来源于同一个 Class 文件，被同一个虚拟机加载，只要加载它们的类加载器不同，那这两个类就必定不相等。 

## JDK 8 及之前的双亲委派模型

- Java 应用程序一般由 3 种类加载器互相配合进行加载。

- 如果有必要，可以自定义的类加载器。

![类加载器之间的关系](/images/posts/android/类加载/jvm_classloader.jpg "类加载器之间的关系")

- 这种层次关系称为类加载器的双亲委派模型（Parents Delegation Model）。

- **双亲委派模型要求除了顶层的启动类加载器外，其余的类加载器都应当有父类加载器。**

- **父子关系一般不会以继承（Inheritance）的关系来实现，而是都使用组合（Composition）关系来复用父加载器的代码。**

### 双亲委派模型的工作过程

1. 一个类加载器收到类加载的请求。

2. **把这个请求委派给父类加载器去完成。**

3. 父加载器反馈自己无法完成这个加载请求（它的搜索范围中没有找到所需的类）。

4. 子加载器尝试自己加载。

### 启动类加载器（Bootstrap ClassLoader）

- 加载以下类库到 JVM 内存

	- 存放在 ＜JAVA_HOME＞\lib 目录中的

	- 或者被 -Xbootclasspath 参数所指定的路径中的

	- 并且是虚拟机识别的类库

- 无法被 Java 程序直接引用。

- 把加载请求委派给引导类加载器，直接使用 null 代替。

### 扩展类加载器（Extension ClassLoader）

- 由 sun.misc.Launcher $ExtClassLoader 实现。

- 加载以下类库到 JVM 内存

	- 存放在＜JAVA_HOME＞\lib\ext目录中的

	- 或者被 java.ext.dirs 系统变量所指定的路径中的所有类库

- 开发者可以直接使用扩展类加载器。

### 应用程序类加载器（Application ClassLoader）

> 也称为系统类加载器

- 由 sun.misc.Launcher $App-ClassLoader 实现。

- 加载以下类库到 JVM 内存

	- 用户类路径（ClassPath）上所指定的类库

- 开发者可以直接使用这个类加载器。

- 如果应用程序中没有自定义过自己的类加载器，一般情况下这个就是程序中默认的类加载器。

### JDK 9 双亲委派模型的更改

- Java9 引入了模块系统，并且略微更改了上述的类加载器。

- 扩展类加载器被改名为平台类加载器（platform class loader）。

- Java SE中除了少数几个关键模块，比如说 java.base 是由启动类加载器加载之外，其他的模块均由平台类加载器所加载。

# Android 类加载机制

- **本质上 Android 和传统的 JVM 是一样的。**

	- 需要通过类加载器将目标类加载到内存

	- 类加载器之间符合双亲委派模型

	- 类有对应的生命周期

- 基于移动设备的特点，如内存以及电量等诸多方面跟一般的 PC 设备都有本质的区别，Google 开发了更符合移动设备的用于执行 Java 代码的虚拟机，即 Dalvik 和 ART。

- Android 5.0 开始采用 ART 虚拟机替代 Dalvik。

- **ART 从 dex 字节码加载类。将多个 Class 文件合并成一个 classes.dex 文件。**

![类加载器关系图](/images/posts/android/类加载/android_classloader.jpg "类加载器关系图")

- 在 8.0 之前

	- DexClassLoader：能够加载未安装的 apk
	
	- PathClassLoader：只能加载系统中已经安装过的 apk

- 从 8.0 开始

	- PathClassLoader 也可以加载未安装的 apk

	- PathClassLoader 可以完全替代 DexClassLoader