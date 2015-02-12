Web
===========

> Front End Website for Data Visualization Capstone.


Overview
---

A Data Visualization Project utilizing GPS data. Demo utilizes D3.js to create interactive maps on top of [Leaflet.js](http://leafletjs.com/).

Setup:
----

1.) Download repository from GitHub

```javascript
$ cd ~/path/to/folder/web
$ git clone git@github.com:data-visualization-capstone/web.git
```

2.) Install [Node](http://nodejs.org/download/). Node should come with Node Package Manager (npm)

> Node Package Manager (NPM) is used for managing packages and dependenices.

3.) Download Node dependencies

```javascript
$ npm install
```

4.) Download Front End Dependencies from bower.json:

```javascript
$ bower install
```

5.) Install Grunt (Task Manager)

```javascript
$ sudo npm install -g grunt
$ sudo npm install -g grunt-cli
```

6.) Run a Local Web Server

```javascript
$ npm start
```
> Starts a local web server. You may now access this project from: http://localhost:8080

Grunt Tasks:
---

We use Grunt to do things like compile LESS and concatenate JS libraries. Run `grunt` or `grunt watch` to run the default task which will build the app every time source files are saved. This is configured in `Gruntfile.js`

License
---

The code is released under the The MIT License. Data used remains copyright of their respective owners.

Special Thanks
---

For converting Google Location Data's .kml file into a usable JSON object, thanks to stsvilik's [Xml-to-JSON converter](https://github.com/stsvilik/Xml-to-JSON).

For the original demo of utilizing D3.js on top of Leaflet, we followed Chris Zetter's [Voronoi maps](http://chriszetter.com/blog/2014/06/14/visualising-supermarkets-with-a-voronoi-diagram/) guide. You can find the [original project here](https://github.com/zetter/voronoi-maps).
