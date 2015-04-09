
// Returns a leaflet geo JSON layer (L.geoJson)
// geoJSON is a list of features.
// Each feature is a census tract.
function censusLayer(census) {
  
  // Map tract ids to color values for census tracts
  function tractFillColor(tractId) {
    var tract = _.findWhere(census, { id: +tractId })

    var colorBins = [
      '#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8',
      '#807dba', '#6a51a3', '#4a1486',
    ]

    // Map median rent to 7 color values
    var quantizeMedianRent = d3.scale.quantize()
      .domain(d3.extent(census, function(d) { return d.medianRent }))
      .range(colorBins)

    if (tract && tract.medianRent) {
      return quantizeMedianRent(tract.medianRent);
    } else {
      // Return grey if we don't have mediant rent data available
      return 'grey';
    }
  }

  // Create the leaflet geo JSON layer to be returned
  var baseLayer = L.geoJson(null, {
    style: function(feature) {
      return {
        color: '#222',
        weight: 2,
        dashArray: '4',
        fill: 'red',
        fillColor: tractFillColor(feature.id),
        fillOpacity: 0.5
      };
    },

    onEachFeature: function(feature, layer) {
      // Event handlers for the layer
      function mouseover(e) {
        var tract = e.target;

        tract.setStyle({
            weight: 5,
            color: 'red',
            dashArray: '',
        });

        if (!L.Browser.ie && !L.Browser.opera) {
          tract.bringToFront();
        }
      }

      function mouseout(e) {
        baseLayer.resetStyle(e.target);
      }

      function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
      }

      // Attach the event handlers to each tract
      layer.on({
        mouseover: mouseover,
        mouseout: mouseout,
        click: zoomToFeature,
      });
    },
  });

  return omnivore.topojson('/js/data/tracts2010.json', {}, baseLayer);
}
