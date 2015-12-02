var parsePageArticle = function(article){
    const headline = article.title.title;
    const lastPublishDateTime = article.lifecycle.lastPublishDateTime;
    const id = article.id;
    var url;

    if (Array.isArray(article.links)) {
        url = article.links[0];
    } else if (article.location && article.location.uri) {
        url = article.location.uri;
    } else {
        url = '';
    }

    article.images.sort(function compare(a, b) {
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

var arrayUnique = function(a) {
    return a.reduce(function(p, c) {
        if (p.indexOf(c) < 0) p.push(c);
        return p;
    }, []);
};

var parseFullArticle = function( article ){
  var titles = [];
  if (article.title.title) {
    titles.push( article.title.title );
  }

  if (article.packaging && article.packaging.spHeadline) {
    titles.push( article.packaging.spHeadline );
  }

  if (article.editorial && article.editorial.otherTitles) {
    titles = titles.concat( article.editorial.otherTitles);
  }

  titles.sort( function compare(a,b) {
    if (a.length < b.length) {
      return -1;
    }
    if (a.length > b.length) {
      return +1;
    }
    return 0;
  });

  titles = arrayUnique( titles);

  return {
    shortestHeadline: titles[0],
    headlines: titles
  };
};

module.exports = {
  parsePageArticle: parsePageArticle,
  parseFullArticle: parseFullArticle
};