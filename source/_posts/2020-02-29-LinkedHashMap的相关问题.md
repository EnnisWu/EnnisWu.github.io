---
title: '「原创」LinkedHashMap 的相关问题'
date: 2020-02-29 19:21:49
tags: [Java,Java集合]
categories: Java
---

> 以下源码基于 JDK 10

# LinkedHashMap 是什么

LinkedHashMap = HashMap + LinkedList

# LinkedHashMap 主要作用

## 实现按添加的顺序访问

- 迭代时按添加的顺序访问

## 实现按访问顺序排序（最近最少使用）（LRU）

- 页面置换算法

- **缓存机制**

# LinkedHashMap 实现原理

## 继承关系图

![LinkedHashMap 类图](/images/posts/Java/Collection/class_diagram_linkedhashmap.png "LinkedHashMap 类图")

![所有节点类图](/images/posts/Java/Collection/class_diagram_treenode.png "所有节点类图")

## put() 如何维护双链表

`LinkedHashMap` 未重写 `put()` 方法，直接使用 `HashMap` 的 `put()` 方法，通过重写 `newNode()` 方法维护双链表的建立，通过重写 `afterNodeAccess()` 方法和 `afterNodeInsertion()` 方法维护 LRU。

> `afterNodeAccess()` 和 `afterNodeInsertion()` 在 `HashMap` 中为空方法

```java
    //HashMap 源码
    public V put(K key, V value) {
        return putVal(hash(key), key, value, false, true);
    }

    final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
        Node<K,V>[] tab; Node<K,V> p; int n, i;
        if ((tab = table) == null || (n = tab.length) == 0)
            n = (tab = resize()).length;
        if ((p = tab[i = (n - 1) & hash]) == null)
            // LinkedHashMap 重写 newNode()
            tab[i] = newNode(hash, key, value, null);
        else {
            Node<K,V> e; K k;
            if (p.hash == hash &&
                ((k = p.key) == key || (key != null && key.equals(k))))
                e = p;
            else if (p instanceof TreeNode)
                e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
            else {
                for (int binCount = 0; ; ++binCount) {
                    if ((e = p.next) == null) {
                        // LinkedHashMap 重写 newNode()
                        p.next = newNode(hash, key, value, null);
                        if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                            treeifyBin(tab, hash);
                        break;
                    }
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        break;
                    p = e;
                }
            }
            if (e != null) { // existing mapping for key
                V oldValue = e.value;
                if (!onlyIfAbsent || oldValue == null)
                    e.value = value;
                //维护 LRU
                afterNodeAccess(e);
                return oldValue;
            }
        }
        ++modCount;
        if (++size > threshold)
            resize();
        //维护 LRU
        afterNodeInsertion(evict);
        return null;
    }
```

`LinkedHashMap` 重写了 `newNode()` 方法，新建节点后调用 `linkNodeLast()` 方法连接链表。

```java
    //HashMap 源码
    Node<K,V> newNode(int hash, K key, V value, Node<K,V> next) {
        return new Node<>(hash, key, value, next);
    }
```

```java
    //LinkedHashMap 源码
    Node<K,V> newNode(int hash, K key, V value, Node<K,V> e) {
        LinkedHashMap.Entry<K,V> p =
            new LinkedHashMap.Entry<>(hash, key, value, e);
        //调用该方法维护双链表
        linkNodeLast(p);
        return p;
    }

    private void linkNodeLast(LinkedHashMap.Entry<K,V> p) {
        //将新节点放入双链表尾
        LinkedHashMap.Entry<K,V> last = tail;
        tail = p;
        if (last == null)
            head = p;
        else {
            p.before = last;
            last.after = p;
        }
    }
```

## remove() 如何维护双链表

`LinkedHashMap` 没有重写 `remove()` 方法，通过重写 `afterNodeRemoval()` 方法维护双链表。

> `afterNodeRemoval()` 在 `HashMap` 中为空方法

