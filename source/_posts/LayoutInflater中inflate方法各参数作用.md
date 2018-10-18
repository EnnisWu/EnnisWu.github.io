---
title: LayoutInflater中inflate方法各参数作用
date: 2018-08-03 15:52:33
tags: Android
categories: Android视图
---

# 1、三个参数的方法

inflate(@LayoutRes int, @Nullable ViewGroup, boolean):View

## 1.1第二个参数不为null且第三个参数为true

- 指定id布局根布局节点各个属性有效
- 添加到父布局

## 1.2第二个参数不为null且第三个参数为false

- 指定id布局根布局节点各个属性有效
- 不添加到父布局

## 1.3第二各参数为null

- 指定id布局根布局节点宽高属性无效

# 2、两个参数的方法

inflate(@LayoutRes int, @Nullable ViewGroup):View

## 2.1第二个参数不为null

等同于1.1

## 2.2第二个参数为null

等同于1.3

# 参考

> https://blog.csdn.net/u012702547/article/details/52628453