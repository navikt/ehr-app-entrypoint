const vars = require('../vars');
/**
 * @param {Application} app
 */
module.exports = (app) => {
  app.get("/", (req, res) =>
      res.redirect(vars.CONTEXT_PATH)
  );
};
