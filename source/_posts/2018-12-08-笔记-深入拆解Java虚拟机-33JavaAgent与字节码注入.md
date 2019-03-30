---
title: 笔记-深入拆解Java虚拟机-33JavaAgent与字节码注入
date: 2018-12-08 16:01:16
tags: JVM
categories: Java虚拟机
---

# premain 方法

- **在 main 方法前执行的方法。**
- JVM 能识别的 premain 方法参数类型是 String

## 以 Java agent 方式运行 premain 方法

- 方法一：打包成 jar 包，在的 MANIFEST.MF 配置文件中，指定的 Premain-class。
- 方法二：通过 Attach API 远程加载。
	- 不会先于 main 方法执行。
	- 取决于调用 Attach API 的时机。
	- 运行不再是 premain 方法，而是 agentmain 方法。
	- 更新 jar 包的 manifest 文件，包含 Agent-Class 配置。
- JVM 不限制 Java agent 的数量。

# 字节码注入

```java
package org.example;

import java.lang.instrument.*;
import java.security.ProtectionDomain;

public class MyAgent {
    public static void premain(String args, Instrumentation instrumentation) {
        instrumentation.addTransformer(new MyTransformer());
    }

    static class MyTransformer implements ClassFileTransformer {
        public byte[] transform(ClassLoader loader, String className, Class<?> classBeingRedefined,
                                ProtectionDomain protectionDomain, byte[] classfileBuffer) throws IllegalClassFormatException {
            //打印该数组的前四个字节，也就是 Java class 文件的魔数（magic number）0xCAFEBABE。
            System.out.printf("Loaded %s: 0x%X%X%X%X\n", className, classfileBuffer[0], classfileBuffer[1],
                    classfileBuffer[2], classfileBuffer[3]);
            //如果返回 null 或抛出异常，JVM 使用原来的 byte 数组完成类加载工作。
            return null;
        }
    }
}
```

- `Instrumentation` 接口：注册类加载时间拦截器。
- `ClassFileTransformer` 接口：拦截器需要实现，重写 transform 方法。
- `transform` 方法：
	- `byte[]` 参数：正在被加载的类的字节码。
	- `byte[]` 返回值：更新过后的类的字节码。

## redefine 和 retransform（不懂，怎么实现？）

- 要求传入所需类实例。

### redefine

> 舍弃原本的字节码，并替换成由用户提供的 byte 数组。

- **比较危险，一般用于修复出错了的字节码。**

### retransform

> 针对所传入的类，重新调用所有已注册的 ClassFileTransformer 的 transform 方法。

- 使用 retransform **注入已加载但未注入的类**。

在执行 premain 或者 agentmain 方法前，JVM 早已加载了不少类，这些类的加载事件并没有被拦截。

- 定义了多个 Java agent，多个注入的情况下，移除部分注入。

# JVMTI agent（不懂）

> JVMTI 是一个事件驱动的工具实现接口。

- Java agent 通过 JVMTI agent（C agent）实现。
- 在 C agent 加载后的入口方法 Agent_OnLoad 注册各个事件的钩子（hook）方法。
- JVM 触发这些事件时，调用对应的钩子方法。

为 JVMTI 中的 ClassFileLoadHook 事件设置钩子，在 C 层面拦截所有的类加载事件。

[关于 JVMTI 的其他事件](https://docs.oracle.com/en/java/javase/11/docs/specs/jvmti.html#EventIndex)

# 基于字节码注入的 profiler

- 实现代码覆盖工具，或者各式各样的 profiler。
- 在某一程序行为的周围，注入某运行时类方法的调用，表示该程序行为正要发生或已经发生。
- 需排除对 JDK 类和运行时类的注入（可能造成死循环调用）。
- 设置一个线程私有标识位，区分应用代码上下文和注入代码上下文。（不懂）
- 借助自定义类加载器来隔离命名空间。
- 观察者效应（observer effect）对所收集的数据造成的影响。
- 使用字节码注入开发 profiler 时，需要辩证地看待所收集的数据。
- 仅表示在被注入的情况下程序的执行状态，不是没有注入情况下的程序执行状态。

# 面向方面（切面）编程（AOP）

- 字节码注入实现。

# 问题

Q：如何注入方法出口。除了正常执行路径之外，还需考虑异常执行路径。

A：不用管有没有 catch 块，有没有 throw，直接给所有代码罩一个 catch any 的异常处理就行了。

# 引用

> https://time.geekbang.org/column/article/41186