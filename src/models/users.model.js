import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const user_model = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true
    },
    class: {
      type: DataTypes.STRING,
      allowNull: true
    },
    role: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    refreshToken: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'refresh_token'
    },
    budget: {
      type: DataTypes.INTEGER,
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
    tableName: "users",
    schema: "crud_market",
    timestamps: false
  }
);

export default user_model;
