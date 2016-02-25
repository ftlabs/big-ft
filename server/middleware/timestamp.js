module.exports = function (req, res, next) {
	if (req.headers['x-ft-timestamp']) {
		res.append('x-ft-timestamp', req.headers['x-ft-timestamp']);
	}
	next();
};
