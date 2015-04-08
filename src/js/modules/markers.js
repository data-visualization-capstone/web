/****************************
        Scatterplot
 ****************************/

// Plot Points as a scatterplot
// http://bost.ocks.org/mike/leaflet/
// chriszetter.com/blog/2014/06/15/building-a-voronoi-map-with-d3-and-leaflet/


function drawMarkers(map, layer){



  var markers = new L.FeatureGroup();

  _.each(layer.data, function(p){

    var latLng = [p.latitude, p.longitude]

    console.log(p)

    var circle = L.circleMarker(latLng, {
      stroke: true,
      weight: 4,
      opacity: 1,
      color: layer.data.color,
      fill: true,
      fillColor: layer.data.color,
      fillOpacity: 1,
      radius: 5,
    })

    // Create a new popup object
    var popup = L.popup()
      .setLatLng(latLng)
      .setContent(p.message)

    // Add popup to the circle
    circle.bindPopup(popup);

    markers.addLayer(circle);
  })

  map.addLayer(markers);
};

