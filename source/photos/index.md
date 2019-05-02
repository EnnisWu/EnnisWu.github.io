---
title: 相册
date: 2019-04-11 11:40:05
type: "photos"
fancybox: false
---

<link rel="stylesheet" href="/lib/photo/ins.css">
<link rel="stylesheet" href="/lib/photo/photoswipe.css"> 
<link rel="stylesheet" href="/lib/photo/default-skin/default-skin.css"> 

<div class="photos-btn-wrap">
  <a class="photos-btn active" href="javascript:void(0)">照片</a>
  <a class="photos-btn" href="/videos">视频</a>
</div>

<div class="instagram itemscope">
  <a target="_blank" class="open-ins">图片正在加载中…若长时间未加载成功，您可能需要科学上网</a>
</div>
 
<script>
  (function() {
    var loadScript = function(path) {
      var $script = document.createElement('script')
      document.getElementsByTagName('body')[0].appendChild($script)
      $script.setAttribute('src', path)
    }
    setTimeout(function() {
        loadScript('/lib/photo/ins.js')
    }, 0)
  })()
</script>