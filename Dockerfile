FROM jakechampion/heroku-nodejs
RUN gem install scss_lint
RUN npm run build
CMD ["npm", "start"]