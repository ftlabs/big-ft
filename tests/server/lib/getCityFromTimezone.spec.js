'use strict'; // eslint-disable-line strict

/* global describe, it, before, beforeEach, afterEach, after */

const expect = require('chai').expect;
const mockery = require('mockery');

const moduleUnderTest = '../../../server/lib/getCityFromTimezone';

mockery.enable({
	useCleanCache: true,
	warnOnReplace: false,
	warnOnUnregistered: false
});

mockery.registerAllowable(moduleUnderTest);

const getCityFromTimezone = require(moduleUnderTest);

describe('getCityFromTimezone', function () {

	after(mockery.disable);

	it('returns city if parameter is a string in the shape of a timezone', function () {
		expect(getCityFromTimezone('Asia/Tokyo')).to.equal('Tokyo');
		expect(getCityFromTimezone('Asia/Hong_Kong')).to.equal('Hong Kong');
		expect(getCityFromTimezone('America/Los_Angeles')).to.equal('Los Angeles');
		expect(getCityFromTimezone('Europe/London')).to.equal('London');
		expect(getCityFromTimezone('MiddleEarth/Hobbiton')).to.equal('Hobbiton');
	});

	it('returns empty string if parameter is not in the shape of a timezone', function () {
		expect(getCityFromTimezone('124')).to.equal('');
		expect(getCityFromTimezone('')).to.equal('');
		expect(getCityFromTimezone(null)).to.equal('');
		expect(getCityFromTimezone()).to.equal('');
		expect(getCityFromTimezone(undefined)).to.equal('');
		expect(getCityFromTimezone({})).to.equal('');
		expect(getCityFromTimezone([])).to.equal('');
		expect(getCityFromTimezone(123)).to.equal('');
	});
});
