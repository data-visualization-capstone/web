/*
 * Boston Rental Maps
 * ==================
 * The leaflet object, L, is available globablly (as part of the mapbox.js).
 * All other dependencies are required with browserify.
 */

var d3 = require('d3');
var queue = require('queue-async');

// Init Mapbox Tile Layer
L.mapbox.accessToken = 'pk.eyJ1IjoiYWxleGpvaG5zb241MDUiLCJhIjoiQVAzNUVUWSJ9.DsqpIB2Asy3IGJ-_HqBCOw';

var tileLayer = L.tileLayer('https://{s}.tiles.mapbox.com/v4/stephalee.aec4ccea/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
});

// Init leaflet map with out mapbox tile layer
var map = L.map('map', {
  center: new L.LatLng(42.329077, -71.108871),
  zoom: 13,
  zoomControl: false,
  layers: [tileLayer]
});

/************************************
      Initialize Map
************************************/

// Global variable for map object
// Initialize Leaflet map
//var map = L.mapbox.map('map', options.map_key).fitBounds(options.viewport);

// Add layers when the map is ready.
map.on('ready', function(){
  update(map, V._layers);
})

// Re-add layers when the map has changed.
map.on('viewreset', function(){
  console.log("\nView Reset: Replotting Layers");
  update(map, DV._layers);
})

// Use queue-async module to load the data in parallel.
// While this isn't totally necessary now, this will prevent
// async issues when we want to operate on multiple data sets.
queue()

  // .defer takes an async task and any
  // number of arguments to be passed to the task
  .defer(d3.json, 'data/MBTARapidTransitLines.json')
  .defer(d3.csv, 'data/census2010.csv', parseCensus)
  .await(dataLoaded);

// Parse census csv, coerce strings to numbers,
// and reject invalid rows.
function parseCensus(row) {
  var parsedRow = {
    id:         +row['tractid10'],
    medianRent: +row['medianrent']
  }

  if (parsedRow.id && parsedRow.medianRent) {
    return parsedRow;
  } else {
    return;
  }
}

// Instantiate overlays with data, add them to a control
function dataLoaded(err, mbta, census) {

  // Each module contains constructors for leaflet layers
  // Each module takes 3 arguments:
  // - a reference to the leaflet map
  // - the corresponding data
  // - and options JSON object

  // Data-Specific Layers
  var CensusLayer = require('./modules/census.js');
  var MbtaGeoJsonLayer = require('./modules/mbta.js');
  var HeatmapLayer = require('./modules/padmapper-heatmap.js');  
  
  //  General Mapping Functionality
  var polyLine = require('./modules/polyline.js');
  var scatterplot = require('./modules/scatterplot.js');
  var heatmap = require('./modules/heatmap.js');
  var hex = require('./modules/hex.js');

  // Instantiate Overlays
  // for data-specific layers
  // ====================
  
  var census2010Layer = CensusLayer(map, census);
  var mbtaLayer = MbtaGeoJsonLayer(map, mbta);
  var heatmapLayer = HeatmapLayer(map); // <!-- Skeleton Layer

  var orange_line = {
    name : "Orange Line",      
    type: "path",
    data : sample_data.subway.orange,
    width: 5,
    color: "#ffa500",
  }

  // Instantiate Overlays
  // for generic layer types
  // ====================

  // Polyline for demo
  var orangeLine = polyLine(map, orange_line)
  var scatterplotLayer = scatterplot(map, orange_line)
  var hexLayer = hex(map, orange_line)

  // Controls
  // ========
  // TODO Switch to our own class that extends L.Control
  //      so we can implement the interface we want.
  //      Or maybe we can just style it? Not sure.

  var overlays = {
    
    // Pre-set data
    'Census 2010': census2010Layer,
    'MBTA': mbtaLayer,
    'Padmapper Heatmap': heatmapLayer,

    // Examples
    'Orange Line': orangeLine,
  }

  var controlOptions = {
    position: 'topleft',
    collapsed: false,
  }

  L.control.layers(null, overlays, controlOptions).addTo(map);
  L.control.scale().addTo(map);
  L.control.zoom( { position: 'topright' } ).addTo(map);
}

