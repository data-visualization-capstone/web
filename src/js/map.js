
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

    switch (layer.type) {
      
      // SCATTERPLOT
      case "scatterplot":
        drawScatterplot(map, layer);
        break;
        
      // PATH
      case "path":
          drawPath(map, layer);
          
          // Currently utilized same functionality as
          // scatterploy. @ TODO Fix this.
          break;
        
      // HEATMAP
      case "heatmap":
          var layer = drawHeatmap(map,layer) 
          
          // Prevent multiple heatmaps from overlaying.
          d3.select(".leaflet-overlay-pane canvas").remove();

          map.addLayer(layer);
          break;
        
      // HEX
      case "hex":

        drawHexmap(map, layer);
        break;
    }
	}
}
