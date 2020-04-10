const pug = require('pug');

global.render = (name, data = {}) => {
  return pug.renderFile(`./views/${name}.pug`, data);
}
