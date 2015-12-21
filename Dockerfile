FROM jakechampion/heroku-nodejs
RUN gem install scss-lint
RUN npm run build
