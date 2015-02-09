
/****************************
          Map.js
    Initialize and Handle Map Interactions
 ****************************/


// Save the Raw Data.
// Since we'll be manipulating, and filtering our
// data set, we'll want to keep and original copy
// as to avoid re-fetching ALL our data when we
// reset filters.
// var raw_data = null;

// Save the Filtered Data.
// This is whatever data is currently being plotted.
// var filtered_data = null;

// Global variable for map object
var leaflet_map = null;

// Initialize map and plot data
function draw() {

  // Initialize Leaflet map
  leaflet_map = L.mapbox.map('map', options.map_key).fitBounds(options.viewport);

  // Render Data Layers
  addLayers();
}

// Iterate through, and place layers onto Leaflet map
function addLayers(){

    // Clear map just to be safe
    d3.select('#overlay').remove();

	for (var i = options.layers.length - 1; i >= 0; i--) {
		var layer = options.layers[i];
		
		if (layer.type == "scatterplot"){
			drawScatterplot(leaflet_map,layer);
		}

		if (layer.type == "path"){
			leaflet_map.addLayer(drawPath(leaflet_map,layer));
		}

		if (layer.type == "heatmap"){
			leaflet_map.addLayer(drawHeatmap(leaflet_map,layer));
		}

    if (layer.type == "hex"){
      drawHexmap(leaflet_map,layer);
    }
	};

}

function drawScatterplot(map, layer){
	
	// Render Layer
	drawPoints(leaflet_map, layer);
};

function drawPath(map, layer){
	// Enable path
	layer.options.pathing = true;

	// Render Layer
	drawPoints(leaflet_map, layer);
};

// WebGL Heatmap Implementation:
// https://github.com/ursudio/webgl-heatmap-leaflet
// Returns a leaflet layer
function drawHeatmap(map, layer){
	
	var heatmap = new L.TileLayer.WebGLHeatMap({ 
    	size: 500,
    	autoresize: false,
    	opacity: .5,
  	});

	var dataPoints = [];

	for (var i = layer.data.length - 1; i >= 0; i--) {
		var point = layer.data[i]
		dataPoints.push([point.latitude, point.longitude, point.value / 40000]);
	};

	heatmap.setData(dataPoints);

	return heatmap;
}

function drawHexmap(map, layer){

    // Options for the hexbin layer
    var hexSettings = {
        radius : 10,                            // Size of the hexagons/bins
        opacity: 0.5,                           // Opacity of the hexagonal layer
        duration: 200,                          // millisecond duration of d3 transitions (see note below)
        lng: function(d){ return d[0]; },       // longitude accessor
        lat: function(d){ return d[1]; },       // latitude accessor
        value: function(d){ return d.length; }, // value accessor - derives the bin value
        valueFloor: 0,                          // override the color scale domain low value
        valueCeil: undefined,                   // override the color scale domain high value
        colorRange: ['#f7fbff', '#08306b']      // default color range for the heat map
    };

    // Create the hexbin layer and add it to the map
    var hexLayer = L.hexbinLayer(hexSettings).addTo(map);

    // Optionally, access the d3 color scale directly
    // Can also set scale via hexLayer.colorScale(d3.scale.linear()...)
    hexLayer.colorScale().range('white', 'blue');

  var center = [42.329077, -71.108871];

    var latFn = d3.random.normal(center[0], 1);
    var longFn = d3.random.normal(center[1], 1);

      var data = [];
      for(i=0; i<1000; i++){
        data.push([longFn(),  latFn(), Math.random()]);
      
    }
    // Set the data (can be set multiple times)
    hexLayer.data(data);
}

  // @TODO:
  // Like, write this function

// Apply updated data set
// Called by Date Range Picker
function updateMap() {

  // Clear map
  leaflet_map.remove();

  draw();

}

/******************************
      Graphing w/ D3.js
 ******************************/

// Use D3.js to place geo points on the leaflet map
drawPoints = function(map, layer, callback) {
  
  // Take out points for easy access 
  var points = layer.data;

  // Last point user selected
  // var lastSelectedPoint;

  var mapLayer = {
    onAdd: function(map) {
      map.on('viewreset moveend', drawWithLoading);
      drawWithLoading();
    }
  }

  map.on('ready', function() {
      map.addLayer(mapLayer);
  })
  
  // Draw points into Map
  var drawWithLoading = function(e){
    d3.select('#loading').classed('visible', true);

    // Clear map
    if (e && e.type == 'viewreset') {
      d3.select('#overlay').remove();
    }

    setTimeout(function(){
      plot();

      d3.select('#loading').classed('visible', false);
    }, 0);
  }

  var plot = function() {

    // Clear map just to be safe
    d3.select('#overlay').remove();

    var bounds = map.getBounds(),
        topLeft = map.latLngToLayerPoint(bounds.getNorthWest()),
        bottomRight = map.latLngToLayerPoint(bounds.getSouthEast()),
        existing = d3.set(),
        drawLimit = bounds.pad(0.4);

    // Create map-able set of points
    points = points.filter(function(d) {
      var latlng = new L.LatLng(d.latitude, d.longitude);

      // Remove points that are missing a GPS location
      if (!drawLimit.contains(latlng)) { return false };

      // Convert Lat & Long into a Mapable point.
      var point = map.latLngToLayerPoint(latlng);

      key = point.toString();

      // Prevent duplicate keys
      if (existing.has(key)) { return false };

      existing.add(key);

      d.lat = point.x;
      d.long = point.y;

      return true;
    });

    var svg = d3.select(map.getPanes().overlayPane).append("svg")
      .attr('id', 'overlay')
      .attr("class", "leaflet-zoom-hide")
      .style("width",  map.getSize().x + 'px')
      .style("height", map.getSize().y + 'px')
      .style("margin-left",  topLeft.x + "px")
      .style("margin-top",   topLeft.y + "px");

    var g = svg.append("g")
      .attr("transform", "translate(" + (-topLeft.x) + "," + (-topLeft.y) + ")")
      .attr("pointer-events", "all");

    var svgPoints = g.attr("class", "points")
      .selectAll("g")
      .data(points)
      .enter().append("g")
      .attr("class", "point")
      .style("z-index", 999);

    svgPoints.append("path")
      .attr("class", "point-cell")

      // On Click - mark as selected
      // .on('click', function(d){ console.log(d) })
      // .classed("selected", function(d) { return lastSelectedPoint == d} );
    
    // Add circles for each point
    svgPoints.append("circle")
      .attr("transform", function(d) { return "translate(" + d.lat + "," + d.long + ")"; })
      .style('fill', function(d) { return '#' + d.color } )
      .attr("date", function(d) { return d.date })
      .attr("r", layer.dot_width)
      .attr("pointer-events", "all")
      .attr("opacity", 1);

    if (layer.pathing){
      showConnections();
    }

    // Connects all sequential location points into 
    // a single path.
    function showConnections(){
      
      // Draw point-to-point connections
      svgPoints.each(function(){
        if($(this).next().length == 1){
          var this_transform = $(this).children("circle").attr("transform"),
              next_transform = $(this).next().children("circle").attr("transform"),
              this_position = this_transform.substring(10, this_transform.length - 1).split(","),
              next_position = next_transform.substring(10, next_transform.length - 1).split(",");

          d3.select(this).append("line")
            .attr("x1", this_position[0])
            .attr("y1", this_position[1])
            .attr("x2", next_position[0])
            .attr("y2", next_position[1])
            .style("stroke", "rgb(255,0,0)")
            .style("stroke-width", layer.dot_width)
            .style("opacity", 0);
        }
      });
    }
  }
}
