---
title: Toolbar的setTitle问题
date: 2018-04-09 23:28:53
tags: [Android,Toolbar]
categories: Android视图
---

在setSupportActionBar(toolbar)之后调用toolbar.setTitle()，
在onCreate()中调用无效，
在onStart()中调用无效。

解决方案：
1. 在onResume()中调用有效。
2. getSupportActionBar.setTitle()有效