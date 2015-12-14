'use strict'; //eslint-disable-line strict
/*global describe, before, it, after*/

require('mocha-generators').install();

const rootURL = "http://localhost:3000";
const Nightmare = require('nightmare');
const expect = require('chai').expect;

const moment = require('moment');

console.log(moment());

describe('Client-side application', function () {
	
	it('works', function () {
		console.log('Working'); // eslint-disable-line no-console
	});

	it('should display the local time', function * (){

		this.timeout(50000);

		var n = Nightmare();
		var timeAttribute = yield n
			.goto(rootURL)
			.wait(3000)
			.evaluate(function(moment){
				return ( document.querySelector('[data-isotime]').getAttribute('data-isotime') == moment().toISOString() ) ;
			}, moment);

		expect(timeAttribute).to.be.equal(true);

	});

});
