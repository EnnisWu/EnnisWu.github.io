function videosRender(data, divId) {
    var videoUrl = 'http://image.ennis.info/videos/';
    var posterUrl = 'http://image.ennis.info/posters/';
    var videosHtml = '';

    var len = data.length;
    for (var i = 0; i < len; i++) {
        var year = data[i].year;
        var month = data[i].month;
        var videos = data[i].videos;
        videosHtml += '<h1 class="year">' + year + '年<em>' + month + '月</em></h1>';
        var vLen = videos.length;
        videosHtml += '<div class="video-box" style="text-align: center; overflow: hidden">';
        for (var j = 0; j < vLen; j++) {
            var name = videos[j].name;
            var videoSrc = videoUrl + videos[j].link;
            var posterSrc = posterUrl + videos[j].poster;
            videosHtml += '<a class="group-picture" data-fancybox href="#v' + name + '">'
            + '<div style="position: relative; text-align: center; width: 32%; float: left">'
            + '<div style="position: absolute; width: 50%; height: 50%; left: 0; right: 0; top: 0; bottom: 0; margin: auto">'
            + '<img style="width: 100%; padding: 0px; border-width: 0px" src="/images/video/play.svg">'
            + '</div>'
            + '<img style="width: 100%; padding: 0px;" src="' + posterSrc + '">'
            + '</div>'
            + '</a>'
            + '<video id="v' + name + '" style="display: none;" src="' + videoSrc + '" controls="controls" class="fancybox-video">'
            + '</video>';
        }
        videosHtml += '</div>';
    }
    document.getElementById(divId).innerHTML = videosHtml;
}