
/****************************
          Map.js
 ****************************/

// Iterate through, and place layers onto Leaflet map
function addLayers(layers){

  // Map Boundaries
  bounds = leaflet_map.getBounds();
  topLeft = leaflet_map.latLngToLayerPoint(bounds.getNorthWest());
  bottomRight = leaflet_map.latLngToLayerPoint(bounds.getSouthEast());

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
        drawScatterplot(leaflet_map, layer);
        break;
        
      // PATH
      case "path":
          layer.path = true;
          drawScatterplot(leaflet_map, layer);
          
          // Currently utilized same functionality as
          // scatterploy. @ TODO Fix this.
          break;
        
      // HEATMAP
      case "heatmap":
          var layer = drawHeatmap(leaflet_map,layer) 
          
          // Prevent multiple heatmaps from overlaying.
          d3.select(".leaflet-overlay-pane canvas").remove();

          leaflet_map.addLayer(layer);
          break;
        
      // HEX
      case "hex":

        drawHexmap(leaflet_map, layer);
        break;
    }
	}
}
