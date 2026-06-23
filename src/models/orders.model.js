import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const order_model = sequelize.define(
  "orders",
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
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      field: 'ingre_id'
    },
    qty: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true
    },
    grandTotal: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'grand_total'
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'user_id'
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
    tableName: "orders",
    schema: "crud_market",
    timestamps: false
  }
);

export default order_model;
