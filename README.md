## Big FT [![Test Coverage](https://codeclimate.com/github/ftlabs/big-ft/badges/coverage.svg)](https://codeclimate.com/github/ftlabs/big-ft/coverage) [![Code Climate](https://codeclimate.com/github/ftlabs/big-ft/badges/gpa.svg)](https://codeclimate.com/github/ftlabs/big-ft)

### Development

#### Prerequisites
- [NodeJS](https://nodejs.org/en/) -- The runtime the application requires
- [Heroku Toolbelt](https://toolbelt.heroku.com/) -- _Used for interacting with the production/testing instances_
- [Java Development Kit](http://www.oracle.com/technetwork/java/javase/downloads/index.html) -- Used for testing.

#### Setting up development environment
- Clone the repository -- `git clone git@github.com:ftlabs/big-ft.git`
- Change in repository directory -- `cd big-ft`
- Install the dependencies -- `npm install`
- Build the files used by the web client -- `npm run build`
- Spin up the web server -- `npm start`
- Open the website in your browser of choice -- `open "localhost:3000"` -- it will default to port 3000

### Day-to-Day Development
When developing you may want to have the server restart and client files rebuilt on any code changes. This can be done with the `develop` npm script -- `npm run develop`.

### Testing
Selenium is used for integration testing. In order to get Selenium running you will need to install the [Java Development Kit](http://www.oracle.com/technetwork/java/javase/downloads/index.html).

### Deploying
We are using [Haikro](https://github.com/matthew-andrews/haikro) for deployment (avoids having to push developer tools to Heroku).

- Deploy a new release to test using -- `npm run deploy:test`
- Deploy a new release to production using -- `npm run deploy:prod`

### Updating Code-Climate
- Install Code-Climate's Test Reporter -- `npm install -g codeclimate-test-reporter`
- Run the tests for the project -- `gulp test`
- Upload the coverage file to Code-Climate -- `CODECLIMATE_REPO_TOKEN=[your token] codeclimate-test-reporter < coverage/lcov.info`
