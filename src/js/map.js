
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
