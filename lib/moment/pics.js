function picsRender(data, divId) {
    var baseUrl = 'http://image.ennis.info/';
    var pics = '<div style="text-align: center; overflow: hidden">';
    
    var len = data.length;
    var width = 0;
    var float = "float: left;";
    if (len == 1) {
        float = "";
        width = 50;
    } else if (len == 2 || len == 4) {
        width = 50;
    } else {
        width = 32;
    }

    for (var i = 0; i < len; i++) {
        var type = data[i].type;
        var link = data[i].link;
        var src = baseUrl + type + 's/' + link;
        if (type == "video") {
            var trans = "";
            if (len == 1) {
                trans = 'transform: translate(50%, 0);'
            }
            var videoName = link.substring(0, link.indexOf('.'));
            var videoPoster = baseUrl + 'posters/' + videoName + '.jpg';
            pics += '<a class="group-picture" data-fancybox href="#v' + videoName + '">'
            + '<div style="position: relative; text-align: center; width: ' + width + '%;' + trans + float + '">'
            + '<div style="position: absolute; width: 100%; height: 100%">'
            + '<img style="width: 30%; margin: 35%" src="/images/video/play.svg">'
            + '</div>'
            + '<img style="width: 100%; padding: 1px;" src="' + videoPoster + '">'
            + '</div>'
            + '</a>'
            + '<video id="v' + videoName + '" style="display: none;" src="' + src + '" controls="controls" class="fancybox-video">'
            + '</video>';
        } else {    
            var srcMin = baseUrl + type + 's_min/' + link;    
            pics += '<a class="group-picture" data-fancybox="gallery" href="' 
            + src 
            + '"><img style="width: ' 
            + width 
            + '%; padding: 1px;' 
            + float 
            + '" src="' 
            + srcMin 
            + '"></a>';
        }
    }
    pics += '</div>';
    document.getElementById(divId).innerHTML = pics;
}