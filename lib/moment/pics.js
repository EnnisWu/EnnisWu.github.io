function picsRender(data, divId) {
    var baseUrl = 'http://image.ennis.info/';
    var pics = '<div style="text-align: center; overflow: hidden">';
    
    var len = data.length;
    var width;
    var float = "float: left;";
    if (len == 1) {
        float = "";
        width = "50%"
    } else if (len == 2 || len == 4) {
        width = "50%";
    } else {
        width = "32%"
    }

    for (var i = 0; i < len; i++) {
        var type = data[i].type;
        var link = data[i].link;
        var src = baseUrl + type + 's/' + link;
        if (type == "video") {
            var videoWidth;
            if (len == 1) {
                videoWidth = "80%"
            } else if (len == 2 || len == 4) {
                videoWidth = "49%";
            } else {
                videoWidth = "31%"
            }
            pics += '<video style="width: ' 
            + videoWidth 
            + '; ' + float + ' padding: 1px; margin-bottom: 0px; border-width: 0px" src="'
            + src
            + '" controls="controls"></video>';
        } else {    
            var srcMin = baseUrl + type + 's_min/' + link;    
            pics += '<a href="' 
            + src 
            + '"><img style="width: ' 
            + width 
            + '; ' + float + ' padding: 1px; margin-bottom: 0px; border-width: 0px" src="' 
            + srcMin 
            + '"></a>';
        }
    }
    pics += '</div>';
    document.getElementById(divId).innerHTML = pics;
}