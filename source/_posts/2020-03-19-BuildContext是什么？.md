---
title: '「笔记」BuildContext是什么？'
date: 2020-03-19 16:23:08
tags: [Flutter]
categories: Flutter
---

**小部件树中小部件位置的句柄。**

此类提供了一组可以从 `StatelessWidget.build` 方法和 `State` 对象上的方法使用的方法。

`BuildContext` 对象将传递到 `WidgetBuilder` 函数（例如 `StatelessWidget.build`），并且可以从 `State.context` 成员获得。一些静态函数（例如 `showDialog`，`Theme.of` 等）也采用构建上下文，以便它们可以代表调用窗口小部件执行操作，或获取特定于给定上下文的数据。

**每个窗口小部件都有其自己的BuildContext**，它将成为 `StatelessWidget.build` 或 `State.build` 函数返回的窗口小部件的父级。 （同样，`RenderObjectWidgets` 的任何子项的父项。）

随着小部件在树上移动，特定小部件的 `BuildContext` 可以随时间改变位置。因此，从类的方法返回的值不应在执行单个同步函数之后进行缓存。

**BuildContext对象实际上是Element对象。 BuildContext接口用于阻止对Element对象的直接操作。**

原文：[BuildContext class](https://api.flutter.dev/flutter/widgets/BuildContext-class.html)

> A handle to the location of a widget in the widget tree.
> 
> This class presents a set of methods that can be used from `StatelessWidget.build` methods and from methods on `State` objects.
> 
> `BuildContext` objects are passed to `WidgetBuilder` functions (such as `StatelessWidget.build`), and are available from the `State.context` member. Some static functions (e.g. `showDialog`, `Theme.of`, and so forth) also take build contexts so that they can act on behalf of the calling widget, or obtain data specifically for the given context.
> 
> Each widget has its own `BuildContext`, which becomes the parent of the widget returned by the `StatelessWidget.build` or `State.build` function. (And similarly, the parent of any children for `RenderObjectWidget`s.)
> 
> The `BuildContext` for a particular widget can change location over time as the widget is moved around the tree. Because of this, values returned from the methods on this class should not be cached beyond the execution of a single synchronous function.
> 
> `BuildContext` objects are actually `Element` objects. The `BuildContext` interface is used to discourage direct manipulation of `Element` objects.

![BuildContext继承关系图](/images/posts/Flutter/build_context_class_diagram.png "BuildContext继承关系图")