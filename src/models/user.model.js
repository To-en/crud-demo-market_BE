import { DataTypes } from 'sequelize';
import sequelize from '../sequelize';

const user_model = sequelize.define(
  "user",
  {
    id:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: true
    },
    username:{
      type: DataTypes.STRING,
      allowNull: true
    },
    password:{
      type: DataTypes.STRING,
      allowNull: true
    },
    role:{
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    refreshToken:{
      type: DataTypes.TEXT,
      allowNull: true
    },
    budget:{
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    tableName: "user",
    schema: "crud_demo",
    timestamps: false
  },
);

export default user_model;
