const debug = require('debug')('big-ft:routes:partners');
const validPartners = require('../lib/partners');

module.exports = function (req, res){

	const partner = req.query.partner;
	
	if(partner === undefined || validPartners.check(partner) === false){
		
		res.json({
			status : 404,
			message : `Partner: '${partner}' is not a valid partner.`
		});

	} else {
	
		res.json({
			status : 200,
			data : {
				partner,
				url : validPartners.get(partner)
			}
		});
	
	}

};
