import { Sequelize } from 'sequelize';
import config from './config.js';
import logger from './logger.js';

const sequelize = new Sequelize(config.database.url, {
  logging: config.database.logging
    ? (msg) => {
        logger.debug(msg);
      }
    : false,
});

export default sequelize;
