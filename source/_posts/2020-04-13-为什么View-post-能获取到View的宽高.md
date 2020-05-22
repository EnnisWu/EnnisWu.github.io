---
title: '「笔记」为什么 View.post() 能获取到 View 的宽高'
date: 2020-04-13 19:29:30
tags: [Android,View]
categories: Android
---

# 为什么在 onCreate() 和第一次 onResume() 中无法获取到宽高

我们知道 `View` 的绘制是从 `ViewRootImpl.performTraversals()` 方法开始的，而 `performTraversals()` 是在 `onResume()` 之后才被调用，所以在 `onCreate()` 和第一次 `onResume()` 中无法获取到 `View` 的宽高。

# 为什么 View.post() 能获取到宽高

```java
    //class View
    public boolean post(Runnable action) {
        final AttachInfo attachInfo = mAttachInfo;
        if (attachInfo != null) {
            return attachInfo.mHandler.post(action);
        }

        // Postpone the runnable until we know on which thread it needs to run.
        // Assume that the runnable will be successfully placed after attach.
        getRunQueue().post(action);
        return true;
    }
```

- `attachInfo` 不为空时直接发送事件

- `attachInfo` 为空时会暂时缓存任务

```java
    //class HandlerActionQueue
    public void post(Runnable action) {
        postDelayed(action, 0);
    }

    public void postDelayed(Runnable action, long delayMillis) {
        final HandlerAction handlerAction = new HandlerAction(action, delayMillis);

        synchronized (this) {
            if (mActions == null) {
                mActions = new HandlerAction[4];
            }
            mActions = GrowingArrayUtils.append(mActions, mCount, handlerAction);
            mCount++;
        }
    }
```

## 缓存的任务何时发送

在 `View.dispatchAttachedToWindow()` 方法中发送事件

```java
    //class View
    void dispatchAttachedToWindow(AttachInfo info, int visibility) {
        ...
        if (mRunQueue != null) {
            mRunQueue.executeActions(info.mHandler);
            mRunQueue = null;
        }
        ...
    }
```

```java
    //class HandlerActionQueue
    public void executeActions(Handler handler) {
        synchronized (this) {
            final HandlerAction[] actions = mActions;
            for (int i = 0, count = mCount; i < count; i++) {
                final HandlerAction handlerAction = actions[i];
                handler.postDelayed(handlerAction.action, handlerAction.delay);
            }

            mActions = null;
            mCount = 0;
        }
    }
```

## dispatchAttachedToWindow() 何时被调用

在 `ViewRootImpl.performTraversals()` 方法中会调用 `dispatchAttachedToWindow()` 方法，该方法在 `View` 的测量、布局、绘制之前被调用。

`dispatchAttachedToWindow()` 方法和测量、布局、绘制一样会递归调用子 `View`。

```java
    //class ViewRootImpl
    private void performTraversals() {
        final View host = mView;
        ...
        if (mFirst) {
            ...
            host.dispatchAttachedToWindow(mAttachInfo, 0);
            ...
        } else {
            ...
        }
        ...
        if (mFirst || ...) {
            ...
            if (...) {
                ...
                if (...) {
                    ...
                    performMeasure(childWidthMeasureSpec, childHeightMeasureSpec);
                    ...
                    if (measureAgain) {
                        ...
                        performMeasure(childWidthMeasureSpec, childHeightMeasureSpec);
                    }
                    ...
                }
            }
        } else {
            ...
        }
        ...
        if (...) {
            performLayout(lp, mWidth, mHeight);
            ...
        }
        if (...) {
            ...
            performDraw();
        } else {
            ...
        }
        ...
    }
```

## 为何 dispatchAttachedToWindow() 先于测量调用却能获取到宽高

实际上 `ViewRootImpl.performTraversals()` 也是在事件循环中被执行的，所以缓存的任务会在 `ViewRootImpl.performTraversals()` 之后执行。

```java
    //class ViewRootImpl
    void scheduleTraversals() {
        if (!mTraversalScheduled) {
            ...
            mChoreographer.postCallback(
                    Choreographer.CALLBACK_TRAVERSAL, mTraversalRunnable, null);
            ...
        }
    }
```

```java
    //class ViewRootImpl
    final class TraversalRunnable implements Runnable {
        @Override
        public void run() {
            doTraversal();
        }
    }
    final TraversalRunnable mTraversalRunnable = new TraversalRunnable();
```

```java
    //class ViewRootImpl
    void doTraversal() {
        if (mTraversalScheduled) {
            ...
            performTraversals();
            ...
        }
    }
```

# 总结

`View.post()` 中的任务在 `ViewRootImpl.performTraversals()`，执行完之前会被缓存，待 `ViewRootImpl.performTraversals()` 执行完后执行，所以可以获取到宽高。