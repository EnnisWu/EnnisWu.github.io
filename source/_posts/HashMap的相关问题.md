---
title: HashMap的相关问题
date: 2019-02-16 22:35:53
tags: [Java,Java集合,Java基础,面试]
categories: Java集合
---

# HashMap 扩容机制

## 扩容时机

### 基于 JDK 1.7

1. 添加元素前容器元素的个数 \>= 阈值（`size >= threshold`）。

2. 当前要添加元素所在数组（桶）的位置（index）不等于null。

	也就是说发生了 hash 冲突。

3. 以上两个条件都满足时触发 HashMap 扩容。

### 基于 JDK 1.10

1. 添加元素后容器的元素个数 \> 阈值（`++size > threshold`）

### thresold 说明

1. threshold = 数组（桶）的长度。

2. 当扩容到最大值时，threshold = int 最大值。

3. 使用提供初始值的构造方法时，threshold = 初始值最接近的 2 的 n 次幂的值。

## 扩容大小

1. 扩容大小为当前数组（桶）的 2 倍（HashMap 中数组的大小始终为 2 的 n 次幂）。

2. 扩容时触发 rehash ，也就是重新计算每个元素的位置。

3. 经过 rehash 后，元素在原位置或者在原位置移动 2 次幂的位置。

## 原代码

以下原代码基于 JDK 1.7

```java
/** 
 * HashMap 添加节点 
 * 
 * @param hash        当前key生成的hashcode 
 * @param key         要添加到 HashMap 的key 
 * @param value       要添加到 HashMap 的value 
 * @param bucketIndex 桶，也就是这个要添加 HashMap 里的这个数据对应到数组的位置下标 
 */  
void addEntry(int hash, K key, V value, int bucketIndex) {  
    //size：The number of key-value mappings contained in this map.  
    //threshold：The next size value at which to resize (capacity * load factor)  
    //数组扩容条件：1.已经存在的key-value mappings的个数大于等于阈值  
    //             2.底层数组的bucketIndex坐标处不等于null  
    if ((size >= threshold) && (null != table[bucketIndex])) {  
        resize(2 * table.length);//扩容之后，数组长度变了  
        hash = (null != key) ? hash(key) : 0;//为什么要再次计算一下hash值呢？  
        bucketIndex = indexFor(hash, table.length);//扩容之后，数组长度变了，在数组的下标跟数组长度有关，得重算。  
    }  
    createEntry(hash, key, value, bucketIndex);  
}  
  
/** 
 * 这地方就是链表出现的地方，有2种情况 
 * 1，原来的桶bucketIndex处是没值的，那么就不会有链表出来啦 
 * 2，原来这地方有值，那么根据Entry的构造函数，把新传进来的key-value mapping放在数组上，原来的就挂在这个新来的next属性上了 
 */  
void createEntry(int hash, K key, V value, int bucketIndex) {  
    HashMap.Entry<K, V> e = table[bucketIndex];  
    table[bucketIndex] = new HashMap.Entry<>(hash, key, value, e);  
    size++;  
}

void resize(int newCapacity) {   //传入新的容量
    Entry[] oldTable = table;    //引用扩容前的Entry数组
    int oldCapacity = oldTable.length;
    if (oldCapacity == MAXIMUM_CAPACITY) {  //扩容前的数组大小如果已经达到最大(2^30)了
        threshold = Integer.MAX_VALUE; //修改阈值为int的最大值(2^31-1)，这样以后就不会扩容了
        return;
    }

    Entry[] newTable = new Entry[newCapacity];  //初始化一个新的Entry数组
    transfer(newTable);                         //！！将数据转移到新的Entry数组里
    table = newTable;                           //HashMap的table属性引用新的Entry数组
    threshold = (int) (newCapacity * loadFactor);//修改阈值
}


void transfer(Entry[] newTable) {
    Entry[] src = table;                   //src引用了旧的Entry数组
    int newCapacity = newTable.length;
    for (int j = 0; j < src.length; j++) { //遍历旧的Entry数组
        Entry<K, V> e = src[j];             //取得旧Entry数组的每个元素
        if (e != null) {
            src[j] = null;//释放旧Entry数组的对象引用（for循环后，旧的Entry数组不再引用任何对象）
            do {
                Entry<K, V> next = e.next;
                int i = indexFor(e.hash, newCapacity); //！！重新计算每个元素在数组中的位置
                e.next = newTable[i]; //标记[1]
                newTable[i] = e;      //将元素放在数组上
                e = next;             //访问下一个Entry链上的元素
            } while (e != null);
        }
    }
}
```

以下原代码基于 JDK 1.10

