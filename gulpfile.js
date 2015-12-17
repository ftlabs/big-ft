'use strict'; // eslint-disable-line strict
/* eslint no-console:0 */
const spawn = require('child_process').spawn;
const denodeify = require('denodeify')
const gulp = require('gulp');
const Server = require('karma').Server;
const obt = require('origami-build-tools');
const path = require('path');
const selenium = require('selenium-standalone');

/*
 * Installs the latest version of Selenium and the default WebDrivers - Chrome & IE.
*/
const installSelenium = denodeify(selenium.install.bind(selenium));

/*
 * Starts the Selenium server with all the WebDrivers installed on the machine.
*/
const startSeleniumServer = denodeify(selenium.start.bind(selenium));

const exec = denodeify(require('child_process').exec, function(err, stdout, stderr) {
  return [err, [stdout, stderr]];
});

const mocha = require('gulp-spawn-mocha');
const nodemon = require('gulp-nodemon');
const util = require('gulp-util');

const buildFolder = './public/build';
const mainJsFile = 'main.js';
const mainScssFile = 'main.scss';
const sourceFolder = './src/';

const mainScssFilePath = path.join(sourceFolder, mainScssFile);
const mainJsFilePath = path.join(sourceFolder, mainJsFile);
const serverJsPaths = ['app.js', 'healthcheck.js', '{routes,bin,lib,middleware}/*'];

/*
 * Installs Selenium and starts the server, ready to control browsers
*/
function installAndStartSelenium () {
	return installSelenium()
		.then(startSeleniumServer)
		.then(child => {
			selenium.child = child;
		})
		.catch(e => {
			console.log('Selenium could not install or start', e);
			throw e;
		});
}

/*
 * A helper function which holds the config used for OBT build
*/
function obtBuildConfig (isDev) {
	return {
		buildFolder: buildFolder,
		env: isDev ? 'development' : 'production',
		js: mainJsFilePath,
		sass: mainScssFilePath,
		sourcemaps: true
	};
}

/*
 * A helper object which holds the config used for OBT verify
*/
const obtVerifyConfig = {
	esLintPath: path.join(__dirname, '.eslintrc'),
	excludeFiles: ['!public/**/**/*', '!src/js/svgloader.js'],
	js: mainJsFilePath,
	sass: mainScssFilePath
};

/*
 * A helper function which builds CSS for development and production
*/
function buildCss (isDev) {
	return obt.build.sass(gulp, obtBuildConfig(isDev))
		.on('end', () => console.log('build-css completed'))
		.on('error', err => console.warn('build-css errored', err));
}

/*
 * A helper function which builds JS for development and production
*/
function buildJs (isDev) {
	return obt.build.js(gulp, obtBuildConfig(isDev))
		.on('end', () => console.log('build-js completed'))
		.on('error', err => console.warn('build-js errored', err));
}

gulp.task('build:css:dev', () => buildCss(true));

gulp.task('build:js:dev', () => buildJs(true));

gulp.task('build:css:prod', () => buildCss(false));

gulp.task('build:js:prod', () => buildJs(false));

gulp.task('build', ['build:css:dev', 'build:js:dev']);

gulp.task('build:prod', ['build:css:prod', 'build:js:prod']);

gulp.task('default', ['watch']);

gulp.task('serve', function () {
	return nodemon({
		script: './bin/www',
		ext: 'js',
		env: { 'NODE_ENV': 'development' }
	});
});

gulp.task('start', ['watch']);

gulp.task('test:client', function (done) {
	return new Server({
		configFile: path.join(__dirname, 'karma.conf.js'),
		singleRun: true
	}, done)
	.start();
});

gulp.task('test:e2e', function () {
	/*
	 * Spins up the server in a child process ready for the tests to run against.
	*/
	function serve () {
		const bin = path.join(__dirname, 'bin', 'www');
		return spawn(bin, { detached: true})
			.on('close', () => console.log("serve exited"))
			.on('error', err => console.error(`"serve" Error: ${err}`));
	}

	const child = serve();

	return installAndStartSelenium()
		.then(function () {
			return new Promise(function(resolve, reject) {
				const wdioBin = path.join(__dirname, 'node_modules', '.bin','wdio');

				/*
				 * Executes WebDriverIO client binary to run our tests using the local Selenium server
				*/
				const wdio = spawn(wdioBin, ['wdio.conf.js'])
				
				wdio.stdout.on('data', function (data) {
					console.log(String(data));
				});

				wdio.stderr.on('data', function (data) {
					console.error(String(data));
				});

				wdio.on('close', function (code) {
					console.log('WebdriverIO exited with code ' + code);
					resolve();
				});

				wdio.on('error', function (err) {
					console.error('Failed to start child process.', err);
					reject(err);
				});
			})
		})
		.then(function () {
			child.kill('SIGINT');
			selenium.child.kill();
		});
});

gulp.task('test:server', () =>
	gulp.src(['tests/**/*.spec.js'], { read: false })
		.pipe(mocha({ reporter: 'spec', istanbul: true }))
		.on('error', util.log)
);

gulp.task('test', ['test:client', 'test:server', 'test:e2e']);

gulp.task('verify:css', function verifyCss () {
	return obt.verify.scssLint(gulp, obtVerifyConfig)
		.on('end', () => console.log('verify:css completed'))
		.on('error', e => console.log('verify:css linting error', e));
});

gulp.task('verify:js:client', function verifyClientJs () {
	return obt.verify.esLint(gulp, obtVerifyConfig)
		.on('end', () => console.log('verify:js:client completed'))
		.on('error', e => console.log('verify:js:client linting error', e));
});

gulp.task('verify:js:server', function verifyServerJs () {
	return obt.verify.esLint(gulp, Object.assign({}, obtVerifyConfig, { js: serverJsPaths }))
		.on('end', () => console.log('verify:js:server completed'))
		.on('error', e => console.log('verify:js:server linting error', e));
});

gulp.task('verify:js', ['verify:js:client', 'verify:js:server']);
gulp.task('verify', ['verify:css', 'verify:js']);

gulp.task('watch:js:server', () => gulp.watch(serverJsPaths, ['verify:js:server', 'test']));
gulp.task('watch:js:client', () => gulp.watch(['./src/**/*.js', 'tests/**/*.spec.js'], ['build:js:dev']));
gulp.task('watch:js', ['watch:js:server', 'watch:js:client']);
gulp.task('watch:css', () => gulp.watch('./src/**/*.scss', ['verify:css', 'build:css:dev']))
gulp.task('watch', ['build', 'serve', 'watch:js', 'watch:css']);
