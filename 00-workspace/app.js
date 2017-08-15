// SET UP THE MAP 
2 
 
3 var mapProjection = new ol.proj.Projection({ 
4   code: 'EPSG:3857', 
5   extent: [-20037508, -20037508, 20037508, 20037508.34] 
6 }) 
7 var geoProjection = new ol.proj.Projection({ 
8   code: 'EPSG:4326', 
9   extent: [-180, -180, 180, 180] 
10 }) 
11 
 
12 var map = new ol.Map({ 
13   layers:[ 
14     new ol.layer.Tile({ 
15       source: new ol.source.XYZ({ 
16         url: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2lsbC1icmVpdGtyZXV0eiIsImEiOiItMTJGWEF3In0.HEvuRMMVxBVR5-oDYvudxw' 
17       }) 
18     }) 
19   ], 
20   target: 'map', 
21   view: new ol.View({ 
22     center: ol.proj.transform([-96, 39], geoProjection, mapProjection), 
23     zoom: 5 
24   }) 
25 }); 
26 
 
27 // SETUP APPLICATION LOGIC HERE 
28 
 
29 var app = { 
30   mapzenKey: 'mapzen-CpAANqF',  
31   activeSearch: 'from', 
32   options: [], 
33   selection: { 
34     from: {}, 
35     to: {} 
36   }, 
37 
 
38   typeAhead: function(e){ 
39     var el = e.target; 
40     var val = el.value; 
41     if(val.length > 2){ 
42       app.queryAutocomplete(val, function(err, data){ 
43         if(err) return console.log(err); 
44         if(data.features) app.options = data.features; 
45         app.renderResultsList(); 
46       }) 
47     }else{ 
48       app.clearList(); 
49     } 
50   }, 
51 
 
52   queryAutocomplete: throttle(function(text, callback){ 
53     $.ajax({ 
54       url: 'https://search.mapzen.com/v1/autocomplete?text=' + text + '&api_key=' + app.mapzenKey,  
55       success: function(data, status, req){ 
56         callback(null, data); 
57       }, 
58       error: function(req, status, err){ 
59         callback(err) 
60       } 
61     }) 
62   }, 150), 
63 
 
64   renderResultsList: function(){ 
65     var resultsList = $('#results-list'); 
66     resultsList.empty(); 
67 
 
68     var results = app.options.map(function(feature){ 
69       var li = $('<li class="results-list-item">' + feature.properties.label + '</li>'); 
70       li.on('click', function(){ 
71         app.selectItem(feature); 
72       }) 
73       return li; 
74     }) 
75 
 
76     resultsList.append(results); 
77 
 
78     if(app.options.length > 0){ 
79       resultsList.removeClass('hidden'); 
80     }else{ 
81       resultsList.addClass('hidden'); 
82     } 
83   }, 
84 
 
85   selectItem: function(feature){ 
86     app.selection[app.activeSearch] = feature; 
87     var elId = '#search-' + app.activeSearch + '-input'; 
88     $(elId).val(feature.properties.label); 
89     app.clearList(); 
90   }, 
91 
 
92   clearList: function(e){ 
93     app.options = []; 
94     app.renderResultsList(); 
95   }, 
96 
 
97   clearSearch: function(e){ 
98     var elId = '#search-' + e.data.input + '-input'; 
99     $(elId).val('').trigger('keyup'); 
100     app.selection[e.data.input] = {}; 
101   } 
102 
 
103 } 
104 
 
105 // SETUP EVENT BINDING HERE 
106 
 
107 $('#search-from-input').on('keyup', {input:'from'}, app.typeAhead); 
108 $('#clear-from-search').on('click', {input:'from'}, app.clearSearch); 
