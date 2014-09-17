<!DOCTYPE html>
<html>
<head>
	<title>St. Louis River Estuary Deep Map</title>
    <script type="text/javascript" src="http://cdn.leafletjs.com/leaflet-0.7.1/leaflet.js"></script>
    <script src="http://maps.google.com/maps/api/js?v=3.2&sensor=false"></script>
    <script type="text/javascript" src="js/layer/tile/Bing.js"></script>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
    <script type="text/javascript" src="js/leaflet-hash.js"></script>
    <script type="text/javascript" src="js/leaflet.label.js"></script>
    <script type='text/javascript' src='js/htmlswitch.js'></script>
    <link rel='stylesheet' href='css/webmapstylesheet1.css'/>
    <link rel="stylesheet" type="text/css" href="css/leaflet.css">
    <link rel="stylesheet" type="text/css" href="css/leaflet.label.css">
    <!--[if lte IE 8]>
    <link rel="stylesheet" href="css/leaflet.ie.css" />
    <![endif]-->
    <script type="text/javascript" src="js/maplayers/points.js"></script>
    <script type="text/javascript" src="js/maplayers/hearding.js"></script>
    <script type="text/javascript" src="js/maplayers/watershed2.js"></script>
    <script type="text/javascript" src="js/maplayers/boundaries.js"></script>
    <script type="text/javascript" src="js/maplayers/bath1.js"></script>
    <script type="text/javascript" src="js/maplayers/bath2.js"></script>
    <script type="text/javascript" src="js/maplayers/bath3.js"></script>
    <script type="text/javascript" src="js/maplayers/monitoring.js"></script>
    <script type="text/javascript" src="js/maplayers/panoramas.js"></script>
    <script type="text/javascript" src="http://maps.stamen.com/js/tile.stamen.js"></script>
    <script type="text/javascript" src="js/app.js"></script>
</head>
<body>
	<div id ="divHeader">
		<a href="http://stlouisriverestuary.org" style="font-size: 60px;" class="headerLink"><h1>St. Louis River Deep Map</h1></a>
		<div class="navHome">
			<a href="javascript:toggleDiv('sidebar');" style="margin-left: 50px;">Show/Hide-Sidebar</a>
		</div>
	</div>
    	<div id="divSectionNav">
           <ul>
               <li><a href="../stories.php">stories and science</a></li>
               <li><a href="../geoquests/geoquests.php" >geoquests</a></li>
               <li><a href="map.php" class="current">deep map</a></li>
               <li><a href="../science/science.php" >science in detail</a></li>
               <li class="last"><a href="http://stlouisriverestuary.org/">home</a></li>
           </ul>
        </div>
    </div>
    <div id="legend">
    	<input style="margin-top:10px" type= button name= type id='bt1' class="input" value='Hide Legend' onclick="setVisibility('legend','footer');"><br>
    	<div id="legendContents">
    		<strong>Base Maps:</strong><br>
            <input type="radio" id="styled" name="baselayer" class="baselayer" value="tilemillLayer" checked/><label for="styled"></label>Styled map</br>
            <input type="radio" id="styled" name="baselayer" class="baselayer" value="stamenTerrain"/><label for="styled"></label>Streets</br>
            <input type="radio" id="styled" name="baselayer" class="baselayer" value="bing" /><label for="bing"></label>Satellite</br>
            <input type="radio" id="styled" name="baselayer" class="baselayer" value="stamenWatercolor" /><label for="stamenWatercolor"></label>Watercolor</br><hr id="hrLegend">
            <strong>Story Layers:</strong><br>
            <input type="checkbox" name="maplayer" class="maplayer" value="fishingLayer" checked/> Fishing <img src ="images/fishing2.png"><br>
            <input type="checkbox" name="maplayer" class="maplayer" value="shippingLayer" checked/> Shipping <img src ="images/shipping.png"><br>
            <input type="checkbox" name="maplayer" class="maplayer" value="wildRiceLayer" checked/> Wild Rice <img src ="images/wildrice.png"><br>
            <input type="checkbox" name="maplayer" class="maplayer" value="communityLayer" checked/> Community <img src ="images/community.png"><br>
            <input type="checkbox" name="maplayer" class="maplayer" value="recreationLayer" checked/> Recreation <img src ="images/recreation1.png"><br>
            <input type="checkbox" name="maplayer" class="maplayer" value="restorationLayer" checked/> Restoration <img src ="images/restoration.png">
        </br>
        <hr>
        <strong>Place-based learning:</strong>
        <br>
        <input type="checkbox" name="maplayer" class="maplayer" value="geoquestLayer" checked/> Geocaches/Geoquests <img src ="images/geocacheIcon.png"><img src ="images/geoquest.png"><br><hr>
        <strong>Data Layers:</strong>
    		<br>
            <input type="checkbox" name="maplayer" class="maplayer" value="panoramaLayer" checked/> Panoramas <img src ="images/panorama.png">
            <br>
            <input type="checkbox" name="maplayer" class="maplayer" value="heardingLayer" /> 1861 Shoreline<br>
            <input type="checkbox" name="maplayer" class="maplayer" value="bathymetryGroup" /> Estuary Bathymetry<br>
            <input type="checkbox" name="maplayer" class="maplayer" value="monitoringLayer" /> Water Quality Monitoring<br>
            <input type="checkbox" name="maplayer" class="maplayer" value="nerrLayer" /> NERR Boundaries<br>
            <input type="checkbox" name="maplayer" class="maplayer" value="watershedLayer" /> Watershed
        </div>
    </div>
    <div id='mymap'></div>
    <div id='sidebar'>
    	<div id= 'sidebarTitle'><h1><img alt = 'A deep map of the st. louis river estuary' id = 'logo' src = 'images/DeepMapLogo.png'></h1></div>
    	<div id = "mediaSlot">
    		<a href ='images/startImageL.jpg' class='top_up'><img src="images/startImage.png" class = 'image'/></a>
    	</div>
    	<p id="textDiscription">"A deep map allows one to dig DEEP into a place by uncovering its history, arts, ecology, issues, and people, as if it were a container of wisdom with no bottom.  As William Least Heat-Moon described, 'It is an acknowledgement of the vastness of a mind's capacity for knowledge about a place.' - PrairyErth: A Deep Map, Boston: Houghton-Mifflin, 1991."<br><br>Filter points using the layer selector in the upper right and click on "map points" to explore this map of the St. Louis River Estuary.</p>
    </div>
    <div id="footer">St. Louis River Estuary Deep Map: Version 2.0</div>
</body>
</html>
