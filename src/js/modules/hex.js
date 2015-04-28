
/****************************
       Hex Heatmap
 ****************************/

// Thanks to :
// http://bl.ocks.org/mbostock/4248145

function drawHexmap(map, layer){

  // http://bl.ocks.org/mbostock/4248145
  var width = map.getSize().x;
  var height = map.getSize().y;

  // Current zoom level ~[0 - 19]
  var zoom = map._zoom

  // Filtered array
  var points = [];

  // Create map-able set of points. For each point,
  // convert the lat/long into a plottable x/y position
  acc = layer.data.filter(function(p) {

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

    if (!p.bedrooms || p.bedrooms < 1){
      p.bedrooms = 1;
    }

    points.push([point.x, point.y, p.value]);

    return true;
  });

  var color = d3.scale.linear()
      .domain([500, 4000])
      .range(["white", "steelblue"])
      .interpolate(d3.interpolateLab)

  var hexbin = d3.hexbin()
      .size([2000, 2000])
      .radius(layer.width);

  // Create an SVG elemnt for plotting points on
  var svg = d3.select(map.getPanes().overlayPane)

      .append("svg")
      .attr('id', layer.id)
      .attr("class", "leaflet-zoom-hide")
      .style("width",  map.getSize().x + 'px')
      .style("height", map.getSize().y + 'px')
      .append("g")

  // clipPath is a trick for rendering custom
  // svg shapes. It restricts the region of
  // a shape where color can be applied.
  svg.append("clipPath")

      .attr("id", "clip")
      .append("rect")
      .attr("class", "mesh")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")

      .attr("clip-path", "url(#clip)")
      .selectAll(".hexagon")

      // Use the hexbin d3.js plugin for
      // bulking data points into their
      // overlapping "bin"

      .data(hexbin(points))
      .enter().append("path")
      .attr("class", "hexagon")
      .attr("d", hexbin.hexagon())
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .style("fill", function(d) {

        // Ugly calculation for finding average prie
        var sum = 0;

        // For each apartment in the current bin
        for (var i = d.length - 1; i >= 0; i--) {
          var price = d[i][2];
          sum += price;
        };

        return color(sum / d.length);
      })

      .style("opacity", .8);
}

