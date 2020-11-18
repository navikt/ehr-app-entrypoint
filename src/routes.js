const fs = require('fs');
const path = require('path');

/**
 * @param {Application} app
 * @param {Object} env
 */
module.exports = (app, env) => {
  const baseDir = path.join(__dirname, 'routes');
  fs.readdirSync(baseDir).forEach(filename => {
    if(!filename.endsWith(".spec.js") && filename.endsWith(".js")){
      require(path.join(baseDir, filename))(app, env)
    }
  });
};
