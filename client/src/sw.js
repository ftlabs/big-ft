const toolbox = require('sw-toolbox');

// Try network but fallback to cache
toolbox.router.default = toolbox.networkFirst;

// Cache static updates then update them once the network resolves.
toolbox.router.any('/static/*', toolbox.fastest);

// Data should query the network first but fallback to the Cache
toolbox.router.any('/data/*', toolbox.networkFirst);
