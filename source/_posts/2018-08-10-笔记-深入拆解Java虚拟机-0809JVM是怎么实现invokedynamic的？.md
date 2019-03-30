---
title: 笔记-深入拆解Java虚拟机-0809JVM是怎么实现invokedynamic的？
date: 2018-08-10 15:07:18
tags: JVM
categories: Java虚拟机
---

# invokedynamic

- Java 7 引入的新指令
- 调用机制抽象出调用点的概念
- 允许将调用点链接至任意符合条件的方法上

# MethodHandle（方法句柄）

- Java 7 引入
- 是一个强类型的，能被直接执行的引用
- 可以指向静态方法、实例方法、构造器、字段

## 方法句柄的类型（MethodType）

- 由参数类型、返回类型组成
- 确认方法句柄是否适配的唯一关键
- 不关心方法的类名或方法名

## 方法句柄的创建

通过 MethodHandles.Lookup 类

- 使用反射的 Method 类查找
- Lookup.findStatic 查找调用 invokestatic 的方法
- Lookup.findVirtual 查找调用 invokevirtual 和 invokeinterface 的方法
- Lookup.findSpecial 查找调用 invokespecial 的方法

## 方法句柄的权限

- 权限检查在创建阶段完成
- 实际调用过程中不检查
- 取决于 Lookup 对象创建位置（不是方法句柄创建位置）

## 方法句柄的操作

### invokeExact

- 严格匹配参数类型（需要显示向上转型）
- @PolymorphicSignature 根据传入参数的声明类型来生成方法描述符（而不是目标方法）

### invoke

- 自动适配参数类型
- 会调用 MethodHandle.asType 方法生成一个适配器方法句柄

### 增删改

通过生成另一个充当适配器的方法句柄来实现

捕获类型的 Lambda 表达式用增操作实现

增操作可以实现方法的柯里化

## 方法句柄的实现

HotSpot 虚拟机中方法句柄调用的具体实现，只讨论DirectMethodHandle

### invokeExact

- 调用至一个共享的、与方法句柄类型相关的特殊适配器中
- 适配器是一个 LambdaForm

## 方法句柄的缺点

- 与反射一样是简介调用
- 无法内联

**未更新09**