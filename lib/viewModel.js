/* eslint strict:0 */
'use strict';
module.exports = function (article) {
  const headline = article.title.title;
  const lastPublishDateTime = article.lifecycle.lastPublishDateTime;
  const id = article.id;
  let url;

  if (Array.isArray(article.links)) {
      url = article.links[0];
  } else if (article.location && article.location.uri) {
      url = article.location.uri;
  } else {
      url = '';
  }

  article.images.sort(function compare (a, b) {
    if (a.width > b.width) {
      return -1;
    }
    if (a.width < b.width) {
      return 1;
    }
    return 0;
  });

  const image = article.images[0] ? article.images[0].url : '';

  return {
    id: id,
    headline: headline,
    url: url,
    image: image,
    lastPublishDateTime: lastPublishDateTime
  };
};
