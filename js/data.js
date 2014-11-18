/******************************
          Data.js 
 ******************************/
 
// Convert Google Location Data's .kml (renamed .xml)
// into a usable JSON format.
function loadData(next) {

  loadXML(convertData);

  // Load data from XML (kml) format
  function loadXML(next) {

    console.log("\nLoading XML ...");

    $.ajax({
      url: "/data/alex.xml",
      dataType: "xml"
    }).done(function(xmlData) {
      convertData(xmlData);
    });
  }

  // Convert data into usable format
  function convertData(xmlData) {

    console.log("\nXML Converted to JSON");

    // Convert XML to JSON. See: https://github.com/stsvilik/Xml-to-JSON
    var jsonData = xml.xmlToJSON(xmlData);

    // Extract location data from google location kml structure
    var data = jsonData.kml.Document.Placemark['gx:Track'];

    /******************************
	       Convert into Usable Format
	     ******************************/
    data = _.map(_.zip(data.when, data["gx:coord"]), function(point, key) {
      return {
        "date": point[0].Text,
        'location': point[1].Text.split(" "),
      };
    })

    next(data); // Callback
  }
}


// Format data into presentable format
function formatData(data, style) {

  if (style == "time") {
    return formatDataByTimeOfDay(data);
  } else if (style == "difference") {
    return formatDataByTimeDifference(data);
  }

  // Color-code points by time proximity
  // to noon (middle of day);
  function formatDataByTimeOfDay(points) {
    return _.map(points, function(point, key) {

      // Hour at which tracking event occured (0 -> 24)
      var hours = moment(point.date, moment.ISO_8601).hours();

      // Hours since noon, normalized to 0 -> 1
      var differenceScale = Math.abs(hours - 12) / 12;

      // Convert to corresponding color
      var color = getColor(differenceScale);

      return {
        id: key,
        date: point.date,
        type: "Alex",
        color: color,
        latitude: point.location[1],
        longitude: point.location[0],
      }
    })
  };

  function formatDataByTimeDifference(points) {
    
    // Time difference between current and previous point
    return _.each(points, function(point, key) {
      if (key == 0) {
        return;
      }

      var a = moment(point.date, moment.ISO_8601);
      var b = moment(points[key - 1].date, moment.ISO_8601);

      var difference = a.diff(b);

      // Low Time Difference:
      // More recorded points -> Green
      
      // High Time Difference
      // Fewer recorded points -> Red

      // Map number to color. 0 = red, 1 = green
      var color = getColor(difference / 160000);

      points[key] = {
        color: color,
        id: key,
        date: point.date,
        latitude: point.location[1],
        longitude: point.location[0],
        type: "Alex",
      };
    })
  }
}