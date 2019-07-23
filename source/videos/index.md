---
title: 相册
date: 2019-05-02 13:18:39
---

<style>
.video-box {
	margin-top: 14px;
	margin-bottom: 14px;
}
.photos-btn-wrap {
	border-bottom: 1px solid #e5e5e5;
    margin-bottom: 20px;
    display: flex;
}
.photos-btn {
	font-size: 16px;
	color: #333;
	margin-bottom: -4px;
    padding: 5px 8px 3px;
	border: 1px solid #fff;
}
.photos-btn.active {
	color: #08c;
	border: 1px solid #e5e5e5;
	border-bottom: 5px solid #fff;
}
.year {
	font-size: 16px;
}
.year{
	display: inline;
}
h1 em{
	font-style: normal;
	font-size: 14px;
	margin-left: 10px;
}
</style>

<div class="photos-btn-wrap">
  <a class="photos-btn" href="/photos">照片</a>
  <a class="photos-btn active" href="javascript:void(0)">视频</a>
</div>

<div id="album-videos">
</div>
<script src="/lib/photo/videos.js"></script>
<script>
var xhr = new XMLHttpRequest();
xhr.open('GET', '/lib/photo/videosData.json', true);
xhr.onload = function() {
	if (this.status >= 200 && this.status < 300) {
		var data = JSON.parse(this.response);
		videosRender(data, "album-videos");
	}
};
xhr.send();
</script>
