---
title: '「原创」为什么嵌套一层 Builder 后 Scaffold.of 方法就不报错了'
date: 2020-03-18 14:04:31
tags: [Flutter]
categories: Flutter
---

# 错误案例

我们可能经常需要调用 `Scaffold.of()` 方法去调用 `showSnackBar` 或 `showBottomSheet` 等方法，如下面的代码所示。

```dart
import 'package:flutter/material.dart';

void main() => runApp(MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Scaffold.of(context)
              .showSnackBar(SnackBar(content: Text('This is SnackBar!')));
        },
        child: Icon(Icons.add),
      ),
    );
  }
}
```

当运行这段代码点击按钮后却报出这样的错误：

> The following assertion was thrown while handling a gesture:
> **Scaffold.of() called with a context that does not contain a Scaffold.**
> 
> No Scaffold ancestor could be found starting from the context that was passed to Scaffold.of(). This usually happens when the context provided is from the same StatefulWidget as that whose build function actually creates the Scaffold widget being sought.

`context` 没有在祖先 `Widget` 中找到 `Scaffold`。`FloatingActionBottom` 明明是 `Scaffold` 的孩子 `Widget`，为什么没有找到呢？

# 解决方案

## 方案一 嵌套一层 Builder

如下面代码所示，在 `FloatingActionButton` 外添加一层 `Builder` 便可以正常运行。

```dart
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: Builder(
        builder: (context) => FloatingActionButton(
          onPressed: () {
            Scaffold.of(context)
                .showSnackBar(SnackBar(content: Text('This is SnackBar!')));
          },
          child: Icon(Icons.add),
        ),
      ),
    );
  }
```

## 方法二 使用 GlobalKey

# .of 方法的原理

由源码可知，通过传入的 `BuildContext` 调用 `findAncestorStateOfType` 方法找到祖先 `ScaffoldState`，当祖先 `Widget` 中没有 `Scaffold` 时报错。

```dart
static ScaffoldState of(BuildContext context, { bool nullOk = false }) {
    assert(nullOk != null);
    assert(context != null);
    final ScaffoldState result = context.findAncestorStateOfType<ScaffoldState>();
    if (nullOk || result != null)
      return result;
    throw FlutterError.fromParts(<DiagnosticsNode>[
      ErrorSummary(
        '...'
      ),
      ErrorDescription(
        '...'
      ),
      ErrorHint(
        '...'
      ),
      ErrorHint(
        '...'
      ),
      context.describeElement('The context used was')
    ]);
  }
```

# 报错原因

从错误案例代码我们可以看到，传入 `of` 的 `BuildContext` 是 `_MyHomePageState` 中 `build` 方法的参数，显然 `_MyHomePageState` 的祖先中并没有 `Scaffold`，所以报错没有找到 `Scaffold`。

![](/images/posts/Flutter/scaffold_no_builder.png)

# Builder 的原理

```dart
typedef WidgetBuilder = Widget Function(BuildContext context);
```

```dart
class Builder extends StatelessWidget {

  const Builder({
    Key key,
    @required this.builder,
  }) : assert(builder != null),
       super(key: key);

  final WidgetBuilder builder;

  @override
  Widget build(BuildContext context) => builder(context);
}
```

由源码可知，`Builder` 接收一个 `WidgetBuilder` 方法，在 `build` 方法中回调了 `WidgetBuilder` 方法，并将自己的 `BuildContext` 传入。

# 解决原因

为了便于查看，我们将修正后源码中 `_MyHomePageState.build` 的参数名改为 `contextA`，将传入 `Builder` 的 `WidgetBuilder` 方法的参数名改为 `contextB`。

```dart
  @override
  Widget build(BuildContext contextA) {
    return Scaffold(
      floatingActionButton: Builder(
        builder: (contextB) => FloatingActionButton(
          onPressed: () {
            Scaffold.of(contextB)
                .showSnackBar(SnackBar(content: Text('This is SnackBar!')));
          },
          child: Icon(Icons.add),
        ),
      ),
    );
  }
```

由修正的代码可知，我们传入 `Scaffold.of` 方法的 `BuildContext` 已经不再是 `_MyHomePageState` 的了，而是 `Builder` 的。而 `Builder` 的父 `Widget` 正是 `Scaffold`，所以正常运行。

![](/images/posts/Flutter/scaffold_builder.png)
