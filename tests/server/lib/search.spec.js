'use strict'; // eslint-disable-line strict
/* global describe, it, before, beforeEach, afterEach, after */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
// const fs = require('fs'); // TODO: Create test that uses fixture data
// const path = require('path');
// const searchFixturePath = path.join(__dirname, '../fixtures/search.json');
chai.use(chaiAsPromised);
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');

const fetchMock = sinon.stub();
mockery.registerMock('node-fetch', fetchMock);

const viewModelMock = sinon.stub();
mockery.registerMock('./viewModel', viewModelMock);

const bluebirdMock = {
	map: sinon.stub()
};
mockery.registerMock('bluebird', bluebirdMock);

const moduleUnderTest = '../../../server/lib/search';

mockery.enable({
	useCleanCache: true,
	warnOnReplace: false,
	warnOnUnregistered: false
});

mockery.registerAllowable(moduleUnderTest);

const search = require(moduleUnderTest);

describe('search', function () {
	afterEach(function () {
		fetchMock.reset();
		bluebirdMock.map.reset();
		viewModelMock.reset();
	});

	after(mockery.disable);

	it('given any parameters, it returns a promise', function () {
		bluebirdMock.map.returns(Promise.resolve());
		fetchMock.returns(Promise.resolve());
		expect(search()).to.be.a('promise');
		expect(search(0)).to.be.a('promise');
		expect(search(0, 0)).to.be.a('promise');
		expect(search(0, 0, 0)).to.be.a('promise');
		expect(search('a')).to.be.a('promise');
		expect(search('a', 'b')).to.be.a('promise');
		expect(search('a', 'b', 'c')).to.be.a('promise');
		expect(search([], [], [])).to.be.a('promise');
		expect(search(undefined, null)).to.be.a('promise');
	});

	it('rejects if the fetch failed', function () {
		fetchMock.returns(Promise.reject());
		expect(search()).to.be.rejected;
		expect(search(0, 1)).to.be.rejected;
		expect(search('a', 'v')).to.be.rejected;
		expect(search(0)).to.be.rejected;
		expect(search('a')).to.be.rejected;
		expect(search([], {})).to.be.rejected;
		expect(search(undefined, null)).to.be.rejected;
	});

	it('rejects if the api response is not json', function () {
		fetchMock.returns(Promise.resolve('Hello World'));
		expect(search()).to.be.rejected;
		expect(search(0, 1)).to.be.rejected;
		expect(search('a', 'v')).to.be.rejected;
		expect(search(0)).to.be.rejected;
		expect(search('a')).to.be.rejected;
		expect(search([], {})).to.be.rejected;
		expect(search(undefined, null)).to.be.rejected;
	});
});
