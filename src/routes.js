const fs = require('fs');
const path = require('path');

/**
 *
 * @param {Application} app
 */
module.exports = (app) => {
  const baseDir = path.join(__dirname, 'routes');
  fs.readdirSync(baseDir).forEach(filename => {
    if(!filename.endsWith(".spec.js")){
      require(path.join(baseDir, filename))(app)
    }
  });
};
