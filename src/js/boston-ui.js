
/****************************
       ~~ UI.js ~~
   UI & DOM interactions.
 ****************************/

// Namespace UI Options
var UI = {};

// Initialize wrapper
UI.elements = {};


// Initialize Checkbox 
// & Fix Semantic UI Checkbox Bug
// Example: checkbox("#box", function(){}, function(){});
UI.elements.layerCheckbox = function(selector, layer){

  // Select Label
  var label = $(selector).siblings("label");
  // Bind action to label
  label.click(function(e) {

    // Get checkbox's status
    var checked = $(this).siblings("input[type=checkbox]").prop("checked");
    console.log(this + " " + checked);

    // Enable - Add Layer
    if (checked) {
        DV.layers.deleteLayer(layer.id);        
        $(this).siblings("input[type=checkbox]").prop("checked", false);         
    
    //  Disable - Remove Layer
    } else {
        DV.layers.addLayer(layer);        
        $(this).siblings("input[type=checkbox]").prop("checked", true);               
    }
  });
}

// Opens and Closes UI Sections
var showOption = function(){

  // Target's RADIO elements
  $("input[type=radio]").each(function(){

    // If it's checked, 
    if($(this).prop("checked") == true){
      $(this).closest(".scaleOption").children(".optionBody").css("display", "block");
    }
    else{
      $(this).closest(".scaleOption").children(".optionBody").css("display", "none");
    }
  });  
} 

// Determines what will be used for SCALE of HEATMAP
// - Rent Price
// - Number of Bedrooms
// - Square Footage
UI.elements.heatmapScale = function(selector){

  // Select Label
  var label = $(selector).siblings("label");

  // Bind action to label
  label.click(function(e) {

    // Get radio's status
    var checked = label.siblings("input[type=radio]").prop("checked");
    console.log(this + " " + checked);

    // Enable - Change Heatmap Scale
    if (!checked) {       
      label.siblings("input[type=radio]").prop("checked", true);
      showOption();         
    }
  });
}
/**************************
     DOM Manipulation
****************************/

// Show/Hide the side menu.
// Take a selector to manipulate the DOM
UI.toggleSideNav = function(element){
  
  // Toggle Button
  var toggle = $(element);

  // Show/Hide Button
  $(".ui_menu, " + element).toggleClass("out");

  // Set Text
  toggle.html(toggle.hasClass("out") ? "Hide Menu" : "Show Menu");
}

// Toggles a pre-set tweet.
// take in the DOM element that was clicked.
// example: <li onclick="UI.toggleTweet(this)"....
UI.toggleTweet = function(obj){
    
    // Show loading indicator.
    Loading.start("tweet");  

    // The DOM element that was selected
    var object = $(obj);

    // Get list of classes on that DOM element.
    var classes = object.attr('class');

    // Is this tweet active? 
    var active = classes.indexOf("active") > -1;

    // Get the content of that DOM element.
    var string = object.html();

    // Toggle Off
    if (active) {

      // Remove layer
      DV.layers.deleteLayer("tweet" + string);

      Loading.stop("tweet");

      // Toggle Class
      object.removeClass("active")

    // Toggle On
    } else {

      // Get tweets that were cached from the stream.
      DV.twitter.stream(string, function(resp){
        
        // Add layer
        DV.layers.addLayer({
          name: "Twitter " + string,
          type: "scatterplot",
          color: DV.utils.getColor(Math.random(0, 100)),
          data : resp,
          width: 3,
        });

        object.addClass("active")

        Loading.stop("tweet");

      }, function(){

        // @TODO User Feedback

        object.addClass("active")
        Loading.stop("tweet");

      });

    }
}

// Fetch tweets
UI.searchForTweet = function(input){
  
  // Show loading indicator.
  Loading.start("tweet");

  // String to search by
  var string = $(input).val()

  // Error Checking
  if (!string) {
    
    // @TODO: User Feedback

    console.error("Invalid Twitter String.");
    return;
  }

  // Get data from API
  DV.twitter.search(string, function(resp){
    
    // Add layer
    DV.layers.addLayer({
      name: "Twitter " + string,
      type: "scatterplot",
      color: DV.utils.getColor(Math.random(0, 100)),
      data : resp,
      width: 3,
    });

    Loading.stop("tweet");

  }, function(){

    // @TODO User Feedback

    console.error("Error fetching tweets...");
    Loading.stop("tweet");

  })
}


// Initializes ALL RANGE SLIDERS (RS)
UI.initializeSliders = function(){

  // Initialize RS for PRICE
  $(".range.price").noUiSlider({
    start: [500, 4000],
    connect: true,
    range: {
      'min': 500,
      'max': 4000
    }
  });

  // Initialize RS for SQUARE FOOTAGE
  $(".range.footage").noUiSlider({
    start: [500, 4000],
    connect: true,
    range: {
      'min': 1000,
      'max': 2000
    }
  });

  // Link the range sliders to spans
  // Display current values of upper and lower handles
  linkInput = function(target){
    var thing = '.range' + target+ '';

    $('.range' + target).Link('lower').to($(target + '_link_lower'));
    $('.range' + target).Link('upper').to($(target + '_link_upper'));
  }

  linkInput('.price');
  linkInput('.footage');
}



/*****************************************************
        set colors for hashtags
******************************************************/

var colors = ["#A0E181", "#AE7AA9", "#718ECB", "#EA7572", "#FDB12E", "#00BCB2", "#7935FF", "#8E2440"],
    hashtags = Array.prototype.slice.call(document.querySelectorAll(".hashtag"));

for(var i = 0; i < hashtags.length; i++){
hashtags[i].setAttribute("color", ""+colors[i]+"");
}

function colorize(){

  $(".hashtag").each(function(){
    if($(this).hasClass("active")){
      $(this).css("background-color", $(this).attr("color")).css("color", "#fff");
    } else{
      $(this).css("background-color", "#E0E0E0").css("color", "rgba(0,0,0,0.8)");
    }
  });            
}

$(".hashtag").click(function(){

  // $(this).toggleClass("active");
  colorize();

});

$(".hashtag").hover(
  function(){
    if($(this).hasClass("active") != true){
      $(this).css("background-color", $(this).attr("color")).css("color", "#fff");
    }
  },
  function(){
    if($(this).hasClass("active") != true){
      $(this).css("background-color", "#E0E0E0").css("color", "rgba(0,0,0,0.8)");
    }
  }

);

colorize();

/**************************
    Loading Indicator
****************************/

// Loading Functionality
Loading = {

  // Start Loading
  start : function(msg){ $("#loading").show(); },

  // Stop Loading
  stop : function(msg){  $("#loading").hide(); },
};
