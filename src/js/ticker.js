/* global jQuery */
'use strict';
module.exports = (function ($){

	$.fn.ticker = function(options) {
		const settings = jQuery.extend({
			pxpersec: 150
		}, options);
		if (this.length !== 1) throw 'Ticker can only be attached to a single element';
		if (this.children('ul').length !== 1) throw `Ticker container must contain a UL, eg <div id='ticker'><ul></ul></div>`;
		return new $.ticker(this, settings); //eslint-disable-line new-cap
	};

	$.ticker = function(el, settings) {

		let addqueue = [];
		let removequeue = [];
		let numSegs;
		let updatecount = 0;
		let segWidth = 0;
		let tapeWidth = 0;
		let isscrolling = false;

		const elcont = el;
		const eltape = el.children().first();
		eltape.css({'margin':0, 'padding':0, 'listStyleType':'none', 'whiteSpace':'nowrap', 'oTransition':'transform 0s linear', 'webkitTransition':'transform 0s linear', 'mozTransition':'transform 0s linear', 'transition':'transform 0s linear'});
		elcont.css({overflow:'hidden', userSelect:'none', pointerEvents:'none'});
		if (!elcont.css('float') || elcont.css('float') === 'none') {
			elcont.css('display', 'block');
		}

		if (eltape.children('li').length) initTape();


		/* Private methods */

		function initTape() {

			numSegs = 1;

			// Mark each message in the list
			if (!eltape.children('li').length) throw 'Cannot initialise ticker: Nothing in it';
			eltape.children('li').addClass('seg1').attr('seg', 1).each(function() {
				if (!$(this).attr('id')) $(this).attr('id', 'msg'+Math.ceil(Math.random()*99999999));
			});

			// Apply transition CSS to the tape
			isscrolling = true;
			updatecount = 1;
			eltape.bind('webkitTransitionEnd', slide);
			eltape.bind('oTransitionEnd', slide);
			eltape.bind('mozTransitionEnd', slide);
			eltape.bind('transitionEnd', slide);
			slide();
		}

		function slide() {
			let widths;
			const contWidth = elcont.width();

			// Copy each segment over the one preceding it
			if (updatecount) {
				if (numSegs > 1) {
					for (let i=(numSegs-1); i>=1; i--) {
						eltape.find('.seg'+(i+1)).remove();
						eltape.find('.seg'+i).clone().removeClass('seg'+i).removeAttr('id').addClass('seg'+(i+1)).attr('seg', (i+1)).insertBefore(eltape.find('.seg'+i).first());
					}
				}

				// If the ticker is now empty, delete all shadow segments and stop
				if (eltape.find('.empty').length) {
					eltape.unbind().css({webkitTransitionDuration:'0s'}).children().remove();
					isscrolling = 0;
					return;
				}

				// Add or remove segments as necessary
				widths = calcWidths();
				if (widths.total < (contWidth+widths.seg1)) {
					let content = eltape.children('.seg'+numSegs);
					content = content.clone().removeAttr('id').removeClass('seg'+numSegs);
					if (!widths['seg'+numSegs]) throw 'Ticker is zero-width';
					const numrequired = Math.ceil((contWidth+widths.seg1-widths.total)/widths['seg'+numSegs]);
					for (let i=1; i<=numrequired; i++) {
						numSegs++;
						eltape.prepend(content.clone().addClass('seg'+numSegs).attr('seg',numSegs));
						widths['seg'+numSegs] = widths['seg'+(numSegs-1)];
						widths.total += widths['seg'+numSegs];
					}
				}
				if (widths.total > (contWidth+(widths.seg1*2))) {
					eltape.find('.seg'+numSegs).remove();
					numSegs--;
					widths.total -= widths['seg'+(numSegs+1)];
					delete widths['seg'+(numSegs+1)];
				}

				segWidth = widths.seg1;
				tapeWidth = widths.total;
				eltape.width(widths.total);
				updatecount--;
			}

			// Modify the last segment to add/remove queued elements
			if (removequeue.length || addqueue.length) {
				if (removequeue.length) {
					for (let remidx=removequeue.length-1; remidx>=0; remidx--) {
						$(removequeue[remidx]).remove();
					}
					removequeue = [];

					// If master segment is now zero-width, add a .empty message that is the width of the parent container
					if (!eltape.find('.seg1').length) $(`<li class='seg1 empty'></li>`).width(elcont.width()).appendTo(eltape);
				}
				if (addqueue.length) {
					for (let addidx=addqueue.length-1; addidx>=0; addidx--) {
						$(addqueue[addidx]).addClass('seg1').attr('seg', 1).appendTo(eltape);
					}
					addqueue = [];

					// Remove any .empty messages
					eltape.find('.seg1').filter('.empty').remove();
				}

				// Recalculate widths
				widths = calcWidths();
				segWidth = widths.seg1;
				tapeWidth = widths.total;
				eltape.width(widths.total);

				// Start cascade
				updatecount = numSegs;
			}

			// Reposition the tape to move the last segment just off the right side of the screen
			eltape.css({'webkitTransitionDuration':'0s', 'mozTransitionDuration':'0s', 'oTransitionDuration':'0s', 'transitionDuration':'0s'});
			eltape.css({transform:'translateX(-'+(tapeWidth-contWidth-segWidth)+'px)'});

			// Commit DOM changes (otherwise the element will still be at right:0 below)
			eltape.offset();

			// Calculate duration of animation to achieve desired speed, resume scrolling
			const dur = Math.floor(segWidth/settings.pxpersec);
			eltape.css({'webkitTransitionDuration':dur+'s', 'mozTransitionDuration':dur+'s', 'oTransitionDuration':dur+'s', 'transitionDuration':dur+'s'});
			eltape.css({transform:'translateX(-'+(tapeWidth-contWidth)+'px)'});
		}

		function calcWidths() {
			const widths = {total:0};
			eltape.children().each(function() {
				if (typeof widths['seg'+$(this).attr('seg')] === 'undefined') widths['seg'+$(this).attr('seg')] = 0;
				widths['seg'+$(this).attr('seg')] += $(this).outerWidth();
				widths.total += $(this).outerWidth();
			});
			return widths;
		}


		/* Public methods */

		// Add a new item to the ticker.  Pass a reference to an LI that is to be added to the ticker
		this.addMsg = function(el) {
			if (typeof el === 'string') el = $('<li>'+el+'</li>');
			if (!el.attr('id')) {
				el.attr('id', 'msg'+Math.ceil(Math.random()*99999999));
			}
			if(!el.attr('class')){
				el.attr('class', 'ticker__story');
			}
			if (isscrolling) {
				addqueue.push(el);
			} else {
				eltape.append(el);
			}
			return el.attr('id');
		};

		// Remove an item from the ticker.  Pass a reference to an LI in segment 1.
		this.removeMsg = function(el) {
			if (typeof el === 'string') el = $('#'+el);
			removequeue.push(el);
		};

		// Start if not already running
		this.start = function() {
			if (!isscrolling) initTape();
		};

		// Report current status of ticker
		this.isScrolling = function() {
			return (isscrolling === true);
		};
	};
}(jQuery));
