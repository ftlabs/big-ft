/* global $, queryString, SVGLoader, moment, mina */
/* eslint-env browser */
/*eslint no-var:0*/
'use strict';
/*
	Customisation
	?primaryType=topStories
	&primarySearch=
	&primaryOffset=0
	&primaryMax=3
	&secondaryType=search
	&secondarySearch=banks
	&secondaryOffset=0
	&secondaryMax=10
*/

const parsed = queryString.parse(location.search);

const primaryType = parsed.primaryType;
const primarySearch = parsed.primarySearch;
const primaryOffset = isNaN(parseInt(parsed.primaryOffset)) ? 0 : parseInt(parsed.primaryOffset);
const primaryMax = isNaN(parseInt(parsed.primaryMax)) ? 3 : parseInt(parsed.primaryMax);

const secondaryType = parsed.secondaryType;
const secondarySearch = parsed.secondarySearch;
const secondaryOffset = isNaN(parseInt(parsed.secondaryOffset)) ? 3 : parseInt(parsed.secondaryOffset);
const secondaryMax = isNaN(parseInt(parsed.secondaryMax)) ? 10 : parseInt(parsed.secondaryMax);

const serviceUrl = '/data';
const topStoriesUrl = serviceUrl + '/top-stories';
const searchStoriesUrl = serviceUrl + '/search';

function getStories(type, offset, amount, term) {
	switch (type) {
		case 'search':
			return getSearchStories(offset, amount, term);
			break
		case 'topStories':
			return getTopStories(offset, amount);
			break;
		default:
			return getTopStories(offset, amount);
	}
}

function getTopStories (offset, amount) {
	return fetch(topStoriesUrl + '?startFrom=' + offset + '&numberOfArticles=' + amount)
		.then(function(response) {
			return response.json();
		})
	;
}

function getSearchStories (offset, amount, term) {
	return fetch(searchStoriesUrl + '?startFrom=' + offset + '&numberOfArticles=' + amount + '&keyword=' + term)
		.then(function(response) {
			return response.json();
		})
	;
}

var __bigFT = (function(){
	const updateInterval = 60 * 1000;
	const lastUpdated = document.getElementsByClassName('last-updated')[0];
	const interstitial = new SVGLoader( document.getElementById( 'loader' ), { speedIn : 700, easingIn : mina.easeinout } );

	const newsTicker = $('.ticker').ticker();
	const mediaHolder = document.getElementsByClassName('main-stories')[0];
	const clocks = document.querySelectorAll('[data-tz]');

	const openingHour = 9;
	const closingHour = 18;

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
		const primaryStories = getStories(primaryType, primaryOffset, primaryMax, primarySearch);
		const secondaryStories = getStories(secondaryType, secondaryOffset, secondaryMax, secondarySearch);

		Promise.all([primaryStories, secondaryStories])
			.then(function(stories) {
				const primaryStories = stories[0];
				const secondaryStories = stories[1];
				interstitial.show();

				setTimeout(function(){
					return Promise.all([populateMainStories(primaryStories), populateTicker(secondaryStories)]);
				}, 1000);

			})
			.then(function(){
				setTimeout(interstitial.hide.bind(interstitial), 1500);
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

			const currentHour = moment.tz(timezone).hours();

			if(currentHour > openingHour && currentHour < closingHour){
				$(clock).closest('li').removeClass('footer-cards__card--dim');
			} else {
				$(clock).closest('li').addClass('footer-cards__card--dim');
			}

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
