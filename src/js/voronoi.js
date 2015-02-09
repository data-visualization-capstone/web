// http://chriszetter.com/blog/2014/06/15/building-a-voronoi-map-with-d3-and-leaflet/

/******************************
      Graphing w/ D3.js
 ******************************/

// Use D3.js to place geo points on the leaflet map
drawPoints = function(map, layer, callback) {
  
  // Take out points for easy access 
  var points = layer.data;

  // Last point user selected
  // var lastSelectedPoint;

  var mapLayer = {
    onAdd: function(map) {
      map.on('viewreset moveend', drawWithLoading);
      drawWithLoading();
    }
  }

  map.on('ready', function() {
      map.addLayer(mapLayer);
  })
  
  // Draw points into Map
  var drawWithLoading = function(e){
    d3.select('#loading').classed('visible', true);

    // Clear map
    if (e && e.type == 'viewreset') {
      d3.select('#overlay').remove();
    }

    setTimeout(function(){
      plot();

      d3.select('#loading').classed('visible', false);
    }, 0);
  }

  var plot = function() {

    // Clear map just to be safe
    d3.select('#overlay').remove();

    var bounds = map.getBounds(),
        topLeft = map.latLngToLayerPoint(bounds.getNorthWest()),
        bottomRight = map.latLngToLayerPoint(bounds.getSouthEast()),
        existing = d3.set(),
        drawLimit = bounds.pad(0.4);

    // Create map-able set of points
    points = points.filter(function(d) {
      var latlng = new L.LatLng(d.latitude, d.longitude);

      // Remove points that are missing a GPS location
      if (!drawLimit.contains(latlng)) { return false };

      // Convert Lat & Long into a Mapable point.
      var point = map.latLngToLayerPoint(latlng);

      key = point.toString();

      // Prevent duplicate keys
      if (existing.has(key)) { return false };

      existing.add(key);

      d.lat = point.x;
      d.long = point.y;

      return true;
    });

    var svg = d3.select(map.getPanes().overlayPane).append("svg")
      .attr('id', 'overlay')
      .attr("class", "leaflet-zoom-hide")
      .style("width",  map.getSize().x + 'px')
      .style("height", map.getSize().y + 'px')
      .style("margin-left",  topLeft.x + "px")
      .style("margin-top",   topLeft.y + "px");

    var g = svg.append("g")
      .attr("transform", "translate(" + (-topLeft.x) + "," + (-topLeft.y) + ")")
      .attr("pointer-events", "all");

    var svgPoints = g.attr("class", "points")
      .selectAll("g")
      .data(points)
      .enter().append("g")
      .attr("class", "point")
      .style("z-index", 999);

    svgPoints.append("path")
      .attr("class", "point-cell")

      // On Click - mark as selected
      // .on('click', function(d){ console.log(d) })
      // .classed("selected", function(d) { return lastSelectedPoint == d} );
    
    // Add circles for each point
    svgPoints.append("circle")
      .attr("transform", function(d) { return "translate(" + d.lat + "," + d.long + ")"; })
      .style('fill', function(d) { return '#' + d.color } )
      .attr("date", function(d) { return d.date })
      .attr("r", layer.dot_width)
      .attr("pointer-events", "all")
      .attr("opacity", 1);

    if (layer.pathing){
      showConnections();
    }

    // Connects all sequential location points into 
    // a single path.
    function showConnections(){
      
      // Draw point-to-point connections
      svgPoints.each(function(){
        if($(this).next().length == 1){
          var this_transform = $(this).children("circle").attr("transform"),
              next_transform = $(this).next().children("circle").attr("transform"),
              this_position = this_transform.substring(10, this_transform.length - 1).split(","),
              next_position = next_transform.substring(10, next_transform.length - 1).split(",");

          d3.select(this).append("line")
            .attr("x1", this_position[0])
            .attr("y1", this_position[1])
            .attr("x2", next_position[0])
            .attr("y2", next_position[1])
            .style("stroke", "rgb(255,0,0)")
            .style("stroke-width", layer.dot_width)
            .style("opacity", 0);
        }
      });
    }
  }
}
