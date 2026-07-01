import { Sequelize } from 'sequelize';
import config from './config.js';
import makeLogger from './logger.js';

const logger = makeLogger(import.meta.url);

const sequelize = new Sequelize(config.database.url, {
  logging: config.database.logging
    ? (msg) => {
        logger.debug(msg);
      }
    : false,
});

export default sequelize;
