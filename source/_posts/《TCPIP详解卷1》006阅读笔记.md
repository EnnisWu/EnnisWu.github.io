---
title: 《TCPIP详解卷1》006阅读笔记
date: 2018-06-12 16:34:53
tags: [计算机网络,TCP/IP]
categories: TCP/IP
---

ICMP的正式规范参见 RFC 792
<br/>

ICMP是IP层的一个组成部分，传递差错报文和其他需要注意的信息。
通常被IP层或更高层协议使用。
<br/>

![ICMP](/images/posts/TCPIP/006/ICMP.png)
- 校验和覆盖整个ICMP报文，算法与IP首部相同
- 不同类型和代码有不同的内容
<br/>

#### ICMP报文的类型
- 类型字段和代码字段共同决定。
- ICMO差错报文始终包含IP首部和产生差错的IP数据报的前8个字节。
接收ICMP差错报文的模块可以与某个协议和用户进程联系起来。

- 下面情况不产生差错报文：
- 1. ICMP差错报文
- 2. 目的地址是广播或多播地址
- 3. 作为链路层广播的数据报
- 4. 不是IP分片的第一片
- 5. 源地址不是单个主机的数据报
<br/>

#### ICMP地址掩码请求与应答
![mask](/images/posts/TCPIP/006/mask.png)
- 用于无盘系统在引导过程中获取自己的子网掩码。
- 系统广播他的ICMP请求报文（类似RARP获取IP地址）。
- 标识符和序列号由发送端任意设定，在应答中返回进行匹配。
  <br/>

#### ICMP时间戳请求与应答
![time_stamp_request_response](/images/posts/TCPIP/006/time_stamp_request_response.png)
- 请求允许系统向另一个系统查询当前时间。
- 返回的建议值是自午夜计算的毫秒数，协调的统一时间。
- 缺陷：必须通过其他方法获知当时的日期。
- 请求端填写发起时间戳，应答系统收到时填写接收时间戳，发送时填写传送时间戳。
![time_stamp_request](/images/posts/TCPIP/006/time_stamp_request.png)
![RTT](/images/posts/TCPIP/006/RTT.png)
- 调整值是difference - RTT / 2。
<br/>

#### ICMP端口不可达差错
以UDP端口不可达为例。
![unreachable_response](/images/posts/TCPIP/006/unreachable_response.png)
- IP首部后面前8个字节是UDP首部（源端口号和目的端口号）。
![unreachable](/images/posts/TCPIP/006/unreachable.png)