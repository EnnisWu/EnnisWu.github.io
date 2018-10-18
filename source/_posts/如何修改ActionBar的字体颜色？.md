---
title: 如何修改ActionBar的字体颜色？
date: 2018-08-01 18:22:46
tags: [Android,ActionBar]
categories: Android视图
---

```xml
<style name="AppTheme" parent="@style/Theme.AppCompat.Light.DarkActionBar">
	<item name="actionBarStyle">@style/ActionBarStyle</item>
</style>

<style name="ActionBarStyle" parent="@style/Widget.AppCompat.ActionBar.Solid">
	<item name="titleTextStyle">@style/TitleTextStyle</item>
</style>

<style name="TitleTextStyle" parent="@style/TextAppearance.AppCompat.Widget.ActionBar.Title">
	<item name="android:textColor">#000000</item>
	<!-- 这里设置ActionBar字体颜色 -->
</style>
```