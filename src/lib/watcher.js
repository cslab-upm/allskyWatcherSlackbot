const { watch } = require('fs');

const logger = require('./logger');

const init = (changeCb) => {
  logger.info('Initializing watcher');
  const filesToWatch = {};

  const watchFile = (dirPath) => {
    try {
      const watcher = watch(dirPath, (event, filename) => {
        const result = event === 'rename' && changeCb(filename);
        return result;
      });
      filesToWatch[dirPath] = watcher;
    } catch (error) {
      throw new Error('No such file');
    }
  };

  const unwatchFile = (dirPath) => {
    const watcher = filesToWatch[dirPath];
    if (!watcher) throw new Error(`${dirPath} not being watched`);
    delete watcher[dirPath];
    watcher.close();
  };

  const listWatchedFiles = () => filesToWatch;

  logger.info('Watcher initialized');
  return {
    watchFile,
    unwatchFile,
    listWatchedFiles,
  };
};

module.exports = {
  init,
};
