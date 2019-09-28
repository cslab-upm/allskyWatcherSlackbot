const dotenv = require('dotenv');

const botInit = require('./bot');

const start = () => {
  dotenv.config();
  const bot = botInit.init('pruebas');
  bot.startBot();
};

start();
