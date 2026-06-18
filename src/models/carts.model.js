
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

// Models
