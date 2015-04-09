
// TODO: Adding layer provides "accessor";

/****************************
          Map.js
 ****************************/

// Define global DV (Data Visualization) Configurations

var DV = {

  // Are we in our development env?
  production : _.contains(document.URL, "dydns.org"),

  // Target API. - Change API's url based on the current environment
  // Currently set to TRUE = always use staging API
  url : true ? "http://vent8225.dyndns.org:8080/" : "http://localhost:8080/",

  // Layer Data
  _layers : [],

  _leaflet_layers : [],

  // Layer CRUD Methods
  layers : {},

};

/**************************
        Layers
****************************/

// PUT - Add a layer to the map.
DV.layers.add = function(layer){

  // @TODO: Prevent Duplicates
  // Prevent duplicates
  // if (DV.layers.find("name", layer.name)) return;

    // Converts to valid layer object
    compileLayer(layer, function(layer){

        var layer = layer;

        // @TODO: Prevent Duplicates

        DV._layers.push(layer);

        console.log(DV._layers);

        // Refresh view
        DV.update();

    });
}

// SET - Update a layer from the settings.
DV.layers.update = function(layerId, layer){
  
  // Save current layer
  var layer = DV.layers.find("layerId", layerId);

  // Delete
  DV.layers.delete(layerId);

  // Add updated layer
  DV.layers.add(layer);
  
  // Refresh view
  DV.update();
}

// DELETE - Delete a layer from the map.
DV.layers.delete = function(id){

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
  DV.update();
}

// Find a layer. Requires a key and a value;
DV.layers.find = function(key, value){

  var acc = _.filter(DV._layers, function(l){
      return l[key] == value;
    })

  return acc[0];
}

// Clear current layers
DV.layers.clear = function(){
  
  console.log("Clearing Layers...");

  _.each(DV._leaflet_layers, function(l){
    map.removeLayer(l);
  })
  
  // Empty local list
  DV._layers = [];
  
  // Update map
  DV.update();
}

// Iterate through, and place layers onto Leaflet map
DV.update = function(){

  var layers = DV._layers;

  // Map Boundaries
  bounds = map.getBounds();
  topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
  bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());
  
  // @ TODO:
  // Clear data before populating
  $("#hexmap").remove()

  // Iterate through layers
	for (var i = layers.length - 1; i >= 0; i--) {
    
    var layer = layers[i]; // Current Layer

    var leaflet_layer = null;

    switch (layer.type) {
      
      // SCATTERPLOT
      case "scatterplot":
        // drawScatterplot(map, layer);
        leaflet_layer = drawMarkers(map, layer);
        break;
        
      // PATH
      case "path":
        leaflet_layer = drawPath(map, layer);
        break;
        
      // HEX
      case "hex":

        // @TODO: Store as layerGroup
        drawHexmap(map, layer);
        break;

      // GEOJSON
      case "geojson":
        leaflet_layer = geoJsonLayer(layer.data);
        break;

      // TOPOJSON
      case "topojson":
        leaflet_layer = censusLayer(layer.data);
        break;
    }


    // If our data is represented as a proper
    // leaflet layer object, lets add it to the map.

    if (leaflet_layer){

      // Store for refernece
      DV._leaflet_layers.push(leaflet_layer);

      // Add to map
      map.addLayer(leaflet_layer);
    }
	}
}

// Builds a layer object. 
// Fetches data if the data isn't provided.
// As a result, this function is async and 
// requires a ccallback function.

function compileLayer(layer, callback){

    // Optional parameter for fetching data.
    // Used if the data isn't available when
    // the initial page is loaded.

    if (layer.loadData) {
    
        // Execute provided function for getting data.
        // Provide parameter. Example: Twitter Key
        layer.loadData(layer.parameter, function(resp){
            
            // Save data back to layer
            layer.data = resp;

            // Applies provided filter & map functions.
            // Generates a unique ID for the layer
            layer = formatLayer(layer);

            // Layer is formatted.
            // Return object
            callback(layer);

        // Throw Error. Usually an API problem....
        // Log the response for debugging

        }, function(resp){

            console.error(resp);

      });

    // If no loadData function is provided, we
    // assume the data is already saved to layer.data
    
    } else if (layer.data){

        layer = formatLayer(layer);

        callback(layer);
      
    } else {

        console.error("Missing either .data or .loadData function");
    }
}

