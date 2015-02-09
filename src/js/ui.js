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