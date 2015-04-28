# Data Visualization Capstone
> Front End Website for Data Visualization Capstone.
===========

* Our goal was to provide a tool that users could use to explore and compare a variety of different data sources. *

Demo
---
See an example: [vent8225.dyndns.org](http://vent8225.dyndns.org)

Documentation
---

** This Living Cities case study contextualizes Boston’s average rent prices with other relevant information. This additional context includes Boston neighborhood borders, MBTA lines, and social media posts within the city. By combining this information in a single tool, we seek to facilitate a greater understanding of where the viewer might want to live in Boston. **

Utilizing Leaflet.js and D3.js, this projects builds interactive maps of GPS and Geolocation data.


Development
---

```javascript

# Download the repository from GitHub
$ cd ~/path/to/folder/
$ git clone git@github.com:data-visualization-capstone/web.git

# Install Node.js & Node Package Manager (npm)
# Download node dependencies
$ npm install

# Download front-end dependencies
$ bower install

# Install Grunt (Task Manager)
$ sudo npm install -g grunt
$ sudo npm install -g grunt-cli

# Run Grunt to compile the project
$ grunt
```

> We use Grunt to do things like compile LESS and concatenate JS libraries. Run `grunt` or `grunt watch` to run the default task which will build the app every time source files are saved. This is configured in `Gruntfile.js`

```javascript
# Run a Simple HTTP Server.
$ npm start
```

You may now access this project from: http://localhost:8080.
You'll notice that the project utilizes our API on our
production server. Please see our [API Repository](https://github.com/data-visualization-capstone/api) for the Node.js API.


Logic
---

DV is an object for rendering layers onto a Leaflet.js map. Residing in map.js, DV's goal is to convert a set of "Layer" objects into their corresponding Leaflet representation. I found that one of the largest downsides of Leaflet.js is it's lack of 'CRUD' support (Create, Read, Update, Delete) for layers. My goal was to build an abstraction level for making modifying map data a more manageable task. 

#### Instantiating

First, declare a Leaflet.js Map in the DOM:

```html
<div id="map"></div>
```

See the following example for how to instantiate a map:


```javascript

/************************************
     Map Initialization Options
 ************************************/

var options = {

  // Mapbox's style key for applying map designs
  map_key: "stephalee.aec4ccea",

  // Define default map viewport: 
  // Top left & bottom right coordinates
  // For reference, Boston is:
  // 42.3601° N (lat), 71.0589° W (long), or -71
  
  viewport: [
    [42.329077, -71.108871],
    [42.374200, -71.032072]
  ],

  // Available layers
  layers : [],
}

/************************************
          Initialize Map
 ************************************/

// Global variable for map object
// Initialize Leaflet map
var map = L.mapbox.map('map', options.map_key, {
  minZoom: 12,
  maxZoom: 16,
}).fitBounds(options.viewport);

// Add layers when the map is ready.
map.on('ready', function(){ DV.update(); })

// Re-add layers when the map has changed.
map.on('viewreset', function(){ DV.update(); })

```

#### Layers

Here's why the magic of our 'DV' object happens.

> Each layer is represented as an easily readable set of key-values.

Layers are configurable in a number of ways. For example:

```javascript

var layer = {
  
  // Name the Layer
  name : "Orange Line",

  // Define the Type of Layer.
  // on of: 'path', 'scatterplot', "geojson", or 'hex'
  type: "path",

  // Provide a dataset. Here we pull a dataset from local memory
  data : sample_data.subway.orange,
  
  // Define the pixel width of the data
  width: 5,

  // Define a color for the data. If no color is
  // specified on an individual point, the graph
  // will default to the layer color.
  color: "#ffa500",

  // Custom function to filter data set.
  // Use to remove duplicates or process.
  // Returns a boolean
  filter : function(point){
    return point.value > 2000;
  },

  // Apply function to every point
  // Useful for computing color.
  // Returns the point in the array
  map : function(point){
    return point;
  },
};

```

Once we know what a layer looks like, we can use the following functions to manipulate our map:

```javascript

// PUT - Add a layer to the map.
// See above for an example of a 'layer' object
DV.layers.add = function(layer){
}

// SET - Update a layer from the settings.
// See above for an example of a 'layer' object
DV.layers.update = function(layerId, layer){
}

// DELETE - Delete a layer from the map.
DV.layers.delete = function(id){
}

// Find a layer. Requires a key and a value,
// and returns a match if it exists
DV.layers.find = function(key, value){
}

// Clear current layers
DV.layers.clear = function(){
}

```

Authors
---

- [Alex Johnson](https://github.com/alexjohnson505)
- [Benjamin Leichter](https://github.com/benjaminleichter)
- [Dana Bucci](https://github.com/danabucci)
- [Stephanie Lee](https://github.com/stephalee)
- [Josh Olsen]()
- [Daniel Hartman](https://github.com/dj)

License
---

The code is released under the The MIT License. Data used remains copyright of their respective owners.

Special Thanks
---

> Dependencies

- [Leaflet.js - Open Source Library for Interactive Maps](leafletjs.com)
- [Node.js](http://nodejs.org/)
- [Underscore.js](http://underscorejs.org/)
- [D3.js Hexbins](https://github.com/d3/d3-plugins/tree/master/hexbin)
- [Moment.js](http://momentjs.com/)
- [Semantic UI](http://semantic-ui.com/)

> Data

- [Jeff Kaufman's work with Boston Apartent Prices](https://github.com/jeffkaufman/apartment_prices/)
- [Google Location History](https://maps.google.com/locationhistory/b/0)
- MBTA Subway Station Data
- [Twitter's Search & Stream APIs](https://dev.twitter.com/overview/documentation)

> Tutorials

For converting Google Location Data's .kml file into a usable JSON object, thanks to stsvilik's [Xml-to-JSON converter](https://github.com/stsvilik/Xml-to-JSON).

For the original demo of utilizing D3.js on top of Leaflet, we followed Chris Zetter's [Voronoi maps](http://chriszetter.com/blog/2014/06/14/visualising-supermarkets-with-a-voronoi-diagram/) guide. You can find the [original project here](https://github.com/zetter/voronoi-maps).