const vars = require('./vars.json');
const defaultApp = 'default';
module.exports = {
  redirectUri: (app) => [vars.REDIRECT_URI, app || defaultApp].join('/'),
  launchPath: (app) => [vars.LAUNCH_PATH, app || defaultApp].join('/'),
};
