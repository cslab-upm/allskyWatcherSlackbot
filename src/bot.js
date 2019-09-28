const SlackBot = require('slackbots');

const logger = require('./lib/logger');
const fileWatcher = require('./lib/watcher');

const init = (channel) => {
  logger.info('Initializing bot');
  const botName = 'BotWatcher';
  let bot = null;
  let watcher = null;
  const emojis = {
    robot: ':robot_face:',
    lol: ':lol:',
    cry: ':cry:',
  };

  const postMessageChannel = (message, emoji = emojis.robot) => {
    bot.postMessageToChannel(channel, message, { icon_emoji: emoji });
  };

  const postMessageUser = (message, user) => {
    bot.postMessageToUser(user, message, { icon_emoji: emojis.robot });
  };

  const processInputMessage = (message, user) => {
    const orders = message.split(' ');
    const helpMessage = `This is what I can do:
          - watch /path/to/dir: Watch that path and notify when a new file is created
          - unwatch /path/to/dir: Unwatch a file being watched 
          - listWatched: List all files being watched
        `;
    const orderType = {
      watch: (path) => {
        watcher.watchFile(path);
        postMessageUser(`Ok, I'll do it and let you know in ${channel} channel`, user);
        postMessageChannel(`${user} told me to watch ${path}`);
      },
      unwatch: (path) => {
        watcher.unwatchFile(path);
        postMessageUser(`Done, I'm not watching <strong>${path}</strong> anymore`, user);
        postMessageChannel(`${user} told me to stop watching ${path}`);
      },
      listWatched: () => {
        const files = watcher.listWatchedFiles();
        const keys = Object.keys(files);
        if (keys.length === 0) postMessageUser('I\'m not watching any files', user);
        else {
          postMessageUser('I\'m watching these files', user);
          keys.forEach((key) => postMessageUser(`${key}`, user));
        }
      },
      help: () => postMessageUser(helpMessage, user),
    };
    try {
      const selectedOrder = orderType[orders[0]];
      if (!selectedOrder) postMessageUser(`Sorry. ${helpMessage}`, user);
      else selectedOrder(orders[1]);
    } catch (error) {
      postMessageUser(`Sorry, I can't do it. Reason: ${error.message}`, user);
    }
  };

  const onChangeListener = (path) => {
    postMessageChannel(`Hey!, there is a new file: ${path}`, emojis.robot);
  };

  const startBot = () => {
    try {
      bot = new SlackBot({
        token: `${process.env.BOT_TOKEN}`,
        name: botName,
      });

      bot.on('start', () => {
        postMessageChannel('Hi. Please, tell me files to watch', emojis.robot);
      });
      bot.on('message', (data) => {
        if (data.type === 'desktop_notification' && !data.subtitle.includes('robot')) {
          processInputMessage(data.content, data.subtitle);
        }
      });
      watcher = fileWatcher.init(onChangeListener);
    } catch (error) {
      logger.error(error);
    }
  };

  logger.info('Bot initialized');
  return {
    startBot,

  };
};

module.exports = {
  init,
};
