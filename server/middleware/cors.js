function inAllowlist (requestersOrigin) {
	// Only allow ft subdomains
	const subdomainRegex = /^(https?:\/\/)?((([^.]+)\.)*)ft\.com(:[0-9]{1,4})?$/;

	return subdomainRegex.test(requestersOrigin);
}

module.exports = function (req, res, next) {

	const requestersOrigin = req.get('origin');

	if (requestersOrigin && inAllowlist(requestersOrigin)) {
		res.set('Access-Control-Allow-Origin', requestersOrigin);
		res.set('Access-Control-Allow-Credentials', true);
	}

	next();
};
