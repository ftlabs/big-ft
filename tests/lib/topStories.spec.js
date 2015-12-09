'use strict';
/* global describe, it, before, beforeEach, afterEach, after */
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const fs = require('fs');
const path = require('path');
const topStoriesFixturePath = path.join(__dirname, '..', 'fixtures', 'capi-top-stories.json');
chai.use(chaiAsPromised);
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');

const fetchMock = sinon.stub();
mockery.registerMock('node-fetch', fetchMock);

const viewModelMock = sinon.stub();
mockery.registerMock('./viewModel', viewModelMock);

const moduleUnderTest = '../../lib/topStories';

mockery.enable({
	useCleanCache: true,
  warnOnReplace: false,
  warnOnUnregistered: false
});

mockery.registerAllowable(moduleUnderTest);

const topStories = require(moduleUnderTest);

describe('topStories', function () {
	afterEach(fetchMock.reset);
	after(mockery.disable);

	it('given any parameters, it returns a promise', function () {
		fetchMock.returns(Promise.resolve());
		expect(topStories()).to.be.a('promise');
		expect(topStories(0, 1)).to.be.a('promise');
		expect(topStories('a', 'v')).to.be.a('promise');
		expect(topStories(0)).to.be.a('promise');
		expect(topStories('a')).to.be.a('promise');
		expect(topStories([], {})).to.be.a('promise');
		expect(topStories(undefined, null)).to.be.a('promise');
	});

	it('rejects if the fetch failed', function () {
		fetchMock.returns(Promise.reject());
		expect(topStories()).to.be.rejected;
		expect(topStories(0, 1)).to.be.rejected;
		expect(topStories('a', 'v')).to.be.rejected;
		expect(topStories(0)).to.be.rejected;
		expect(topStories('a')).to.be.rejected;
		expect(topStories([], {})).to.be.rejected;
		expect(topStories(undefined, null)).to.be.rejected;
	});

	it('rejects if the api response is not json', function () {
		fetchMock.returns(Promise.resolve('Hello World'));
		expect(topStories()).to.be.rejected;
		expect(topStories(0, 1)).to.be.rejected;
		expect(topStories('a', 'v')).to.be.rejected;
		expect(topStories(0)).to.be.rejected;
		expect(topStories('a')).to.be.rejected;
		expect(topStories([], {})).to.be.rejected;
		expect(topStories(undefined, null)).to.be.rejected;
	});

	describe('how it returns articles', function () {
		let topStoriesFixture;
		beforeEach(() => {
			viewModelMock.returnsArg(0);
			topStoriesFixture = JSON.parse(fs.readFileSync(topStoriesFixturePath, 'utf8'));
			fetchMock.returns(Promise.resolve({
				json: function () {
					return topStoriesFixture;
				}
			}));
		})

		it('if no offset is passed it will return from the start of the article list', function (done) {
			expect(topStories().then(a => a[0])).to.eventually.deep.equal(topStoriesFixture.pageItems[0]).notify(done);
		});

		it('returns an offset of the article list based on the parameter', function (done) {
			const offsetOfOne = topStories(1);
			const offsetOfTwo = topStories(2);
			const offsetOfThree = topStories(3);
			const offsetOfFour = topStories(4);
			const offsetOfFive = topStories(5);
			const offsetOfSix = topStories(6);
			const offsetOfSeven = topStories(7);
			const offsetOfEight = topStories(8);

			Promise.all([offsetOfOne, offsetOfTwo, offsetOfThree, offsetOfFour, offsetOfFive, offsetOfSix, offsetOfSeven, offsetOfEight])
			.then(results => {
				const offsetOfOne = results[0][0];
				const offsetOfTwo = results[1][0];
				const offsetOfThree = results[2][0];
				const offsetOfFour = results[3][0];
				const offsetOfFive = results[4][0];
				const offsetOfSix = results[5][0];
				const offsetOfSeven = results[6][0];
				const offsetOfEight = results[7][0];
				expect(offsetOfOne).to.deep.equal(topStoriesFixture.pageItems[1]);
				expect(offsetOfTwo).to.deep.equal(topStoriesFixture.pageItems[2]);
				expect(offsetOfThree).to.deep.equal(topStoriesFixture.pageItems[3]);
				expect(offsetOfFour).to.deep.equal(topStoriesFixture.pageItems[4]);
				expect(offsetOfFive).to.deep.equal(topStoriesFixture.pageItems[5]);
				expect(offsetOfSix).to.deep.equal(topStoriesFixture.pageItems[6]);
				expect(offsetOfSeven).to.deep.equal(topStoriesFixture.pageItems[7]);
				expect(offsetOfEight).to.deep.equal(topStoriesFixture.pageItems[8]);
				done();
			}).catch(done)
		});

		it('returns undefined if the offset is larger than the amount of articles', function (done) {
			const offsetOfTen = topStories(100);
			offsetOfTen
			.then(results => {
				const offsetOfTen = results[0];
				expect(offsetOfTen).to.equal(undefined);
				done();
			}).catch(done)
		});

		it('if no maximum amount of articles is passed, it will return all of the articles', function (done) {
			expect(topStories(0)).to.eventually.deep.equal(topStoriesFixture.pageItems).notify(done);
		});

		it('returns a list of articles less than or equal to the passed in parameter', function (done) {
			const maximumOfOne = topStories(0, 1);
			const maximumOfTwo = topStories(0, 2);
			const maximumOfThree = topStories(0, 3);
			const maximumOfFour = topStories(0, 4);
			const maximumOfFive = topStories(0, 5);
			const maximumOfSix = topStories(0, 6);
			const maximumOfSeven = topStories(0, 7);
			const maximumOfEight = topStories(0, 8);
			const maximumOf9000 = topStories(0, 9000);

			Promise.all([maximumOfOne, maximumOfTwo, maximumOfThree, maximumOfFour, maximumOfFive, maximumOfSix, maximumOfSeven, maximumOfEight, maximumOf9000])
			.then(results => {
				const maximumOfOne = results[0].length;
				const maximumOfTwo = results[1].length;
				const maximumOfThree = results[2].length;
				const maximumOfFour = results[3].length;
				const maximumOfFive = results[4].length;
				const maximumOfSix = results[5].length;
				const maximumOfSeven = results[6].length;
				const maximumOfEight = results[7].length;
				const maximumOf9000 = results[8].length;
				expect(maximumOfOne).to.be.at.most(1);
				expect(maximumOfTwo).to.be.at.most(2);
				expect(maximumOfThree).to.be.at.most(3);
				expect(maximumOfFour).to.be.at.most(4);
				expect(maximumOfFive).to.be.at.most(5);
				expect(maximumOfSix).to.be.at.most(6);
				expect(maximumOfSeven).to.be.at.most(7);
				expect(maximumOfEight).to.be.at.most(8);
				expect(maximumOf9000).to.be.at.most(9000);
				done();
			}).catch(done)
		});
	});
});
