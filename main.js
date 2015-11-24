require('dotenv').load({silent: true});

var express = require('express');
var exphbs = require('express-handlebars');
var request = require('request-promise');
var ftwebservice = require('express-ftwebservice');
var app = express();

ftwebservice(app, {
	manifestPath: __dirname + '/package.json',
	about: require("./runbook.json"),
	healthCheck: require('./healthcheck'),
	goodToGoTest: function() {
		return Promise.resolve(true) // TODO
	},
})

var hbs = exphbs.create({
	helpers: {}
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use("/static", express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.render('big', {});
});

var server = app.listen(process.env.PORT || 3006, function () {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Listening at http://%s:%s', host, port);
});
