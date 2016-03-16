const validPartners = process.env.PARTNERS !== undefined ? JSON.parse(process.env.PARTNERS) : {
	labs : 'labs.ft.com'
};

module.exports = {
	list : validPartners,
	check : function (partner){
		if(partner === undefined || validPartners[partner] === undefined){
			return false;
		} else {
			return true;
		}
	},
	get : function (partner){
		
		if (validPartners[partner] !== undefined){
			return validPartners[partner];
		} else {
			return "";
		}
		
	}
};