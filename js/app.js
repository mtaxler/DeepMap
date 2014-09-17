window.onload = function(){

    var pointId = GetURLParameter('id'); //
    var panoramaId = GetURLParameter('pano');
    
	//Create global map variables
    var map, baseLayer;

    //Restrict Bounds
    var southWest = new L.LatLng(46.56028, -92.45956); 
    var northEast = new L.LatLng(46.91322, -91.75335); 
    var restrictBounds = new L.LatLngBounds(southWest, northEast);

	//Terrain Bounds
    var southWestT = new L.LatLng(45.32, -96.81);
    var northEastT = new L.LatLng(49.84, -84.20);
    var terrainBounds = new L.LatLngBounds(southWestT,northEastT);

    //Create map and add the tile layer
    var mapset = new L.LatLng(46.72857, -92.09667);
    var map = new L.Map('mymap', {
        center: mapset,
        maxBounds: restrictBounds,
        attributionControl: true
    });

    var baselayer = new L.tileLayer('http://a.tiles.mapbox.com/v3/ascgis.slremap/{z}/{x}/{y}.png',{
        minZoom: 12,
        maxZoom: 14
    });

    var tilemillLayer = new L.tileLayer('http://a.tiles.mapbox.com/v3/ascgis.slremap/{z}/{x}/{y}.png', {
        minZoom: 12,
        maxZoom: 14
    });

    map.addLayer(baselayer, {minZoom:12, maxZoom:14}).setView(mapset,12);
    var stamen = new L.StamenTileLayer("terrain");
    var stamen2 = new L.StamenTileLayer("watercolor");
    var bing = new L.BingLayer("AtBiwXDnvn5P92TTCJ0lJSIshhf29OdHAqM3Zg-9A0CAun71t8StM3touvMfbRM8");

    $(".baselayer").change(function(){

        if ($(".baselayer:checked").val() == "tilemillLayer") {
            var l = $(".baselayer:checked").val();
            map.removeLayer(baselayer);
            baselayer = tilemillLayer;
            map.addLayer(baselayer);
            map.setMaxBounds(restrictBounds);
        }
        if ($(".baselayer:checked").val() == "stamenTerrain") {
            var l = $(".baselayer:checked").val();
            map.removeLayer(baselayer);
            baselayer = stamen;
            map.addLayer(baselayer);
            map.setMaxBounds(terrainBounds);
        }
        if ($(".baselayer:checked").val() == "bing"){
            var l = $(".baselayer:checked").val();
            map.removeLayer(baselayer);
            baselayer = bing;
            map.addLayer(baselayer);
            map.setMaxBounds(terrainBounds);
        }
        if ($(".baselayer:checked").val() == "stamenWatercolor") {
            var l = $(".baselayer:checked").val();
            map.removeLayer(baselayer);
            baselayer = stamen2;
            map.addLayer(baselayer);
            map.setMaxBounds(terrainBounds);
        }
    });
//STYLE ****** POINT ICONS ******

    var LeafIcon = L.Icon.extend({
        options: {
            shadowUrl: null,
            iconSize: new L.Point(32, 37),
            popupAnchor: new L.Point(-4, -37),
            iconAnchor: [16,37]
        }
    });
    var LeafIconActive = L.Icon.extend({
        options: {
            shadowUrl: 'images/shadow.png',
            iconSize: new L.Point(32, 37),
            popupAnchor: new L.Point(-4, -37),
            iconAnchor: [16,37]
        }
    });

    //----Icons----
    var wildRiceIcon = new LeafIcon({iconUrl:'images/wildrice.png'}),
    shippingIcon = new LeafIcon({iconUrl:'images/shipping.png'}),
    recreationIcon = new LeafIcon({iconUrl:'images/recreation1.png'}),
    fishingIcon = new LeafIcon({iconUrl:'images/fishing2.png'}),
    panoramaIcon = new LeafIcon({iconUrl:'images/panorama.png'}),
    restorationIcon = new LeafIcon({iconUrl:'images/restoration.png'}),
    geoquestIcon = new LeafIcon({iconUrl:'images/geoquest.png'}),
    geocacheIcon = new LeafIcon({iconUrl:'images/geocacheIcon.png'}),
    communityIcon = new LeafIcon({iconUrl:'images/community.png'}),
    activeIcon = new LeafIconActive({iconUrl: 'images/active.png'});

    // var wildRiceIcon = new LeafIcon({iconUrl:'images/wildrice.png'}),
    // shippingIcon = new LeafIcon({iconUrl:'images/shipping.png'}),
    // recreationIcon = new LeafIcon({iconUrl:'images/recreation1.png'}),
    // fishingIcon = new LeafIcon({iconUrl:'images/fishing2.png'}),
    // geoquestIcon = new LeafIcon({iconUrl:'images/geoquest.png'}),
    // geocacheIcon = L.icon({iconUrl:'images/geocacheIcon.png'}),
    // communityIcon = new LeafIcon({iconUrl:'images/community.png'});
    //--------------------------------------------------------------             
    //GeoJSON ****** NERR Boundary Layer ******
    var nerrStyle = {
        color: "blue",
        opacity: 1,
        weight: 2.5
    }
    var nerrLayer;

    function nerrParse(feature, layer){
        layer.on({
            mouseover: nerrHighlight,
            mouseout: nerrReset
        });
    }
    function nerrHighlight(e){

        var layer = nerrLayer;

        layer.setStyle({
            color: "#0086B3",
            opacity: 1,
            weight: 4
        });
    }
    function nerrReset(e) {
        var layer = nerrLayer;

        layer.setStyle({
            color: "blue",
            opacity: 1,
            weight: 2.5
        });
    }
    var nerrLayer = new L.GeoJSON(boundaries, {
        style: nerrStyle,
        onEachFeature: nerrParse
    });
    nerrLayer.on('click', nerrBoundaries);

    //GeoJSON ****** WATERSHED BOUNDARIES LAYER ******

    var watershedStyle = {
        color: "red",
        opacity: 1,
        weight: 2.5

    };
    
    function watershedParse(feature, layer){
        layer.on({
            mouseover: watershedHighlight,
            mouseout: watershedReset
        });
        layer.bindPopup(feature.properties.name);
    }
    function watershedHighlight(e){
        var layer = watershedLayer;
        layer.setStyle({
            color: "#FF7A7A",
            opacity: 1,
            weight: 4
        });
    }

    function watershedReset(e) {
        var layer = watershedLayer;

        layer.setStyle({
            color: "red",
            opacity: 1,
            weight: 2.5
        });
    }

    var watershedLayer = new L.GeoJSON(watershed, {
        style: watershedStyle,
        onEachFeature: watershedParse
    });

    //GeoJSON ****** HEARDING SHORELINE LAYER ******

    var heardingStyle = {
        color: "green",
        opacity: 1,
        weight: 2.5
    }	
    var heardingLayer;

    function heardingParse(feature, layer){
        layer.on({
            mouseover: heardingHighlight,
            mouseout: heardingReset
        });
    }

    function heardingHighlight(e){

        var layer = heardingLayer;

        layer.setStyle({
            color: "#008099",
            weight: 5,
            opacity:1
        });
    }

    function heardingReset(e) {
        var layer = heardingLayer;

        layer.setStyle({
            color: "green",
            opacity: 1,
            weight: 2.5
        });
    }
    var heardingLayer = new L.GeoJSON(hearding, {
        style: heardingStyle,
        onEachFeature: heardingParse
    });

    heardingLayer.on('click', heardingShoreline);

    //--------------------------------------------------------------             
    
    //GeoJSON ****** BATHYMETRY LAYER ******
    //Bathymetry icons
    var bathIcon1 = {
        radius: 5,
     	fillColor: "#ECE7F2",
     	color: "#000",
     	weight: 1,
     	stroke: false,
     	opacity: 1,
     	fillOpacity: 0.8
    };

    var bathIcon2 = {
     	radius: 5,
     	fillColor: "#A6BDDB",
     	color: "#000",
     	weight: 1,
     	stroke: false,
     	opacity: 1,
     	fillOpacity: 0.8
    };

    var bathIcon3 = {
        radius: 5,
        fillColor: "#2B8CBE",
        color: "#000",
        weight: 1,
        stroke: false,
        opacity: 1,
        fillOpacity: 0.8
    };

    var bathHighlight = {
        radius: 6,
        fillColor: "#FF0000",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    var monitoringIcon = {
        radius:8,
        fillColor: "red",
        color: "#000",
        weight: 1,
        opacity:1,
        fillOpacity:0.7
    };	


    //--------------------------------------------------------------
    ////create layer, attach style////

    function bathParse(feature, layer) {
    	var depth = feature.properties.DEPTH;
    	var popupContent = "<p id = 'bathpopups'><strong>Depth:</strong> " + depth + " meters </p>";
    	if (feature.properties && feature.properties.popupContent) {
    		popupContent += feature.properties.popupContent;
    	}
    	layer.bindLabel(popupContent);
    }

    var bathymetryLayer1 = new L.GeoJSON(bath1, {
    	onEachFeature: bathParse,
    	pointToLayer: function (feature, latlng) {
    		return L.circleMarker(latlng, bathIcon1);
    	}
    });

    var bathymetryLayer2 = new L.GeoJSON(bath2, {
    	onEachFeature: bathParse,
    	pointToLayer: function (feature, latlng) {
    		return L.circleMarker(latlng, bathIcon2);
    	}
    });

    var bathymetryLayer3 = new L.GeoJSON(bath3, {
    	onEachFeature: bathParse,
    	pointToLayer: function (feature, latlng) {
    		return L.circleMarker(latlng, bathIcon3);
    	}
    });

    function highlightFeature(e) {
        var layer = e.target;
        layer.setStyle({
            radius:10,
            fillColor: "red",
            color: "#FFF",
            weight: 3,
            opacity:1,
            fillOpacity:0.9
        });
        if (!L.Browser.ie && !L.Browser.opera) {
          layer.bringToFront();
        }
    }
    //GeoJSON - CARTODB ****** GEOCACHE LAYER ******

    var geoquestLayer = new L.LayerGroup().addTo(map);

    $.getJSON('http://slregeocaches.cartodb.com/api/v2/sql?format=GeoJSON&q=SELECT * FROM geocaches', function(data) {
            for (var i = 0; i < data.features.length ; i++) {
                var geometry = data.features[i].geometry;
                var props = data.features[i].properties;
                addcachemarker(geometry,props);
            }
    });

    
    function addcachemarker(geo, prop){
        
        var lon = geo.coordinates[0];
        var lat = geo.coordinates[1];
        var clicklink = '<br><br>Click the link above for more instructions on finding this geocache...';
        var photolink = "";
        var photoContent;


        if (prop.photolink){
            photolink = prop.photolink;
            photoContent = "<a href = '" + prop.cachelink + "' target='_blank'><img style = 'float:left;margin:10px;margin-bottom=30px' height='75px' src='" + photolink + "'></a>";
        } else {
            photoContent = '';

        }
        var contentString = "<a href = '" + prop.cachelink + "' target='_blank'><strong>" + prop.name + "</strong></a><br>" + photoContent +"<i>" + prop.description + "</i>";
        contentString += clicklink;
        var layer = new L.marker([lat,lon], {icon: geocacheIcon})
            .bindPopup(contentString)
            .on('click',function(e){
                resetMarkers();
                e.target.setIcon(activeIcon);
                map.panTo(e.latlng);
                $('#sidebar').html(e.target._popup._content)
            })
            .addTo(geoquestLayer);
    }

    //GeoJSON ****** MONITORING LAYER ******
    var monitoringLayer;
    function resetHighlight(e) {
        var layer = e.target;
        layer.setStyle({
            radius:8,
            fillColor: "red",
            color: "#000",
            weight: 1,
            opacity:1,
            fillOpacity:0.7		    
        });
    }

    //----------------------------------------
    function monitoringParse(feature, layer) {
        var url = feature.properties.url;
        var site = feature.properties.site;
        if (url == 'TBD'){
            popupContent = "<p> No data currently available. Stay tuned!</p>";
        } else {
            popupContent = "<p id = 'bathpopups'><strong>Site: </strong> " + site + "<br>" + "<a href =\'" + url + "\' target='_blank'>view current data</a></p>";
        }
        if (feature.properties && feature.properties.popupContent) {
            popupContent += feature.properties.popupContent;
        }
        layer.bindPopup(popupContent);
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: monitoringSidebar
        });
    }

    var monitoringLayer = new L.GeoJSON(monitoring, {
        onEachFeature: monitoringParse,
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, monitoringIcon);
        }
    });	

    function monitoringSidebar(e){
        var popup = e.target._popup._content;
        var text = "<div id='textDiscription'>Click links in monitoring site popups to access the real-time data or choose from the links below.  Be sure to enable java in order to view the data.<div id ='monitorSymbol'><img style = 'margin-right: 7px' src='images/monitoringsites.gif'><i>Monitoring Buoy Locations</i></div></br></br><strong>LakeSuperiorStreams.org: </strong><a href = \'http://www.lakesuperiorstreams.org/streams/data/Java/SMUplotter.html\' target='_blank'>2012 Data</a></br><strong>LakeSuperiorStreams.org:  </strong><a href = \'http://www.lakesuperiorstreams.org/streams/data/Java/index.html\' target='_blank'>All data</a><br></div>";
        var title = "<div id='sidebarTitle'>Monitoring Sites & Data</div>";
        var media = "<div id='mediaSlot'><a href ='images/lakesuperiorstreamsL.png' class='top_up'><img src='images/lakesuperiorstreams.png' class = 'image'/></a></div>";
        var content = title + popup + media + text;
        $('#sidebar').html(content);
    }			   
    //--------------------------------------------------------------                        
    function resetMarkers(){
         // geoquestLayer.eachLayer(function(layer){
         //    layer.setIcon(geoquestIcon);
         // });
         wildRiceLayer.eachLayer(function(layer){
            layer.setIcon(wildRiceIcon);
         });

         shippingLayer.eachLayer(function(layer){
            layer.setIcon(shippingIcon);
         });
         recreationLayer.eachLayer(function(layer){
            layer.setIcon(recreationIcon);
         });
         fishingLayer.eachLayer(function(layer){
            layer.setIcon(fishingIcon);
         });
         panoramaLayer.eachLayer(function(layer){
            layer.setIcon(panoramaIcon);
         });
         restorationLayer.eachLayer(function(layer){
            layer.setIcon(restorationIcon);
         });
         communityLayer.eachLayer(function(layer){
            layer.setIcon(communityIcon);
         });

         geoquestLayer.eachLayer(function(layer){
            if (layer._icon.alt == 'geoquest'){
                layer.setIcon(geoquestIcon);
            } else {
                layer.setIcon(geocacheIcon);
            }
         });
        panoramaLayer.eachLayer(function(layer){
            layer.setIcon(panoramaIcon);
        });

    }
    //GeoJSON ****** GEOQUEST LAYER ******
    p15 = new L.Marker(new L.LatLng(46.75303, -92.09856), {icon: geoquestIcon, alt : 'geoquest', riseOnHover: true})
        .bindPopup("<a href = 'http://maps.aqua.wisc.edu/storymaps/upriverquest/' target='_blank'><strong>Up River: Rice\'s Point Geoquest Site<strong/></a>")
        .on('click',function(e){
            resetMarkers();
            e.target.setIcon(activeIcon);
            map.panTo(e.latlng);
            $('#sidebar').html(e.target._popup._content)
        });

    p16 = new L.Marker(new L.LatLng(46.78073, -92.0953), {icon: geoquestIcon, alt : 'geoquest', riseOnHover: true})
        .bindPopup("<a href = 'http://maps.aqua.wisc.edu/storymaps/upriverquest/' target='_blank'><strong>Up River: The Lakewalk Geoquest Site<strong/></a>")
        .on('click',function(e){
            resetMarkers();
            e.target.setIcon(activeIcon);
            map.panTo(e.latlng);
            $('#sidebar').html(e.target._popup._content)
        });

    p17 = new L.Marker(new L.LatLng(46.7281, -92.1589), {icon: geoquestIcon, alt : 'geoquest', riseOnHover: true})
        .bindPopup("<a href = 'http://maps.aqua.wisc.edu/storymaps/upriverquest/' target='_blank'><strong>Up River: Grassy Point Geoquest Site<strong/></a>")
        .on('click',function(e){
            resetMarkers();
            e.target.setIcon(activeIcon);
            map.panTo(e.latlng);
            $('#sidebar').html(e.target._popup._content)
        });

    p18 = new L.Marker(new L.LatLng(46.72227, -92.06251), {icon: geoquestIcon, alt : 'geoquest', riseOnHover: true})
        .bindPopup("<a href = 'http://maps.aqua.wisc.edu/storymaps/barkersislandquest/' target='_blank'><strong>Barker\'s Island Geoquest Overview<strong/></a>")
        .on('click',function(e){
            resetMarkers();
            e.target.setIcon(activeIcon);
            map.panTo(e.latlng);
            $('#sidebar').html(e.target._popup._content)
        });

    //--------------------Fishing Layer Group------------------------  
    var fishingLayer = new L.LayerGroup();
    map.addLayer(fishingLayer);
    //-------------------Recreation Layer Group-------------------------             
    var recreationLayer = new L.LayerGroup();
    map.addLayer(recreationLayer);
    //------------------Wild Rice Layer Group-------------------------------               
    var wildRiceLayer = new L.LayerGroup();
    map.addLayer(wildRiceLayer);
    //----------------Shipping Layer Group-------------------------------              
    var shippingLayer = new L.LayerGroup();
    map.addLayer(shippingLayer);
    //----------------Community Layer Group------------------------------- 
    var communityLayer = new L.LayerGroup();
    map.addLayer(communityLayer);
    var restorationLayer = new L.LayerGroup();
    map.addLayer(restorationLayer);

    var hash = new L.hash(map);
    //----------------Panorama Layer Group---------------------------               
    var panoramaLayer = new L.LayerGroup();

    map.addLayer(panoramaLayer);
    var panoramaIcon = new LeafIcon({iconUrl:'images/panorama.png'});
    addPanoramas();
    function addPanoramas(){
        for (var i = panoramas.features.length - 1; i >= 0; i--) {
            var coords = [panoramas.features[i].geometry.coordinates[1],panoramas.features[i].geometry.coordinates[0]];
            var properties = panoramas.features[i].properties;
            var title = '<div id="sidebarTitle">' + properties.name + '</div>'; 
            //var photo = '<div id = "mediaSlot"><a href ="images/' + properties.imagelarge + '" class="top_up"><img  src="images/' + properties.imagesmall + '" class = "image"/></a></div>';//"<div id = 'mediaSlot'></div>" //mediaSlot - id
            var description = '<p id="textDiscription">Click the link the view a panorama of this location:</p>';
            var siteLink = '<p><a href="' + properties.url + '" target="_blank">Panorama</a></p>';

            var sidebarContent = title + description + siteLink;

            var pointAttr = false;
            if (panoramaId){
                if (panoramaId == properties.pano){
                    pointAttr = true;
                    $('#sidebar').html(sidebarContent);
                    map.panTo([properties.lat,properties.lng]);
                }
            }

            if (pointAttr){
                theIcon = activeIcon;
            } else {
                theIcon = panoramaIcon;
            }


            var marker = new L.Marker(coords,{icon: theIcon, riseOnHover: true})
                .bindPopup(sidebarContent)
                .on('click',function(e){
                    resetMarkers();
                    e.target.setIcon(activeIcon);
                    map.panTo(e.latlng);
                    $('#sidebar').html(e.target._popup._content)
                })
                .addTo(panoramaLayer);


        }
    }
    //------------------Geoquest Layer Group-----------------------------               

    geoquestLayer.addLayer(p15);
    geoquestLayer.addLayer(p16);
    geoquestLayer.addLayer(p17);
    geoquestLayer.addLayer(p18);
    //map.addLayer(geoquestLayer);
    //-------------------Bathymetry Layer Group------------------------------               
    var bathymetryGroup = new L.LayerGroup();
    bathymetryGroup.addLayer(bathymetryLayer1);
    bathymetryGroup.addLayer(bathymetryLayer2);
    bathymetryGroup.addLayer(bathymetryLayer3);

    


    //GeoJSON ****** STORY POINTS LAYERS ******
    addPoints();
    function addPoints(){
        var relLinkPath = '../';
        for (var i = mapPoints.features.length - 1; i >= 0; i--) {
            var coords = [mapPoints.features[i].geometry.coordinates[1],mapPoints.features[i].geometry.coordinates[0]];
            var properties = mapPoints.features[i].properties;
            var category = properties.category;
            var linkDescription = properties.externallinkdescription;
            var restorationDates = '<h4>' + properties.restorationDates + '</h4><br>';
            var restorationTimeline = '<p><a href="' + properties.timelineLink + '" target="_blank">Restoration timeline</a></p>';



            var siteLink, externalLink;

            if (properties.storylink){
                var link = properties.storylink;
                var siteLink = '<p><a href="' + relLinkPath + link + '" target="_blank">Read more...</a></p>';
            } else {
                siteLink = "";
            }

            if (properties.externallink){
                externalLink = '<p><a href="' + properties.externallink + '" target="_blank">' + linkDescription + '</a></p>';
            } else {
                externalLink = "";
            }
            var title = '<div id="sidebarTitle">' + properties.title + '</div>'; 
            var photo = '<div id = "mediaSlot"><a href ="images/' + properties.imagelarge + '" class="top_up"><img style="width: 250px" src="images/' + properties.imagesmall + '" class = "image"/></a></div>';//"<div id = 'mediaSlot'></div>" //mediaSlot - id
            var description = '<p id="textDiscription">'+ properties.description + '</p>';
            var id = properties.id;

            if (category == 'restoration'){
                //var sidebarContent = title + photo + restorationDates + description + siteLink + externalLink + restorationTimeline;
                var sidebarContent = title + photo + restorationDates + description + siteLink + externalLink;
            } else {
                var sidebarContent = title + photo + description + siteLink + externalLink;
            }
            
            var pointAttr = false;
            if (pointId){
                if (pointId == properties.id){
                    pointAttr = true;
                    $('#sidebar').html(sidebarContent);
                    map.panTo([properties.lat,properties.lng]);
                }
            }
            

            var pointType;
            var icon;


            switch (category){
                case "fishing":
                    var theIcon;
                    if (pointAttr){
                        theIcon = activeIcon;
                    } else {
                        theIcon = fishingIcon;
                    }
                    
                    var marker = new L.Marker(coords,{icon: theIcon, riseOnHover: true})
                        .bindPopup(sidebarContent)
                        .on('click',function(e){
                            resetMarkers();
                            
                            e.target.setIcon(activeIcon);
                            map.panTo(e.latlng);
                            $('#sidebar').html(e.target._popup._content)
                        })
                        .addTo(fishingLayer);
                    break;
                case "recreation":
                    var theIcon;
                    if (pointAttr){
                        theIcon = activeIcon;
                    } else {
                        theIcon = recreationIcon;
                    }
                    var marker = new L.Marker(coords,{icon: theIcon, riseOnHover: true})
                        .bindPopup(sidebarContent)
                        .on('click',function(e){
                            resetMarkers();
                            e.target.setIcon(activeIcon);
                            map.panTo(e.latlng);
                            $('#sidebar').html(e.target._popup._content)
                        })
                        .addTo(recreationLayer);
                    break;
                case "community":
                    var theIcon;
                    if (pointAttr){
                        theIcon = activeIcon;
                    } else {
                        theIcon = communityIcon;
                    }
                    var marker = new L.Marker(coords,{icon: theIcon, riseOnHover: true})
                        .bindPopup(sidebarContent)
                        .on('click',function(e){
                            resetMarkers();
                            e.target.setIcon(activeIcon);
                            map.panTo(e.latlng);
                            $('#sidebar').html(e.target._popup._content)
                        })
                        .addTo(communityLayer);
                    break;
                case "ricing":
                    var theIcon;
                    if (pointAttr){
                        theIcon = activeIcon;
                    } else {
                        theIcon = wildRiceIcon;
                    }
                    var marker = new L.Marker(coords,{icon: theIcon, riseOnHover: true})
                        .bindPopup(sidebarContent)
                        .on('click',function(e){
                            resetMarkers();
                            e.target.setIcon(activeIcon);
                            map.panTo(e.latlng);
                            $('#sidebar').html(e.target._popup._content)
                        })
                        .addTo(wildRiceLayer);
                    break;
                case "shipping":
                    var theIcon;
                    if (pointAttr){
                        theIcon = activeIcon;
                    } else {
                        theIcon = shippingIcon;
                    }
                    var marker = new L.Marker(coords,{icon: theIcon, riseOnHover: true})
                        .bindPopup(sidebarContent)
                        .on('click',function(e){
                            resetMarkers();
                            e.target.setIcon(activeIcon);
                            map.panTo(e.latlng);
                            $('#sidebar').html(e.target._popup._content)
                        })
                        .addTo(shippingLayer);
                    break;
                case "restoration":
                    var theIcon;
                    if (pointAttr){
                        theIcon = activeIcon;
                    } else {
                        theIcon = restorationIcon;
                    }
                    var marker = new L.Marker(coords,{icon: theIcon, riseOnHover: true})
                        .bindPopup(sidebarContent)
                        .on('click',function(e){
                            resetMarkers();
                            e.target.setIcon(activeIcon);
                            map.panTo(e.latlng);
                            $('#sidebar').html(e.target._popup._content)
                        })
                        .addTo(restorationLayer);
                    break;
            }
        }
    }
    function makeMarker(content, type){
        var marker = new L.Marker(coords)
        .bindPopup(content)
        .on('click',function(e){
            $('#sidebar').html(e.target._popup._content)
        })
        .addTo(map);
    }

    //LEGEND ****** OVERLAYS ******		

    $(".maplayer").click(function(){

        var layers = {
            'recreationLayer':recreationLayer,
            'fishingLayer':fishingLayer,
            'shippingLayer':shippingLayer,
            'communityLayer':communityLayer,
            'wildRiceLayer':wildRiceLayer,
            'geoquestLayer':geoquestLayer,
    	    'panoramaLayer':panoramaLayer,
            'heardingLayer':heardingLayer,
            'bathymetryGroup':bathymetryGroup,
            'monitoringLayer':monitoringLayer,
            'nerrLayer':nerrLayer,
            'watershedLayer':watershedLayer
        }
        if (this.checked ==false){
        	var activeLayer = layers[this.value];
        	map.removeLayer(activeLayer);
        }
        if (this.checked ==true){
        	var activeLayer = layers[this.value];
        	map.addLayer(activeLayer);
        }
    });
}

//Helper Functions

function toggleDiv(divId,divId1) {
    $("#"+divId).fadeToggle('slow');
}

function setVisibility(id) {
    if(document.getElementById('bt1').value=='Hide Legend'){
        document.getElementById('bt1').value = 'Show Legend';
        document.getElementById('legendContents').style.display = 'none';
        document.getElementById(id).style.height = '35px';
        document.getElementById(id).style.width = '79px';
    } else {
        document.getElementById('bt1').value = 'Hide Legend';
        document.getElementById('legendContents').style.display = 'inline';
        document.getElementById(id).style.height = '493px';
        document.getElementById(id).style.width = '227px';
    }
}

function GetURLParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++){
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam){
            return sParameterName[1];
        }
    }
}

