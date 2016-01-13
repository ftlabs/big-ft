/* global browser */
require('mocha-generators').install();
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;

function browserLogs() {
	return browser.log('browser')
	.then(function (logs) {
		return logs.value
			.filter(i => !!i.message.trim())
			.map(v => `${(new Date(Number(v.timestamp))).toTimeString()}: ${v.message}`)
			.join('\n');
	});
};

function printLogOnError(e) {

	// show browser console.logs
	return browserLogs()
	.then(function (logs) {
		console.log('BROWSER LOGS: \n' + logs);
		throw e;
	});
}

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

	it('can override the timezone shown on page load', function () {
		const activeTimezone = browser
			.url('/?timezone=Europe/London')
			.waitForExist('[data-active-timezone="true"]', 10000)
			.getText('[data-active-timezone="true"]');

		return expect(activeTimezone).to.eventually.include('LONDON')
		.then(undefined, printLogOnError);
	});

	it('adds a new clock if the timezone of the device is not one of the default timezones', function () {
		const activeTimezone = browser
			.url('/')
			.waitForExist('[data-tz="Asia/Seoul"]', 10000, true)
			.url('/?timezone=Asia/Seoul')
			.waitForExist('[data-tz="Asia/Seoul"]', 10000)
			.getText('[data-active-timezone="true"]');

		return expect(activeTimezone).to.eventually.include('SEOUL')
		.then(undefined, printLogOnError);
	});

	it('uses default timezone of device if custom timezone does not exist', function () {
		const activeTimezone = browser
			.url('/?timezone=MiddleEarth/Hobbiton')
			.waitForExist('[data-active-timezone="true"]', 10000)
			.getText('[data-active-timezone="true"]');

		return expect(activeTimezone).to.eventually.include('LONDON')
		.then(undefined, printLogOnError);
	});
});
