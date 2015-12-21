const fetch = require('node-fetch');
const briefArticle = require('./viewModel');
const R = require('ramda');
const briefArticleMapper = R.map(briefArticle);

const siteApiEndpoint = process.env.siteApiEndpoint;
const frontPageId = process.env.frontPageId;
const mainContentKey = process.env.mainContentKey;
const apiKey = process.env.apiKey;

module.exports = function (startFrom, numberOfArticles){
  if (isNaN(startFrom)) {
    startFrom = 0;
  }

  if (isNaN(numberOfArticles)) {
    numberOfArticles = Infinity;
  }

  return fetch(`${siteApiEndpoint}/${frontPageId}/${mainContentKey}?apiKey=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    const articles = briefArticleMapper(data.pageItems);
    const articlesWithImages = articles.filter(article => article.image !== '');

    return articlesWithImages.slice(startFrom).slice(0, numberOfArticles);
  })
  ;
}
