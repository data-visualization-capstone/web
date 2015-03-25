# Data Visualization Capstone

===========

> Front End Website for Data Visualization Capstone.


Overview
---

This project aims to provide an easy to use graphing library. Utilizing Leaflet.js and D3.js, this projects builds interactive maps of GPS and Geolocation data.

Demo
---
See an example: [vent8225.dyndns.org](http://vent8225.dyndns.org)

Documentation
---

> How the library works.

#### Summary

### Grab Dependencies:

```javascript

```

Declate a Leaflet.js Map in the DOM:

```html
<div id="map"></div>
```

#### Options

Initializing the project requires an "options" object. The Options object contains a number of parameters.

```javascript

var options = {

  // Mapbox's style key for applying map designs
  map_key: "stephalee.aec4ccea",

  // Define default map viewport: Top left & bottom right coordinates
  viewport: [
    [42.329077, -71.108871],
    [42.374200, -71.032072]
  ],

  // Support multiple layers of data representation.
  // Useful for building correlations between data sets.
  layers : [],
}

```

#### Layers

Each layer corresponds to a layer/data set on the graph. Layer are configurable in a number of ways. For example:

```javascript

options.layers.push({
  
  // Name the Layer
  name : "Orange Line",

  // Define the Type of Layer.
  // on of: 'path', 'scatterplot', or 'hex'
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
});

```

Running Locally:
----

1.) Download repository from GitHub

```javascript
$ cd ~/path/to/folder/
$ git clone git@github.com:data-visualization-capstone/web.git
```

2.) Install [Node](http://nodejs.org/download/). Node should come with Node Package Manager (npm)

> Node Package Manager (NPM) is used for managing packages and dependenices.


```javascript
// Download Node dependencies
$ npm install

// Download Front End Dependencies from bower.json:
$ bower install

// Compile Project
// We use Grunt to do things like compile LESS and concatenate JS libraries. Run `grunt` or `grunt watch` to run the default task which will build the app every time source files are saved. This is configured in `Gruntfile.js`
$ grunt

// Run a Local Web Server
// Using Node's Simple HTTP Server.

$ npm start
```

You may now access this project from: http://localhost:8080

Authors
---
- [Dana Bucci]()
- [Daniel Hartman]()
- [Alex Johnson]()
- [Benjamin Leichter]()
- [Stephanie Lee]()
- [Josh Olsen]()

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