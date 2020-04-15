const pug = require('pug');
const path = require('path');
const fs = require('fs');

global.stack_messages = []; // Сообщения ожидающие отправку!
global.render = (name, data = {}) => {
  return pug.renderFile(`./views/${name}.pug`, data);
}
global.send = async (content, peer_id, param = {}) => {
  bot.options.api = { v: "5.103" }
  await bot.send(content, peer_id, param);
  bot.options.api = { v: "5.80" }
  return;
}
global.pre_send = async (content, peer_id, param = {}) => {
  global.stack_messages.push({
    send_id: peer_id,
    content: content,
    param: Object.assign(param, {random_id: global.conversation_message_id})
  });
}
global.get_keyboard = async (name, inline = true) => {
  let keyboard = await require('../views/Keyboards/' + name + '.js').index();
  keyboard.obj.inline = inline;
  return keyboard;
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
global.init_events = async () => {
  fs.readdir('./events', function (err, files) {
    global.events = [];
    files.forEach(function (file) {
      let file_name = file.split('.')[0];
        global.events[file_name] = require(`../events/${file}`);
    });
  });
}
global.init_actions = async () => {
  fs.readdir('./actions', function (err, files) {
    global.actions = [];
    files.forEach(function (file) {
      let file_name = file.split('.')[0];
        global.actions[file_name] = require(`../actions/${file}`);
    });
  });
}
global.init_app = async () => {
  init_models();
  init_events();
  init_actions();
}
