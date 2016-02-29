const validPartners = process.env.PARTNERS !== undefined ? JSON.parse(process.env.PARTNERS) : {
	labs : 'labs.ft.com'
};

module.exports = function (req, res){

	const partner = req.query.partner;

	if(partner === undefined || validPartners[partner] === undefined){

		res.json({
			status : 404,
			message : `Partner: '${partner}' is not a valid partner.`
		});

	} else {

		res.json({
			status : 200,
			data : {
				partner,
				url : validPartners[partner]
			}
		});
	
	}

};
