
var express = require('express');
var app = express();


var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "jorge_read",
  password: "_Eqrk223",
  database: "jorgegraca_casadosjogos"
});


app.use(express.static('./'));//TODO: change to dist directory

app.get('/', function (req, res) {
	con.connect(function(err) {
		if (err) throw err;
		console.log("Connected!");
		con.query("SELECT * FROM videojogos", function (err, result, fields) {
			if (err) throw err;
			console.log(result);
			res.send(result)
		});
	});
})




var server = app.listen(8888, function () {

    var host = server.address().address
    var port = server.address().port
    console.log('Express app listening at http://%s:%s', host, port)

});
