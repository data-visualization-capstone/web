

/****************************
          Path
 ****************************/

// Returns a leaflet polyline
module.exports = function drawPath(map, layer){
  
    // Clear layer if previously existing.
    // @TODO
      
    // Create map-able set of points. For each point,
    // convert the lat/long into a plottable x/y position
    var points = layer.data.filter(function(p) {

      // Check for missing data points
      if (!p.latitude || !p.longitude){
        console.log("ERROR. Missing Latitude/Longitude Data.");
        return false;
      }

      // Create new leaflet Lat/Long Object
      var latlng = new L.LatLng(p.latitude, p.longitude);

      bounds = map.getBounds();
      
      // Remove points that are outside current viewport
      if (!bounds.contains(latlng)) { return false };
      
      // Convert Latitude and Longitude into a Mapable
      // point using leaflet's LayerPoint API.
      var point = map.latLngToLayerPoint(latlng);

      // Save the resulting x & y values
      // onto the current point object.
      p.x = point.x;
      p.y = point.y;

      return true;
    });

    var polylinePoints = _.map(points, function(p){ 
      return [p.latitude, p.longitude]; 
    });
    
    console.log(polylinePoints);

    var polyline = L.polyline(polylinePoints, {
      color: layer.color,
      weight: layer.width,
      opacity: 1,
      lineJoin: 'round'
    });
      
    return polyline;
};