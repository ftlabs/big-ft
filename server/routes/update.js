'use strict';
const express = require('express');
const router = express.Router(); //eslint-disable-line new-cap
const isOutOfDate = require('../lib/update');
const curry = require('lodash').curry;

const response = curry((res, code, success, data) => res.status(code).json({ success, data, code }));

router.get('/', function (req, res) {
	const goodResponse = response(res, 200, true);
	const badResponse = response(res, 422, false);

	try {
		if (isOutOfDate(req.query.version)) {
			goodResponse({update: true});
		} else {
			goodResponse({update: false});
		}

	} catch (e) {
		badResponse({
			error: e.message
		});
	}
});

module.exports = router;
