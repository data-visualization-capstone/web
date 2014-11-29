
/******************************
         Graphing.js 
 ******************************/

// drawPoints
drawPoints = function(map, data) {
  var pointTypes = d3.map(),
      points = data,
      lastSelectedPoint;

  var mapLayer = {
    onAdd: function(map) {
      map.on('viewreset moveend', drawWithLoading);
      drawWithLoading();
    }
  }

  map.on('ready', function() {
      points.forEach(function(point) {
        pointTypes.set(point.type, {type: point.type, color: point.color});
      })
        
      drawPointTypeSelection();

      map.addLayer(mapLayer);
  })

  var drawPointTypeSelection = function() {

    labels = d3.select('#toggles').selectAll('input')
      .data(pointTypes.values())
      .enter().append("label");

    labels.append("input")
      .attr('type', 'checkbox')

      // Enable all
      .property('checked', function(d) { return true; })
      .attr("value", function(d) { return d.type; })
      .on("change", drawWithLoading);

    labels.append("span")
      .attr('class', 'key')
      .style('background-color', function(d) { return '#' + d.color; });

    labels.append("span")
      .text(function(d) { return d.type; });
  }

  var selectedTypes = function() {
    return d3.selectAll('#toggles input[type=checkbox]')[0].filter(function(elem) {
      return elem.checked;
    }).map(function(elem) {
      return elem.value;
    })
  }

  var pointsFilteredToSelectedTypes = function() {
    
    var currentSelectedTypes = d3.set(selectedTypes());
    
    return points.filter(function(item){
      return currentSelectedTypes.has(item.type);
    });
  }
  
  // Draw points into Map
  var drawWithLoading = function(e){
    d3.select('#loading').classed('visible', true);

    if (e && e.type == 'viewreset') {
      d3.select('#overlay').remove();
    }

    setTimeout(function(){
      draw();

      d3.select('#loading').classed('visible', false);
    }, 0);
  }

  var draw = function() {
    d3.select('#overlay').remove();

    var bounds = map.getBounds(),
        topLeft = map.latLngToLayerPoint(bounds.getNorthWest()),
        bottomRight = map.latLngToLayerPoint(bounds.getSouthEast()),
        existing = d3.set(),
        drawLimit = bounds.pad(0.4);

    filteredPoints = pointsFilteredToSelectedTypes().filter(function(d) {
      var latlng = new L.LatLng(d.latitude, d.longitude);

      if (!drawLimit.contains(latlng)) { return false };

      var point = map.latLngToLayerPoint(latlng);

      key = point.toString();

      if (existing.has(key)) { return false };

      existing.add(key);

      d.x = point.x;
      d.y = point.y;
      return true;
    });

    var svg = d3.select(map.getPanes().overlayPane).append("svg")
      .attr('id', 'overlay')
      .attr("class", "leaflet-zoom-hide")
      .style("width", map.getSize().x + 'px')
      .style("height", map.getSize().y + 'px')
      .style("margin-left", topLeft.x + "px")
      .style("margin-top", topLeft.y + "px");

    var g = svg.append("g")
      .attr("transform", "translate(" + (-topLeft.x) + "," + (-topLeft.y) + ")")
      .attr("pointer-events", "all");

    var svgPoints = g.attr("class", "points")
      .selectAll("g")
      .data(filteredPoints)
      .enter().append("g")
      .attr("class", "point")
      .style("z-index", 999);

    svgPoints.append("path")
      .attr("class", "point-cell")
      .on('click', function(d){ console.log(d) })
      .classed("selected", function(d) { return lastSelectedPoint == d} );
    
    // Add circles for each point
    svgPoints.append("circle")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .style('fill', function(d) { return '#' + d.color } )
      .attr("date", function(d) { return d.date })
      .attr("r", options.dot_width)
      .attr("pointer-events", "all")
      .attr("opacity", 1);

    if (options.map_show_connections){
      connectTheDots();
    }

    // Connects all sequential location points into 
    // a single path.
    function connectTheDots(){
      
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
            .style("stroke-width", options.dot_width)
            .style("opacity", 0);
        }
      });
    }
    
    
    if (options.show_paths_on_hover){
      addTrackingLines();  
    }

    // Provides a tracing highlight of user
    // activiity for sequential points on *hover*
    function addTrackingLines(){

      $("g").each(function(){

        var lines = [$(this).children("line"), $(this).next().children("line")],
        lines2 = [$(this).prev().children("line")];

        $(this).hover(function(){

          for(i=1; i < 5; i++){
            lines.push(lines[i].parent().next().children("line"));
          }

          for(i=0; i < 4; i++){
            lines2.push(lines2[i].parent().prev().children("line"));
          }

          lines = lines.concat(lines2);
          
          for(var x in lines){
            lines[x].css("opacity", .4); // Set HOVER .4
          }
        },

        function(){
          
          for(i=1; i < 5; i++){
            lines.push(lines[i].parent().next().children("line"));
          }

          for(i=0; i < 4; i++){
            lines2.push(lines2[i].parent().prev().children("line"));
          }

          lines = lines.concat(lines2); 

          for(var x in lines){
            lines[x].css("opacity", 0);
          }
        });
      });
    }
  }

}