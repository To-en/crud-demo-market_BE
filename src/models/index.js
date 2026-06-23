import sequelize from '../sequelize.js';
import Ingre from './ingredients.model.js';
import Order from './orders.model.js';
import User from './users.model.js';
import School from './school.model.js';
import Nutrition from './nutritions.model.js';

const db = {
  Ingre,
  Order,
  User,
  School,
  Nutrition
};

// --- Foriegn key association

// ingredients <-> nutrition_facts (asd)
Ingre.hasOne(Nutrition, { foreignKey: 'ingredientId', onDelete: 'CASCADE' });
Nutrition.belongsTo(Ingre, { foreignKey: 'ingredientId', onDelete: 'CASCADE' });

// users <-> orders ()
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

db.sequelize = sequelize;

export default db;
