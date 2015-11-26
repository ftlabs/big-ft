const fetch = require('node-fetch');
const present = require('./viewModel');
const R = require('ramda');
const presenter = R.map(present);

const siteApiEndpoint = process.env.siteApiEndpoint;
const frontPageId = process.env.frontPageId;
const mainContentKey = process.env.mainContentKey;
const apiKey = process.env.apiKey;

module.exports = (startFrom, numberOfArticles) => {
  if (isNaN(startFrom)) {
    startFrom = 0;
  }

  if (isNaN(numberOfArticles)) {
    numberOfArticles = 0;
  }

  return fetch(`${siteApiEndpoint}/${frontPageId}/${mainContentKey}?apiKey=${apiKey}`)
  .then(response => response.json())
  .then(data => data.pageItems)
  .then(articles => articles.slice(startFrom).slice(0, numberOfArticles))
  .then(articles => presenter(articles))
  ;
}
