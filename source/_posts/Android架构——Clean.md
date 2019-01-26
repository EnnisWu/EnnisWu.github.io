---
title: Android架构——Clean
date: 2018-07-23 11:16:49
tags: [Android,架构,Clean]
categories: Android架构
---

# Clean架构的主要特点：
- 框架独立
- 容易测试
- UI独立
- 数据库独立
- 不依赖任何中介

Clean的主要思想是外层依赖内层，**内层完全不依赖外层**（或者说内层不知道外层的存在，可以独立开发，复用性强）。

# Clean架构解析
![CleanArchitecture](/images/posts/android/architecture/clean/CleanArchitecture-c.jpg)

- Enterprise Business Rules：业务对象
- Application Business Rules：用于处理我们的业务对象，业务逻辑所在，也称为Interactor
- Interface Adapters： 接口转换，拿到我们需要的数据，主持者层（Presenters）和控制层（Controllers）就在这一层
- Frameworks and Drivers: 这里是所有具体的实现了：比如：UI，工具类，基础框架等等。

Clean框架不一定只有4层，这里以4层为例。
上面可能比较抽象，下面是简单的说法：
- 第一层：实体类
- 第二层：也叫UseCase层，实现具体业务逻辑。
- 第三层：如果是MVP这一层为Presenter，MVC这一层为Controller。
- 第四层：具体实现。

![CleanSimple](/images/posts/android/architecture/clean/CleanSimple.jpg)

1. **内层均为纯Java代码**，只需要jvm便可以运行。
2. 内层代码不仅可以在Android平台，还可以在别的Java平台复用。
3. 各层单独测试，各层之间通过接口通信，且独立，方便单元测试。
4. **层与层之间完全隔离**，最主要的体现就是**各层有自己的数据结构**，不同层之间相互转换，完全没有依赖关系。
5. 通过依赖注入的方式导致灵活修改逻辑、实现，这点与MVP的思想相似，Clean与MVP和Dagger结合使用是天然合适的。

以mvp-clean为例，与纯mvp最主要的区别就是Presenter层剥离出UserCase层，一是方便测试，二是方便代码复用，减少Presenter层的代码冗余。

# Google Demo —— todo-mvp-clean 解析

> demo地址：https://github.com/googlesamples/android-architecture/tree/todo-mvp-clean/
mvp-clean基于mvp，加了 domain layer 介于 presentation 和 repositories。同时也将整个app 分为三个层次处理。

## mvp-clean层次图
![mvp-clean](/images/posts/android/architecture/clean/mvp-clean.png)

- Presentation层 : MVP 设计准则。
- Domain层 : 处理所有的业务逻辑，注意是所有的业务逻辑。对应use case（interactors）。
- Data层 : 获取数据，以及数据的存储，分为本地和远程。

## 基本概念（摘自mvp-clean GitHub主页部分原文翻译）
- mvp-clean 和 基本的mvp 最大的区别就是在domain层和UseCase 的使用上。从 presenter 层分离出domain 层好处是可以减少代码的冗余。
- **UseCase 的好处是在domain的代码层上可以复用。**CompleteTask在TaskDetailPresenter和TasksPresenter做到了很好的复用。
- domain layer 是完全解耦与Android 层和第三方依赖的。是一个纯java层的处理。
- **UseCase 从主线程剥离出来**，对于Android app是个好的操作。这种操作是尽可能的减少占用UI 线程。我们决定使用 command pattern 将use case 在线程池里执行操作。同样的我们可以用RxJava 或者 Promises实现同样的功能。
- 我们使用异步的repositories 。 但是现在没有必要这么做了。因为UseCase 已经从主线程里剥离出来了。这是尽量保持 samples 和原来的是一致的。

## 项目主要关系图
![mvpcleanproject](/images/posts/android/architecture/clean/mvpcleanproject.png)

## 具体用例流程

未完待续。。。

# 思考
纯MVP架构会使项目变得复杂，Clean架构则会更复杂，大项目可以使项目的结构清晰，内层复用性强，便于测试。
小项目则会使项目过于复杂，反而使项目结构显得不清晰，就像MVVM不适合小型项目一样。MVP作为万金油可以说适合大部分项目，我个人的思考是小型项目使用MVP架构，但在MVP的基础上加入部分Clean的思想。

1. 从Presenter层分离出UseCase层，方便代码复用
2. 各层独立，这里有一点需要注意，Clean中各层有各层的数据结构，在实际项目中各层可能写出类似的实体类，这里可以考虑只写一个通用实体类的作为最内层，虽然违背了Clean各层完全独立的思想，但是可以减少部分冗余，这一点根据自己项目来缺点。

> 参考资料
> - https://8thlight.com/blog/uncle-bob/2012/08/13/the-clean-architecture.html
> - https://www.jianshu.com/p/c6a1a5c9a49b
> - https://blog.csdn.net/YANGDAHUAN/article/details/80388849
> - https://www.jianshu.com/p/552c3a1c5fe5
> - https://www.jianshu.com/p/e0258ce7d392