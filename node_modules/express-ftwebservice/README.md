# Express FT Web Service Description

Installs routes for `/__gtg`, `/__health`, and `/__about`.

# Example

Basic example:

```JS
var path = require('path');
var ftwebservice = require('ftwebservice');
var express = require('express');
var app = express();

ftwebservice(app, {
	manifestPath: path.join(__dirname, 'package.json')
	about: {
		"schemaVersion": 1,
		"name": "build-service",
		"purpose": "Front end build process as a service.  Fetches specified Origami components from git, runs Origami build process, and returns the resulting CSS or JS bundle over HTTP.",
		"audience": "public",
		"primaryUrl": "https://build.origami.ft.com",
		"serviceTier": "gold"
	}
});
```

Example with Good To Go logic and Healthcheck logic:

```JS
ftwebservice(app, {
	manifestPath: path.join(__dirname, 'package.json')
	about: {
		"schemaVersion": 1,
		"name": "build-service",
		"purpose": "Front end build process as a service.  Fetches specified Origami components from git, runs Origami build process, and returns the resulting CSS or JS bundle over HTTP.",
		"audience": "public",
		"primaryUrl": "https://build.origami.ft.com",
		"serviceTier": "gold"
	}
	goodToGoTest: function() {
		return new Promise(function(resolve, reject) {
			resolve(isApplicationHappy());
		});
	},
	healthCheck: function() {
		// You might have several async checks that you need to perform or
		// collect the results from, this is a really simplistic example
		return new Promise(function(resolve, reject) {
			resolve([
				{
					name: "Database TCP connectivity",
					ok: false,
					severity: 2,
					businessImpact: "Article pages will not be available",
					technicalSummary: "The database is dead",
					panicGuide: "Check the health status of the database at host <database host>",
					checkOutput: "tcp connect failed after 10 seconds on destination port 3306 - destination unreachable",
					lastUpdated: new Date().toISOString()
				}
			]);
		});
	}
});
```

## Options

| Option | Description |
|--------|-------------|
| `manifestPath` | (Optional) Path to the app's package.json file. This will be used to populate the `appVersion` and `dateDeployed` properties of the /__about endpoint, if they are not specified explicitly. |
| `about` | (Optional) Object containing standard runbook propeties as defined in the [FT Runbook standard](https://docs.google.com/document/d/1B80a0nAI8L1cuIlSEai4Zuztq7Lef0ytxJYNFCjG7Ko/edit#) |
| `goodToGoTest` | (Optional) A function that can be used to indicate the good to go status of the service, the function should return a Promise resolved with `true` to indicate a positive good to go status, and `false` to indicate a negative good to go status. |
| `healthCheck` | (Optional) A function that can be used to generate structured healthcheck information, the function should return a Promise resolved with an array of healthcheck objects. |

# License

MIT
