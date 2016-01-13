/* global browser */
require('mocha-generators').install();

const expect = require('chai').expect;

describe('Big FT website', () => {
	it('has "Financial Times" as the heading', function *() {
		const title = yield browser
			.url('/')
			.waitForText('h1')
			.getText('h1');

		expect(title).to.include('FINANCIAL TIMES');
	});

	it('has the interstitial shown on page load', function *() {
		const interstitial = yield browser
			.url('/')
			.isVisible('svg');

		expect(interstitial).to.be.true;
	});

	it('can override the timezone shown on page load', function *() {
		const activeTimezone = yield browser
			.url('/?timezone=Europe/London')
			.waitForExist('[data-active-timezone="true"]', 25000)
			.getText('[data-active-timezone="true"]');

		expect(activeTimezone).to.include('LONDON');
	});

	it('adds a new clock if the timezone of the device is not one of the default timezones', function *() {
		const activeTimezone = yield browser
			.url('/')
			.waitForExist('[data-tz="Asia/Seoul"]', 10000, true)
			.url('/?timezone=Asia/Seoul')
			.waitForExist('[data-tz="Asia/Seoul"]', 10000)
			.getText('[data-active-timezone="true"]');

		expect(activeTimezone).to.include('SEOUL');
	});

	it('uses default timezone of device if custom timezone does not exist', function *() {
		const activeTimezone = yield browser
			.url('/?timezone=MiddleEarth/Hobbiton')
			.waitForExist('[data-active-timezone="true"]', 10000)
			.getText('[data-active-timezone="true"]');

		expect(activeTimezone).to.include('LONDON');
	});
});
