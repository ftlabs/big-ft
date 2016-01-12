'use strict'; // eslint-disable-line strict

/* global describe, it, before, beforeEach, afterEach, after */

const expect = require('chai').expect;
const mockery = require('mockery');

const moduleUnderTest = '../../../server/lib/isTimezone';

mockery.enable({
	useCleanCache: true,
	warnOnReplace: false,
	warnOnUnregistered: false
});

mockery.registerAllowable(moduleUnderTest);

const isTimezone = require(moduleUnderTest);

describe('isTimezone', function () {

	after(mockery.disable);

	it('returns false if parameter is not a valid timezone', function () {
		expect(isTimezone('124')).to.be.false;
		expect(isTimezone('')).to.be.false;
		expect(isTimezone(null)).to.be.false;
		expect(isTimezone()).to.be.false;
		expect(isTimezone(undefined)).to.be.false;
		expect(isTimezone({})).to.be.false;
		expect(isTimezone([])).to.be.false;
		expect(isTimezone(123)).to.be.false;

		expect(isTimezone('MiddleEarth/Hobbiton')).to.be.false;

	});

	it('returns true if parameter is a valid timezone', function () {
		expect(isTimezone('Asia/Tokyo')).to.be.true;
	});
});
