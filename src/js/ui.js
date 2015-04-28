
/****************************
       ~~ UI.js ~~
   UI & DOM interactions.
 ****************************/

// Namespace UI Options
var UI = {};

// Initialize wrapper
UI.elements = {};

//Shows/Hides Filtering for heatmap based on selected scale 
UI.toggleOption = function(){
  $("input[type=radio]").each(function(){

    if($(this).prop("checked") == true){
        $(this).closest(".scaleOption").children(".optionBody").css("display", "block");
    }
    else{
        $(this).closest(".scaleOption").children(".optionBody").css("display", "none");
    }
  }); 
} 

UI.addAboutModal = function(){
  $.ajax({ url: "../templates/about.html" })
  .done(function(content){
    $("body").append(content);
  })
}

UI.removeAboutModal = function(){

  // Flag the modal as seen
  localStorage.setItem("about_modal_read", true);

  // Make it go away
  $("#modal_wrapper").remove();
}

// Shows card to add filters
UI.elements.toggleFilterCard = function(){

  // enables and disables 'Explore...' button
  $("#add_filter, #add_filter_disabled").toggle();

  // shows '.add_card'
  $(".card.add_card").toggleClass("expanded"); 
}

// adds card to dom
UI.addCard = function(target){

  $.ajax({
    url: "/templates/card_templates/" + $(target).attr("card") + ".html"
  })
  .done(function( data ){

    // reset styles for "select data set"
    $("#select_set p").html("Select a data set");
    $("#select_set p").css("color", "#D4D4D4");

    // add card to DOM
    $("#added_cards").prepend(data);   

    if($("#select_set").attr("card") == "twitter_cached_card"){

      var card = $(".card:nth-of-type(1)"),
          header = $(".card:nth-of-type(1) .tweet_parameter"),
          button = $(".card:nth-of-type(1) a"),
          title = $("#select_set").attr("parameter"),
          capTitle = title.charAt(0).toUpperCase() + title.substring(1);


      header.html(capTitle);

      card.attr("visualization", "twitter_" + title);
      console.log("TITLE" + title)
      DV.twitter.addStream(title); 

    } 

    UI.elements.toggleFilterCard(); 
    
  });

}

UI.makeSelection = function(target){
  $("#select_set p").html($(target).html());
  $("#select_set p").css("color", "#000");
  $("#select_set").attr("card", $(target).attr("card"));
  if( $(target).attr("card") == "twitter_cached_card" ){

    $("#select_set").attr("parameter", $(target).attr("parameter"));

  }
  $("#select_list").removeClass("expanded");
  $("#select_list").empty();  
}

// @TODO: Fix bug when removing hexmap
UI.removeCard = function(target){ 
  var card = $(target).closest(".card");
  DV.layers.delete(card.attr("visualization"));
  $(target).closest(".card").remove();
}

// Seperate function to remove map layer
// since it's not a leaflet feature
UI.removeMap = function(target){
  $('.leaflet-tile-pane').hide();
  $(target).closest(".card").remove();
}

// Shows and hides dropdown menu to add filters
// Dynamically populates dropdown
UI.elements.toggleFilterList = function(){
  var list = $("#select_list");
  if(list.css("display") == "none"){

    // placholder for active layers
    var active_layers = [];

    // create list of all possible layer names
    var all_layers = Object.keys(options.layers);

    // create list of all active layer names
    for(i = 0; i < DV._layers.length; i++){
      active_layers.push(DV._layers[i].id);
    } 

    // itterate through all layers
    for(i = 0; i < all_layers.length; i ++){
      // Get name of current layer 
      var name = all_layers[i];

      console.log(name);

      // if the current layer NOT ACTIVE...
      if( $.inArray( name, active_layers ) < 0 ){
        
        if(name != "map" || $(".leaflet-tile-pane").css("display") == "none"){
              // create <a>
          var obj = document.createElement("A"),

              // create textnode containg name of layer
              text = document.createTextNode(options.layers[name].name);
          
          // Set class of object
          obj.setAttribute("class", "select_option");

          // prevents <a> from reloading page
          obj.setAttribute("href", "javascript:void(0)");

          // Which card gets added to the dom?
          obj.setAttribute("card", options.layers[name].card);

          if (options.layers[name].card == "twitter_cached_card") {
            obj.setAttribute("parameter", options.layers[name].parameter);
          };

          // Bind addCard function
          obj.setAttribute("onclick", "UI.makeSelection(this);");

          // put name in <a>
          obj.appendChild(text);

          // add whole object to dropdown
          document.getElementById("select_list").appendChild(obj);

        }
      }
      else{
        console.log("" + name + " is active");
      }
    }
  }
  else{
    list.empty();
  }
  list.toggleClass("expanded");  
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
    $('.range' + target).Link('lower').to($(target + '_link_lower'));
    $('.range' + target).Link('upper').to($(target + '_link_upper'));
  }

  // Bind spans to RS
  linkInput('.price');
  linkInput('.footage');
}
