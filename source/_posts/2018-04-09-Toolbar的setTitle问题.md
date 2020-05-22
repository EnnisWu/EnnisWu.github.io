---
title: '「笔记」Toolbar 的 setTitle 问题'
date: 2018-04-09 23:28:53
tags: [Android,Toolbar]
categories: Android
---

- 在 `setSupportActionBar(toolbar)` 之后调用 `toolbar.setTitle()` 

- 在 `onCreate()` 中调用无效

- 在 `onStart()` 中调用无效

解决方案：

1. 在 `onResume()` 中调用有效。

2. `getSupportActionBar.setTitle()` 有效