// This module exports a factory for creating leaflet geoJSON layer from MBTA geoJSON.
module.exports = function MbtaGeoJsonLayer(map, json) {
  var layer = L.geoJson(json, {
    style: function(feature) {
      return {
        color: feature.properties['LINE']
      }
    }
  });

  return layer;
}

