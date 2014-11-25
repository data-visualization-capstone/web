Web
===========

> Front End Website for Data Visualization Capstone


Overview
---
A demo utilizing D3.js to create interactive maps on top of [Leaflet.js](http://leafletjs.com/).

Source
---

This repo contains a fork from Chris Zetter's [Voronoi maps](http://chriszetter.com/blog/2014/06/14/visualising-supermarkets-with-a-voronoi-diagram/) project - using D3 and Leaflet. You can find the [original project here](https://github.com/zetter/voronoi-maps).


#### Setup:

First install [Node](http://nodejs.org/download/)

Install node development dependencies from `package.json`:

`npm install`

Install bower packages from `bower.json`

`bower install`

Run a local Apache server. For Mac OSX users, I recommend using the MAMP app.
Load index.html for your local server. In the case of MAMP, open localhost:888

#### Grunt Tasks:

We use Grunt to do things like compile LESS and concatenate JS libraries. Run `grunt` or `grunt watch` to run the default task which will build the app every time source files are saved. This is configured in `Gruntfile.js`

License
---

The code is released under the The MIT License. Data used remains copyright of their respective owners.

Special Thanks
---

Convert Google Location Data's .kml file into a usable JSON object.

Thanks to stsvilik's Xml-to-JSON converter.

https://github.com/stsvilik/Xml-to-JSON

Thanks to Chris Zetter and his [guide using D3 with Leaflet](http://chriszetter.com/blog/2014/06/15/building-a-voronoi-map-with-d3-and-leaflet/). His blog post provided the initial code and instructions for mapping on top of Leaflet.
