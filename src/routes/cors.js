const cors = require('cors');
/**
 * @param {Application} app
 */
module.exports = (app) => {
  app.use(cors({
    origin: true,
    credentials: true,
  }));
};
