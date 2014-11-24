
/******************************
         api.js 
 ******************************/

// Reference on XHR callbacks
// http://stackoverflow.com/questions/5485495/how-can-i-take-advantage-of-callback-functions-for-asynchronous-xmlhttprequest

// Define global DV (Data Visualization) Object
// 
var DV = {
	api : {},
	url : "http://localhost:8080/",
};

// GET
// takes target URL, callback, callback
DV.api.get = function(url, success, error){
	var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(){
      
      // If call is complete & successfull
      if (xhr.readyState == 4 && xhr.status == 200) {
        var resp = JSON.parse(xhr.response);
        console.log(resp);

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