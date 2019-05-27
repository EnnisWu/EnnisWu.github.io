---
title: {{ title }}
date: {{ date }}
tags:
categories:
type: moment
time: {{ 't' + date.substring(10) + '修改！！' }}
---

<div class="pics"></div>

<script src="/lib/moment/pics.js"></script>
<script>
var data = [
    {"link": "", "type": "photo"},
    {"link": "", "type": "image"},
    {"link": "", "type": "meme"},
    {"link": "", "type": "screenshot"},
    {"link": "", "type": "picture"}
];
picsRender(data);
</script>
