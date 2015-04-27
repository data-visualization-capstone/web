
// This module exports a factory for creating leaflet geoJSON layer from MBTA geoJSON.
function geoJsonLayer(json, layerOptions) {

  var layer = L.geoJson(json, {

    style: function(feature) {

      // Default options
      // (Used for Neighborhoods)
      var opts = {
        weight: 3,
        opacity: 1,
        color: '#666',
        dashArray: '5',
        fill : true,
        fillOpacity: 0,
      }

      // If a color is provided, update options
      // (Used for MBTA lines)
      var color = feature.properties['COLOR'];

      if (color) {
        opts.weight = 5;
        opts.color = color;
        opts.dashArray = null;
      }

      return opts;
    },

    onEachFeature: function (feature, layer) {

        layer.on('mouseover', function(){
        	$("#nhood").html(feature.properties.Name)
        })

        layer.on('mouseout', function(){
        	$("#nhood").html("")
        })
    }
  });

  return layer;
}