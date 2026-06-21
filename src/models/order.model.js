
import { DataTypes } from 'sequelize';
import sequelize from '../sequelize';

// --- Models
const order_model = sequelize.define(
  "order_log",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ingreId: {
      type: DataTypes.ARRAY,
      allowNull: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lastModified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    deleteAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
  },
  {
    tableName: "order_log",
    schema: "crud_demo",
    timestamps: false
  },
);

export default order_model;