```java
/**
 * Associates the specified value with the specified key in this map.
 * If the map previously contained a mapping for the key, the old
 * value is replaced.
 *
 * @param key key with which the specified value is to be associated
 * @param value value to be associated with the specified key
 * @return the previous value associated with {@code key}, or
 *         {@code null} if there was no mapping for {@code key}.
 *         (A {@code null} return can also indicate that the map
 *         previously associated {@code null} with {@code key}.)
 */
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}

/**
 * Implements Map.put and related methods.
 *
 * @param hash hash for key
 * @param key the key
 * @param value the value to put
 * @param onlyIfAbsent if true, don't change existing value
 * @param evict if false, the table is in creation mode.
 * @return previous value, or null if none
 */
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    if ((p = tab[i = (n - 1) & hash]) == null)
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
            afterNodeAccess(e);
            return oldValue;
        }
    }
    ++modCount;
    if (++size > threshold)
        resize();
    afterNodeInsertion(evict);
    return null;
}

/**
 * Initializes or doubles table size.  If null, allocates in
 * accord with initial capacity target held in field threshold.
 * Otherwise, because we are using power-of-two expansion, the
 * elements from each bin must either stay at same index, or move
 * with a power of two offset in the new table.
 *
 * @return the table
 */
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table;
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
    int oldThr = threshold;
    int newCap, newThr = 0;
    if (oldCap > 0) {
        if (oldCap >= MAXIMUM_CAPACITY) {
            threshold = Integer.MAX_VALUE;
            return oldTab;
        }
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                 oldCap >= DEFAULT_INITIAL_CAPACITY)
            newThr = oldThr << 1; // double threshold
    }
    else if (oldThr > 0) // initial capacity was placed in threshold
        newCap = oldThr;
    else {               // zero initial threshold signifies using defaults
        newCap = DEFAULT_INITIAL_CAPACITY;
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
    }
    if (newThr == 0) {
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                  (int)ft : Integer.MAX_VALUE);
    }
    threshold = newThr;
    @SuppressWarnings({"rawtypes","unchecked"})
    Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    table = newTab;
    if (oldTab != null) {
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {
                oldTab[j] = null;
                if (e.next == null)
                    newTab[e.hash & (newCap - 1)] = e;
                else if (e instanceof TreeNode)
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                else { // preserve order
                    Node<K,V> loHead = null, loTail = null;
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    do {
                        next = e.next;
                        if ((e.hash & oldCap) == 0) {
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        else {
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);
                    if (loTail != null) {
                        loTail.next = null;
                        newTab[j] = loHead;
                    }
                    if (hiTail != null) {
                        hiTail.next = null;
                        newTab[j + oldCap] = hiHead;
                    }
                }
            }
        }
    }
    return newTab;
}
```

# HashMap 插入链表时是头插还是尾插

其实这个问题很简单，只需要观察 HashMap 的 Node 节点类的字段。

Node 类仅保存了它的下一个节点，也就是说这个链表是单向的，并且只保存了头节点，所以肯定是头插法性能较高。

# LinkedHashMap 是怎样实现有序的

我们知道 HashMap 中保存的元素是无序的，并且 HashMap 不保证其元素的位置不变，而 Map 接口的另一个实现类 LinkedHashMap 则可以保证其遍历时以添加的顺序返回，那它是怎样实现的？

> 注意 LinkedHashMap 不可以随机访问，其内部元素仍无序，只是通过迭代器遍历时返回顺序与添加顺序相同。

以下代码基于 JDK 1.10

```java
static class Entry<K,V> extends HashMap.Node<K,V> {
    Entry<K,V> before, after;
    Entry(int hash, K key, V value, Node<K,V> next) {
        super(hash, key, value, next);
    }
}
```

```java
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    V value;
    Node<K,V> next;

    Node(int hash, K key, V value, Node<K,V> next) {
        this.hash = hash;
        this.key = key;
        this.value = value;
        this.next = next;
    }
    
    //其余方法省略
}
```

LinkedHashMap 直接继承于 HashMap，其源代码非常短，仅对 HashMap 做了少量更改。LinkedHashMap 中的节点 Node 也直接继承于 HashMap 中的节点 Node。

从节点代码中我们可以了解到 LinkHashMap 中节点添加了前驱、后继两个新字段，其他不变。

正如官方文档所说 LinkedHashMap 是哈希表和双向链表的实现。

![LinkedHashMap 数据结构](/images/posts/Java/Collection/linkedhashmap.png)

[图片来自](https://yikun.github.io/2015/04/02/Java-LinkedHashMap%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86%E5%8F%8A%E5%AE%9E%E7%8E%B0/)

# HashMap 与 HashTable 的区别

## 继承不同

HashMap 与 HashTable 都实现了 Map 接口，但是 HashMap 直接继承于 AbstractMap 类，HashTable 直接继承于 Dictionary 类。

## 迭代器不同

HashMap 与 HashTable 的迭代器都实现了 Iterator 接口，但是 HashTable 的迭代器还实现了 Enumeration 接口。

## 线程安全不同

HashMap 是线程不安全的，而 HashTable 是线程安全的。

在单线程情况下，HashMap 效率高于 HashTable。

## 哈希算法不同

HashMap 中元素的 hash 值使用 key 的 hashcode 值经过一定的算法计算得到。以减少哈希冲突。

HashTable 中元素的 hash 值直接使用 key 的 hashcode 值。

## 允不允许 null 值不同

HashMap 可以使用 null 作为键和值。HashTable 均不允许。

## 扩容大小不同

HashMap 扩容为原数组（桶）的 2 倍，HashTable 扩容为原数组（桶）的 2 倍 + 1。

# 参考资料

> https://www.cnblogs.com/chengxiao/p/6059914.html
> https://blog.csdn.net/qq_27093465/article/details/52270519
> https://blog.csdn.net/mgl934973491/article/details/60466487
> https://blog.csdn.net/u014532901/article/details/78936283
> https://yikun.github.io/2015/04/02/Java-LinkedHashMap%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86%E5%8F%8A%E5%AE%9E%E7%8E%B0/