// TODO: Adding layer provides "accessor";

/****************************
          Map.js
 ****************************/

// Define global DV (Data Visualization) Configurations

var DV = {

  // Are we in a development env?
  production : _.contains(document.URL, "dydns.org"),

  // Target API. - Change API's url based on the current environment
  // Currently set to TRUE = always use staging API
  url : true ? "http://vent8225.dyndns.org:8080/" : "http://localhost:8080/",

  // Layer Data
  _layers : [],

  // Layer Methods
  layers : {},

};

/**************************
        Layers
****************************/

// GET - Get a layer from the settings.
DV.layers.getLayer = function(layerId){
  return _.findWhere(DV._layers, { id : layerId });
}

// PUT - Add a layer to the map.
DV.layers.addLayer = function(layer){

    // Converts to valid layer object
    compileLayer(layer, function(layer){

        var layer = layer;

        // @TODO: Prevent Duplicates

        DV._layers.push(layer);

        // Refresh view
        update(DV._layers);

    });
}

// SET - Update a layer from the settings.
DV.layers.setLayer = function(layerId, layer){
  
  // Save current layer
  var layer = DV.layers.findLayer("layerId", layerId);

  // Delete
  DV.layers.deleteLayer(layerId);

  // Add updated layer
  DV.layers.addLayer(layer);
  
  // Refresh view
  update(DV._layers);
}

// DELETE - Delete a layer from the map.
DV.layers.deleteLayer = function(id){

  // alert(id)

  // @TODO: Refresh all layers on map

  for (i in map._layers){
    var current = map._layers[i];

    if (current._path){
      map.removeLayer(current);
    }
  }
  
  // Filter layers
  DV._layers = _.filter(DV._layers, function(layer){
    return layer.id != id;
  })

  // Refresh view
  update(DV._layers);
}

// Find a layer. Requires a key and a value;
DV.layers.findLayer = function(key, value){
  return _.findWhere(DV._layers, {key : value});
}

// Clear current layers
DV.layers.clearLayers = function(){
  DV._layers = [];
  update(DV._layers);
}

// Iterate through, and place layers onto Leaflet map
function update(layers){

  // Map Boundaries
  bounds = map.getBounds();
  topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
  bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());
  
  // @ TODO:
  // Clear data before populating
  $("#hexmap").remove()

  buildKey(layers);

  // Iterate through layers
	for (var i = layers.length - 1; i >= 0; i--) {
    
    var layer = layers[i]; // Current Layer

    var leaflet_layer = null;

    switch (layer.type) {
      
      // SCATTERPLOT
      case "scatterplot":
        drawScatterplot(map, layer);
        break;
        
      // PATH
      case "path":
        leaflet_layer = drawPath(map, layer);
        break;
        
      // HEX
      case "hex":
        drawHexmap(map, layer);
        break;

      // GEOJSON
      case "geojson":
        map.addLayer(geoJsonLayer(layer.data));
        break;

      // TOPOJSON
      case "topojson":
        map.addLayer(censusLayer(layer.data));
        break;
    }

    if (leaflet_layer){
      layer.object = leaflet_layer;
      map.addLayer(leaflet_layer);
    }
	}

  console.log("\nActive Layers:");
  console.log(DV._layers);
}

// Builds a layer object. 
function compileLayer(layer, done){

    // Optional parameter for fetching data.
    // Used if the data isn't available when
    // the initial page is loaded.

    if (layer.loadData) {
    
        // Execute provided function for getting data.
        // Provide parameter. Example: Twitter Key
        layer.loadData(layer.parameter, function(resp){
            
            // Save data back to layer
            layer.data = resp;

            layer = formatLayer(layer);

            done(layer);

        // Throw Error. Usually an API problem....
        // Log the response for debugging
        }, function(resp){

            console.error(resp);

      });

    // If no loadData function is provided, we
    // assume the data is already saved to layer.data
    
    } else {

        layer = formatLayer(layer);

        done(layer);
      
    }
}

// Verifies layer data
function formatLayer(layer){

  // Ensure the layer ID exists
  var layer = verifyKeys(layer);

  // Support layer.filter function
  if (layer.filter){
    layer.data = _.filter(layer.data, function(p){
      return layer.filter(p);
    })
  }

  // Support layer.filter function
  if (layer.map){
    layer.data = _.map(layer.data, function(p){
      return layer.map(p);
    })
  }

  return layer;  
}

// Check for missing keys.
// Execute & normalize data.
function verifyKeys(layer){

    // Create unique ID for current layer
    if (!layer.name){
      console.error("Alert. 'layer.name' is not defined. Defaulting name. This may cause issues if you have more then 1 unnamed layer.");
      layer.name = 'default';
    }

    layer.id = layer.name.replace(/\s/g, '').toLowerCase();

    return layer;
}

function buildKey(layers){
  var key = $("#legend");

  key.html("");

  _.each(layers, function(layer){

    // console.log(layer.id)

    var a = '<p style="border-bottom: 2px solid ' + layer.color + ';">';
    var b = layer.name;
    var c = '<span class="btn-remove" onclick="DV.layers.deleteLayer(\'' + layer.id + '\')">X</span>';
    var d = '</p>'

    key.append(a + b + c + d);
  })
}



/******************************
       Twitter API
 ******************************/

DV.twitter = {};

// GET /twitter/search/:string
DV.twitter.search = function(string, success, error){
  $.get(DV.url + "twitter/search/" + string, function(resp){
      success(resp);
    })
    .fail(function() {
      console.error("Error fetching tweets: "  + resp)
      error(resp)
    })
};

// GET /twitter/stream/:string
DV.twitter.stream = function(string, success, error){
  $.get(DV.url + "twitter/stream/" + string, function(resp){
      success(resp)
    })
    .fail(function() {
      console.error("Error fetching tweets: "  + resp)
      error(resp)
    })
};

/******************************
      Loading Data Sets
 ******************************/

// Load data from a JSON file
DV.loadJSON = function(target, success, error){
  d3.json(target, function(json){
    success(json);
  }, function(resp){
    error(resp);
  });
};

// Load data from a CSV file
DV.loadCSV = function(target, success, error){
  d3.csv(target, function(csv){
    success(csv);
  }, function(resp){
    error(resp);
  });
};

/******************************
         Utils
 ******************************/

DV.utils = {};

// Maps the input number to the output
// color. Input between 0 and 100 maps
// to the range of red -> green
DV.utils.getColor = function(i){

  if (i < 0){
    i = 0;
  } else if (i > 1){    
    i = 1;
  }

  var r = Math.floor(255 * i);
  var g = Math.floor(255 - 255 * i);
  var b = 0;

  return '#' + DV.utils.componentToHex(r) + DV.utils.componentToHex(g) + DV.utils.componentToHex(b);
};

// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
DV.utils.componentToHex = function(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};


