---
title: '「笔记」LayoutInflater 中 inflate 方法各参数作用（二）'
date: 2019-05-03 20:40:47
tags: Android
categories: Android
---

# 原文

- [三个案例带你看懂LayoutInflater中inflate方法两个参数和三个参数的区别](https://blog.csdn.net/u012702547/article/details/52628453)

- [View.inflate() 的前世今生](https://www.jianshu.com/p/342890fcf5c9)

# View.inflate 和 LayoutInflater.inflate

View.inflate 实际上上只是简单的包装了 LayoutInflater.inflate

```java
    public static View inflate(Context context, @LayoutRes int resource, ViewGroup root) {
        LayoutInflater factory = LayoutInflater.from(context);
        return factory.inflate(resource, root);
    }
```

# LayoutInflater.inflate 两个参数和三个参数的区别

## 两个参数

两个参数的方法实际上也只是简单调用了三个参数的方法

```java
    public View inflate(@LayoutRes int resource, @Nullable ViewGroup root) {
        return inflate(resource, root, root != null);
    }
```

- 当 ViewGroup 传入 null 时调用

``` java
inflate(resource, null, false);
```

- 当 ViewGroup 传入非 null 时调用

```java
inflate(resource, root, true);
```

## 三个参数

### ViewGroup 传入 null

- View 没有父布局

- View 没有 LayoutParams

- 返回该 View

- attachToRoot 参数无效

### ViewGroup 传入非 null

#### attachToRoot 为 true

- View 添加到父布局

- View 设置 LayoutParams 参数

- 返回父布局

#### attachToRoot 为 true

- View 没有父布局

- View 设置 LayoutParams 参数

- 返回该 View

# ViewGroup 最好传入非 null 的情况

如果在知道父布局的情况下，ViewGroup 最好传入父布局而不是 null，因为 View 的 LayoutParams 参数始终需要通过父布局来确定。

当调用 ViewGroup.addView 时，如果添加的 View 的 LayoutParams 为 null，会调用 generateDefaultLayoutParams 方法生成一个宽高都包裹的 LayoutParams，这可能并不是我们想要的效果，因为在 xml 中指定的宽高等属性将失效。

```java
    public void addView(View child, int index) {
        if (child == null) {
            throw new IllegalArgumentException("Cannot add a null child view to a ViewGroup");
        }
        LayoutParams params = child.getLayoutParams();
        if (params == null) {
            params = generateDefaultLayoutParams();
            if (params == null) {
                throw new IllegalArgumentException("generateDefaultLayoutParams() cannot return null");
            }
        }
        addView(child, index, params);
    }
```

# attachToRoot 最好传入 true 的情况

- 自定义组件

# attachToRoot 必须传入 false 的情况

否则会抛出异常

```
java.lang.IllegalStateException: The specified child already has a parent. You must call removeView() on the child's parent first.
```

## 不负责 View 的展示时，attachToRoot 必须传入 false

- RecyclerView#onCreateViewHolder

由 RecyclerView 控制展示 ViewHolder 的 View

- Fragment#onCreateView

由 FragmentManager 控制显示 Fragment

## View 已有父布局时，attachToRoot 必须传入 false
