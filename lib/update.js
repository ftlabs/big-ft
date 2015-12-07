const currentVersion = require('../package.json').version;
const semver = require('semver');

module.exports = function (clientVersion) {
  if (!semver.valid(clientVersion)) {
    throw new TypeError(`${clientVersion} is not a valid semantic version.`)
  } else if (!semver.valid(currentVersion)){
    throw new TypeError(`${currentVersion} is not a valid semantic version.`);
  } else {
    return semver.gt(currentVersion, clientVersion);
  }
}
