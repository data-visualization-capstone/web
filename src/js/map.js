
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

  // Iterate through layers
	for (var i = layers.length - 1; i >= 0; i--) {
    var layer = layers[i]; // Current Layer
    
    // Create unique ID for current layer
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
