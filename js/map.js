
/****************************
          Map.js
    Initialize and Handle Map Interactions
 ****************************/


// Save the Raw Data.
// Since we'll be manipulating, and filtering our
// data set, we'll want to keep and original copy
// as to avoid re-fetching ALL our data when we
// reset filters.

var raw_data = null;

// Save the Filtered Data.
// This is whatever data is currently being plotted.

var filtered_data = null;

// Global variable for map object

var leaflet_map = null;

// On document ready
$(function() {

  // Load location data.
  loadData(options.data_source, function(data) {

    // Splice the data set for efficiency?
    if (options.data_splice) {
      data = data.splice(0, options.data_splice);
    }

    // Sample the data set for efficiency?
    if (options.data_sample) {

      // Take random sample of data
      data = _.sample(data, options.data_sample);

      // Sort by date
      data = _.sortBy(data, function(p) {
        return p.date
      });
    }

    // Check for missing keys
    data = removeInvalidData(data, ["latitude", "longitude", "date"])

    // Save data. The only time RAW and FILTERED data will be the same.
    raw_data = filtered_data = formatData(data, "time");
    // DV.log(filtered_data[0]);

    // Setup date ranger picker.
    initDateRangePicker(filtered_data[0].date, filtered_data[filtered_data.length - 1].date);

    // Render the current filtered subset of data
    draw(filtered_data);
  })
});

// Initialize map and plot data
function draw(data) {

  // Initialize Leaflet map
  leaflet_map = L.mapbox.map('map', options.map_key).fitBounds(options.viewport);

  // Render points on graph
  drawPoints(leaflet_map, data);

  var heatmap = new L.DivHeatmapLayer();

  heatmap.addTo(leaflet_map);
  
  // heatmap.testAddData();
  heatmap.setData(_.sample(options.layers[0].data, 1000));

  addLayers();
}

// Add layers to map
function addLayers(){
  for (var i = options.layers.length - 1; i >= 0; i--) {
    if (options.layers[i] == "heatmap"){

    }

    if (options.layers[i] == "scatterplot"){    

    }
  };
}

// Apply updated data set
function updateMap(data) {

  // Clear map
  leaflet_map.remove();

  draw(filtered_data);

  // @TODO:
  // Like, write this function

}

/****************************
        Filters
 ****************************/

// Initialize slider for time range
$("#slider").noUiSlider({
  start: [20, 80],
  connect: true,
  range: {
    'min': 0,
    'max': 100
  }
});

/****************************
        Interaction
 ****************************/

// Show/Hide sequential lines
$("#toggleConnections").click(function() {
  options.map_show_connections = !options.map_show_connections;
  d3.selectAll("line").style("opacity", options.map_show_connections ? 1 : 0);
});

/******************************
         Date Range Picker
  https://github.com/longbill/jquery-date-range-picker
 ******************************/

function initDateRangePicker(startdate, enddate) {

  // Set String Format for Moment.js dates
  var format = "MMMM Do YYYY";

  // convert unix timestamps to Moment.js dates
  var start = moment.unix(startdate);
  var end = moment.unix(enddate);

  // Initialize default values
  var msg = start.format(format) + " to " + end.format(format);

  $("#date-range").val(msg);

  DV.log("\nDate range: " + msg);

  // Initialize datepicker element
  var datepicker = $('#date-range').dateRangePicker({
    format: format,
    startDate: start.format(format),
    endDate: end.format(format),
    autoClose: true,
    shortcuts: {
      'prev-days': [3, 7, 30, 60],
      'prev': ['week', 'month', 'year'],
      'next-days': null,
      'next': null,
    },

    // Bind callback when date range is updated
  }).bind('datepicker-change', function(event, obj) {

    DV.log("\n Date Range Updated:");
    DV.log(obj.value);

    // Filter data set
    updateMap(filterByDate(moment(obj.date1).unix(), moment(obj.date2).unix()));
  })
};