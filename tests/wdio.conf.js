require('dotenv').load({silent: true});

const denodeify = require('denodeify');
const selenium = require('selenium-standalone');
const installSelenium = denodeify(selenium.install.bind(selenium));
const startSeleniumServer = denodeify(selenium.start.bind(selenium));
const spawn = require('child_process').spawn;

// Start application server
const app = spawn('../server/bin/www')
    .on('error', function (err) {
        console.log('Failed to start child process.', err);
    });

// const bs_local = spawn('BrowserStackLocal', [process.env.BROWSERSTACK_KEY], {
//     detached: true
// });

/*
 * Installs Selenium and starts the server, ready to control browsers
*/

function installAndStartSelenium () {
    return installSelenium()
        .then(startSeleniumServer)
        .then(child => {
            selenium.child = child;
        })
        .catch(e => {
            console.log('Selenium could not install or start', e);
            throw e;
        });
}

exports.config = {

    //
    // =================
    // Service Providers
    // =================
    // WebdriverIO supports Sauce Labs, Browserstack and Testing Bot (other cloud providers
    // should work too though). These services define specific user and key (or access key)
    // values you need to put in here in order to connect to these services.
    //
    user: process.env.BROWSERSTACK_USER,
    key:  process.env.BROWSERSTACK_KEY,

    // Define which test specs should run. The pattern is relative to the directory
    // from which `wdio` was called. Notice that, if you are calling `wdio` from an
    // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
    // directory is where your package.json resides, so `wdio` will be called from there.
    specs: [
        './tests/integration/**/*.js'
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
        browserName: 'chrome',
        // 'browserstack.local' : 'true',
        // 'browserstack.debug': 'true',
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

        // =====
    // Hooks
    // =====
    // Run functions before or after the test. If one of them returns with a promise, WebdriverIO
    // will wait until that promise got resolved to continue.
    //
    // Gets executed before all workers get launched.
    onPrepare: function() {
        return installAndStartSelenium();
    },

    // Gets executed before test execution begins. At this point you will have access to all global
    // variables like `browser`. It is the perfect place to define custom commands.
    before: function() {
    },

    // Gets executed after all tests are done. You still have access to all global variables from
    // the test.
    after: function(failures, pid) {
        process.kill(pid);
    },

    // Gets executed after all workers got shut down and the process is about to exit. It is not
    // possible to defer the end of the process using a promise.
    onComplete: function() {
        selenium.child.kill();
        app.kill();
        // bs_local.kill();
    }
};
