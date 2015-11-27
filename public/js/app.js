/* global $ */
/*eslint no-var:0*/

var __bigFT = (function(){

	'use strict';

	const serviceURL = "http://ftlabs-big-ft.herokuapp.com/data/";
	const updateInterval = 10 * 1000;
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

			var media = document.createElement('div'),
				headlines = document.createElement('ol'),
				images = [];

			media.setAttribute('class', 'main-stories__media-container');
			headlines.setAttribute('class', 'main-stories__headlines flex-col');

			stories.forEach(function(story, idx){

				var img = new Image();
				var text = document.createElement('li');

				var imgClass = "main-stories__media";
				var textClass = "main-stories__story";

				if(idx === 0){
					imgClass += " main-stories__media--current";
					textClass += " main-stories__story--current"
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

					images.forEach(function(image, idx){

						media.appendChild(image);

					});

					resolve();

					mediaHolder.innerHTML = "";

					mediaHolder.appendChild(media);
					mediaHolder.appendChild(headlines);

				})
				.catch(function(err){
					reject();
				})
			;



		});

	}

		function populateTicker(stories){

		return new Promise(function(resolve, reject){

			stories.forEach(function(story){

				newsTicker.addMsg(story.headline);

			});

			newsTicker.start();

			resolve();

		});

	}

	function checkForChanges(newStories, oldStories){

		if (oldStories.length < newStories.length) {
			return Promise.resolve(newStories);
		};

		return new Promise(function(resolve, reject){

			var thereWasADifference = newStories.some(function(story, idx){

				var oldStory = oldStories[idx].textContent.toLowerCase();
				var newStory = story.headline.toLowerCase();

				return newStory !== oldStory;

			});

			if(thereWasADifference){
				resolve(newStories);
			} else {
				reject();
			}

		});

	}

	function getStories(amount){

		var amount = amount || 3;

		return fetch(serviceURL + "/top-stories?startFrom=0&numberOfArticles=" + amount)
			.then(function(response) {
				return response.json();
			})
		;

	}

	function getFilteredStories(amount, from){

		var amount = amount || 10;
		var from = from || 0;



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

		getStories(3)
			.then(function(stories) {

				return checkForChanges(stories, Array.prototype.slice.call(document.querySelectorAll('.main-stories__story')));

			})
			.then(function(stories){
				interstitial.show();
				setTimeout(function(){
					return Promise.all( [ populateMainStories( stories.slice(0, 3) ), populateTicker( stories.slice( 3, stories.length ) ) ]);
				}, 1000);
			})
			.then(function(){
				setTimeout(interstitial.hide.bind(interstitial), 3000);
				clearTimeout(mainStoryTransition);
				mainStoryTransition = setInterval(nextMainStory, 10000);
				lastUpdated.innerHTML = "Last updated: " + moment().format("HH:mm");
			})
			.catch(function(err){
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

})();


$(function() {

	__bigFT.init();

});
