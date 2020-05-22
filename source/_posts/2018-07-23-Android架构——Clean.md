---
title: '「笔记」Android 架构——Clean'
date: 2018-07-23 11:16:49
tags: [Android,架构,Clean,未完成]
categories: Android
---

# 原文

- https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html

- https://www.jianshu.com/p/c6a1a5c9a49b

- https://blog.csdn.net/YANGDAHUAN/article/details/80388849

- https://www.jianshu.com/p/552c3a1c5fe5

- https://www.jianshu.com/p/e0258ce7d392

# Clean 架构的主要特点：

- 框架独立

- 容易测试

- UI 独立

- 数据库独立

- 不依赖任何中介

Clean 的主要思想是外层依赖内层，**内层完全不依赖外层**（或者说内层不知道外层的存在，可以独立开发，复用性强）。

# Clean 架构解析

![CleanArchitecture](/images/posts/android/architecture/clean/CleanArchitecture-c.jpg)

- Enterprise Business Rules：业务对象

- Application Business Rules：用于处理我们的业务对象，业务逻辑所在，也称为 Interactor

- Interface Adapters： 接口转换，拿到我们需要的数据，主持者层（Presenters）和控制层（Controllers）就在这一层

- Frameworks and Drivers: 这里是所有具体的实现了：比如：UI，工具类，基础框架等等。

Clean 框架不一定只有 4 层，这里以 4 层为例。

上面可能比较抽象，下面是简单的说法：

- 第一层：实体类

- 第二层：也叫 UseCase 层，实现具体业务逻辑。

- 第三层：如果是 MVP 这一层为 Presenter，MVC 这一层为Controller。

- 第四层：具体实现。

![CleanSimple](/images/posts/android/architecture/clean/CleanSimple.jpg)

1. **内层均为纯 Java 代码**，只需要 jvm 便可以运行。

2. 内层代码不仅可以在 Android 平台，还可以在别的 Java 平台复用。

3. 各层单独测试，各层之间通过接口通信，且独立，方便单元测试。

4. **层与层之间完全隔离**，最主要的体现就是**各层有自己的数据结构**，不同层之间相互转换，完全没有依赖关系。

5. 通过依赖注入的方式导致灵活修改逻辑、实现，这点与 MVP 的思想相似，Clean 与 MVP 和 Dagger 结合使用是天然合适的。

以 mvp-clean 为例，与纯 mvp 最主要的区别就是 Presenter 层剥离出 UserCase 层，一是方便测试，二是方便代码复用，减少 Presenter 层的代码冗余。

# Google Demo —— todo-mvp-clean 解析

> demo 地址：https://github.com/googlesamples/android-architecture/tree/todo-mvp-clean/
mvp-clean 基于 mvp，加了 domain layer 介于 presentation 和 repositories。同时也将整个 app 分为三个层次处理。

## mvp-clean 层次图

![mvp-clean](/images/posts/android/architecture/clean/mvp-clean.png)

- Presentation 层 : MVP 设计准则。

- Domain 层 : 处理所有的业务逻辑，注意是所有的业务逻辑。对应 use case（interactors）。

- Data 层 : 获取数据，以及数据的存储，分为本地和远程。

## 基本概念（摘自 mvp-clean GitHub 主页部分原文翻译）

- mvp-clean 和 基本的 mvp 最大的区别就是在 domain 层和 UseCase 的使用上。从 presenter 层分离出 domain 层好处是可以减少代码的冗余。

- **UseCase 的好处是在 domain 的代码层上可以复用。**CompleteTask 在 TaskDetailPresenter 和 TasksPresenter 做到了很好的复用。

- domain layer 是完全解耦与 Android 层和第三方依赖的。是一个纯 java 层的处理。

- **UseCase 从主线程剥离出来**，对于 Android app 是个好的操作。这种操作是尽可能的减少占用 UI 线程。我们决定使用 command pattern 将 use case 在线程池里执行操作。同样的我们可以用 RxJava 或者 Promises 实现同样的功能。

- 我们使用异步的 repositories 。 但是现在没有必要这么做了。因为 UseCase 已经从主线程里剥离出来了。这是尽量保持 samples 和原来的是一致的。

## 项目主要关系图

![mvpcleanproject](/images/posts/android/architecture/clean/mvpcleanproject.png)

## 具体用例流程

未完待续。。。

# 思考

纯 MVP 架构会使项目变得复杂，Clean 架构则会更复杂，大项目可以使项目的结构清晰，内层复用性强，便于测试。

小项目则会使项目过于复杂，反而使项目结构显得不清晰，就像 MVVM 不适合小型项目一样。MVP 作为万金油可以说适合大部分项目，我个人的思考是小型项目使用 MVP 架构，但在 MVP 的基础上加入部分 Clean 的思想。

1. 从 Presenter 层分离出 UseCase 层，方便代码复用

2. 各层独立，这里有一点需要注意，Clean 中各层有各层的数据结构，在实际项目中各层可能写出类似的实体类，这里可以考虑只写一个通用实体类的作为最内层，虽然违背了 Clean 各层完全独立的思想，但是可以减少部分冗余，这一点根据自己项目来缺点。
