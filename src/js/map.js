
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
  drawPoints(leaflet_map, data);


  var heatmap = new L.TileLayer.WebGLHeatMap({ 
    size: 500,
    autoresize: true,
    opacity: .5,
    // gradientTexture (url to gradient PNG)
    alphaRange: .5,
  });

  var dataPoints = [];

  _.each(options.layers[0].data, function(point){
      var v = Math.random() * .1; // point.value
      dataPoints.push([point.latitude, point.longitude, v]);
  })

  heatmap.setData(dataPoints)  
  leaflet_map.addLayer(heatmap);

}

// Apply updated data set
function updateMap(data) {

  // Clear map
  leaflet_map.remove();

  draw(filtered_data);

  // @TODO:
  // Like, write this function

}

