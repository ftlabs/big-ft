module.exports = function(timezone) {
	timezone = String(timezone);
	const city = timezone.split('/')[1] || '';

	return city.replace('_', ' ');
}
