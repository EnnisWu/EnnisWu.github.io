function picsRender(data, divId) {
    var baseUrl = 'http://image.ennis.info/';
    var pics = '<div style="text-align: center; overflow: hidden">';
    for (var i = 0, len = data.length; i < len; i++) {
        var type = data[i].type;
        var link = data[i].link;
        var src = baseUrl + type + 's/' + link;
        var srcMin = baseUrl + type + 's_min/' + link;
        pics += '<a href="' 
        + src 
        + '"><img style="width: 33%; float: left; padding: 1px; margin-bottom: 0px; border-width: 0px" src="' 
        + srcMin 
        + '"></a>';
    }
    pics += '</div>';
    document.getElementById(divId).innerHTML = pics;
}