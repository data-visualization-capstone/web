/******************************
          Data.js
     Loading Usable Data
 ******************************/

// Load data from source
function loadData(source, next) {
  
  // JSON
  if (source == "json") {
    loadJSON(next);
  
  // XML
  } else if (source == "xml"){
    loadXML(next);
  
  // API
  } else {
    loadAPI(next);
  }
}

// Load data from a JSON file
function loadJSON(next){
  DV.log("\nLoading JSON file ...");

  var url = options.data_file;
  
  $.ajax({
    url: url,
    dataType: "json"
  }).done(function(result) {
    
    // Format data into flat object.
    var data = _.map(result, function(point){
      return {
        userId: point.userId,
        date : point.date,

        // Data may come back with a lat/long key, or a location object
        latitude : (point.latitude) ? point.latitude : point.location[1],
        longitude : (point.longitude) ? point.longitude : point.location[0],
      }
    })

    DV.log("JSON data loaded.")

    next(data);

  });
}

// Load data from an XML file
// Convert Google Location Data -> JSON
function loadXML(next){
  DV.log("\nLoading XML file ...");

  var url = options.data_file;

  $.ajax({
    url: url,
    dataType: "xml"
  }).done(function(xmlData) {
    DV.log("XML data loaded.")
    convertData(xmlData, next);
  });

  // Convert XML into JSON
  function convertData(xmlData, next) {

    // Convert XML to JSON. https://github.com/stsvilik/Xml-to-JSON
    var jsonData = xml.xmlToJSON(xmlData);

    // Extract location data from google location kml structure
    var data = jsonData.kml.Document.Placemark['gx:Track'];

    // Flatten each data point into usable format
    data = _.map(_.zip(data.when, data["gx:coord"]), function(point, key) {
      
      var location = point[1].Text.split(" ");

      return {
        "date": point[0].Text,
        "latitude" : location[1],
        "longitude" : location[0],
      };
    })

    // callback
    next(data);
  }
}

// Load data from our API
function loadAPI(next){
  DV.log("\nLoading API data ...");

  DV.api.get("locations", function(resp){
    
    DV.log("API data loaded.")
    next(resp);

  },function(resp){
    DV.log("Error loading data from API.")
  })
}

/******************************
      Formatting Data
 ******************************/

// Remove all entries from given data that do not
// contain atleast an instance of each required key
function removeInvalidData(data, requiredKeys){
  return _.filter(data, function(point){
    return _.reduce(requiredKeys, function(acc, key){
      return acc && (key in point);
    })
  })
}

// Format data into presentable format
function formatData(data, style) {

  if (style == "time") {
    return formatDataByTimeOfDay(data);
  } else if (style == "difference") {
    return formatDataByTimeDifference(data);
  } else {
    DV.log("Error. Incorrent format style specified");
  }
}

// Color-code points by time proximity
// to noon (middle of day);
function formatDataByTimeOfDay(points) {

  return _.map(points, function(point, key) {

    // Hour at which tracking event occured (0 -> 24)
    var hours = moment.unix(point.date).hours();

    // Hours since noon, normalized to 0 -> 1
    var differenceScale = Math.abs(hours - 12) / 12;

    // Convert to corresponding color
    point.color = getColor(differenceScale);
    point.type = "Alex";
    
    return point;    
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

    // More recorded points = Green
    // High Time Difference = Fewer recorded points -> Red

    // Map number to color. 0 = red, 1 = green
    var color = getColor(difference / 160000);

    points[key] = {
      color: color,
      id: key,
      date: point.date,
      latitude: point.latitude,
      longitude: point.longitude,
      type: "Alex",
    };
  })
}

function addUserId(data, userId){
return _.map(data, function(p){

    // Format location object
    return {
      userId : userId,
      latitude : p.latitude,
      longitude : p.longitude,
      date : p.date,
    }
  }) 
}

function contertDatesToUnix(data){
  return _.map(data, function(p){
    return {
      userId : p.userId,
      latitude : p.latitude,
      longitude : p.longitude,
      date : new moment(p.date).unix(),
    }
  })
}