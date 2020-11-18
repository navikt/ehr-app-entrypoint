const vars = require('../vars');
const {launchPath} = require('../paths');
/**
 * @param {Application} app
 * @param {EnvVars} env
 */
module.exports = (app) => {
  app.get([
    '/',
    vars.LAUNCH_PATH,
  ], (req, res) => res.redirect(launchPath()));
};
