require('dotenv').config();
require('./app/core.js');
global.Sequelize = require('sequelize');
global.random = require('random');
global.plural = require('plural-ru');
global.sklonenie = require('sklonenie');
const { Bot, Keyboard } = require('node-vk-bot');
global.Keyboard = Keyboard;
const router = new (require('./app/router.js'));
global.bot = new Bot({
  token: process.env.VK_API_TOKEN,
  group_id: process.env.VK_API_GROUP_ID
});


global.sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
  logging: false
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
  router.run(data);
});
