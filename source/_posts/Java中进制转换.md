---
title: Java中进制转换
date: 2018-08-03 10:19:26
tags: [Java,进制转换]
categories: 进制转换
---

# 十进制转二、八、十六进制

Integer.toBinaryString():String
Integer.toOctalString():String
Integer.toHexString():String

返回值为字符串。

# 任意进制转十进制

Integer.valueOf(String,int):Integer
Integer.parseInt(String,int):int

第二个参数指定基数，将字符串参数解析为有符号的整数。 