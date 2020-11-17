const vars = require('../vars');
/**
 * @param {Application} app
 */
module.exports = (app) => {
  app.get(vars.READINESS_PATH,
      (req, res) =>
          res.send('ok'),
  );
};
