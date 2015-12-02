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
  debug("capiPageUrl=" + capiPageUrl);

  return fetch(capiPageUrl)
  .then(response => response.json())
  .then(data => data.pageItems)
  .then(articles => articles.slice(startFrom).slice(0, numberOfArticles))
  .then(articles => briefArticleMapper(articles))
  .then(function(briefArticles){
    var extendedArticles = briefArticles.map(function(ba){
      debug( "ba=" + JSON.stringify(ba) );
      var capiArticleUrl = `${apiOrigin}/content/items/v1/${ba.id}?apiKey=${apiKey}`;
      debug( "capiArticleUrl=" + capiArticleUrl );      
      return fetch(capiArticleUrl)
//      .then(response => response.json())
      .then(function(response) { 
        // debug( "response=" + JSON.stringify(response) );
        return response.json(); 
      })
     .then(data => data.item)
      .then(viewModel.parseFullArticle)
      .then(function(extraArticleFields){ 
        if (ba.headline !== extraArticleFields.shortestHeadline){
          debug( "ba.headline !== extraArticleFields.shortestHeadline:\n" + ba.headline + "\n" + extraArticleFields.shortestHeadline);
        }
        return Object.assign(ba, extraArticleFields);
      })
    });
    return Promise.all( extendedArticles );
  })
  ;
}
