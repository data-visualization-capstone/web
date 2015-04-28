/****************************
        Markers
 ****************************/

// Plot Points as a Markers

function drawMarkers(map, layer){

  var markers = new L.FeatureGroup();

  _.each(layer.data, function(p){

    var latLng = [p.latitude, p.longitude]

    var circle = L.circleMarker(latLng, {
      stroke: true,
      weight: 4,
      opacity: 1,
      color: layer.color,
      fill: true,
      fillColor: layer.color,
      fillOpacity: 1,
      radius: 5,
      stroke: (5 / 3)
    })

    // Create a new popup object
    var popup = L.popup()
      .setLatLng(latLng)
      .setContent("<div class='header' style='background-color:" + layer.color + "'><i class='fa fa-twitter fa-2x'></i><p>Twitter</p></div>" + p.message)

    // Add popup to the circle
    circle.bindPopup(popup);

    markers.addLayer(circle);

  })
  
  // Return layer group
  return markers;
};

