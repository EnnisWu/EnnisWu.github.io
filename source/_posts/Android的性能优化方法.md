---
title: Android的性能优化方法
date: 2018-07-23 16:33:07
tags: [Android,优化]
categories: Android优化
---

# 布局优化

- LinearLayout与RelativeLayout作用相同时使用LinearLayout。
- LinearLayout需要嵌套时使用RelativeLayout。

## \<include>标签

- 只支持android:layout\_开头的属性（android:id是特例）。
- \<include>指定了id属性，包含的布局文件根元素也指定了id属性，以\<include>指定的为准。

## \<merge>标签

- 配合\<include>标签使用可以减少布局的层级。

## ViewStub

- 继承自View，宽高都是0，本身不参与任何的布局和绘制过程。
- 按需加载所需的布局文件（如网络异常时的界面），使用的时候再加载，提高初始化性能。
- 不支持\<merge>标签。

### 怎样加载？

((ViewStub) findViewById(R.id.stub_import)).setVisibility(View.VISIBLE);

或

View importPanel = ((ViewStub) findViewById(R.id.stub_import)).inflate();

- 加载后ViewStub不在属于布局，为null。

# 绘制优化

## onDraw方法

- 不要创建新的布局对象。
- 不要做耗时的任务。

# 内存泄漏优化

## 静态变量导致的内存泄漏

- 静态变量引用Context。
- 静态变量引用View（持有Context）。

## 单例模式导致的内存泄漏

- 单例模式保存某个监听器（由Context实现）而没有解注册的方法。

## 属性动画导致的内存泄漏

- 无限循环的属性动画，Activity在onDestroy中需要停止动画（否则动画会一直播放，动画持有View，View持有Activity，Activity不能被释放）。

# 响应速度优化

- 核心思想：避免在主线程中做耗时操作。
- 一个进程发生ANR之后，系统会在/data/anr目录下建一个文件traces.txt。

# ListView优化

- 别优化了，直接用RecyclerView，同理GridView。

# Bitmap优化

未更新

# 线程优化

- 采用线程池，避免大量的Thread。

# 其他

- 避免创建过多对象。
- 不要过多使用枚举，枚举占用的内存空间比整形大。
- 常量使用static final修饰。
- Android特有的数据结构有更好的性能(SparseArray，Pair等)。
- 适当使用软引用和弱引用。
- 采用内存缓存和磁盘缓存。
- 尽量采用静态内部类。