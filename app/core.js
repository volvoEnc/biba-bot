const pug = require('pug');
const path = require('path');
const fs = require('fs');

global.stack_messages = []; // Сообщения ожидающие отправку!


/**
 * Рендер шаблона на основе входных данных
 *
 * @param {string} name - название шаблона
 * @param {object} data - объект данных после модификации
 * @param {object|null} renderData - объект данных для рендера
 * @returns {Promise <string>}
 */
global.render = async (name, renderData = null, data) => {
  let conv_id = null;
  let angryMode = false;
  try {
    conv_id = data.data.object.message.peer_id;
  } catch (e) {}
  if (conv_id != null) {
    let rulePromise = await Rules.getRule(conv_id, 'messageMode');
  }
  let filepath = `./views/${name}.pug`;
  if (angryMode) {
    filepath = `./views/${name}_angry.pug`
    if (!fs.existsSync(filepath)) {
      filepath = `./views/${name}.pug`;
    }
  }
  let message;
  try {
    message = pug.renderFile(filepath, renderData);
  } catch (e) {
    message = 'Не удалось выполнить рендер шаблона: ' + filepath;
  }

  return message;
}
global.send = async (content, peer_id, param = {}) => {
  bot.options.api = { v: "5.103" }
  try { await bot.send(content, peer_id, Object.assign(param, {random_id: Date.now()})); }
  catch (e) { return e; }
  bot.options.api = { v: "5.80" }
  return true;
}
global.pre_send = async (content, peer_id, param = {}) => {
  global.stack_messages.push({
    send_id: peer_id,
    content: content,
    param: param,
    attempt: 0
  });
}
global.get_keyboard = async (name, inline = true) => {
  let keyboard = await require('../views/Keyboards/' + name + '.js').index();
  keyboard.obj.inline = inline;
  return keyboard;
}
global.middleware_execute = async (data, isAll = true) => {
  for (let i = 0; i < middleware.length; i++) {
    if (await middleware[i].is_all() === isAll) {
      if (!await middleware[i].execute(data)) {
        return false;
      }
    }
  }
  return true;
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
global.init_middleware = async () => {
  fs.readdir('./middleware', function (err, files) {
    global.middleware = [];
    files.forEach(function (file, index) {
      let file_name = file.split('.')[0];
      global.middleware[index] = require(`../middleware/${file}`);
    });
  });
}
global.init_shop = async () => {
  fs.readdir('./shop/products', function (err, files) {
    global.products = [];
    files.forEach(async function (file) {
      let file_name = file.split('.')[0];
      global.products[file_name] = require(`../shop/products/${file}`);
    });
    global.shop = require(`../shop/init`);
    global.shop.index();
  });
}
global.init_src = async (path = './src') => {
  fs.readdir(path, {'withFileTypes' : true}, (err, files) => {
    files.forEach(file => {
      if (file.isDirectory()) {
        init_src(path + '/' + file.name)
      } else if (file.isFile()) {
        require('.' + path + '/' + file.name);
      }
    });
  });
}
global.init_app = async () => {
  await init_middleware();
  await init_models();
  await init_events();
  await init_actions();
  await init_shop();
  await init_src();
}
// Перемешивание массива
global.shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
global.uploadPhotoToVk = async (buffer) => {
  const { v4: uuidv4 } = require('uuid');
  let filename = uuidv4() + '.png';
  fs.writeFileSync('generated/'+filename, buffer);
  let photo = await bot.uploadPhoto('generated/'+filename);
  fs.unlinkSync('generated/'+filename);
  return photo;
}
global.uploadVoiceMessageToVk = async (data, filename) => {
  let vkServerLink = (await bot.api('docs.getMessagesUploadServer', {type: 'audio_message', peer_id: data.user_id})).upload_url;
  let resp = await rq({
    method: 'POST',
    uri: vkServerLink,
    formData: {
      file: fs.createReadStream('static/audio/'+filename+'.ogg')
    },
    json: true
  });
  let finalDocs = await bot.api('docs.save', {file: resp.file});
  return finalDocs[0];
}

Date.prototype.yyyymmdd = function() {
  let mm = this.getMonth() + 1; // getMonth() is zero-based
  let dd = this.getDate();

  return [this.getFullYear(),
    (mm>9 ? '' : '0') + mm,
    (dd>9 ? '' : '0') + dd
  ].join('-');
};

let date = new Date();
date.yyyymmdd();