---
title: 笔记-深入拆解Java虚拟机-15Java语法糖与Java编译器
date: 2018-10-20 19:02:34
tags: JVM
categories: Java虚拟机
---

# 自动装箱（auto-boxing）与自动拆箱（auto-unboxing）

```java
public int foo() {
	ArrayList<Integer> list = new ArrayList<>();
	list.add(0);
	int result = list.get(0);
	return result;
}
```

上段代码对应的字节码：

```
public int foo();
  Code:
     0: new java/util/ArrayList
     3: dup
     4: invokespecial java/util/ArrayList."<init>":()V
     7: astore_1
     8: aload_1
     9: iconst_0
    10: invokestatic java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
    13: invokevirtual java/util/ArrayList.add:(Ljava/lang/Object;)Z
    16: pop
    17: aload_1
    18: iconst_0
    19: invokevirtual java/util/ArrayList.get:(I)Ljava/lang/Object;
    22: checkcast java/lang/Integer
    25: invokevirtual java/lang/Integer.intValue:()I
    28: istore_2
    29: iload_2
    30: ireturn
```

- 向泛型参数为 Integer 的 ArrayList 添加 int 值，**字节码中调用了 Integer.valueOf 方法**。
- 从泛型参数为 Integer 的 ArrayList 取出元素，程序期待的是 int 值，**字节码中调用了 Integer.intValue 方法**。

# 泛型与类型擦除

- 在字节码中，ArrayList 的 add 接受的参数类型是 Object，get 方法的返回类型是 Object。
- get 方法**强制向下转换类型**。
- **泛型信息**在 JVM 中会**全部擦除**，为了兼容引入泛型之前的代码。
- 为限定继承类的泛型参数擦除为 Object，**限定继承类**的泛型参数**擦除为所限定的类**。

```java
class GenericTest<T extends Number> {
	T foo(T t) {
		return t;
	}
}
```

上段代码字节码

```
T foo(T);
  descriptor: (Ljava/lang/Number;)Ljava/lang/Number;
  flags: (0x0000)
  Code:
    stack=1, locals=2, args_size=2
       0: aload_1
       1: areturn
  Signature: (TT;)TT;
```

- **方法声明和方法签名（Signature）仍存在泛型参数信息**，由 Java 编译器编译其他类时使用。

# 桥接方法

- 桥接方法标识符包括 ACC_BRIDGE 和 ACC_SYNTHETIC（对于 Java 源代码不可见）。
- **不能直接调用桥接方法，但可通过反射调用。**

## 泛型重写生成桥接方法

```java
class Merchant<T extends Customer> {
	public double actionPrice(T customer) {
		return 0.0d;
	}
}

class VIPOnlyMerchant extends Merchant<VIP> {
	@Override
	public double actionPrice(VIP customer) {
		return 0.0d;
	}
}
```

- actionPrice 方法符合 Java 语言的方法重写。
- 不符合 JVM 方法重写的定义。
父类方法描述符(LCustomer)
子类方法描述符(LVIP)

- 为了**保证编译的字节码能保留重写的语言**，Java 编译器额外**添加了桥接方法**。

```
class VIPOnlyMerchant extends Merchant<VIP>
...
  public double actionPrice(VIP);
    descriptor: (LVIP;)D
    flags: (0x0001) ACC_PUBLIC
    Code:
         0: dconst_0
         1: dreturn

  public double actionPrice(Customer);
    descriptor: (LCustomer;)D
    flags: (0x1041) ACC_PUBLIC, ACC_BRIDGE, ACC_SYNTHETIC
    Code:
         0: aload_0
         1: aload_1
         2: checkcast class VIP
         5: invokevirtual actionPrice:(LVIP;)D
         8: dreturn

// 这个桥接方法等同于
public double actionPrice(Customer customer) {
  return actionPrice((VIP) customer);
}
```

- 桥接方法在字节码层面重写父类方法，并通过强制类型转换调用子类方法。

## 子类定义与父类参数相同，返回类型为父类方法返回类型的子类生成桥接方法

```
class NaiveMerchant extends Merchant
  public java.lang.Double actionPrice(Customer);
    descriptor: (LCustomer;)Ljava/lang/Double;
    flags: (0x0001) ACC_PUBLIC
    Code:
      stack=2, locals=2, args_size=2
         0: dconst_0
         1: invokestatic Double.valueOf:(D)Ljava/lang/Double;
         4: areturn

  public java.lang.Number actionPrice(Customer);
    descriptor: (LCustomer;)Ljava/lang/Number;
    flags: (0x1041) ACC_PUBLIC, ACC_BRIDGE, ACC_SYNTHETIC
    Code:
      stack=2, locals=2, args_size=2
         0: aload_0
         1: aload_1
         2: invokevirtual actionPrice:(LCustomer;)Ljava/lang/Double;
         5: areturn         
```

- JVM 允许两个同名、同参数类型、不同返回类型的方法。

# foreach

## 数组

循环从 0 到末尾逐一访问数组元素。

## Iterable 对象

循环调用 hasNext 和 next 方法 遍历元素。

# 字符串 switch

- case 比较字符串的哈希值。
- 哈希值相同的字符串用 equals 比较。

# 问题

# 参考

> https://time.geekbang.org/column/article/13781