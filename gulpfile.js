/* global console */
'use strict';

const gulp = require('gulp');
const obt = require('origami-build-tools');
const nodemon = require('gulp-nodemon');
const uglify = require('gulp-uglify');
const path = require('path');

const mainJsFile = 'main.js';
const mainScssFile = 'main.scss';
const sourceFolder = './src/';
const buildFolder = './public/build';

const buildCss = isDev => obt.build.sass(gulp, {
	sass: path.join(sourceFolder, mainScssFile),
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
	js: path.join(sourceFolder, mainJsFile),
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

gulp.task('build-css-dev', buildCss.bind(null, true));

gulp.task('build-js-dev', buildJs.bind(null, true));

gulp.task('build-css-prod', buildCss.bind(null, false));

gulp.task('build-js-prod', buildJs.bind(null, false));

gulp.task('build', ['build-css-dev', 'build-js-dev']);

gulp.task('build-prod', ['build-css-prod', 'build-js-prod']);

gulp.task('watch-js', () => gulp.watch('./src/**/*.js', ['build-js-dev']))
gulp.task('watch-css', () => gulp.watch('./src/**/*.scss', ['build-css-dev']))

gulp.task('nodemon', server);

gulp.task('watch', ['build', 'nodemon', 'watch-js', 'watch-css']);

gulp.task('default', ['watch']);
