const sequelize = require("../sequelize");
const Sequelize = require("sequelize");

const Market = require("./ingredients.model");

// csm export compiled db
const db = {
  Market,
  Carts,
  Users,
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
