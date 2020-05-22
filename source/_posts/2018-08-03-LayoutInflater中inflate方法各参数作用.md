---
title: '「笔记」LayoutInflater 中 inflate 方法各参数作用'
date: 2018-08-03 15:52:33
tags: [Android]
categories: Android
---

原文：[三个案例带你看懂LayoutInflater中inflate方法两个参数和三个参数的区别](https://blog.csdn.net/u012702547/article/details/52628453)

# 三个参数的方法

inflate(@LayoutRes int, @Nullable ViewGroup, boolean):View

## 第二个参数不为 null 且第三个参数为 true

- 指定 id 布局根布局节点各个属性有效

- 添加到父布局

## 第二个参数不为 null 且第三个参数为 false

- 指定 id 布局根布局节点各个属性有效

- 不添加到父布局

## 第二各参数为 null

- 指定 id 布局根布局节点宽高属性无效

# 两个参数的方法

inflate(@LayoutRes int, @Nullable ViewGroup):View

## 第二个参数不为 null

等同于[第二个参数不为 null 且第三个参数为 true](#第二个参数不为-null-且第三个参数为-true)

## 第二个参数为 null

等同于[第二各参数为 null](#第二各参数为-null)
