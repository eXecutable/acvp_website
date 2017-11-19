global.TL = {
		VERSION: '0.1',
		_originalL: global.TL
	};

require ("./TL.Util.js");
require ("./TL.ConfigFactory.js");
var http = require ("https");
var fs = require ("fs");


var url = "https://spreadsheets.google.com/feeds/list/1SxtPQvuaL273uVJGydEHC4CVR8i5dF21AjHl0IZQ8Kg/1/public/values?alt=json";

http.get(url, function(res){
    var body = '';

    res.on('data', function(chunk){
        body += chunk;
    });

    res.on('end', function(){
        var videojogos_googlejson = JSON.parse(body);
        var finalObj = TL.ConfigFactory.googleFeedJSONtoTimelineJSON(videojogos_googlejson);
		var finaljson = JSON.stringify(finalObj);
		fs.writeFile('videojogos_TLjson.json', finaljson, 'utf8', null);
    });
}).on('error', function(e){
      console.log("Got an error: ", e);
});