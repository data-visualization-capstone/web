
/******************************
         Filtering.js 
 ******************************/

// Subset "filtered_data" by the provided start & end date.
function filterByDate(startdate, enddate) {

  // DV.log("\nFiltering by date range: " + startdate + " to " + enddate);

  filtered_data = _.filter(raw_data, function(p) {

    // Passes filter if:
    a = startdate < p.date;
    b = enddate > p.date;
    return a && b;
  })

  DV.log("\n" + raw_data.length + " points filtered by time range to " + filtered_data.length + " points");

  return filtered_data;
}

showHide = function(selector) {
  d3.select(selector).select('.hide').on('click', function(){
    d3.select(selector)
      .classed('visible', false)
      .classed('hidden', true);
  });

  d3.select(selector).select('.show').on('click', function(){
    d3.select(selector)
      .classed('visible', true)
      .classed('hidden', false);
  });
}

////////////////////////////////////////////
// Functions for filtering points by date //
////////////////////////////////////////////

// TODO: Make this function better 
// - should not work if no points are displayed  
// - should be able to display data for all days of selected month
// - should store month and corresponding number as key-value pair
//    september : 9, october : 10, etc. 

// filter = function (month, day){
//   $("circle").each(function(){
//     var thisDate = $(this).attr("date").substring(0, 10).split("-"),
//         thisMonth = Number(thisDate[1]),
//         thisDay = Number(thisDate[2]);

//     if(thisMonth != month && thisDay != day){
//       $(this).parent("g").hide();
//     } else if($(this).parent("g").css("display") == "none"){
//       $(this).parent("g").show();
//     }
//   });
// }

// makeDays = function (month){
//   var thirtyDay = [9, 4, 6, 11];
//   for(i = 0; i < 3; i ++){
//     if(Number(month) == thirtyDay[i]){
//       for(i = 1; i < 31; i++){
//         $("#day").append("<option>"+i+"</option>");
//       }
//     } 
//     else if(Number(month) != 2){
//       for(i = 1; i < 30; i++){
//         $("#day").append("<option>"+i+"</option>");
//       }
//     }
//     else{
//       for(i = 1; i < 29; i++){
//         $("#day").append("<option>"+i+"</option>");
//       } 
//     }
//   }
// }

// clearFilter = function (){
//   $("circle").parent("g").show();
//   $("#month").val("month");
//   $("#day").val("day");
// }