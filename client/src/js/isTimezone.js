const moment = require('moment-timezone');
const timezones = moment.tz.names();

module.exports = function(timezone) {
	timezone = String(timezone);

	return timezones.includes(timezone);
}
