---
title: HashSet为什么要使用Object对象填充value而不是null
date: 2019-02-16 23:25:02
tags: [Java,Java集合,Java基础,面试]
categories: Java集合
---

我们知道 HashSet 内部使用 HashMap 实现，HashSet 的元素存储在 HashMap 的 key 中（唯一），value 使用了一个 Object 对象填充。为什么 HashSet 不使用 null 去填充 value 呢？

以下所有原代码基于 JDK 1.10

```java
private transient HashMap<E,Object> map;

 // Dummy value to associate with an Object in the backing Map
private static final Object PRESENT = new Object();
```

# 从 remove 的角度

```java
public boolean remove(Object o) {
    return map.remove(o)==PRESENT;
}
```

1. HashSet 使用 HashMap 的 `remove(Object) : Object` 方法移除元素，如果使用 null 作为 value 填充，其返回值始终为 null，因为当存在该 key 并移除成功使返回原 value 为 null，当不存在该 key 时返回 null ，即无法判断是否移除成功。

2. HashMap 存在 `remove(Object, Object) : boolean` 方法，但该方法在 JDK 1.8 才出现。并且该方法相对于上一个方法更加耗时。

# 从 add 的角度

```java
public boolean add(E e) {
    return map.put(e, PRESENT)==null;
}
```

1. HashSet 使用 HashMap 的 `put(Object, Object) : Object` 方法添加元素，但该方法无法判断是否添加成功。HashSet 的 add 方法添加元素时若该元素之前未被添加则返回 true，若该元素之前已被添加则返回 false。HashMap 的 put 添加键值对时若该键值对的 key 未被添加则返回 null，若该键值对的 key 已被添加则返回原 value。即当使用 null 作为 value 填充，其返回值始终为 null，无法判断是否添加成功。

2. 可以使用 HashMap 的 `containsKey(Object) : boolean`	方法加以条件判断，但这样会更加耗时。并且若添加一个之前未被添加的元素需要遍历整个 HashMap。而添加元素是一个使用频繁的方法，尤其是添加新元素更为频繁，每次都加以判断并不是一个明智的选择。

# 从消耗内存的角度

HashSet 使用的填充对象 PRESENT 用 static 修饰，所有 HashSet 的所有元素都使用该对象作为 value 填充，并不会消耗多大内存，可以忽略不计。

# 总结

综上，HashSet 使用一个 Object 对象而不是 null 作为 value 填充 HashMap 在时间上效率会更优越，并且消耗的内存可以忽略不计。