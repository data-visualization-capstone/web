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
// var map = L.map('map', {
//   center: new L.LatLng(42.329077, -71.108871),
//   zoom: 13,
//   zoomControl: false,
//   layers: [tileLayer]
// });

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
  // These modules export constructors for leaflet layers
  // that take 2 positional arguments:
  // - a reference to the leaflet map
  // - the corresponding data
  var CensusLayer = require('./layers/census.js');
  var MbtaGeoJsonLayer = require('./layers/mbta.js');
  var HeatmapLayer = require('./layers/padmapper-heatmap.js');

  // Instantiate overlays
  // ====================
  var census2010Layer = CensusLayer(map, census);
  var mbtaLayer = MbtaGeoJsonLayer(map, mbta);
  
  // This module is mostly a skeleton, since we haven't decided what we wanna do with it.
  var heatmapLayer = HeatmapLayer(map);

  // Controls
  // ========
  // TODO Switch to our own class that extends L.Control
  //      so we can implement the interface we want.
  //      Or maybe we can just style it? Not sure.

  var overlays = {
    'Census 2010': census2010Layer,
    'MBTA': mbtaLayer,
    'Padmapper Heatmap': heatmapLayer,
  }

  var controlOptions = {
    position: 'topleft',
    collapsed: false,
  }

  L.control.layers(null, overlays, controlOptions).addTo(map);
  L.control.scale().addTo(map);
  L.control.zoom( { position: 'topright' } ).addTo(map);
}

