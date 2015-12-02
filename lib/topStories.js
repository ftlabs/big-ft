const debug = require('debug')('big-ft:topStories');
const fetch = require('node-fetch');
const viewModel = require('./viewModel');
const R = require('ramda');
const briefArticleMapper = R.map(viewModel.parsePageArticle);

const apiOrigin   = process.env.apiOrigin;
const frontPageId = process.env.frontPageId;
const apiKey      = process.env.apiKey;

module.exports = function(startFrom, numberOfArticles){
  if (isNaN(startFrom)) {
    startFrom = 0;
  }

  if (isNaN(numberOfArticles)) {
    numberOfArticles = 0;
  }

  var capiPageUrl = `${apiOrigin}/site/v1/pages/${frontPageId}/main-content?apiKey=${apiKey}`;

  return fetch(capiPageUrl)
  .then(response => response.json())
  .then(data => data.pageItems)
  .then(articles => articles.slice(startFrom).slice(0, numberOfArticles))
  .then(articles => briefArticleMapper(articles))
  ;
};
