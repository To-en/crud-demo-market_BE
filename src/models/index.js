const sequelize = require("../sequelize");
const Sequelize = require("sequelize");

const Ingre = require("./ingredients.model");
const Order = require("./orders.model");
const User = require("./users.model");

// csm export compiled db
const db = {
  Ingre,
  Order,
  User,
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
