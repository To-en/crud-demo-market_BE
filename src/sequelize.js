const { Sequelize } = require("sequelize");
const config = require("./config");
const logger = require("./logger")(__filename);

const sequelize = new Sequelize(config.database.url, {
  logging: config.database.logging
    ? (msg) => {
        logger.debug(msg);
      }
    : false,
});

module.exports = sequelize;
