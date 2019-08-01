function quoteRender(data, divId) {
    var quote = '转自：' + data.post.author + '<blockquote style="background-color: #eeeeee;">'
    + '<h2 class="post-title" itemprop="name headline" style="text-align: center">'
    + '<p style="text-align: left; display: table; margin: auto">' 
    + (data.post.content ? data.post.content : '分享') + '</p>'
    + '</h2>'
    + '<div class="post-meta">'
    + '<span class="post-time">'
    + '<span class="post-meta-item-icon">'
    + '<i class="fa fa-calendar-o"></i>'
    + '</span>'
    + '<span class="post-meta-item-text">发表于</span>'
    + '<time title="创建于" itemprop="dateCreated datePublished">'
    + data.post.date
    + '</time>'
    + '</span>'
    + '</div>';
    if (data.picDivId != null) {
        quote += '<div id="' + data.picDivId + '"></div>';
    }
    quote += '</blockquote>';
    document.getElementById(divId).innerHTML = quote;
    if (data.pics != null) {
        picsRender(data.pics, data.picDivId);
    }
}