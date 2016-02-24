const toolbox = require('sw-toolbox');

toolbox.router.default = toolbox.fastest;

// Data should query the network first but fallback to the Cache
toolbox.router.any('/data/*', toolbox.networkFirst);
