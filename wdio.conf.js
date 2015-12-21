exports.config = {

    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
    specs: [
        './tests/specs/e2e/**/*.js'
    ],

    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilties at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude option in
    // order to group specific specs to a specific capability.
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://docs.saucelabs.com/reference/platforms-configurator
    capabilities: [{
        browserName: 'chrome'
    }],

    // Level of logging verbosity: silent | verbose | command | data | result | error
    logLevel: 'silent',

    coloredLogs: true,

    // Saves a screenshot to a given path if a command fails.
    screenshotPath: './errorShots/',

    // Set a base URL in order to shorten url command calls. If your url parameter starts
    // with "/", the base url gets prepended.
    baseUrl: 'http://localhost:3000',

    // Default timeout for all waitForXXX commands.
    waitforTimeout: 30000,

    // Initialize the browser instance with a WebdriverIO plugin. The object should have the
    // plugin name as key and the desired plugin options as property. Make sure you have
    // the plugin installed before running any tests. The following plugins are currently
    // available:
    // WebdriverCSS: https://github.com/webdriverio/webdrivercss
    // WebdriverRTC: https://github.com/webdriverio/webdriverrtc
    // Browserevent: https://github.com/webdriverio/browserevent
    // plugins: {
    //     webdrivercss: {
    //         screenshotRoot: 'my-shots',
    //         failedComparisonsRoot: 'diffs',
    //         misMatchTolerance: 0.05,
    //         screenWidth: [320,480,640,1024]
    //     },
    //     webdriverrtc: {},
    //     browserevent: {}
    // },

    framework: 'mocha',
    reporter: 'dot',

    // Options to be passed to Mocha.
    // See the full list at http://mochajs.org/
    mochaOpts: {
        ui: 'bdd',
        timeout: 50000
    },

    // Gets executed before all workers get launched. If it returns with a promise, WebdriverIO
    // will wait until that promise gets resolved before continuing.
    onPrepare: function() { // TODO: Install selenium, webdrivers and start-up selenium server
        // return selenium.start();
    },

    // Gets executed after all workers are shut down and the process is about to exit. It is not
    // possible to defer the end of the process using a promise.
    onComplete: function() { // TODO: shut down selenium server
        // return selenium.stop();
    }
};
