require('dotenv').load({silent: true});

module.exports = function (config) {
	config.set({
		// global config of your BrowserStack account
		browserStack: {
			username: process.env.BROWSERSTACK_USER,
			accessKey: process.env.BROWSERSTACK_KEY,
			pollingTimeout: 10000,
			startTunnel: true
		},

		basePath: '',
		frameworks: ['mocha'],

		plugins: [
			'karma-mocha',
			'karma-browserstack-launcher',
			'karma-webpack'
		],

		files: [
			'http://polyfill.webservices.ft.com/v1/polyfill.js?ua=safari/4&features=fetch,CustomEvent,Function.prototype.bind,Element.prototype.closest',
			{ pattern: './client/*.js', watched: true, included: true, served: true },
			{ pattern: '../client/src/*.js', watched: true, included: false, served: true },
		],

		preprocessors: {
			'./client/*.spec.js': ['webpack']
		},

		reporters: ['progress'],
		port: 9876,
		colors: true,
		
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,

		// define browsers
		customLaunchers: {
			bs_chrome_mac: {
				base: 'BrowserStack',
				browser: 'chrome',
				browser_version: '47.0',
				os: 'OS X',
				os_version: 'Mountain Lion'
			}
		},

		browsers: ['bs_chrome_mac'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: true,

		webpack: {
			module: {
				loaders: [
					{
						test: /\.js$/,
						loader: 'babel',
						exclude: /node_modules/,
						query: {
							// https://github.com/babel/babel-loader#options
							cacheDirectory: true,
							presets: ['es2015']
						}
					},
					{
						include: /\.json$/,
						loaders: ['json-loader']
					}
				]
			}
		},

		// Hide webpack output logging
		webpackMiddleware: {
			noInfo: true
		}

	});
};
