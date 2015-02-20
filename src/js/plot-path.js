
/****************************
          Path
 ****************************/

// Returns a leaflet polyline
function drawPath(map, layer){
  
    // Clear layer if previously existing.
    d3.select('#' + layer.id).remove();

    // Select leaflet's 'overlay pane' layer. Leaflet will 
    // auto-repositions the overlay panes upon map movement.

    // Create an SVG elemnt for plotting points on
    var svg = d3.select(map.getPanes().overlayPane).append("svg")
      .attr('id', layer.id)
      .attr("class", "leaflet-zoom-hide")

    // Fix the size of our SVG layer to match the leaflet map
      .style("width",  map.getSize().x + 'px')
      .style("height", map.getSize().y + 'px')

    // Add a "g" (group) element. Organizes points
    // and ensures that layer aligns with leaflet.
    var g = svg.append("g")
      .attr('id', layer.id)
      .attr("class", "leaflet-zoom-hide")

    // Fix the size of our SVG layer to match the leaflet map
      .style("width",  map.getSize().x + 'px')
      .style("height", map.getSize().y + 'px')

    // Apply leaflet-zoom-hide so that the overlay
    // is hidden during zoom animations
      .attr("class", "leaflet-zoom-hide");
      
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

    console.log(points)

    var polylinePoints = _.map(points, function(p){ 
      return [p.latitude, p.longitude]; 
    });

    var polyline = L.polyline(polylinePoints, {
      color: layer.color,
      weight: layer.width,
      opacity: 1,
      lineJoin: 'round'
    });
      
    return polyline;


};