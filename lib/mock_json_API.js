// node script for generating .json files
// I was struggling too much with node and ended up doing this in ruby...
// Going to look at it again later, but would appeciate help

var fs = require("fs"),
    xml2js = require("xml2js"),
    http = require("http"),
    _ = require("underscore-node"),
    moment = require("moment")

alexData = fs.readFileSync(__dirname + '/alex.xml');

writeJSON(parseXML(alexData), '/result.json');

function writeJSON(data, filename) {
  fs.writeFileSync(__dirname + filename, JSON.stringify(data));
}

function parseXML(data) {
  var parser = new xml2js.Parser();

  parser.parseString(data, function (err, result) {
    if (err) throw err;

    // Get the GPS data object
    data = result['kml']['Document'][0]['Placemark'][0]['gx:Track'][0];

    result = _.map(_.zip(data['when'], data["gx:coord"]), function(point, key) {
      return {
        'date': point[0],
        'location': point[1].split(" ")
      };
    });

    return result
  });
};


