const _session = require('express-session');
/**
 * @param {Application} app
 * @param {EnvVars} env
 */
module.exports = (app,env) => {
  app.use(_session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }));
}
