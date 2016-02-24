module.exports = function (req, res, next) {
	if (req.headers['x-ft-timestamp']) {
		res.headers['x-ft-timestamp'] = req.headers['x-ft-timestamp'];
	}
	next();
};
