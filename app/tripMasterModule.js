/*
    Load trip Data from response json
*/
import tripData from './resources/response.json';
/*
    underscore library
*/
import _ from './resources/underscore-min.js';

/*
    declaring variable arrays for constructing routes structures
*/
var allDepartures       = [];
var allArrivals         = [];
var tripMapByRef        = [];
var tripMapByDeparture  = [];
var tripMapByRoute      = [];
var resultRoutes        = [];
var currency            = tripData.currency;

/*
    Traverse routes for constructing routes structures
*/
tripData.deals.forEach(function(deal){
    if(_.indexOf(allDepartures, deal.departure)==-1)
        allDepartures.push(deal.departure);
    if(_.indexOf(allArrivals, deal.arrival)==-1)
        allArrivals.push(deal.arrival);
    tripMapByRef[deal.reference] = deal;
    tripMapByDeparture[deal.departure] = [];
    if(tripMapByRoute[deal.departure+"_"+deal.arrival]==undefined)tripMapByRoute[deal.departure+"_"+deal.arrival]=[];
    tripMapByRoute[deal.departure+"_"+deal.arrival].push(deal.reference);
    tripData.deals.forEach(function(pdeal){
        if(deal.departure==pdeal.departure && _.indexOf(tripMapByDeparture[deal.departure], pdeal.arrival)==-1){
            tripMapByDeparture[deal.departure].push(pdeal.arrival);
        }
    });
});

/*
    All sorted unique departures and arrivals
*/
allDepartures = allDepartures.sort();
allArrivals   = allArrivals.sort();

/*
    Method to get all routes between two places
    Recursive method
*/
function findRouteBetween(departure, arrival, historyString){
    if(historyString == undefined)historyString = departure;
    tripMapByDeparture[departure].forEach(function(dept){
        if(dept!=arrival){
          if(historyString.indexOf(dept)==-1){
              findRouteBetween(dept, arrival, historyString+","+dept);
          }
        }
        else{
            //construct with route id
            resultRoutes.push(historyString+","+ arrival);
        }
    });
}

/*
    Method to get cheapest option for a route
*/
function processCheapestRoutes(routeString){
    var routeRef = "";
    var routes = routeString.split(",");
    for(var i=0; i < routes.length - 1; i++){
        var rArr = tripMapByRoute[routes[i]+"_"+routes[i+1]];
        var cheapest = 0;
        var cheapRoute = "";
        rArr.forEach(function(rRef){
            var deal = tripMapByRef[rRef];
            var dealValue = deal.cost - (deal.cost * deal.discount / 100);
            if(dealValue < cheapest || cheapest == 0){
                cheapest = dealValue;
                cheapRoute = rRef;
            }
        });
        if(routeRef!=''){
            routeRef = routeRef + "," + cheapRoute;
        }
        else {
            routeRef = cheapRoute;
        }
    }
    return routeRef;
}

/*
    Method to get fastest option for a route
*/
function processFastestRoutes(routeString){
    var routeRef = "";
    var routes = routeString.split(",");
    for(var i=0; i < routes.length - 1; i++){
        var rArr = tripMapByRoute[routes[i]+"_"+routes[i+1]];
        var fastest = 0;
        var fastRoute = "";
        rArr.forEach(function(rRef){
            var deal = tripMapByRef[rRef];
            var dealTime = parseInt(deal.duration.h) * 60 + parseInt(deal.duration.m);
            if(dealTime < fastest || fastest == 0){
                fastest = dealTime;
                fastRoute = rRef;
            }
        });
        if(routeRef!=''){
            routeRef = routeRef + "," + fastRoute;
        }
        else {
            routeRef = fastRoute;
        }
    }
    return routeRef;
}

/*
    Method to calcuate route cost for a route
*/
function calculateRouteCost(routeRef){
    var deal = tripMapByRef[routeRef];
    var dealValue = deal.cost - (deal.cost * deal.discount / 100);
    return dealValue;
}

/*
    Method to calcuate time duration for a route
*/
function calculateDuration(routeRef){
    var deal = tripMapByRef[routeRef];
    var dealDuration = parseInt(deal.duration.h) * 60 + parseInt(deal.duration.m);
    return dealDuration;
}

/*
    Method to get all routes in fastest order
*/
function findFastestRoute(departure, arrival){
  resultRoutes = [];
  findRouteBetween(departure, arrival);
  var routeRefMap = [];
  resultRoutes.forEach(function(routeString){
     var routeRefString = processFastestRoutes(routeString);
     var routeRefs = routeRefString.split(",");
     var totalTime = 0;
     var sumOfCosts = 0;
     routeRefs.forEach(function(route){
          totalTime = totalTime + calculateDuration(route);
          sumOfCosts = sumOfCosts + calculateRouteCost(route);
     });
     routeRefMap.push({route : routeRefString, duration : totalTime, cost : sumOfCosts});
  })
  routeRefMap = _.sortBy(routeRefMap, 'duration');
  return routeRefMap;
}

/*
    Method to get all routes in cheapest order
*/
function findCheapestRoute(departure, arrival){
    resultRoutes = [];
    findRouteBetween(departure, arrival);
    var routeRefMap = [];
    resultRoutes.forEach(function(routeString){
       var routeRefString = processCheapestRoutes(routeString);
       var routeRefs = routeRefString.split(",");
       var totalTime  = 0;
       var sumOfCosts = 0;
       routeRefs.forEach(function(route){
            totalTime = totalTime + calculateDuration(route);
            sumOfCosts = sumOfCosts + calculateRouteCost(route);
       });
       routeRefMap.push({route : routeRefString, duration : totalTime, cost : sumOfCosts});
    })
    routeRefMap = _.sortBy(routeRefMap, 'cost');
    return routeRefMap;
}

// function findRoute(departure, arrival, condition){
//     resultRoutes = [];
//     findRouteBetween(departure, arrival);
//     var routeRefMap = [];
//     resultRoutes.forEach(function(routeString){
//        var routeRefString = processCheapestRoutes(routeString);
//        var routeRefs = routeRefString.split(",");
//        var sumOfCosts = 0;
//        routeRefs.forEach(function(route){
//             sumOfCosts = sumOfCosts + calculateRouteCost(route);
//        });
//        routeRefMap.push({route : routeRefString, cost : sumOfCosts});
//     })
//     routeRefMap = _.sortBy(routeRefMap, 'cost');
//     return routeRefMap;
// }


export {
    allDepartures,
    allArrivals,
    tripMapByRef,
    findFastestRoute,
    findCheapestRoute,
    currency
}
