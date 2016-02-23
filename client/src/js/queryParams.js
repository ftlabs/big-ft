'use strict';

const queryString = require('query-string');
const isTimezone = require('./isTimezone');

const parsed = queryString.parse(location.search);

const customTimezone = parsed.timezone;
const useCustomTimezone = isTimezone(customTimezone);

const primaryType = parsed.primaryType;
const primarySearch = parsed.primarySearch;
const primaryOffset = isNaN(parseInt(parsed.primaryOffset)) ? 0 : parseInt(parsed.primaryOffset);
const primaryMax = isNaN(parseInt(parsed.primaryMax)) ? 10 : parseInt(parsed.primaryMax);

const secondaryType = parsed.secondaryType;
const secondarySearch = parsed.secondarySearch;
const secondaryOffset = isNaN(parseInt(parsed.secondaryOffset)) ? 0 : parseInt(parsed.secondaryOffset);
const secondaryMax = isNaN(parseInt(parsed.secondaryMax)) ? 10 : parseInt(parsed.secondaryMax);

const defaultEdition = 'UK';
const edition = (parsed.edition) ? parsed.edition : defaultEdition;

const organisation = parsed.organisation;

const partner = parsed.partner;

const exportData = {
	organisation,
	edition,
	customTimezone,
	useCustomTimezone,
	primaryMax,
	primaryType,
	primarySearch,
	primaryOffset,
	secondaryType,
	secondarySearch,
	secondaryOffset,
	secondaryMax,
	partner
};

module.exports = {
	getQueryParams: () => exportData,
	getQueryParam: i => exportData[i]
};
