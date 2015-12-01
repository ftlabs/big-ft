/* eslint strict:0 */
'use strict';
module.exports = article => {
    const headline = article.title.title;
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
      headline,
      url,
      image
    };
  }
