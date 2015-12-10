'use strict';
/* global describe, it, before, beforeEach, afterEach, after */
const expect = require('chai').expect;
const mockery = require('mockery');
const fs = require('fs');
const path = require('path');
const articleFixturePath = path.join(__dirname, '..', 'fixtures', 'capi-article.json');
const moduleUnderTest = '../../lib/viewModel';

mockery.enable({
	useCleanCache: true,
  warnOnReplace: false,
  warnOnUnregistered: false
});

mockery.registerAllowable(moduleUnderTest);
const viewModel = require(moduleUnderTest);
describe('viewModel', function () {

	after(mockery.disable);

	it('transforms a content-api article model into the model our view expects', function () {
		const articleFixture = JSON.parse(fs.readFileSync(articleFixturePath, 'utf8'));
		expect(viewModel(articleFixture)).to.deep.equal({
			headline: 'VW cuts number of cars hit by CO2 errors',
			id: '722174a2-9e6b-11e5-b45d-4812f209f861',
			image: 'http://im.ft-static.com/content/images/3f78880a-183e-48b2-80f9-00492f3b81c7.img',
			lastPublishDateTime: '2015-12-09T16:22:18Z',
			url: {
				href: 'http://api.ft.com/content/items/v1/722174a2-9e6b-11e5-b45d-4812f209f861',
				rel: 'content-item'
			}
		});
	});
});
