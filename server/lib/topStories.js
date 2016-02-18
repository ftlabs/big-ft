const fetch = require('node-fetch');
const briefArticle = require('./viewModel');
const R = require('ramda');
const briefArticleMapper = R.map(briefArticle);

const siteApiEndpoint = process.env.siteApiEndpoint;
const mainContentKey = process.env.mainContentKey;
const apiKey = process.env.apiKey;
const frontPageIdUK = process.env.frontPageId;
const frontPageIdUS = process.env.frontPageIdUS;

// edition can be "US" or "INTL" (both meaning US), or "UK" (and anything except "US"/"INTL", including null or "", i.e. its the default)
module.exports = function (startFrom, numberOfArticles, edition){
  if (isNaN(startFrom)) {
    startFrom = 0;
  }

  if (isNaN(numberOfArticles)) {
    numberOfArticles = Infinity;
  }

  let frontPageId = frontPageIdUK; // the default
  if (edition && (edition === "US" || edition === "INTL" )) {
    frontPageId = frontPageIdUS;
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
