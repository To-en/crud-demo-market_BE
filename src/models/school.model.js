import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const school_model = sequelize.define(
  "school",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    budget: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true
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
    tableName: "school",
    schema: "crud_market",
    timestamps: false
  }
);

export default school_model;
