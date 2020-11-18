const _cors = require('cors');
/**
 * @param {Application} app
 * @param {EnvVars} env
 */
module.exports = (app,env) => {
  app.use(_cors({
    origin: true,
    credentials: true,
  }));
};
