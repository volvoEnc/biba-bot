require('dotenv').config();
require('./app/core.js');
global.express = require('express');
global.rq = require("request-promise-native");
global.web_page = express();
global.socketIo = require('socket.io')();
global.Sequelize = require('sequelize');
global.random = require('random');
global.plural = require('plural-ru');
global.sklonenie = require('sklonenie');
global.draw = require('canvas');
global.fs = require('fs');
global.stream = require('streamifier');
const Morphy = require('phpmorphy');
const { Bot, Keyboard } = require('node-vk-bot');
global.Keyboard = Keyboard;
global.MainRouter = new (require('./app/router.js'));
global.bot = new Bot({
  token: process.env.VK_API_TOKEN,
  group_id: process.env.VK_API_GROUP_ID
});
global.morphy = new Morphy('ru', {
    storage: Morphy.STORAGE_MEM,
    predict_by_suffix: true,
    predict_by_db: true,
    graminfo_as_text: true,
    use_ancodes_cache: false,
    resolve_ancodes: Morphy.RESOLVE_ANCODES_AS_TEXT
});
require('./routes/web.js')
require('./routes/socket.js')
global.sessionCode = 998283123568172731; // Случайные циферки

global.sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: false,
  dialectOptions: {
    charset: 'utf8mb4',
  },
});
sequelize.authenticate()
         .then(() => { console.log('Соединение с БД успешно'); })
         .catch(err => { console.error('Невозможно соедениться с БД: ', err); });

try {
  init_app();
  bot.start();
  console.log('Бот запущен');
} catch (e) {
  console.log('Ошибка при запуске');
}

global.access = true;
bot.on('update', data => {
  MainRouter.run(data);
});

// Config WEB interface
web_page.set('views', './views/page');
web_page.set('view engine', 'pug');

web_page.listen(process.env.PORT_WEB, () => {
    console.log(`WEB сервер запущен!`);
})
socketIo.listen(process.env.PORT_SOCKET, () => {
    console.log(`Socket запущен!`);
});
