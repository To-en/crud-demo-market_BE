import { DataTypes } from 'sequelize';
import sequelize from '../sequelize';

// --- Models
const ingre_model = sequelize.define(
  "ingredients",
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
    unit: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true
    },
    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deleteAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
  },
  {
    tableName: "ingredient",
    schema: "crud_demo",
    timestamps: false
  },
);

// Model associatation with.. 
// ingre_model.associate = (models) => {

// };

export default ingre_model;
