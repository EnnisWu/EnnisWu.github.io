---
title: '「转载」HTTP 中 GET 与 POST 的区别'
date: 2020-05-16 15:39:44
tags: [计算机网络,HTTP]
categories: 计算机网络
---

# w3schools 答案

1. GET 在浏览器回退时是无害的，而 POST 会再次提交请求。

2. GET 产生的 URL 地址可以被 Bookmark，而 POST 不可以。

3. GET 请求会被浏览器主动 cache，而 POST 不会，除非手动设置。

4. GET 请求只能进行 url 编码，而 POST 支持多种编码方式。

5. GET 请求参数会被完整保留在浏览器历史记录里，而 POST 中的参数不会被保留。

6. GET 请求在 URL 中传送的参数是有长度限制的，而 POST 没有。

7. 对参数的数据类型，GET 只接受 ASCII 字符，而 POST 没有限制。

8. GET 比 POST 更不安全，因为参数直接暴露在 URL 上，所以不能用来传递敏感信息。

9. GET 参数通过 URL 传递，POST 放在 Request body 中。

# 注意

- GET 产生一个 TCP 数据包，POST 产生两个 TCP 数据包。

    - 对于 GET 方式的请求，浏览器会把 header 和 data 一并发送出去，服务器响应 200（返回数据）。

    - 而对于 POST，浏览器先发送 header，服务器响应 100 continue，浏览器再发送 data，服务器响应 200 ok（返回数据）。

    - 只有部分浏览器会发两个数据包，且 header 要加相应参数，且服务端要支持。

- 增删查改中，GET 语义对应查，POST 语义对应增。