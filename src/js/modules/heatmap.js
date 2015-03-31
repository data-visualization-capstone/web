
/****************************
         Heatmap
 ****************************/

// WebGL Heatmap Implementation:
// https://github.com/ursudio/webgl-heatmap-leaflet
// Returns a leaflet layer
modules.exports = function drawHeatmap(map, layer){
	
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