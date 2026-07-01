import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

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
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'category_id'
    },
    unitPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
      field: 'unit_price'
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'image_url'
    },
    barcode: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: true
    },
    quantity: {
      type: DataTypes.STRING,
      allowNull: true
    },
    allergens: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true
    },
    labels: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: true
    },
    ingredientsRaw: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'ingredients_raw'
    },
    countryOrigin: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'country_origin'
    },
    offId: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'off_id'
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
    tableName: "ingredients",
    schema: "crud_market",
    timestamps: false
  }
);

export default ingre_model;
