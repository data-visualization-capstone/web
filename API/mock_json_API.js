// node script for generating .json files
// node mock_json_API.js

var fs = require("fs"),
    xml2js = require("xml2js"),
    http = require("http"),
    _ = require("underscore-node");

convertData('/alex.xml', 'API/result.json');

function convertData(xmlPath, jsonResultPath) {
  var parser = new xml2js.Parser();
  var data = {};

  // Read the XML File
  fs.readFile(__dirname + '/alex.xml', function(err, data) {
      parser.parseString(data, function (err, result) {
        if (err) throw err;

        console.log("XML converted into JSON...\n");

        // Get the GPS data object
        data = result['kml']['Document'][0]['Placemark'][0]['gx:Track'][0];

        result = _.map(_.zip(data['when'], data["gx:coord"]), function(point, key) {
          return {
            "date": point[0],
            'location': point[1].split(" "),
          };
        });

        fs.writeFile(jsonResultPath, JSON.stringify(result));
      });
  });
}

