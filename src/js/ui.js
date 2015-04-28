
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
    $("#added_cards").prepend(data);
    $("#select_set p").html("Select a data set");
    $("#select_set p").css("color", "#D4D4D4");    
    UI.elements.toggleFilterCard();    
  });

}

UI.makeSelection = function(target){
  $("#select_set p").html($(target).html());
  $("#select_set p").css("color", "#000");
  $("#select_set").attr("card", $(target).attr("card"));
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

  list.toggleClass("expanded");
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

    // if the current layer NOT ACTIVE...
    if( $.inArray( name, active_layers ) < 0 ){
      
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

      // Bind addCard function
      obj.setAttribute("onclick", "UI.makeSelection(this);");

      // put name in <a>
      obj.appendChild(text);

      // add whole object to dropdown
      document.getElementById("select_list").appendChild(obj);

    }
    else{
      console.log("" + name + " is active");
    }
  }
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
