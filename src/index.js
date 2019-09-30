const botInit = require('./bot');

const start = () => {
  const bot = botInit.init(process.env.SLACK_CHANNEL);
  bot.startBot();
};

start();