```java
    //HashMap 源码
    public V remove(Object key) {
        Node<K,V> e;
        return (e = removeNode(hash(key), key, null, false, true)) == null ?
            null : e.value;
    }

    final Node<K,V> removeNode(int hash, Object key, Object value,
                               boolean matchValue, boolean movable) {
        Node<K,V>[] tab; Node<K,V> p; int n, index;
        if ((tab = table) != null && (n = tab.length) > 0 &&
            (p = tab[index = (n - 1) & hash]) != null) {
            Node<K,V> node = null, e; K k; V v;
            if (p.hash == hash &&
                ((k = p.key) == key || (key != null && key.equals(k))))
                node = p;
            else if ((e = p.next) != null) {
                if (p instanceof TreeNode)
                    node = ((TreeNode<K,V>)p).getTreeNode(hash, key);
                else {
                    do {
                        if (e.hash == hash &&
                            ((k = e.key) == key ||
                             (key != null && key.equals(k)))) {
                            node = e;
                            break;
                        }
                        p = e;
                    } while ((e = e.next) != null);
                }
            }
            if (node != null && (!matchValue || (v = node.value) == value ||
                                 (value != null && value.equals(v)))) {
                if (node instanceof TreeNode)
                    ((TreeNode<K,V>)node).removeTreeNode(this, tab, movable);
                else if (node == p)
                    tab[index] = node.next;
                else
                    p.next = node.next;
                ++modCount;
                --size;
                //维护双链表
                afterNodeRemoval(node);
                return node;
            }
        }
        return null;
    }
```

```java
    //LinkedHashMap 源码
    void afterNodeRemoval(Node<K,V> e) { // unlink
        //移除节点后断开双链表重新连接
        LinkedHashMap.Entry<K,V> p =
            (LinkedHashMap.Entry<K,V>)e, b = p.before, a = p.after;
        p.before = p.after = null;
        if (b == null)
            head = a;
        else
            b.after = a;
        if (a == null)
            tail = b;
        else
            a.before = b;
    }
```

## get() 和 put() 如何维护 LRU

`LinkedHashMap` 通过重写 `afterNodeAccess()` 方法维护 LRU，该方法在 `HashMap` 的 `put()` 方法中被调用，在 `LinkedHashMap` 重写的 `get()` 方法中被调用。

```java
    //访问节点后将该节点移至链尾
    //put() 方法中若新值覆盖旧值则会调用该方法
    //get() 方法中调用该方法
    void afterNodeAccess(Node<K,V> e) { // move node to last
        LinkedHashMap.Entry<K,V> last;
        if (accessOrder && (last = tail) != e) {
            LinkedHashMap.Entry<K,V> p =
                (LinkedHashMap.Entry<K,V>)e, b = p.before, a = p.after;
            p.after = null;
            if (b == null)
                head = a;
            else
                b.after = a;
            if (a != null)
                a.before = b;
            else
                last = b;
            if (last == null)
                head = p;
            else {
                p.before = last;
                last.after = p;
            }
            tail = p;
            ++modCount;
        }
    }

    public V get(Object key) {
        Node<K,V> e;
        if ((e = getNode(hash(key), key)) == null)
            return null;
        if (accessOrder)
            //维护 LRU
            afterNodeAccess(e);
        return e.value;
    }
```

`LinkedHashMap` 重写了 `afterNodeInsertion()` 方法，该方法在 `put()` 中添加新节点后被调用，**该方法会移除头节点，也就是最久未被访问的节点**。

该方法中调用的 `removeEldestEntry()` 方法直接返回 `false`，所以该方法**实际逻辑不执行**。

可以通过重写 `removeEldestEntry()` 方法实现在某条件下移除最久未被访问节点。

```java
    void afterNodeInsertion(boolean evict) { // possibly remove eldest
        LinkedHashMap.Entry<K,V> first;
        //put() 中 evict 传入 true
        if (evict && (first = head) != null && removeEldestEntry(first)) {
            K key = first.key;
            removeNode(hash(key), key, null, false, true);
        }
    }

    protected boolean removeEldestEntry(Map.Entry<K,V> eldest) {
        return false;
    }
```

# 如何开启按访问顺序排序（LRU）

`LinkedHashMap` 有这样一个构造方法，第三个参数传入 `true` 即可，默认是 `false`。

```java
public LinkedHashMap(int initialCapacity,
                     float loadFactor,
                     boolean accessOrder) {
    super(initialCapacity, loadFactor);
    this.accessOrder = accessOrder;
}
```

# LinkedHashMap 对于 HashMap 的优化

- `LinkedHashMap` 重写 `containsValue()` 方法。

- `LinkedHashIterator` 重写 `nextNode ()` 方法。

LinkedHashMap **直接遍历双链表**，即直接遍历有效数据。

HashMap **先遍历桶，再遍历链表**，双重循环，但是并不是所有桶都有数据。
