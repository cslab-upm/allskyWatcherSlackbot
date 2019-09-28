const chokidar = require('chokidar');

const logger = require('./logger');

const init = (addListenerFunc, changeListenerFunc) => {
  logger.info('Initializing watcher');
  let watcher = null;
  const options = {
    persistent: true,
  };

  const watchFile = (path) => {
    if (!watcher) {
      options.ignored = `${path}/*/**`;
      watcher = chokidar.watch(path, options);
      watcher.on('add', (pathEvent) => addListenerFunc(pathEvent));
      watcher.on('change', (pathEvent) => changeListenerFunc(pathEvent));
    } else {
      watcher.add(path);
    }
  };

  const appendAddListener = (func) => {
    watcher.on('add', (path) => func(path));
  };

  const appendChangeListener = (func) => {
    watcher.on('change', (path) => func(path));
  };

  const unwatchFile = (path) => {
    watcher.unwatch(path);
  };

  const stopWatching = () => {
    watcher.close();
  };

  logger.info('Watcher initialized');

  return {
    watchFile,
    unwatchFile,
    stopWatching,
    appendAddListener,
    appendChangeListener,
  };
};

module.exports = {
  init,
};
