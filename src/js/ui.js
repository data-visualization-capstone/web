
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

// SHITTY CODE FOR RISE
// UI.hideApartments = function(){
//   $("#ui_apartment").hide();
//   DV.layers.delete('hexmap');
// }

// UI.showRed = function(){
//   if($("#red_line").prop("checked") == true){
//     DV.layers.add(red_line);
//   }
//   else{
//     DV.layers.delete('redline');
//   }
// }
// UI.showOrange = function(){
//   if($("#orange_line").prop("checked") == true){
//     DV.layers.add(orange_line);
//   }
//   else{
//     DV.layers.delete('orangeline');
//   }
// }

UI.hideMBTA = function(){
  $("#ui_mbta").hide();
  DV.layers.delete('orangeline');  
  DV.layers.delete('redline');  
  $("#red_line").prop("checked", false);
  $("#orange_line").prop("checked", false);
}

// Shows card to add filters
UI.elements.toggleFilterCard = function(){

  // enables and disables 'Explore...' button
  $("#add_filter, #add_filter_disabled").toggle();

  // shows '.add_card'
  $(".card.add_card").toggleClass("expanded"); 
}

// Shows and hides dropdown menu to add filters
UI.elements.toggleFilterList = function(){
  $("#select_list").toggleClass("expanded");
}

// adds card to 
UI.addCard = function(target){

  $.ajax({
    url: "/templates/card_templates/" + $(target).attr("card") + ".html"
  })
  .done(function( data ){
    $("#menuBody").append(data);

    // Hides filter list
    UI.elements.toggleFilterList();
    UI.elements.toggleFilterCard();    
  });

}
 

// UI.elements.expandElement = function(selector){
//     if(selector == '.card.add_card'){
//       $("#add_filter, #add_filter_disabled").toggle();          
//     }  

//     if(selector == '#select_list'){

//       $(".select_option").click(function(){
//         if($(this).attr("icon") == "home"){
//           $("#ui_apartment").show();
          
//           $("#ui_apartment .card_delete a").click(function(){
//             UI.hideApartments()
//           });

//           DV.layers.add(options.layers.apartments);

//           UI.elements.expandElement("#select_list");          
//         }
//         else if($(this).attr("icon") == "subway"){
//           $("#ui_mbta").show();

//           $("#ui_mbta .card_delete a").click(function(){UI.hideMBTA()});

//           $("#red_line").click(function(){
//             UI.showRed();         
//           });

//           $("#orange_line").click(function(){
//             UI.showOrange();
//           });

//           DV.layers.add(options.layers.mbta)
//         }
//         if($(this).attr("icon") == "neighborhoods"){
//           $("#ui_neighborhoods").show();
          
//           $("#ui_neighborhoods .card_delete a").click(function(){
//             UI.hideApartments()
//           });

//           DV.layers.add(options.layers.neighborhoods);

//           UI.elements.expandElement("#select_list");          
//         }

//         UI.elements.expandElement(".card.add_card");          
//       });    
//     }

//     $("" + selector + "").toggleClass("expanded");
// }



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
// UI.toggleTweet = function(obj){
    
//     // Show loading indicator.
//     Loading.start("tweet");  

//     // The DOM element that was selected
//     var object = $(obj);

//     // Get list of classes on that DOM element.
//     var classes = object.attr('class');

//     // Is this tweet active? 
//     var active = classes.indexOf("active") > -1;

//     // Get the content of that DOM element.
//     var string = object.html();

//     // Toggle Off
//     if (active) {

//       // Remove layer
//       DV.layers.delete("tweet" + string);

//       Loading.stop("tweet");

//       // Toggle Class
//       object.removeClass("active")

//     // Toggle On
//     } else {

//       // Get tweets that were cached from the stream.
//       DV.twitter.getStream(string, function(resp){
        
//         // Add layer
//         DV.layers.add({
//           name: "Twitter " + string,
//           type: "scatterplot",
//           color: DV.utils.getColor(Math.random(0, 100)),
//           data : resp,
//           width: 3,
//         });

//         object.addClass("active")

//         Loading.stop("tweet");

//       }, function(){

//         // @TODO User Feedback

//         object.addClass("active")
//         Loading.stop("tweet");

//       });

//     }
// }


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



/**************************
    Adding a Card
****************************/
// UI.newCard = function(icon_class, header){

//   var menu = document.getElementById("menuBody"),
//       card = document.createElement("DIV"),
//       left = document.createElement("DIV"),
//       right = document.createElement("DIV"),
//       title = document.createElement("H3"),
//       title_text = header,
//       title_text = document.createTextNode(title_text),
//       icon_class = "fa fa-" + icon_class + " fa-2x",
//       icon = document.createElement("I");

//   card.setAttribute("class", "card");
//   left.setAttribute("class",  "card_left");
//   right.setAttribute("class", "card_right");
//   icon.setAttribute("class", icon_class);

//   title.appendChild(title_text);


//   left.appendChild(icon);
//   right.appendChild(title);

//   card.appendChild(left);
//   card.appendChild(right);
  
//   menu.appendChild(card);
  
//   return card;

