---
title: 足迹
date: 2019-04-09 15:36:53
---

<link rel="stylesheet" href="/js/map/jquery-jvectormap-2.0.3.css" type="text/css" media="screen"/>
<script src="/js/map/jquery-3.3.1.min.js"></script>
<script src="/js/map/jquery-jvectormap-2.0.3.min.js"></script>
<script src="/js/map/jquery-jvectormap-world-mill.js"></script>
<script src="/js/map/jquery-jvectormap-cn-merc-en.js"></script>
<script src="/js/map/jquery-jvectormap-jp-merc.js"></script>

***

# 世界

<div id="world-map-markers" style="width: 600px; height: 400px"></div>

***

# 中国

<div id="china-map-markers" style="width: 600px; height: 400px"></div>

- **常德**
	- 诞生
- **长沙**
	- 长沙理工大学（本科就读）
	- 黄兴广场
	- 五一广场
	- 坡子街
	- 太平街
	- 中南大学  2016-12-17
	- 世界之窗  2018-04-15
	- 橘子洲  2018-10-01
- **岳阳**
- **上海**
	- 上海科技馆  2008-02
	- 长风海洋世界  2009-08
	- 杜莎夫人蜡像馆  2016-08-13
	- 南京路步行街  2016-08-13
	- 外滩  2016-08-13
- **苏州**
	- 苏州乐园
	- 苏州乐园水上世界
	- 拙政园
	- 苏州博物馆
	- 平江路
	- 盘门
	- 同里
	- 狮子林
	- 金鸡湖
	- 虎丘
	- 寒山寺
	- 留园
	- 观前街
	- 月光码头
	- 相门
	- 斜塘老街
	- 苏州中心冠军冰场
- **宁波**
	- 象山  2009-08
- **北京**
	- 恭王府  2013-07-31
	- 天安门广场  2013-07-31
	- 故宫  2013-07-31
	- 长城  2013-08-01
	- 定陵  2013-08-01
	- 北京奥林匹克公园  2016-08-01
	- 颐和园  2013-08-02
	- 北京大学  2013-08-02
	- 太平洋海底世界  2013-08-02
	- 中央电视塔  2013-08-02
	- 天坛公园  2013-08-02
- **湘潭**
	- 韶山毛泽东故居  2013-02-09
- **杭州**
	- 雷峰塔  2016-08-11
	- 西湖景区  2016-08-11~2016-08-12
		- 曲院风荷
		- 苏堤春晓
		- 花港观鱼
		- 三潭映月
		- 苏堤
		- 断桥残雪
		- 白堤
		- 平湖秋月
		- 南屏晚钟
	- 西溪国家湿地公园  2016-08-12
	- 河坊街  2016-08-12
- **株洲**
	- 株洲方特欢乐世界  2017-06-03
- **庐山**
	- 庐山景区  2019-02-02~2019-02-03
		- 含鄱口
		- 大口瀑布
		- 龙首崖
		- 三叠泉
		- 如琴湖
		- 白居易草堂
		- 花径
		- 仙人洞
- **吉首**
	- 矮寨大桥  2019-02-07
- **张家界**
	- 武陵源景区  2019-02-08
		- 百龙天梯
		- 天下第一桥
		- 天子山
		- 天子山索道
	- 大峡谷玻璃桥  2019-02-09

***

# 日本

<div id="japan-map-markers" style="width: 600px; height: 400px"></div>

- **广岛**  2018-08-18
	- 锦带桥
	- 严岛神社
	- 广岛城
- **高知**  2018-08-19
	- 竹林寺
	- 高知城

<script>
    $('#world-map-markers').vectorMap({
        map: 'world_mill',
        scaleColors: ['#C8EEFF', '#0071A4'],
        normalizeFunction: 'polynomial',
        hoverOpacity: 0.7,
        hoverColor: false,
        markerStyle: {
            initial: {
                fill: '#F8E23B',
                stroke: '#383f47'
            }
        },
        backgroundColor: '#383f47',
        series: {
            regions: [{
                attribute: 'fill',
                values: {
                "CN": '#C8EEFF',
                "JP": '#C8EEFF'
                },
            },]
        }, 
        markers: [
            {latLng: [29.05, 111.68], name: '常德'},
            {latLng: [28.23, 112.93], name: '长沙'},
            {latLng: [29.37, 113.12], name: '岳阳'},
            {latLng: [31.23, 121.47], name: '上海'},
            {latLng: [31.30, 120.58], name: '苏州'},
            {latLng: [29.88, 121.55], name: '宁波'},
            {latLng: [39.90, 116.40], name: '北京'},
            {latLng: [27.83, 112.93], name: '湘潭'},
            {latLng: [30.28, 120.15], name: '杭州'},
            {latLng: [27.83, 113.13], name: '株洲'},
            {latLng: [29.68, 115.98], name: '庐山'},
            {latLng: [28.32, 109.73], name: '吉首'},
            {latLng: [29.13, 110.47], name: '张家界'},
            {latLng: [34.23, 132.27], name: '广岛'},
            {latLng: [33.34, 133.32], name: '高知'},
        ]
    });
</script>

<script>
    $('#china-map-markers').vectorMap({
        map: 'cn_merc_en',
        scaleColors: ['#C8EEFF', '#0071A4'],
        normalizeFunction: 'polynomial',
        hoverOpacity: 0.7,
        hoverColor: false,
        markerStyle: {
            initial: {
                fill: '#F8E23B',
                stroke: '#383f47'
            }
        },
        backgroundColor: '#383f47',
        series: {
            regions: [{
                attribute: 'fill',
                values: {
                "CN-11": '#C8EEFF',
                "CN-31": '#C8EEFF',
                "CN-32": '#C8EEFF',
                "CN-33": '#C8EEFF',
                "CN-36": '#C8EEFF',
                "CN-43": '#C8EEFF'
                },
            },]
        }, 
        markers: [
            {latLng: [29.05, 111.68], name: '常德'},
            {latLng: [28.23, 112.93], name: '长沙'},
            {latLng: [29.37, 113.12], name: '岳阳'},
            {latLng: [31.23, 121.47], name: '上海'},
            {latLng: [31.30, 120.58], name: '苏州'},
            {latLng: [29.88, 121.55], name: '宁波'},
            {latLng: [39.90, 116.40], name: '北京'},
            {latLng: [27.83, 112.93], name: '湘潭'},
            {latLng: [30.28, 120.15], name: '杭州'},
            {latLng: [27.83, 113.13], name: '株洲'},
            {latLng: [29.68, 115.98], name: '庐山'},
            {latLng: [28.32, 109.73], name: '吉首'},
            {latLng: [29.13, 110.47], name: '张家界'}
        ]
    });
</script>

<script>
	$('#japan-map-markers').vectorMap({
        map: 'jp_merc',
        scaleColors: ['#C8EEFF', '#0071A4'],
        normalizeFunction: 'polynomial',
        hoverOpacity: 0.7,
        hoverColor: false,
        markerStyle: {
            initial: {
                fill: '#F8E23B',
                stroke: '#383f47'
            }
        },
        backgroundColor: '#383f47',
        series: {
            regions: [{
                attribute: 'fill',
                values: {
                "Hiroshima": '#C8EEFF',
                "Kochi": '#C8EEFF'
                },
            },]
        }, 
        markers: [
            {latLng: [34.40, 132.46], name: '广岛'},
            {latLng: [33.56, 133.53], name: '高知'}
        ]
    });
</script>