'use strict'; // eslint-disable-line strict

/* global describe, it, before, beforeEach, afterEach, after */

const expect = require('chai').expect;

const getCityFromTimezone = require('../../../client/src/js/getCityFromTimezone.js');

describe('getCityFromTimezone', function () {

	it('returns city if parameter is a string in the shape of a timezone', function () {
		expect(getCityFromTimezone('Asia/Tokyo')).to.equal('Tokyo');
		expect(getCityFromTimezone('Asia/Hong_Kong')).to.equal('Hong Kong');
		expect(getCityFromTimezone('America/Los_Angeles')).to.equal('Los Angeles');
		expect(getCityFromTimezone('Europe/London')).to.equal('London');
		expect(getCityFromTimezone('MiddleEarth/Hobbiton')).to.equal('Hobbiton');
	});

	it('returns string version of passed in parameter if parameter is not in the shape of a timezone', function () {
		expect(getCityFromTimezone('124')).to.equal('124');
		expect(getCityFromTimezone('')).to.equal('');
		expect(getCityFromTimezone(null)).to.equal('');
		expect(getCityFromTimezone()).to.equal('');
		expect(getCityFromTimezone(undefined)).to.equal('');
		expect(getCityFromTimezone({})).to.equal('');
		expect(getCityFromTimezone([])).to.equal('');
		expect(getCityFromTimezone(123)).to.equal('');
		expect(getCityFromTimezone('UTC')).to.equal('UTC');
	});
});
