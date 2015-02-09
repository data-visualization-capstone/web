
/****************************
          Map.js
 ****************************/

// Iterate through, and place layers onto Leaflet map
function addLayers(layers){

  // Map Boundaries
  bounds = leaflet_map.getBounds();
  topLeft = leaflet_map.latLngToLayerPoint(bounds.getNorthWest());
  bottomRight = leaflet_map.latLngToLayerPoint(bounds.getSouthEast());

  // Clear map just to be safe
  // d3.select('#overlay').remove();

  // Iterate through layers
	for (var i = layers.length - 1; i >= 0; i--) {
		
    var layer = layers[i]; // Current Layer
    
    // Create unique ID for current layer
    layer.id = layer.name.replace(/\s/g, '').toLowerCase();

    // @ TODO:
    // Prevent Duplicates

    console.log(layer)
		
		if (layer.type == "scatterplot"){
			drawScatterplot(leaflet_map, layer);
		}

		if (layer.type == "path"){
      var layer = drawPath(leaflet_map, layer);
			leaflet_map.addLayer(layer);
		}

		if (layer.type == "heatmap"){
			var layer = drawHeatmap(leaflet_map,layer)
      leaflet_map.addLayer(layer);
		}

    if (layer.type == "hex"){
      drawHexmap(leaflet_map, layer);
    }
	};
}

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

    // Create a group for this layer
    var svgPoints = g.attr("class", "points")
      .selectAll("g")
      
      // Append a <g class="point"> for 
      // ever data point in the set.
      .data(points)
      .enter().append("g")
      .attr("class", "point")
      .style("z-index", 999);

    // Add circles for each point
    svgPoints.append("circle")
      
      // Position each circle with the x/y position.
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      
      // Visual Settings
      .style('fill', function(d) { return layer.color } )
      .attr("r", layer.dot_width)
      .attr("opacity", 1);

      // .attr("date", function(d) { return d.date })
      // .attr("pointer-events", "all")
};

/****************************
          Path
 ****************************/

function drawPath(map, layer){
	// Enable path
	layer.options.pathing = true;

	// Render Layer
	drawPoints(map, layer);
};

/****************************
         Heatmap
 ****************************/

// WebGL Heatmap Implementation:
// https://github.com/ursudio/webgl-heatmap-leaflet
// Returns a leaflet layer
function drawHeatmap(map, layer){
	
	var heatmap = new L.TileLayer.WebGLHeatMap({ 
    	size: 500,
    	autoresize: true,
    	opacity: .4,
  	});

	var dataPoints = [];

	for (var i = layer.data.length - 1; i >= 0; i--) {
		var point = layer.data[i]
		dataPoints.push([point.latitude, point.longitude, point.value / 40000]);
	};

	heatmap.setData(dataPoints);

	return heatmap;
}

function drawHexmap(map, layer){

    // Options for the hexbin layer
    var hexSettings = {
        radius : 10,                            // Size of the hexagons/bins
        opacity: 0.5,                           // Opacity of the hexagonal layer
        duration: 200,                          // millisecond duration of d3 transitions (see note below)
        lng: function(d){ return d[0]; },       // longitude accessor
        lat: function(d){ return d[1]; },       // latitude accessor
        value: function(d){ return d.length; }, // value accessor - derives the bin value
        valueFloor: 0,                          // override the color scale domain low value
        valueCeil: undefined,                   // override the color scale domain high value
        colorRange: ['#f7fbff', '#08306b']      // default color range for the heat map
    };

    // Create the hexbin layer and add it to the map
    var hexLayer = L.hexbinLayer(hexSettings).addTo(map);

    // Optionally, access the d3 color scale directly
    // Can also set scale via hexLayer.colorScale(d3.scale.linear()...)
    hexLayer.colorScale().range('white', 'blue');

    var center = [42.329077, -71.108871];
  
    var latFn = d3.random.normal(center[0], 1);
    var longFn = d3.random.normal(center[1], 1);
  
    var data = [];
    
    for(i=0; i<1000; i++){
        data.push([longFn(),  latFn(), Math.random()]);
    }
  
    // Set the data (can be set multiple times)
    hexLayer.data(data);
}
