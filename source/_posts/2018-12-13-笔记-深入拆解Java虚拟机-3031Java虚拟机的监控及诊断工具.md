---
title: 笔记-深入拆解Java虚拟机-3031Java虚拟机的监控及诊断工具
date: 2018-12-13 15:25:33
tags: JVM
categories: Java虚拟机
---

> 随便看看了解下就好。

# 命令行

## jps

> 打印所有正在运行的 Java 进程的相关信息。[帮助文档](https://docs.oracle.com/en/java/javase/11/tools/jps.html)

| 参数 | 作用 |
| ---- | ----- |
| 默认 | 打印 Java 进程 ID 和主类名 |
| -l | 打印模块名和包名 |
| -v | 打印传递给 JVM 的参数 |
| -m | 打印传递给主类的参数 |

- 如果某 Java 进程关闭了默认开启的 UsePerfData 参数 jps 命令和 jstat 命令无法探知该 Java 进程。

## jstat

> 打印目标 Java 进程的性能数据。包括多条子命令。[帮助文档](https://docs.oracle.com/en/java/javase/11/tools/jstat.html)

```
$ jstat -options
-class
-compiler
-gc
-gccapacity
-gccause
-gcmetacapacity
-gcnew
-gcnewcapacity
-gcold
-gcoldcapacity
-gcutil
-printcompilation
```

| 子命令 | 作用 |
| ------- | ---- |
| -class | 打印类加载相关数据 |
| -compiler | 打印即时编译相关数据 |
| -printcompilation | 同上 |
| -gc 前缀 | 打印垃圾回收相关数据 |

- -t 参数，打印进程的启动时间。
- 默认情况 jstat 只打印一次性能数据。
- 可以配置为每隔一段时间打印一次（直至进程终止或达到最大次数）。

## jmap

> 分析 JVM 堆中的对象。包括多条子命令。[帮助文档](https://docs.oracle.com/en/java/javase/11/tools/jmap.html)

| 子命令 | 作用 |
| ------ -| ---- |
| -clstats | 打印被加载类的信息 |
| -finalizerinfo | 打印所有待 finalize 的对象 |
| -histo | 统计各个类的实例数目以及占用内存 |
| -histo:live | 只统计堆中的存活对象 |
| -dump | 导出堆的快照 |
| -dump:live | 只保存堆中的存活对象 |

## jinfo

> 查看进程的参数。[帮助文档](https://docs.oracle.com/en/java/javase/11/tools/jinfo.html)

- 可以修改进程的“manageable”虚拟机参数。

## jstack

> 打印进程中各个线程的栈轨迹和线程所持有的锁。[帮助文档](https://docs.oracle.com/en/java/javase/11/tools/jstack.html)

- 死锁检测。

## jcmd

> 替代除了 jstat 之外的所有命令。[帮助文档](https://docs.oracle.com/en/java/javase/11/tools/jcmd.html)

# GUI

## eclipse MAT

> 解析二进制快照工具。

- 获取二级制快照的方式
	1. 使用 Attach API
	2. 新建一个 JVM 运行 Attach API
	3. 使用 jmap

- 进程启用 DisableAttachMechanism 参数时
	1. 不显示
	2. 不显示
	3. 运行时报错

- 计算对象占据内存的[两种方式](https://help.eclipse.org/mars/topic/org.eclipse.mat.ui.help/concepts/shallowretainedheap.html?cp=46_2_1)
	1. Shallow heap：对象自身所占据的内存。
	2. Retained heap：对象不再被引用时，垃圾回收器所能回收的总内存，包括对象自身所占据的内存，和仅能够通过该对象引用到的其他对象所占据的内存。

- 直方图（histogram）：展示各个类的实例数目和实例的堆总和。

- 支配树（dominator tree）：按照每个对象 Retained heap 的大小排列支配树。

- 自动匹配内存泄漏常见模式，汇报潜在内存泄漏问题。[帮助文档](https://help.eclipse.org/mars/topic/org.eclipse.mat.ui.help/tasks/runningleaksuspectreport.html?cp=46_3_1) [博客](http://memoryanalyzer.blogspot.com/2008/05/automated-heap-dump-analysis-finding.html)

## Java Mission Control

> JVM 上的性能监控工具。包含一个 GUI 客户端，众多用来收集 JVM 性能数据的插件，虚拟机内置的高效 profiling 工具 Java Flight Recorder（JFR）。

- JFR 的性能开销很小，默认配置下平均低于 1%。
- JFR 能够直接访问虚拟机内的数据，不会影响虚拟机的优化。
- 适用于生产环境下满负荷运行的 Java 程序。
- JFR 记录运行过程中发生的一系列事件（包括 Java 和 JVM）。

| 事件类型 | 说明 |
| --------- | ----- |
| 瞬时事件（Instant Event） | 关心发生与否，如异常、线程启动 |
| 持续事件（Duration Event） | 关心持续时间，如垃圾回收 |
| 计时事件（Timed Event） | 时长超出指定阈值的持续事件 |
| 取样事件（Sample Event） | 周期性取样的事件，如方法抽样 |

- JFR 的取样事件比其他工具更加精确。
- JFR 的 3 种启用方式
	1. 命令行中使用 -XX:StartFlightRecording= 参数。
	2. 使用 jcmd 的 JFR.\* 子命令。
	3. 使用 JMC 的 JFR 插件。

## VisualVM

> https://visualvm.github.io/index.html

## JITWatch

> https://github.com/AdoptOpenJDK/jitwatch

# 引用

> https://time.geekbang.org/column/article/40821