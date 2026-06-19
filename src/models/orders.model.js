
const { DataTypes } = require("sequelize");
const sequelize = require("../sequelize"); // Import from this project sequelize source

// Mock data
export let ingredients = [
  { id: 1, name: "Rice",           unit: "kg",  stock: 50, category: "Grain"     },
  { id: 2, name: "Egg",            unit: "pcs", stock: 200, category: "Protein"  },
  { id: 3, name: "Chicken Breast", unit: "kg",  stock: 30, category: "Protein"   },
  { id: 4, name: "Tomato",         unit: "kg",  stock: 20, category: "Vegetable" },
  { id: 5, name: "Garlic",         unit: "pcs", stock: 100, category: "Spice"    },
  { id: 6, name: "Onion",          unit: "pcs", stock: 60, category: "Vegetable" },
  { id: 7, name: "Milk",           unit: "L",   stock: 25, category: "Dairy"     },
  { id: 8, name: "Pasta",          unit: "g",   stock: 5000, category: "Grain"   },
];
export let nextId = 9;
export const bumpId = () => nextId++;
// for pumping to fake ingredient list , wait 


// Models
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
      type: DataTypes.INTEGER,
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
    tableName: "ingredient",
    schema: "crud_demo",
    timestamps: false
  },
);

module.exports  = order_model;