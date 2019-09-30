FROM node:10-alpine
RUN mkdir -p /home/node/allSkyWatcherSlackbot/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/allSkyWatcherSlackbot
COPY package*.json ./
USER node
RUN npm install
COPY --chown=node:node . .
CMD ["node", "src/index.js"]
