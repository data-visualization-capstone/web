
// This module exports a factory for creating leaflet geoJSON layer from MBTA geoJSON.
function geoJsonLayer(json) {
  var layer = L.geoJson(json, {
    style: function(feature) {
      return {
        color: feature.properties['COLOR']
      }
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

