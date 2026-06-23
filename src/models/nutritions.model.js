import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const nutrition_model = sequelize.define(
  "nutrition_facts",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    ingredientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'ingredient_id'
    },
    energyKcal: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'energy_kcal'
    },
    fatG: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'fat_g'
    },
    saturatedFatG: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'saturated_fat_g'
    },
    carbsG: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'carbs_g'
    },
    sugarG: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'sugar_g'
    },
    fiberG: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'fiber_g'
    },
    proteinG: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'protein_g'
    },
    saltG: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'salt_g'
    },
    sodiumMg: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'sodium_mg'
    },
    createdDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_date'
    },
    lastModified: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_modified'
    },
    deleteAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'delete_at'
    }
  },
  {
    tableName: "nutrition_facts",
    schema: "crud_market",
    timestamps: false
  }
);

export default nutrition_model;
