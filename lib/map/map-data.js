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
