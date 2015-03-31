
/****************************
       Hex Heatmap
 ****************************/

// Thanks to :
// http://bl.ocks.org/mbostock/4248145

module.exports = function drawHexmap(map, layer){
  
  // Clear layer if previously existing.
  // $("#" + layer.id).remove()
  // console.log($("#" + layer.id))

  // http://bl.ocks.org/mbostock/4248145
  var width = map.getSize().x;
  var height = map.getSize().y;

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

    points.push([point.x, point.y, p.value / p.bedrooms]);

    return true;
  });

  var color = d3.scale.linear()
      .domain([600, 2500])
      .range(["white", "steelblue"])
      .interpolate(d3.interpolateLab);

  var hexbin = d3.hexbin()
      .size([width, height])
      .radius(layer.width);

  // Create an SVG elemnt for plotting points on
  var svg = d3.select(map.getPanes().overlayPane).append("svg")
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
        
        // Ugly calculation for finding price per bedroom;
        var sum = 0;

        for (var i = d.length - 1; i >= 0; i--) {
          var pricePerBedroom = d[i][2];
          sum += pricePerBedroom;
        };

        var average = sum / d.length
        return color(average); 
      })

      .style("opacity", .6);
}

