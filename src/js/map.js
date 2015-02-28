
/****************************
          Map.js
 ****************************/

// Iterate through, and place layers onto Leaflet map
function addLayers(layers){

  // Map Boundaries
  bounds = map.getBounds();
  topLeft = map.latLngToLayerPoint(bounds.getNorthWest());
  bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());

  // @ TODO:
  // Prevent Duplicates

  buildKey(layers);

  // Iterate through layers
	for (var i = layers.length - 1; i >= 0; i--) {
    var layer = layers[i]; // Current Layer
    
    var layer = verifyKeys(layer);

    switch (layer.type) {
      
      // SCATTERPLOT
      case "scatterplot":
        drawScatterplot(map, layer);
        break;
        
      // PATH
      case "path":
          drawPath(map, layer).addTo(map);
          break;
        
      // HEATMAP
      case "heatmap":

          // Prevent multiple heatmaps from overlaying.
          d3.select(".leaflet-overlay-pane canvas").remove();
          map.addLayer(drawHeatmap(map,layer) );
          break;
        
      // HEX
      case "hex":
        drawHexmap(map, layer);
        break;
    }
	}
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


function buildKey(layers){
  var key = $("#mapkey");

  key.html("");

  _.each(layers, function(layer){

    var a = '<p style="border-bottom: 2px solid ' + layer.color + ';">';
    var b = layer.name;
    var c = '</p>'

    key.append(a + b + c);
  })
}
/******************************
         Coloring
 ******************************/

// Maps the input number to the output
// color. Input between 0 and 100 maps
// to the range of red -> green
function getColor(i){

  if (i < 0){
    i = 0;
  } else if (i > 1){    
    i = 1;
  }

  var r = Math.floor(255 * i);
  var g = Math.floor(255 - 255 * i);
  var b = 0;

  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}