// Verifies layer data
function formatLayer(layer){

  // Ensure the layer ID exists
  var layer = generateId(layer);

  // Support layer.filter function
  if (layer.map){

    // Apply map function
    layer.data = _.map(layer.data, function(p){
      return layer.map(p);
    })
  }

  // Support layer.filter function
  if (layer.filter){
    layer.data = _.filter(layer.data, function(p){
      return layer.filter(p);
    })
  }

  return layer;  
}

// Check for missing keys.
// Execute & normalize data.
function generateId(layer){

    // Create unique ID for current layer
    if (!layer.name){
      console.error("Alert. 'layer.name' is not defined. Defaulting name. This may cause issues if you have more then 1 unnamed layer.");
      layer.name = 'default';
    }

    layer.id = layer.name.replace(/\s/g, '').toLowerCase();

    return layer;
}

/******************************
       Twitter API
 ******************************/

DV.twitter = {};

// Add a new layer getting data from twitter.
// Support 2 types of tweets:
//   "search" - Search the twitter API for tweets
//   "stream" - Use cached tweets that we've recorded

// Fetch tweets from twitter search API.
// Provide the element where the user
// entered a search term.

DV.twitter.addSearch = function(element){

  // String to search by. Provide element where
  // user entered the search term
  var string = $(element).val()

  DV.twitter.addLayer(string, DV.twitter.getSearchData)
}

// Fetch tweets that we've stored from a
// twitter stream. Take a string that tweets
// should contain in the message.

DV.twitter.addStream = function(string){

  DV.twitter.addLayer(string, DV.twitter.getStreamData)
}

// Helper function for adding different types of t
// twitter data
DV.twitter.addLayer = function(string, loadDataFunction){
  
  // Error Checking
  // @TODO: User Feedback
  if (!string) { console.error("Invalid Twitter String."); return; }

  // Show loading indicator.
  Loading.start("tweet");

  // Create layer object
  var layer = {
      name: "Twitter " + string,
      type: "scatterplot",
      color: DV.utils.getColor(Math.random(0, 100)),
      loadData : loadDataFunction,
      parameter : string,
      width: 3,
  }  

  // add layer object
  DV.layers.add(layer);
}

// GET /twitter/search/:string
DV.twitter.getSearchData = function(string, success, error){
  $.get(DV.url + "twitter/search/" + string, function(resp){

      Loading.stop("tweet");
      success(resp);
    })
    .fail(function() {
      
      Loading.stop("tweet");
      console.error("Error fetching tweets: "  + resp)
      error(resp)
    })
};

// GET /twitter/stream/:string
DV.twitter.getStreamData = function(string, success, error){
  $.get(DV.url + "twitter/stream/" + string, function(resp){
      
      Loading.stop("tweet");
      success(resp)
    })
    .fail(function() {
      
      Loading.stop("tweet");
      console.error("Error fetching tweets: "  + resp)
      error(resp)
    })
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

// Load data from a JSON file
DV.utils.loadJSON = function(target, success, error){
  d3.json(target, function(json){
    success(json);
  }, function(resp){
    error(resp);
  });
};

// Load data from a CSV file
DV.utils.loadCSV = function(target, success, error){
  d3.csv(target, function(csv){
    success(csv);
  }, function(resp){
    error(resp);
  });
};


/**************************
    Loading Indicator
****************************/

// Loading Functionality
Loading = {

  // Start Loading
  start : function(msg){ $("#loading").show(); },

  // Stop Loading
  stop : function(msg){  $("#loading").hide(); },
};
