
// This module exports a factory for creating leaflet geoJSON layer from MBTA geoJSON.
function geoJsonLayer(json) {
  var layer = L.geoJson(json, {
    style: function(feature) {
      return {
      	weight: 3,
        opacity: 1,
        color: '#666',
        dashArray: '5',
        fillOpacity: 0,
        // color: feature.properties['COLOR'],
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