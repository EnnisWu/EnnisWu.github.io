---
title: '「笔记」Android 在子线程中更新 UI'
date: 2019-02-17 10:21:05
tags: [Android]
categories: Android
---

# 原文

- https://www.zhihu.com/question/24764972

- https://ivanljt.github.io/blog/2017/08/16/Android%20%E4%B8%AD%E5%AD%90%E7%BA%BF%E7%A8%8B%E7%9C%9F%E7%9A%84%E4%B8%8D%E8%83%BD%E6%9B%B4%E6%96%B0UI%E5%90%97/

源码版本 SDK 28

Android 中控件都是线程不安全的，Google **规范**只能在主线程中更新 UI，在子线程中发送网络请求。假如在子线程中更新 UI，会抛出异常

```
android.view.ViewRootImpl$CalledFromWrongThreadException: Only the original thread that created a view hierarchy can touch its views.
        at android.view.ViewRootImpl.checkThread(ViewRootImpl.java:7753)
```

但如果运行下面这段代码，你会发现程序完美运行，没有任何问题，为什么这时却又可以在子线程更新 UI 了呢？

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Log.d("子线程更新UI", "onCreate");
    Log.d("子线程更新UI", Thread.currentThread().getId()
            + Thread.currentThread().getName());
    setContentView(R.layout.activity_main);

    textView = findViewById(R.id.text_view);
    new Thread(new Runnable() {
        @Override
        public void run() {
            Log.d("子线程更新UI", Thread.currentThread().getId()
                    + Thread.currentThread().getName());
            textView.setText(String.valueOf(System.currentTimeMillis()));
        }
    }).start();
}
```

如果我们将子线程 sleep 1 秒呢，这时便抛出了上述不能更新 UI 的异常。

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Log.d("子线程更新UI", "onCreate");
    Log.d("子线程更新UI", Thread.currentThread().getId()
            + Thread.currentThread().getName());
    setContentView(R.layout.activity_main);

    textView = findViewById(R.id.text_view);
    new Thread(new Runnable() {
        @Override
        public void run() {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            Log.d("子线程更新UI", Thread.currentThread().getId()
                    + Thread.currentThread().getName());
            textView.setText(String.valueOf(System.currentTimeMillis()));
        }
    }).start();
}
```

# 为什么在 onCreate 中在子线程可以更新 UI

TextView.setText 的调用过程是这样的

```java
TextView.setText 
-> TextView.checkForRelayout
-> View.invalidate 
-> View.invalidateInternal 
-> ViewGroup.invalidateChild
-> ViewParent.invalidateChildInParent //这里会不断Loop去取上一个结点的mParent
-> ViewRootImpl.invalidateChildInParent //DecorView的mParent是ViewRootImpl
-> ViewRootImpl.checkThread //在这里执行checkThread，如果非UI线程则抛出异常
```

## ViewRootImpl.checkThread

检查线程的逻辑是**检查当前线程是否为创建 ViewRootImpl 对象的线程**，因为一般情况 ViewRootImpl 对象由系统在主线程中创建，**即一般情况检查是否为主线程**。

```java
void checkThread() {
    if (mThread != Thread.currentThread()) {
        throw new CalledFromWrongThreadException(
                "Only the original thread that created a view hierarchy can touch its views.");
    }
}
```

```java
public ViewRootImpl(Context context, Display display) {
    mThread = Thread.currentThread();
```

## View.invalidateInternal

`View.invalidateInternal` 方法中有这样一段，它会判断 mAttachInfo 和 mParent 均不为空时才会调用 `ViewGroup.invalidateChild` ，onCreate 时 View 的 mAttachInfo 字段还未被赋值，此时为 null，所以**此时更新 UI 未执行到 ViewRootImpl.checkThread 方法，未检查线程，所以更新 UI 成功**。

```java
...
final AttachInfo ai = mAttachInfo;
final ViewParent p = mParent;
if (p != null && ai != null && l < r && t < b) {
    final Rect damage = ai.mTmpInvalRect;
    damage.set(l, t, r, b);
    p.invalidateChild(this, damage);
}
...
```

# mAttachInfo 什么时候被赋值？

当我们将子线程 sleep 一定时间后更新 UI 发现抛出异常，最简单的解释就是 View 的 mAttachInfo 字段已被赋值。

那 mAttachInfo 是何时被赋值的？

ViewRootImpl 对根节点 DecorView **执行 performTraversals 时**，调用 dispatchAttachedToWindow 对所有 View 赋值 mAttachInfo。（类似 measure，layout，draw 的递归调用）。

而 ViewRootImpl 执行 performTraversals 是**在 Activity.onResume 之后**，所以当子线程试图更新 UI 时，如果在 performTraversals 之前更新 UI 是可以成功的，当 mAttachInfo 字段已被赋值后便会抛出异常。

我们可以通过打印日志验证

![](/images/posts/android/UI/子线程/logcat1.png)

# 在子线程中更新 UI

由上述可知**子线程中可以更新 UI**，如下面这段代码就可以完美运行

```java
private void runOnChildThread() {
    new Thread(new Runnable() {
        @Override
        public void run() {
            Looper.prepare();
            final TextView textView = new MyTextView(MainActivity.this);
            Log.d("子线程更新UI", Thread.currentThread().getId()
                    + Thread.currentThread().getName() + "创建TextView");
            textView.setText("子线程" + System.currentTimeMillis());
            textView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Log.d("子线程更新UI", Thread.currentThread().getId()
                            + Thread.currentThread().getName() + "点击TextView");
                    textView.setText("子线程" + System.currentTimeMillis());
                }
            });
            WindowManager.LayoutParams layoutParams = new WindowManager.LayoutParams();
            //设置为透明，默认效果是黑色
            layoutParams.format = PixelFormat.TRANSPARENT;
            layoutParams.height = WindowManager.LayoutParams.WRAP_CONTENT;
            layoutParams.width = WindowManager.LayoutParams.WRAP_CONTENT;
            //设置window透传，也就是当前view所在的window不阻碍底层的window获得触摸事件
            layoutParams.flags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
                    | WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL;
            MainActivity.this.getWindowManager().addView(textView, layoutParams);
            Looper.loop();
        }
    }).start();
}
```

我们可以打印日志验证，点击 TextView 时，UI 在子线程中更新。

![](/images/posts/android/UI/子线程/logcat2.png)

当子线程满足以下条件时便可以在子线程中更新 UI

1. **创建子线程的根视图**

2. **根视图添加到 WindowManager**

3. **创建子线程的 Looper**

# **实际项目请在主线程中更新 UI！！！**
