/* eslint strict:0 */
const fetch = require('node-fetch');
const briefArticle = require('./viewModel');
const R = require('ramda');
const briefArticleMapper = R.map(briefArticle);

const apiOrigin = process.env.apiOrigin;
const apiKey = process.env.apiKey;
const frontPageIdUK = process.env.frontPageId;
const frontPageIdUS = process.env.frontPageIdUS;

console.log({
	apiKey,
	apiKey,
	frontPageIdUK,
	frontPageIdUS
});

// edition can be "US" or "INTL" (both meaning US), or "UK" (and anything except "US"/"INTL", including null or "", i.e. its the default)
module.exports = function (startFrom, numberOfArticles, edition) {
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

	return fetch(`${apiOrigin}/${frontPageId}/main-content?apiKey=${apiKey}`)
	.then(response => response.json())
	.then(data => {
		const articles = briefArticleMapper(data.pageItems);
		const articlesWithImages = articles.filter(article => article.image !== '');

		return articlesWithImages.slice(startFrom).slice(0, numberOfArticles);
	})
	;
}
