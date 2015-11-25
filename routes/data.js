const express = require('express');
const router = express.Router(); //eslint-disable-line new-cap
const topStories = require('../lib/top-stories');

router.get('/top-stories', (req, res) => {
  const sendJson = res.json.bind(res);
  const send503 = res.sendStatus.bind(res,503);

  const startFrom = req.query.startFrom;
  const numberOfArticles = req.query.numberOfArticles;

  topStories(startFrom, numberOfArticles)
  .then(sendJson)
  .catch(send503);
})

module.exports = router;
