const includes = require('array-includes');

const moment = require('moment-timezone');
const timezones = moment.tz.names();

module.exports = function(timezone) {
	timezone = String(timezone);

	return includes(timezones, timezone);
}
