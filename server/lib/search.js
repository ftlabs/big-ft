const fetch = require('node-fetch');
const present = require('./viewModel');
const bluebird = require('bluebird');

const searchApiEndpoint = process.env.searchApiEndpoint;
const apiKey = process.env.apiKey;

module.exports = (keyword, startFrom, numberOfArticles) => {
    const searchPayload = {
      queryString: keyword,
      queryContext : {
        curations : [ 'ARTICLES' ]
      },
      resultContext : {
        maxResults : numberOfArticles || 10,
        offset : startFrom || 0,
        sortOrder: 'DESC',
        sortField: 'lastPublishDateTime'
      }
    };

    const searchResponse = fetch(`${searchApiEndpoint}?apiKey=${apiKey}`, {
      method: 'post',
      'Content-Type': 'application/json',
      body: JSON.stringify(searchPayload)
    })
    .then(response => response.json());

    const articleApiUrls = searchResponse
    .then(data => {
        if (Array.isArray(data.results) && Array.isArray(data.results[0].results)) {
            return data.results[0].results
                .map(article => `${article.apiUrl}?apiKey=${apiKey}`)
                .filter(Boolean);
        } else {
            return [];
        }
    });

    return bluebird.map(articleApiUrls, article =>
        fetch(article)
        .then(article => article.json())
        .then(a => a.item)
        .then(present)
    )
    .then(articles => articles.filter(article => article.image !== ''))
};
