/* global console */
'use strict';

const gulp = require('gulp');
const obt = require('origami-build-tools');
const nodemon = require('gulp-nodemon');
const path = require('path');

const mocha = require('gulp-spawn-mocha');
const util = require('gulp-util');

const mainJsFile = 'main.js';
const mainScssFile = 'main.scss';
const sourceFolder = './src/';
const buildFolder = './public/build';
const mainScssFilePath = path.join(sourceFolder, mainScssFile);
const mainJsFilePath = path.join(sourceFolder, mainJsFile);

const buildCss = isDev => obt.build.sass(gulp, {
	sass: mainScssFilePath,
	buildFolder: buildFolder,
	env: isDev ? 'development' : 'production',
	sourcemaps: true
})
.on('end', function() {
	console.log('build-css completed');
})
.on('error', function(err) {
	console.warn('build-css errored');
	throw err;
});

const buildJs = isDev => obt.build.js(gulp, {
	js: mainJsFilePath,
	buildFolder: buildFolder,
	env: isDev ? 'development' : 'production',
	sourcemaps: true
})
.on('end', function() {
	console.log('build-js completed');
})
.on('error', function(err) {
	console.warn('build-js errored');
	throw err;
});

const server = () => nodemon({
	script: './bin/www',
	env: { 'NODE_ENV': 'development' }
})
.on('restart', updatedFiles => console.log('restarted!', updatedFiles)
);

const verifyCss = () => obt.verify.scssLint(gulp, {
	sass: mainScssFilePath
})

const verifyJs = () => obt.verify.esLint(gulp, {
	js: mainJsFilePath,
	excludeFiles: ['!public/**/**/*', '!src/js/svgloader.js']
})

gulp.task('build-css-dev', buildCss.bind(null, true));

gulp.task('build-js-dev', buildJs.bind(null, true));

gulp.task('build-css-prod', buildCss.bind(null, false));

gulp.task('build-js-prod', buildJs.bind(null, false));

gulp.task('build', ['build-css-dev', 'build-js-dev']);

gulp.task('build-prod', ['build-css-prod', 'build-js-prod']);

gulp.task('nodemon', server);

gulp.task('test', () =>
	gulp.src(['tests/**/*.spec.js'], { read: false })
	.pipe(mocha({ reporter: 'spec' }))
 	.on('error', util.log)
);

gulp.task('verify-css', verifyCss);
gulp.task('verify-js', verifyJs);
gulp.task('verify', ['verify-css', 'verify-js']);

gulp.task('watch-server-js', () => gulp.watch(['app.js', 'healthcheck.js', '{routes,bin,lib,middleware}/*'], ['test']));
gulp.task('watch-client-js', () => gulp.watch(['./src/**/*.js', 'tests/**/*.spec.js'], ['build-js-dev']));
gulp.task('watch-js', ['watch-server-js', 'watch-client-js']);
gulp.task('watch-css', () => gulp.watch('./src/**/*.scss', ['build-css-dev']))
gulp.task('watch', ['build', 'nodemon', 'watch-js', 'watch-css']);

gulp.task('default', ['watch']);
