---
title: Android的视图优化方法
date: 2018-11-07 21:31:51
tags: [Android,优化,视图]
categories: Android优化
---

# 过度绘制（Overdraw）

> 过度绘制（Overdraw）指的是屏幕上的某个像素在同一帧的时间内被绘制了多次。

## 检测过度绘制

Android 中打开过度绘制检测工具的方式：

- 开发者选项 ➡ 调试GPU过度绘制 ➡ 显示过度绘制区域

界面中会出现不同颜色的区域，各颜色代表的意思：

![overdraw](/images/posts/android/Android的视图优化方法/overdraw.webp)

## 过度绘制优化

### 移除布局中不需要的背景

#### 移除 Window 默认的 Background

通常使用的 theme 会包含一个 windowBackground。

```xml
 <item name="android:windowBackground">@color/background_material_light</item>
```

然后又给跟布局添加了一个背景，这会导致整个页面被多绘制一次。

移掉 windowBackground 即可解决，有两种方法。

- 在 theme 中设置

```xml
 <item name="android:windowBackground">@null</item>
```

- 在 onCreate() 方法中添加

```java
 getWindow().setBackgroundDrawable(null);
```

#### 移除控件中不需要的背景

- 父布局和子布局设置了相同的 background，选择其一设置即可。

## 减少透明度的使用

View 设置了 alpha 值至少渲染两次。

# 布局优化

- LinearLayout 与 RelativeLayout 作用相同时使用 LinearLayout。
- LinearLayout 需要嵌套时使用 RelativeLayout。
- 使用 ConstraintLayout。

## 使用 Layout Inspector 查看 layout 层次结构

> Tools > Android > Layout Inspector

## 使用 lint 优化布局的层次结构

> Analyze> Inspect Code
>> Android> Lint> Performance

## <include\> 标签

- 只支持 android:layout\_ 开头的属性（android:id 是特例）。
- <include\> 指定了 id 属性，包含的布局文件根元素也指定了 id 属性，以 <include\> 指定的为准。

## <merge\> 标签

- 配合 <include\> 标签使用可以减少布局的层级。

## ViewStub

- 继承自 View，宽高都是 0，本身不参与任何的布局和绘制过程。
- 按需加载所需的布局文件（如网络异常时的界面），使用的时候再加载，提高初始化性能。
- 不支持 <merge\> 标签。
- 使用 inflateedId 属性指定加载的布局 id。

```xml
<ViewStub
	android:id="@+id/stub_import"
	android:inflatedId="@+id/panel_import" />
```

### 怎样加载？

```java
((ViewStub) findViewById(R.id.stub_import)).setVisibility(View.VISIBLE);
```

或

```java
View importPanel = ((ViewStub) findViewById(R.id.stub_import)).inflate();
```

- 加载后 ViewStub 不在属于布局，为 null。

# 绘制优化

## onDraw 方法

- 不要创建新的布局对象。
- 不要做耗时的任务。

### 减少自定义 View 的过度绘制

- 假如有多张图片叠层显示时，可以使用 ```Canvas``` 的 ```clipRect()``` 等方法将图片裁剪。

# 使用 GPU 呈现模式分析工具

Android 中打开 GPU 呈现模式分析工具的方式：

- 开发者模式 ➡ 监控 ➡ GPU呈现模式