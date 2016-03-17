const express = require('express');
const router = express.Router(); //eslint-disable-line new-cap
const path = require('path');
const validPartners = require('../lib/partners');
const appVersion = require(path.join(__dirname, '../../package.json')).version;

/* GET home page. */
router.get('/', function (req, res) {
	res.render('index', {
		version : appVersion,
		isProduction : process.env.NODE_ENV === 'production',
		sentryClientKey : process.env.sentryClientKey
	});
});

router.get('/should-update', function (req, res){

	res.json({
		version : appVersion
	});

});

router.get('/:vanity', function (req, res){
	
	const partner = req.params.vanity;
	
	if(validPartners.check(partner) !== false){
		res.redirect(`http://${validPartners.get(partner)}`);
	} else {
		res.redirect("http://ftcorporate.ft.com/");
	}
	
});

module.exports = router;
