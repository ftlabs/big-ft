const toolbox = require('sw-toolbox');

// Try network but fallback to cache
toolbox.router.default = toolbox.networkFirst;

// Cache static updates then update them once the network resolves.
toolbox.router.any('/static/*', toolbox.fastest);

// Data should query the network first but fallback to the Cache
toolbox.router.any('/data/*', function (request) {
	return toolbox.networkFirst(request)
	.then(function (response) {
		
		// here I will alter the body from an array of values
		// to an object that looks like:
		// {
		//   data: [],
		//   timestamp: response.headers.get('ft-timestamp')
		// }
		// the ft-timestamp header is set by fetch
		// it is echoed back by the server
		// 
		// in case it is not there we do not alter the response
		return response;
	});
});
