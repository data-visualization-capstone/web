// This is mostly scaffolding right now, since I don't know if we want to use this data.
// If we do decide to use it, we can extend this class to handle showing the heatmap
// for different periods of time
module.exports = function HeatmapLayer(map) {
  // Init heatmap layer
  heatmapBounds = [
    [42.255594, -71.1828231],
    [42.4351936, -70.975800]
  ]

  var layer = L.imageOverlay('img/apts-1361188921.png', heatmapBounds);

  return layer;
}

