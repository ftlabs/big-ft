/**
 * service-worker.js
 *
 * Set up the service worker.
 */

module.exports = (function () {

	if ('serviceWorker' in navigator) {

		if (navigator.serviceWorker.controller) {
			return Promise.resolve();
		} else {

			// Return the instantiation promise
			return navigator.serviceWorker.register('./sw.js');
		}
	}
}());
