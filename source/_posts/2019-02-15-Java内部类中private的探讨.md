---
title: '「原创」Java 内部类中 private 的探讨'
date: 2019-02-15 11:48:23
tags: [Java,内部类]
categories: Java
---

Java 内部类一直是一个很特殊的类，它与外部类和该外部类的其他内部类总有着千丝万缕的联系，本文讨论的是内部类中的 private 修饰符。

以下测试基于下面的代码

```java
public class Outer {

    private int outer;

    public Outer(int outer) {
        this.outer = outer;
    }

    public void accessInnerPrivateMethod(Inner inner) {
        inner.privateMethod(1, 1.1, 'a');
    }

    public void print(Inner inner) {
        System.out.println(inner.inner);
    }

    private void privateMethod(String str) {

    }

    class Inner {

        private int inner;

        public Inner(int inner) {
            this.inner = inner;
        }

        public void accessOuterPrivateMethod(Outer outer) {
            outer.privateMethod(null);
        }

        public void print(Outer outer) {
            System.out.println(outer.outer);
        }

        private void privateMethod(int a, double b, char c) {

        }
    }
}
```

```java
import java.lang.reflect.*;

public class Test {

    private static String parseExecutable(Executable executable) {
        StringBuilder sb = new StringBuilder();
        sb.append(Modifier.toString(executable.getModifiers())).append(" ");
        sb.append(executable.getName()).append("(");
        for (Parameter parameter : executable.getParameters()) {
            sb.append(parameter.getType().getSimpleName()).append(" ").append(parameter.getName()).append(", ");
        }
        sb.delete(sb.length() - 2, sb.length());
        sb.append("): ");
        sb.append(executable.getAnnotatedReturnType().getType().getTypeName());
        return sb.toString();
    }

    private static void printExecutables(Executable[] executables) {
        for (Executable executable : executables) {
            System.out.println(parseExecutable(executable));
        }
    }

    private static String parseField(Field field) {
        StringBuilder sb = new StringBuilder();
        sb.append(Modifier.toString(field.getModifiers())).append(" ");
        sb.append(field.getType().getSimpleName()).append(" ");
        sb.append(field.getName());
        return sb.toString();
    }

    private static void printFields(Field[] fields) {
        for (Field field : fields) {
            System.out.println(parseField(field));
        }
    }

    public static void main(String[] args) {
        Class<Outer> outerClass = Outer.class;
        Class<Outer.Inner> innerClass = Outer.Inner.class;

        Outer outer = new Outer(0);
        Outer.Inner inner = outer.new Inner(0);

        System.out.println("外部类的方法");
        printExecutables(outerClass.getDeclaredMethods());
        System.out.println();

        System.out.println("内部类的构造方法");
        printExecutables(innerClass.getDeclaredConstructors());
        System.out.println();

        System.out.println("内部类的方法");
        printExecutables(innerClass.getDeclaredMethods());
        System.out.println();

        System.out.println("内部类的字段");
        printFields(innerClass.getDeclaredFields());
        System.out.println();
    }
}
```

运行结果

```
外部类的方法
static access$200(Outer arg0, String arg1): void
static access$300(Outer arg0): int
public print(Inner arg0): void
public accessInnerPrivateMethod(Inner arg0): void
private privateMethod(String arg0): void

内部类的构造方法
public Outer$Inner(Outer arg0, int arg1): Outer$Inner

内部类的方法
static access$100(Inner arg0): int
static access$000(Inner arg0, int arg1, double arg2, char arg3): void
public print(Outer arg0): void
public accessOuterPrivateMethod(Outer arg0): void
private priviteMethod(int arg0, double arg1, char arg2): void

内部类的字段
private int inner
final Outer this$0
```

# 内部类为什么可以直接访问外部类的字段和方法

- **内部类对象的创建依赖外部类对象。**

```java
Outer outer = new Outer(0);
Outer.Inner inner = outer.new Inner(0);
```

从反射的结果可以看出生成的内部类

- **构造方法添加了一个外部类的参数。**
- **添加了一个外部类的字段。**

实际上**内部类的对象“隐式“引用了外部类对象**，所以可以直接访问外部类的字段和方法。

# private 在外部类与内部类中的访问限制

- **外部类可以访问内部类的 private 字段和方法**。
- **内部类可以访问外部类的 private 字段和方法**。

从反射的结果可以看出外部类与内部类均添加了 2 个 static 的 access 方法，如果你会反编译的话，通过反编译的结果可以看出实际上这些 access 方法会返回相应 private 字段的值或者调用相应 private 方法，**内部类与外部类之间访问 private 字段和方法实际上通过调用这些 static 方法间接访问**。

# 内部类与内部类

- **同一个外部类的内部类之间可以访问 private 字段和方法。**

原理同上。