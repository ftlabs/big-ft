'use strict'; //eslint-disable-line strict
/*global describe, before, it, after*/
const request = require('supertest');
const mockery = require('mockery');

const moduleUnderTest = '../../server/app';

mockery.enable({
	useCleanCache: true,
	warnOnReplace: false,
	warnOnUnregistered: false
});

const app = require(moduleUnderTest);

describe('App', function () {
	before(done => {
		app.listen(9999, done)
	});

	after(() => {
		mockery.deregisterAllowable(moduleUnderTest);
		mockery.deregisterAll();
		mockery.disable();
	});

	it('has a /__gtg endpoint which returns 200', function (done) {
		request(app)
			.get('/__gtg')
			.expect(200, done);
	});

	it('has a /__health endpoint which return JSON with a 200 which follows the schema', function (done) {
		request(app)
			.get('/__health')
			.expect('Content-Type', /json/)
			.expect(function hasPreviousAndNextKeys (res) {
				if (!('schemaVersion' in res.body)) throw new Error('missing schemaVersion key');
				if (!('name' in res.body)) throw new Error('missing name key');
				if (!('checks' in res.body)) throw new Error('missing checks key');
			})
			.expect(200)
			.end(function (err) {
				if (err) {
					done(err);
				} else {
					done();
				}
			});
	});

	it('has a /__about endpoint which returns JSON with a 200', function (done) {
		request(app)
			.get('/__about')
			.expect('Content-Type', /json/)
			.expect(200, done);
	});
});
