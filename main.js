require('dotenv').config();
require('./app/core.js');
global.random = require('random');
const { Bot, Keyboard } = require('node-vk-bot');
const router = new (require('./app/router.js'));
global.bot = new Bot({
  token: process.env.VK_API_TOKEN,
  group_id: process.env.VK_API_GROUP_ID
});

try {
  bot.start();
  console.log('Бот запущен');
} catch (e) {
  console.log('Ошибка при запуске LongPool');
}

let access = true;
bot.on('update', data => {
  if (access) {
    router.run(data);
    access = false;
  } else {
    return;
  }
});

setInterval(function () {
  access = true;
}, 5000);
