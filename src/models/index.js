import sequelize from '../sequelize';
import Ingre from './ingredient.model';
import Order from './order.model';
import User from './user.model';

const db = {
  Ingre,
  Order,
  User
};

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

export default db;
