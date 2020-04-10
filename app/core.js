const pug = require('pug');
const path = require('path');
const fs = require('fs');

global.render = (name, data = {}) => {
  return pug.renderFile(`./views/${name}.pug`, data);
}

global.init_models = async () => {
  fs.readdir('./models', function (err, files) {
    global.models = [];
    files.forEach(function (file) {
      let file_name = file.split('.')[0];
        global.models[file_name] = require(`../models/${file}`);
    });
  });
}
global.events_init = async () => {
  fs.readdir('./events', function (err, files) {
    global.events = [];
    files.forEach(function (file) {
      let file_name = file.split('.')[0];
        global.events[file_name] = require(`../events/${file}`);
    });
  });
}
