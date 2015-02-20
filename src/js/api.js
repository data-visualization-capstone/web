
var development = true; 

/******************************
         api.js 
 ******************************/

// Define global DV (Data Visualization) Configurations

var DV = {
	
  // Define common CRUD functions
  api : {},

  // Is this a development configuration?
  // Disables logging, and debug information
  // for production environments.
  development : development,

  // Target API
  url : (development) ? "http://localhost:8080/" : "http://vent8225.dyndns.org:8080/",
};

/******************************
      CRUD Functionality
 ******************************/

// Reference on XHR callbacks
// http://stackoverflow.com/questions/5485495/how-can-i-take-advantage-of-callback-functions-for-asynchronous-xmlhttprequest

// GET
// takes target URL, callback, callback
DV.api.get = function(url, success, error){
	var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(){
      
      // If call is complete & successfull
      if (xhr.readyState == 4 && xhr.status == 200) {
        var resp = JSON.parse(xhr.response);
        success(resp);

      } else if (xhr.readyState == 4 && xhr.status != 200) {
        console.log("API Call Error.");
        console.log(xhr.response);

        error(xhr);
      }
    };

    xhr.open("GET", DV.url + url, false);
    xhr.send();
}

DV.api.post = function(url, params, success, error){
	var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(){
      
      // If call is complete & successfull
      if (xhr.readyState == 4 && xhr.status == 200) {
        success(JSON.parse(xhr.response));

      } else if (xhr.readyState == 4 && xhr.status != 200) {
        console.log("API Call Error.");
      
        error(xhr);
      }
    };

	xhr.open("POST", DV.url + url, false);

    // Send the proper header information along with the request
  	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  	// xhr.setRequestHeader("Connection", "close");
    
    // var params = JSON.stringify(params);
    // console.log(params);
    xhr.send(params);
}