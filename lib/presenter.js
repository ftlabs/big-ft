module.exports = articles =>
  articles.map(article => {
    const headline = article.title.title;
    const url = article.links[0] ? article.links[0].href : '';

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
      headline,
      url,
      image
    };
  })
