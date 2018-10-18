---
title: Android透明状态栏与沉浸模式总结
date: 2018-08-02 20:02:51
tags: [Android,状态栏,沉静模式,透明]
categories: Android视图
---

# Java实现

通过Java代码实现的思路是通过当前界面DecorView设置UI可见性实现。

| flag | 作用 |
| ---- | ---- |
| SYSTEM_UI_FLAG_FULLSCREEN | 请求进入普通全屏模式 |
| SYSTEM_UI_FLAG_HIDE_NAVIGATION | 请求暂时隐藏系统导航栏 |
| SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN |  |
| SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION |  |
| SYSTEM_UI_FLAG_LAYOUT_STABLE | 当使用其他布局标志时，提供内容插入的稳定视图 |
| SYSTEM_UI_FLAG_IMMERSIVE_STICKY |  |

通过组合上面的6中flag实现各种效果

## 隐藏状态栏

支持Android4.1及以上

```java
int option = View.SYSTEM_UI_FLAG_FULLSCREEN;
getWindow().getDecorView().setSystemUiVisibility(option);
```

注：下滑顶部会重新显示

## 透明状态栏

支持Android5.0及以上

```java
int option = View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE;
getWindow().getDecorView().setSystemUiVisibility(option);
getWindow().setStatusBarColor(Color.TRANSPARENT);
```

## 隐藏状态栏及导航栏

支持Android4.1及以上

```java
int option = View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION;
getWindow().getDecorView().setSystemUiVisibility(option);
```

注：点击屏幕会退出全屏

## 透明状态栏及透明导航栏

支持Android5.0及以上

```java
int option = int option = View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_STABLE;
getWindow().getDecorView().setSystemUiVisibility(option);
getWindow().setStatusBarColor(Color.TRANSPARENT);
getWindow().setNavigationBarColor(Color.TRANSPARENT);
```

## 沉浸模式

支持Android4.4及以上

```java
int option = View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
getWindow().getDecorView().setSystemUiVisibility(option);
```

注：滑动状态栏或导航栏的位置显示状态栏和导航栏，一段时间未操作再次隐藏

# XML实现

通过设置activity的style实现

## 隐藏状态栏

```xml
<style name="AppTheme" parent="@style/Theme.AppCompat.Light.NoActionBar">
	<item name="windowNoTitle">true</item>
	<item name="android:windowFullscreen">true</item>
</style>
```

## 透明状态栏

Android4.4

```xml
<style name="fullScreenTheme" parent="Theme.AppCompat.Light.DarkActionBar">
	<item name="android:windowTranslucentStatus">true</item>
	<item name="android:windowTranslucentNavigation">true</item>
</style>
```

如果添加了DrawerLayout需要设置，否则DrawerLayout部分状态栏是灰色的。

```java
mDrawerLayout.setFitsSystemWindows(true);
mDrawerLayout.setClipToPadding(false);
```

Android5.0

```xml
<style name="fullScreenTheme" parent="Theme.AppCompat.Light.DarkActionBar">
	<item name="android:windowTranslucentStatus">false</item>
	<item name="android:windowTranslucentNavigation">true</item>
	<item name="android:statusBarColor">@android:color/transparent</item>
</style>
```

# 参考

> - https://blog.csdn.net/guolin_blog/article/details/51763825
> - https://blog.csdn.net/do168/article/details/51587935
> - https://blog.csdn.net/tc_xingdechen/article/details/68958337