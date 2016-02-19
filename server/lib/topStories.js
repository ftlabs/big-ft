/* eslint strict:0 */
const fetch = require('node-fetch');
const briefArticle = require('./viewModel');
const R = require('ramda');
const briefArticleMapper = R.map(briefArticle);
const bluebird = require("bluebird");

const apiOrigin = process.env.apiOrigin;
const apiKey = process.env.apiKey;
const frontPageIdUK = process.env.frontPageId;
const frontPageIdUS = process.env.frontPageIdUS;

// edition can be "US" or "INTL" (both meaning US), or "UK" (and anything except "US"/"INTL", including null or "", i.e. its the default)
module.exports = function (startFrom, numberOfArticles, edition, organisation) {
	'use strict';

	if (isNaN(startFrom)) {
		startFrom = 0;
	}

	if (isNaN(numberOfArticles)) {
		numberOfArticles = Infinity;
	}

	let frontPageId = frontPageIdUK; // the default
	if (edition && (edition === 'US' || edition === 'INTL' )) {
		frontPageId = frontPageIdUS;
	}


	let organisationPromise;
	if (organisation) {

		organisationPromise = bluebird.coroutine(function * () {
			const id = yield fetch('https://next.ft.com/search-suggestions?flatten=true&limit=1&exclude=special&q=twitter')
			.then(response => response.json())
			.then(json => json[0].id);

			console.log(id);

			const newApiReq = yield fetch(`http://api.ft.com/content?isAnnotatedBy=${id}&authority=http://api.ft.com/system/FT-TME&bindings=v1&apiKey=${apiKey}`)
			.then(response => response.json())
			.then(json => json.content[0].apiUrl)

			console.log(newApiReq);

			const article = yield fetch(newApiReq + `?apiKey=${apiKey}`)
			.then(response => response.json());

			console.log(article);
			return article;
		}).then(article => [article], () => []);
	} else {
		organisationPromise = Promise.resolve([]);
	}

	console.log(apiOrigin);

	const articlePromise = fetch(`${apiOrigin}/${frontPageId}/main-content?apiKey=${apiKey}`)
	.then(response => response.json())
	.then(data => {
		const articles = briefArticleMapper(data.pageItems);
		const articlesWithImages = articles.filter(article => article.image !== '');

		return articlesWithImages.slice(startFrom).slice(0, numberOfArticles);
	});

	return bluebird.all([organisationPromise, articlePromise]).then(function (results) {
		const organisations = results[0];
		const articles = results[articles];
		if (organisations[0]) {
			articles.unshift(organisations[0]);
		}
		return articles;
	});
}
