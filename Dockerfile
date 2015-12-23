# Inherit from Heroku's stack
FROM heroku/cedar:14

# Install scss_lint as Origami-Build-Tools needs it
RUN gem install scss_lint

# Install BrowserStackLocal for testing
RUN cd /usr/local/bin; curl -o BrowserStackLocal-linux-x64.zip https://www.browserstack.com/browserstack-local/BrowserStackLocal-linux-x64.zip && unzip BrowserStackLocal-linux-x64.zip && chmod +x BrowserStackLocal && rm BrowserStackLocal-linux-x64.zip; cd -

# Internally, we arbitrarily use port 3000
ENV PORT 3000
# Which version of node?
ENV NODE_ENGINE 5.1.0
# Locate our binaries
ENV PATH /app/heroku/node/bin/:/app/user/node_modules/.bin:$PATH

# Create some needed directories
RUN mkdir -p /app/heroku/node /app/.profile.d
WORKDIR /app/user

# Install node
RUN curl -s https://s3pository.heroku.com/node/v$NODE_ENGINE/node-v$NODE_ENGINE-linux-x64.tar.gz | tar --strip-components=1 -xz -C /app/heroku/node

# Export the node path in .profile.d
RUN echo "export PATH=\"/app/heroku/node/bin:/app/user/node_modules/.bin:\$PATH\"" > /app/.profile.d/nodejs.sh

ADD package.json /app/user/

RUN /app/heroku/node/bin/npm install

ADD . /app/user/

RUN npm run build

CMD ["npm", "start"]