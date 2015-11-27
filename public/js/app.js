/* global $, queryString, SVGLoader, moment, mina */
/* eslint-env browser */
/*eslint no-var:0*/
'use strict';

function getStories (amount) {

	var amount = amount || 3;

	return fetch(serviceURL + '/top-stories?startFrom=1&numberOfArticles=' + amount)
		.then(function(response) {
			return response.json();
		})
	;

}

var __bigFT = (function(){

	const serviceURL = "http://ftlabs-big-ft.herokuapp.com/data/";
	const updateInterval = 60 * 1000;
	const lastUpdated = document.getElementsByClassName('last-updated')[0];
	const interstitial = new SVGLoader( document.getElementById( 'loader' ), { speedIn : 700, easingIn : mina.easeinout } );

	const newsTicker = $('.ticker').ticker();
	const mediaHolder = document.getElementsByClassName('main-stories')[0];
	const clocks = document.querySelectorAll('[data-tz]');

	var mainStoryTransition = undefined;

	function populateMainStories(stories){

		return new Promise(function(resolve, reject){

			var media = document.createElement('div');
			var headlines = document.createElement('ol');
			var images = [];

			media.setAttribute('class', 'main-stories__media-container');
			headlines.setAttribute('class', 'main-stories__headlines flex-col');

			stories.forEach(function(story, idx){

				var img = new Image();
				var text = document.createElement('li');

				var imgClass = 'main-stories__media';
				var textClass = 'main-stories__story';

				if(idx === 0){
					imgClass += ' main-stories__media--current';
					textClass += ' main-stories__story--current'
				}

				img.setAttribute('class', imgClass);
				text.setAttribute('class', textClass);

				img.src = story.image;
				images.push(new Promise(function(resolve, reject){
						img.onload = resolve(img);
						img.onerror = reject();
					})
				)

				text.textContent = story.headline;
				headlines.appendChild(text);

			});

			Promise.all(images)
				.then(function(images){

					images.forEach(function(image){

						media.appendChild(image);

					});

					resolve();

					mediaHolder.innerHTML = '';

					mediaHolder.appendChild(media);
					mediaHolder.appendChild(headlines);

				})
				.catch(function(){
					reject();
				})
			;



		});

	}

		function populateTicker(stories){

		return new Promise(function(resolve){

			stories.forEach(function(story){

				newsTicker.addMsg(story.headline);

			});

			newsTicker.start();

			resolve();

		});

	}

	function getStories(amount){

		var amount = amount || 3;

		return fetch(serviceURL + "/top-stories?startFrom=1&numberOfArticles=" + amount)
			.then(function(response) {
				return response.json();
			})
		;

	}

	function nextMainStory() {
		['main-stories__story--current', 'main-stories__media--current'].forEach(function(c) {
			var existing = $('.'+c);
			existing.removeClass(c).next().addClass(c);
			if (!$('.'+c).length) {
				existing.parent().children().eq(0).addClass(c);
			}
		});
	}

	function updateContent(){

		getStories(10)
			.then(function(stories) {

				interstitial.show();

				setTimeout(function(){
					return Promise.all( [ populateMainStories( stories.slice(0, 3) ), populateTicker( stories.slice( 3, stories.length ) ) ]);
				}, 1000);

			})
			.then(function(){
				setTimeout(interstitial.hide.bind(interstitial), 5000);
				clearTimeout(mainStoryTransition);
				mainStoryTransition = setInterval(nextMainStory, 10000);
				lastUpdated.innerHTML = 'Last updated: ' + moment().format('HH:mm');
			})
			.catch(function(){
				setTimeout(interstitial.hide.bind(interstitial), 5000);
			})
		;


	}

	function updateClocks(){
		[].forEach.call(clocks, function(clock){

			const timezone = clock.getAttribute('data-tz');

			clock.innerHTML = moment().tz(timezone).format('HH:mm');

		});

	}

	function initialise(){

		updateContent();
		updateClocks();

		setInterval(updateClocks, 60000);
		setInterval(updateContent, updateInterval);

	}

	return {
		init : initialise
	};

}());


$(function() {

	__bigFT.init();

});
