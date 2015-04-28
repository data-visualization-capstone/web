/****************************
        Scatterplot
 ****************************/

// Plot Points as a scatterplot
// http://bost.ocks.org/mike/leaflet/
// chriszetter.com/blog/2014/06/15/building-a-voronoi-map-with-d3-and-leaflet/

function drawScatterplot(map, layer){

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

    var zoomModifier = map.getZoom() - 12;
    
    if (zoomModifier < 1){
      zoomModifier = 1;
    }

    svg.selectAll("circle")

      .data(points)
      .enter().append("circle")
      .attr("class", "point")

      // Position each circle with the x/y position.
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      
      // Visual Settings
      .style('fill', function(d) { return layer.color } )
      .attr("r", layer.width * zoomModifier)
      .attr("z-index", 99999)

      // Mouse events
      .on("mouseover", function() {
        d3.select(this).style("fill", "red");
      })

      .on("mouseout", function() {
        d3.select(this).style("fill", layer.color);
      })

    // Logic for drawing paths between points
    if (layer.path){
      
      for (var i = 0; i < points.length - 1; i++) {

        // Stop iteration if there's not
        // a next point to connect.
        if (i >= points.length - 2) return;

        var current = points[i];
        var next = points[i + 1];

        svg.append("line")

          .attr("x1", current.x)
          .attr("y1", current.y)
          .attr("x2", next.x)
          .attr("y2", next.y)
          
          .style("stroke", "black")
          .style("stroke-width", layer.width / 3)
          .style("opacity", 1);

      };
      
    }
};