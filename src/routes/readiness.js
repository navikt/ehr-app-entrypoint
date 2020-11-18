const vars = require('../vars');
/**
 * @param {Application} app
 * @param {EnvVars} env
 */
module.exports = (app) => {
  app.get(vars.READINESS_PATH,
      (req, res) =>
          res.send('ok'),
  );
};
