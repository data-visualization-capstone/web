// This module exports a factory for creating leaflet geoJSON layer from MBTA geoJSON.
function MbtaGeoJsonLayer(json) {
  var layer = L.geoJson(json, {
    style: function(feature) {
      return {
        color: feature.properties['LINE']
      }
    }
  });

  return layer;
}

