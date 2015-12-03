const express = require('express');
const router = express.Router(); //eslint-disable-line new-cap
const appVersion =  require('../package.json').version;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {
  	version : appVersion
  });
});

router.get('/should-update', function(req, res){

	res.json({
		version : appVersion
	});

});

module.exports = router;
