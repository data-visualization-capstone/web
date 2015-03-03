
/****************************
          UI.js
   UI & DOM interactions.
 ****************************/


// Namespace UI Options
var UI = {};

// Loading Functionality
UI.loading = {
  
  // Support multiple asyc loads
  que : [],

  start : function(msg){
    console.log(this);
    console.log(UI.loading);
    $("#loading").show();
  },

  stop : function(msg){
    $("#loading").hide();
  },
};

  
// Show/Hide the side menu. Provide selector.
UI.toggleSideNav = function(element){
  var toggle = $(element);

  $(".ui_menu, " + element).toggleClass("out");
  toggle.html(toggle.hasClass("out") ? "Hide Menu" : "Show Menu");
}

// Fetch tweets
UI.getTweets = function(input){
  UI.loading.start("tweet");

  var string = $(input).val()

  if (!string) {
    console.error("Invalid Twitter String.")
    return;
  }

  DV.api.twitter.search(string, function(resp){
    UI.loading.stop("tweet");

    // Add layer
    UI.addLayer({
      name: "Twitter " + string,
      type: "scatterplot",
      color: getColor(Math.random(0, 100)),
      data : resp,
      width: 3,
    });

  }, function(){
    UI.loading.stop("tweet");

  })
}

/************************************
     Fix Checkboxs in Side Menu

     - problem with z-index

     - click label instead of checkbox
       to toggle checkbox
 ************************************/

$("label").click(function(){
    var checkbox = $(this).siblings("input[type=checkbox]").prop("checked");
    if(checkbox == true){
      $(this).siblings("input[type=checkbox]").prop("checked", false);
    } 
    else {
      $(this).siblings("input[type=checkbox]").prop("checked", true);
    }
});


var showOption = function(){
  $("input[type=radio]").each(function(){
    if($(this).prop("checked") == true){
      $(this).closest(".scaleOption").children(".optionBody").css("display", "block");
    }
    else{
      $(this).closest(".scaleOption").children(".optionBody").css("display", "none");
    }
  });  
} 

showOption();

$("label").click(function(){
    var checkbox = $(this).siblings("input[type=radio]").prop("checked");
    if(checkbox == true){
      $(this).siblings("input[type=radio]").prop("checked", false);
      showOption();
    } 
    else {
      $(this).siblings("input[type=radio]").prop("checked", true);
      showOption();
    }
});


  /*****************************************************
     Set Up Range Slider
 ******************************************************/

 // Set up the ranges for each class of slider 

$(".range.price").noUiSlider({
  start: [500, 4000],
  connect: true,
  range: {
    'min': 500,
    'max': 4000
  }
});

$(".range.footage").noUiSlider({
  start: [500, 4000],
  connect: true,
  range: {
    'min': 1000,
    'max': 2000
  }
});

// Link the range sliders spans
// Display current values of upper and lower handles

var linkInput = function(target){
  var thing = '.range.' + target+ '';
  console.log(thing);
  $('.range.' + target+ '').Link('lower').to($('.'+ target+ '_link_lower'));
  $('.range.' + target+ '').Link('upper').to($('.'+ target+ '_link_upper'));
}

linkInput('price');
linkInput('footage');



  /*****************************************************
     set colors for hashtags
 ******************************************************/

var colors = ["#A0E181", "#AE7AA9", "#718ECB", "#718ECB", "#FDB12E", "#00BCB2", "#00BCB2", "#8E2440"],
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

  $(this).toggleClass("active");
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

 /*****************************************************
   Add Tooptip functionality for hexagons/points ??
******************************************************/

 /**************************
      Helper Functions
****************************/

// Add Layer Object
// Refresh map.
UI.addLayer = function(layer){
  options.layers.push(layer);
  addLayers(options.layers);
}
