/* eslint strict:0 */
const fetch = require('node-fetch');
const briefArticle = require('./viewModel');
const R = require('ramda');
const briefArticleMapper = R.map(briefArticle);

const apiKey = process.env.apiKey;
const apiOrigin = 'http://api.ft.com/site/v1/pages';
const frontPageIdUK = '4c499f12-4e94-11de-8d4c-00144feabdc0';
const frontPageIdUS = 'b0ed86f4-4e94-11de-8d4c-00144feabdc0';

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
	if (edition) {
    let editionUC = edition.toUpperCase();
    if (editionUC === 'US' || editionUC === 'INTL') {
      frontPageId = frontPageIdUS;
    }
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
