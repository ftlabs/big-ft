/* global browser */
require('mocha-generators').install();

const expect = require('chai').expect;

describe('Big FT website', () => {
	it('has "Financial Times" as the heading', function *() {
		const title = yield browser
			.url('/')
			.waitForText('h1', 10000)
			.getText('h1');

		expect(title).to.include('FINANCIAL TIMES');
	});

	it('has the interstitial shown on page load', function *() {
		const interstitial = yield browser
			.url('/')
			.isVisible('svg',);

		expect(interstitial).to.be.true;
	});
});
