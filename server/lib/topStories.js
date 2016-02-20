/* eslint strict:0 */
const fetch = require('node-fetch');
const briefArticle = require('./viewModel');
const R = require('ramda');
const briefArticleMapper = R.map(briefArticle);
const co = require('co');
const debug = require('debug')('big-ft:topStories');

const apiKey = process.env.apiKey;
const apiOrigin = 'http://api.ft.com/site/v1/pages';
const frontPageIdUK = '4c499f12-4e94-11de-8d4c-00144feabdc0';
const frontPageIdUS = 'b0ed86f4-4e94-11de-8d4c-00144feabdc0';

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
	if (edition) {
		let editionUC = edition.toUpperCase();
		if (editionUC === 'US' || editionUC === 'INTL') {
			frontPageId = frontPageIdUS;
		}
	}


	let organisationPromise;
	if (organisation) {

		organisationPromise = co(function * () {

			const id = yield fetch('https://next.ft.com/search-suggestions?flatten=true&limit=1&exclude=special&q=' + organisation)
			.then(response => response.json())
			.then(json => json[0].id);

			const orgArticles = yield fetch(`http://api.ft.com/content?isAnnotatedBy=${id}&authority=http://api.ft.com/system/FT-TME&bindings=v1&apiKey=${apiKey}`)
			.then(response => response.json())
			.then(json => json.content);

			let chosenArticles = [];
			for (let orgArticle of orgArticles) {

				// get v1 article
				const newApiReq = orgArticle.apiUrl.replace(/^http:\/\/api.ft.com\/content\//, 'http://api.ft.com/content/items/v1/');
				const article = yield fetch(newApiReq + `?apiKey=${apiKey}`)
				.then(response => response.json())
				.then(json => json.item);

				// if the article was published 2 or more days ago then stop checking
				const daysAgoPublished = Math.floor((Date.now() - (new Date(article.lifecycle.lastPublishDateTime)))/(3600*24*1000));
				if (daysAgoPublished >= 2) {
					break;
				}

				// Find image and headline
				if (article.images && article.images.length) {
					const image = article.images.filter(image => image.type === 'wide-format')[0];
					if (!image) {
						continue;
					}
					chosenArticles.push({
						image: image.url,
						headline: article.packaging.spHeadline
					});
					if (chosenArticles.length >= 3) {
						break;
					}
				}
			}

			return chosenArticles;
		}).catch(e => (debug(e), []));
	} else {
		organisationPromise = Promise.resolve([]);
	}

	const articlePromise = fetch(`${apiOrigin}/${frontPageId}/main-content?apiKey=${apiKey}`)
	.then(response => response.json())
	.then(data => {
		const articles = briefArticleMapper(data.pageItems);
		const articlesWithImages = articles.filter(article => article.image !== '');

		return articlesWithImages.slice(startFrom).slice(0, numberOfArticles);
	});

	return Promise.all([organisationPromise, articlePromise]).then(function (results) {
		const organisations = results[0];
		const articles = results[1];

		// Pick one of the upto 3 organisation articles
		// The first on the first page, second on second etc.
		// But if there aren't enough then don't prepend any.
		const nextArticle = organisations[Math.floor(startFrom / numberOfArticles) % 3];
		if (nextArticle) {
			articles.unshift(nextArticle);
		}
		return articles;
	});
}
