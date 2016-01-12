const express = require('express');
const router = express.Router(); //eslint-disable-line new-cap
const path = require('path');
const includes = require('array-includes');
const appVersion = require(path.join(__dirname, '../../package.json')).version;
const isTimezone = require('../lib/isTimezone');
const getCityFromTimezone = require('../lib/getCityFromTimezone');

/* GET home page. */
router.get('/', function (req, res) {
	const timezones = [
		'America/New_York',
		'Europe/London',
		'Asia/Shanghai',
		'Asia/Hong_Kong',
		'Asia/Tokyo'
	];

	if (isTimezone(req.query.timezone) && !includes(timezones, req.query.timezone)) {
		timezones.push(req.query.timezone);
	}

	const citiesWithTimezones = timezones.map(function(timezone) {
		return {
			city: getCityFromTimezone(timezone),
			timezone: timezone
		};
	});

	console.log(citiesWithTimezones)

	res.render('index', {
		version : appVersion,
		isProduction : process.env.NODE_ENV === "production",
		sentryClientKey : process.env.sentryClientKey,
		clocks: citiesWithTimezones
	});
});

router.get('/should-update', function (req, res){

	res.json({
		version : appVersion
	});

});

module.exports = router;
