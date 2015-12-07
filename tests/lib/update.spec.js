'use strict';
/* global describe, it, before, beforeEach, afterEach, after */
const expect = require('chai').expect;
const mockery = require('mockery');

const moduleUnderTest = '../../lib/update';

mockery.enable({
	useCleanCache: true,
  warnOnReplace: false,
  warnOnUnregistered: false
});

mockery.registerAllowable(moduleUnderTest);
const isOutOfDate = require(moduleUnderTest);
describe('isOutOfDate', function () {

	after(mockery.disable);

	it('throws if not passed a valid semantic version string', function () {

		expect(function () {
			isOutOfDate('124');
		}).to.throw(Error);
	});

	it('returns Boolean', function () {
		expect(isOutOfDate('1.2.4')).to.be.a('boolean');
	});
});
