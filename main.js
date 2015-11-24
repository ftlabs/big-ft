require('dotenv').load({silent: true});

const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

const hbs = exphbs.create({
    helpers: {}
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use('/static', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.render('big', {});
});

const server = app.listen(process.env.PORT || 3006, function () {
	const host = server.address().address;
	const port = server.address().port;

	console.log('Listening at http://%s:%s', host, port);
});
