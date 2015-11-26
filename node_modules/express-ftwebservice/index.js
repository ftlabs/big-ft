module.exports = function(app, options) {
	var opts = options || {};

	opts.goodToGoTest = opts.goodToGoTest || defaultGoodToGo;
	opts.healthCheck = opts.healthCheck || defaultHealthCheck;
	opts.about = opts.about || {};

	if (opts.manifestPath && !opts.about.dateDeployed) {
		require('fs').stat(opts.manifestPath, function(err, stat) {
			opts.about.dateDeployed = stat.mtime;
		});
	}

	if (opts.manifestPath && !opts.about.appVersion) {
		opts.about.appVersion = require(opts.manifestPath).version;
	}

	if (!opts.about.hostname) {
		opts.about.hostname = require("os").hostname();
	}

	app.get(/^\/__about$/, function(req, res) {
		res.json(opts.about || {});
	});

	app.get(/\/__gtg$/, function(req, res) {

		res.set("Cache-Control", "no-store");
		res.set("Content-Type", "text/plain;charset=utf-8");

		function notOk() {
			res.statusCode = 503;
			res.send("Not OK, see /__health endpoint");
		}

		function ok() {
			res.send("OK");
		}

		// The GTG generation must timeout after 3 seconds and provide notice
		// of the timeout
		var goodToGoTimeout;
		Promise.race([
			opts.goodToGoTest(),
			new Promise(function(resolve, reject) {
				goodToGoTimeout = setTimeout(function() {
					res.send("gtg status generation timed out\n");
					resolve(false);
				}, 3000);
			})
		]).then(function(isOk) {
			clearTimeout(goodToGoTimeout);
			if (isOk) {
				ok();
			} else {
				notOk();
			}
		}).catch(function(e) {
			notOk();
		});
	});

	app.get(/\/__health$/, function(req, res) {
		res.set('Cache-Control', 'no-store');
		res.set('Content-Type', 'application/json;charset=utf-8');

		opts.healthCheck().then(function(checks) {
			res.json({
				schemaVersion: 1,
				name: opts.about.name,
				description: opts.about.purpose,
				checks: checks
			});
		}).catch(function(e) {
			// TODO
		});
	});

	function defaultHealthCheck() {
		return Promise.resolve([]);
	}

	function defaultGoodToGo() {
		return Promise.resolve(true);
	}
};
