import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const category_model = sequelize.define(
  "category",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: "category",
    schema: "crud_market",
    timestamps: false
  }
);

export default category_model;
