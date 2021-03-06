## Warning

In package.json, the version of jquery has been bumped to 3.0.0, in response to an automated vulnerability check, but not tested. The code is not live. *Caveat emptor*.


## Big FT [![Test Coverage](https://codeclimate.com/github/ftlabs/big-ft/badges/coverage.svg)](https://codeclimate.com/github/ftlabs/big-ft/coverage) [![Code Climate](https://codeclimate.com/github/ftlabs/big-ft/badges/gpa.svg)](https://codeclimate.com/github/ftlabs/big-ft)

### Development

#### Prerequisites
- [NodeJS](https://nodejs.org/en/) -- The runtime the application requires
- [Heroku Toolbelt](https://toolbelt.heroku.com/) -- _Used for interacting with the production/testing instances_
- [Java Development Kit](http://www.oracle.com/technetwork/java/javase/downloads/index.html) -- Used for testing.
- Install [Origami build tools](http://origami.ft.com/docs/developer-guide/building-modules/)

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

### Updating Code-Climate
- Install Code-Climate's Test Reporter -- `npm install -g codeclimate-test-reporter`
- Run the tests for the project -- `gulp test`
- Upload the coverage file to Code-Climate -- `CODECLIMATE_REPO_TOKEN=[your token] codeclimate-test-reporter < coverage/lcov.info`

### Usage

To experience the big view glory:

- http://big.ft.com

To display a specific timezone:
- http://big.ft.com/?timezone=Europe/London

To display the US home page:

- http://big.ft.com/?edition=US

To include recent articles about a specific organisation whih may not ordinarily make it to the front page

- http://big.ft.com/?organisation=amazon

To configure the big view glory to display articles about Amazon:

- http://big.ft.com/?primaryType=search&primarySearch=amazon

To configure the big view glory to display only the first top-story in the primary section:

- http://big.ft.com/?primaryType=topStories&primaryMax=1

To customise everything in the big view glory which is customisable:

- http://big.ft.com/?primaryType=search&primarySearch=amazon&primaryOffset=0&primaryMax=1&secondaryType=search&secondarySearch=banks&secondaryOffset=0&secondaryMax=3

To switch to the simplistic black and white version

- http://big.ft.com?monotone=true

#### Vanity URLs

For our partners, we can display a vanity URL in the corner of Big FT. To display the vanity url, pass the partners name (as listed [here](https://docs.google.com/spreadsheets/d/12dCHQVzYEJyg2uv1ggxNZjCq_tJz3dsb_JJyM3a6twk/) ) a query parameter to the Big FT service. For example `http://big.ft.com/?partner=labs` will display the URL `labs.ft.com` in the bottom right corner. If the value passed does not relate to one of our partners, `www.ft.com` will display instead.
