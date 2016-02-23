module.exports = function(timezone) {
	if (typeof timezone !== 'string') {
		return '';
	}

	const city = timezone.split('/')[1] || '';
	if (city === '') {
		return timezone;
	} else {
		return city.replace('_', ' ');
	}
}
