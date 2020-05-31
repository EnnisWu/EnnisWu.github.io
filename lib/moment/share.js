function qzoneShareRender(data, divId) {
    var baseUrl = 'https://ennis.sgp1.cdn.digitaloceanspaces.com/image/';
    var picUrl = baseUrl + data.picUrl;
    document.getElementById(divId).innerHTML 
    = '<div style="text-align: center">'
    + '<div class="mod_details lbor" style="width: 80%; border-width: 0 0 0 2px; margin-top: 6px; padding-left: 8px; border-color: #DDDDDD; border-style: none none none solid; display: inline-block;">'
    + '<div class="layout_s" style="margin-right: 8px; float: left;">'
    + '<a class="img_wrap group-picture" style="border-bottom: 0px; font-size: 0; line-height: 0; display: block; color: #26709A; text-decoration: none;"'
    + 'href="' + data.url + '"'
    + 'target="_blank">'
    + '<img src="' + picUrl + '"'
    + 'style="width: ' + data.width + 'px; height: ' + data.height + 'px; padding: 2px; border-color: #E0E0E0; border-style: solid; border-width: 1px;" class="bor3">'
    + '</a>'
    + '</div>'
    + '<div class="mod_brief" style="overflow: hidden; text-align: left;">'
    + '<h5 style="padding-top: 0px; margin-top: 0px; margin-bottom: 3px; font-size: 12px; width: 100%; font-weight: normal;">'
    + '<strong style="font-weight: bold;">'
    + '<a class="c_tx _share_title" style="border-bottom: 0px; color: #26709A;"'
    + 'href="' + data.url + '"'
    + 'target="_blank">' + data.title + '</a>'
    + '</strong>'
    + '</h5>'
    + '<p style="margin: 0 0 0 0; font-size: 12px; display: block; /*margin-block-start: 1em; margin-block-end: 1em;*/ margin-inline-start: 0px; margin-inline-end: 0px;">'
    + data.brief + '</p>'
    + '<p class="c_tx3 comming" style="margin: 0 0 0 0; font-size: 12px; margin-top: 3px; color: #9B9B9B;">'
    + '来自：'
    + '<a title="' + data.source + '"'
    + 'href="' + data.url + '"'
    + 'target="_blank" class="c_tx3 mgrm" style="border-bottom: 0px; margin-right: 10px; color: #9B9B9B;">' + data.source + '</a>'
    + '</p>'
    + '</div></div></div>';
}

function weChatShareRender(data, divId) {
    var baseUrl = 'https://d13mlcfozzlptt.cloudfront.net/shares/';
    var picUrl = baseUrl + data.picUrl;
    document.getElementById(divId).innerHTML 
    = '<div style="width: 270px; display: table; height: 40px; position: relative; border-radius: 2px; overflow: hidden; background-color: #f5f5f5; padding: 10px; margin: auto;">'
    + '<div style="float: left; overflow: hidden; margin: 0; width: 40px; height: 40px; position: relative; display: table-cell;">'
    + '<a class="group-picture" href="' + data.url + '"target="_blank" title="点击查看" style="border-bottom: 0px; display: inline-block; vertical-align: top; color: #295c9d;">'
    + '<img src="' + picUrl + '"style="padding: 0px; height: 40px;"></a></div>'
    + '<div style="line-height: 1.2; padding-right: 10px; overflow: hidden; display: table-cell; vertical-align: middle; padding-left: 14px;">'
    + '<a href="' + data.url + '"target="_blank" style="text-align: left; border-bottom: 0px; font-size: 15px; color: #000; text-decoration: none; overflow: hidden;">'
    + data.title + '</a></div></div>';
}