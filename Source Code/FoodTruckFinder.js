var request = require("request-promise");

var FoodTruckFinder = require('./FoodTruckFinder.js');
var objToday = new Date(),
    dayOrder = objToday.getDay();
    curHour = objToday.getHours(),
    curMinute = objToday.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday.getMinutes();
    curTime = curHour + ":" + curMinute;
    
var offset = 0;
var options = {  
  url: 'http://data.sfgov.org/resource/bbb8-hzi6.json?$where=start24 < "' + encodeURIComponent(curTime) + '" AND end24 > "' + encodeURIComponent(curTime) + '" AND dayorder = ' + encodeURIComponent(dayOrder) + '&$limit=10&$offset=' + offset,
  method: 'GET'
};
var setOptions = function(){
  offset = offset + 10;
  options.url = options.url.substring(0,options.url.indexOf("offset=") + 7) + offset;
};
var requestFunc =  function() { 


 return request(options)
  .then(function (response) {
    var result = JSON.parse(response);
    
    if(result == undefined || result.length == 0) {
      console.log("There is no food trucks open at this time");
      process.exit();
    }
    console.log("\nNAME".padEnd(81) + "ADDRESS");
    result.forEach(function(element) {
      console.log(element.applicant.padEnd(80) + element.location);
    });
    if(result.length < 10) {
      console.log("There is no more food trucks open at this time");
      process.exit();
    }
    // node.js get keypress
    var stdin = process.stdin;
    stdin.setRawMode( true );
    stdin.resume();
    stdin.setEncoding( 'utf8' );

    // on any data into stdin
    stdin.on( 'data', function( key ){
      if ( key === '\u0003' ) {
        process.exit();
      }

      //reset the offset
      setOptions();
      //recursive call
      return requestFunc();
    });
    console.log("Press any key to show the next 10 food trucks");

  })
  .catch(function (error) {
    console.error('fetch data failed', error);
  });

};

requestFunc();

