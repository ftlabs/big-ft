const SENTRY_DSN = process.env.SENTRY_DSN;
const raven = require('raven');
const client = new raven.Client(SENTRY_DSN);
const express = require('express');
const router = express.Router(); //eslint-disable-line new-cap
const topStories = require('../lib/topStories');
const search = require('../lib/search');
const cors = require('../middleware/cors');

router.use(cors);
router.get('/top-stories', (req, res) => {
  const startFrom = req.query.startFrom;
  const numberOfArticles = req.query.numberOfArticles;

  topStories(startFrom, numberOfArticles)
  .then(data => res.json(data))
  .catch(e => {
    client.captureException(e);
    res.sendStatus(503);
  });
})

router.get('/search', (req, res) => {
  const searchTerm = req.query.keyword;

  const startFrom = req.query.startFrom;
  const numberOfArticles = req.query.numberOfArticles;

  search(searchTerm, startFrom, numberOfArticles)
  .then(data => res.json(data))
  .catch(e => {
    client.captureException(e);
    res.sendStatus(503);
  });
})

module.exports = router;
