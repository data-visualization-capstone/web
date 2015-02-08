
/****************************
          Map.js
    Initialize and Handle Map Interactions
 ****************************/


// Save the Raw Data.
// Since we'll be manipulating, and filtering our
// data set, we'll want to keep and original copy
// as to avoid re-fetching ALL our data when we
// reset filters.

var raw_data = null;

// Save the Filtered Data.
// This is whatever data is currently being plotted.
var filtered_data = null;

// Global variable for map object
var leaflet_map = null;

// Initialize map and plot data
function draw(data) {

  // Initialize Leaflet map
  leaflet_map = L.mapbox.map('map', options.map_key).fitBounds(options.viewport);

  // Render points on graph
  // console.log(options.layers[1].data)
  
  drawPoints(leaflet_map, data);
  

  addLayers();
}

// Iterate through, and place layers onto Leaflet map
function addLayers(){

	for (var i = options.layers.length - 1; i >= 0; i--) {
		var layer = options.layers[i];
		
		if (layer.type == "scatterplot"){
			// leaflet_map.addLayer(drawScatterplot(leaflet_map,layer));
		}

		if (layer.type == "path"){
			leaflet_map.addLayer(drawPath(leaflet_map,layer));
		}

		if (layer.type == "heatmap"){
			leaflet_map.addLayer(drawHeatmap(leaflet_map,layer));
		}
	};

}

function drawScatterplot(map, layer){
	console.log(layer.data[1]);
	drawPoints(leaflet_map, filtered_data);
};

function drawPath(map, layer){};

// WebGL Heatmap Implementation:
// https://github.com/ursudio/webgl-heatmap-leaflet
// Returns a leaflet layer
function drawHeatmap(map, layer){
	
	var heatmap = new L.TileLayer.WebGLHeatMap({ 
    	size: 500,
    	autoresize: true,
    	opacity: .3,
  	});

	var dataPoints = [];

	for (var i = layer.data.length - 1; i >= 0; i--) {
		var point = layer.data[i]
		dataPoints.push([point.latitude, point.longitude, point.value / 6000]);
	};

	heatmap.setData(dataPoints);

	return heatmap;
}

// Apply updated data set
// Called by Date Range Picker
function updateMap(data) {

  // Clear map
  leaflet_map.remove();

  draw(filtered_data);

  // @TODO:
  // Like, write this function

}

