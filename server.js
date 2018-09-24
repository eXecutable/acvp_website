var express = require('express');
var app = express();


var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "jorge_read",
  password: "Muitasgajas1**",
  database: "jorgegraca_casadosjogos"
});
con.connect();

app.get('/search', function (req, res) {
	let searchString = req.query.searchString;
	let querySelect = "SELECT DISTINCT videojogos.nome, videojogos.data_criacao, videojogos.video, videojogos.onde_adquirir, videojogos.icone, videojogos.preco, videojogos.referencias, estudios.nome AS estudio, estudios.site, tipos.nome AS tipo, GROUP_CONCAT(plataformas.nome SEPARATOR ', ') AS plataformas ";
	let queryFrom = "FROM videojogos LEFT JOIN (estudios, tipos, plataformas_videojogos) " +
					  "ON (estudios.id = videojogos.estudio_id AND tipos.id = videojogos.tipo_id AND plataformas_videojogos.videojogo_id = videojogos.id) " +
					  "LEFT JOIN (plataformas) ON (plataformas_videojogos.plataforma_id = plataformas.id) ";
	let queryWhere = "";
	if (searchString) {
		queryWhere += "WHERE videojogos.nome LIKE '%" + searchString + "%' OR estudios.nome LIKE '%" + searchString + "%' ";
	}
	let	queryGroupLimit = "GROUP BY videojogos.id " +
			 "ORDER BY videojogos.data_criacao DESC " +
			 "LIMIT 25";

	let querySelectCount = "SELECT COUNT(DISTINCT videojogos.id) as count ";
	con.query(querySelectCount + queryFrom + queryWhere, function (err, countResult, fields) {
		if (err) res.send(err);//TODO: remove

		con.query(querySelect + queryFrom + queryWhere + queryGroupLimit, function (err, result, fields) {
			if (err) res.send(err);//TODO: remove
			try {
				let response = [];
				for (let index = 0; index < result.length; index++) {
					const element = result[index];
					let data_criacao = new Date(element.data_criacao);
					let platformIcon = getPlatformIcon(element);
					let bodyText = "";
					if (element.icone) {
						bodyText = "<img src='" + element.icone + "' style='max-height:160px; max-width:400px;'>";
					}
					bodyText += "<p>Developer: <a href='" + element.site + "' target='_blank' rel='noopener'>" + element.estudio + "</a></p>";
					bodyText += "<p>Plataforma(s): " + element.plataformas + "</p>";
					bodyText += "<p>Preço: " + element.preco + "</p>";

					if (element.onde_adquirir) {
						let ondeAquirirArray = element.onde_adquirir.split(' ').filter((val) => val);
						if (ondeAquirirArray.length) {
							bodyText += "<p>Onde adquirir:";
							for (let index2 = 0; index2 < ondeAquirirArray.length; index2++) {
								bodyText += "&nbsp<span><a href='" + ondeAquirirArray[index2] + "' target='_blank'>Link</a></span>";
							}
							bodyText += "</p>";
						}
					}
					
					if (element.referencias) {
						let referenciasArray = element.referencias.split(' ').filter((val) => val);
						if (referenciasArray.length) {
							bodyText += "<p>Referências:";
							for (let index3 = 0; index3 < referenciasArray.length; index3++) {
								bodyText += "&nbsp<span><a href='" + referenciasArray[index3] + "' target='_blank'>Link</a></span>";
							}
							bodyText += "</p>";
						}
					}

					let newEntry = {
						text: {
							headline: element.nome,
							text: bodyText
						},
						media: {
							caption: "",
							credit: "",
							url: element.video,
							thumbnail: "",
							icon: platformIcon
						},
						start_date: {
							year: data_criacao.getFullYear().toString(),
							month: data_criacao.getMonth().toString(),
							day: data_criacao.getDate().toString()
						},
						display_date: "&nbsp"
					};
					response.push(newEntry);
				}

				res.send({
					count: countResult[0].count,
					events: response,
					errors: [],
					warnings: [],
					eras: []
				});
			} catch(error) {
				res.send(error.toString());//TODO: remove
			}
		});
	});
})


function getPlatformIcon(__element){
	if(__element.plataformas.toLowerCase().indexOf("steam") > -1){
		return "acvp-icon-steam2";
	}
	else if(__element.plataformas.toLowerCase().indexOf("xbox") > -1){
		return "acvp-icon-brand";
	}
	else if(__element.plataformas.toLowerCase().indexOf("playstation") > -1){
		return "acvp-icon-playstation";
	}
	else if(__element.plataformas.toLowerCase().indexOf("pc") > -1){
		return "acvp-icon-mouse";
	}
	else if(__element.plataformas.toLowerCase().indexOf("ios") > -1
		 || __element.plataformas.toLowerCase().indexOf("iphone") > -1
		 || __element.plataformas.toLowerCase().indexOf("ipod") > -1
		 || __element.plataformas.toLowerCase().indexOf("ipad") > -1){
		return "acvp-icon-appleinc";
	}
	else if(__element.plataformas.toLowerCase().indexOf("android") > -1){
		return "acvp-icon-android";
	}
	else if(__element.plataformas.toLowerCase().indexOf("mobile") > -1){
		return "acvp-icon-mobile2";
	}
	else if(__element.plataformas.toLowerCase().indexOf("documental") > -1){
		return "acvp-icon-book";
	}
	return "";
}

var server = app.listen(80, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('Express app listening at http://%s:%s', host, port);
});
