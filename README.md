## Big FT

### Development

#### Prerequisites
- [Docker](https://www.docker.com/docker-toolbox)
- [Heroku Toolbelt](https://toolbelt.heroku.com/)
- Heroku Docker plugin -- `heroku plugins:install heroku-docker`

If running OS X or Windows, [follow these steps for creating a virtual machine for Docker](#creating-a-virtual-machine-for-docker).

#### Setting up development environment
- Clone the repository -- `git clone git@github.com:ftlabs/big-ft.git`
- Change in repository directory -- `cd big-ft`
- Build a Docker image -- `docker build .`
- Spin up the web process in a container -- `docker-compose up web`
- Open the application in your browser of choice -- `open "http://$(docker-machine ip default):8080"`

##### [Creating a virtual machine for Docker](#creating-a-virtual-machine-for-docker)
 [VirtualBox](https://www.virtualbox.org/wiki/Downloads) or [VMWare](http://www.vmware.com/uk/).

- Create a virtual machine -- `docker-machine create --driver virtualbox dev` (change the driver value if using vmware)
- Check that your machine is running -- `docker-machine ls`
- If machine is not running, boot it up -- `docker-machine start dev`
- Add environment variables to your computer in order to let Docker communicate with the virtual machine -- `eval "$(docker-machine env dev)"`
