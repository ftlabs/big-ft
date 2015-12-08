const SENTRY_DSN = process.env.SENTRY_DSN;
const express = require('express');
const compression = require('compression');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const data = require('./routes/data');
const update = require('./routes/update');
const app = express();
const ftwebservice = require('express-ftwebservice');
const hbs = require('express-hbs');
const raven = require('raven');
const client = new raven.Client(SENTRY_DSN);
client.patchGlobal();

app.engine('hbs', hbs.express4({
  partialsDir: path.join(__dirname, '/views/partials')
}));

ftwebservice(app, {
	manifestPath: path.join(__dirname, '/package.json'),
	about: require('./runbook.json'),
	healthCheck: require('./healthcheck'),
	goodToGoTest: () => Promise.resolve(true) // TODO
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Set-up error reporting to sentry
app.use(raven.middleware.express.requestHandler(SENTRY_DSN));
app.use(raven.middleware.express.errorHandler(SENTRY_DSN));

app.use(compression({threshold: 0}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/static', express.static(__dirname + '/public'));

app.use('/', routes);
app.use('/data', data);
app.use('/update', update);

app.use(function (req, res) {
  res.sendStatus(404);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

module.exports = app;
