## Big FT [![Test Coverage](https://codeclimate.com/github/ftlabs/big-ft/badges/coverage.svg)](https://codeclimate.com/github/ftlabs/big-ft/coverage) [![Code Climate](https://codeclimate.com/github/ftlabs/big-ft/badges/gpa.svg)](https://codeclimate.com/github/ftlabs/big-ft)

### Development

#### Prerequisites
- [Docker](https://www.docker.com/docker-toolbox)
- [Heroku Toolbelt](https://toolbelt.heroku.com/)
- Heroku Docker plugin -- `heroku plugins:install heroku-docker`

If running OS X or Windows, [follow these steps for creating a virtual machine for Docker](#creating-a-virtual-machine-for-docker) -- This is a section in this readme file.

#### Setting up development environment
- Clone the repository -- `git clone git@github.com:ftlabs/big-ft.git`
- Change in repository directory -- `cd big-ft`
- Build a Docker image -- `docker build .`
- Spin up the web process in a container -- `docker-compose up web`
- Open the application in your browser of choice -- `open "http://$(docker-machine ip default):8080"`

##### [Creating a virtual machine for Docker](#creating-a-virtual-machine-for-docker)
 [VirtualBox](https://www.virtualbox.org/wiki/Downloads) or [VMWare](http://www.vmware.com/uk/).

- Check if you already have a Docker machine set-up -- `docker-machine ls`
If you don't have a Docker machine set-up:
- Create a virtual machine -- `docker-machine create --driver virtualbox default` (change the driver value if using vmware)
If/Once you have a Docker machine set-up:
- Check that your machine is running -- `docker-machine ls`
- If machine is not running, boot it up -- `docker-machine start default`
- Add environment variables to your computer in order to let Docker communicate with the virtual machine -- `eval "$(docker-machine env default)"`

### Deploying
As we are using Heroku Docker for development, we can no longer deploy using `git`.

- Deploy a new release using -- `heroku docker:release --app {APP_NAME}`

### Updating Code-Climate
- Install Code-Climate's Test Reporter -- `npm install -g codeclimate-test-reporter`
- Run the tests for the project -- `gulp test`
- Upload the coverage file to Code-Climate -- `CODECLIMATE_REPO_TOKEN=[your token] codeclimate-test-reporter < coverage/lcov.info`
