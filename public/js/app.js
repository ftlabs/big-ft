/* global $ */
/*eslint no-var:0*/

function nextMainStory() {
	['main-stories__story--current', 'main-stories__media--current'].forEach(function(c) {
		var existing = $('.'+c);
		existing.removeClass(c).next().addClass(c);
		if (!$('.'+c).length) {
			existing.parent().children().eq(0).addClass(c);
		}
	});
}


$(function() {
	var interstitial;

	$('.ticker').ticker();

	setInterval(nextMainStory, 5000);

	interstitial = new SVGLoader( document.getElementById( 'loader' ), { speedIn : 700, easingIn : mina.easeinout } );

	// Demo for Sean
	setTimeout(function() {
		interstitial.show();
		setTimeout(interstitial.hide.bind(interstitial), 1500);
	}, 1000);
});
