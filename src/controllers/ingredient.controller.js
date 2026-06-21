import { ingredients, bumpId } from '../models';

const CATEGORIES = ["Grain", "Protein", "Vegetable", "Dairy", "Spice"];
const UNITS      = ["kg", "g", "L", "ml", "pcs"];


// GET /api/ingre
export async function listIngredients(_req, res) {
  res.json(ingredients);
}

// GET /api/ingre/id?value=[ , ... ]
export async function getIngredient(req, res) {
  // Extract proper param value for this one 

  // Let's convert this to valid
  const item = ingredients.find(i => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: "Ingredient not found" });
  res.json(item);
}

// POST /api/ingre/ 
/**
request JSON body
{
  "id":     od,
  "Name":   od,
  "qty":    od,
  "price":  od,
  "vendor": od,
}
 */
export async function createIngredient(req, res) {
  const { name, unit, stock, category } = req.body;
  if (!name || !unit || stock == null || !category)
    return res.status(400).json({ error: "name, unit, stock, category required" });
  if (!CATEGORIES.includes(category))
    return res.status(400).json({ error: `category must be one of: ${CATEGORIES.join(", ")}` });
  if (!UNITS.includes(unit))
    return res.status(400).json({ error: `unit must be one of: ${UNITS.join(", ")}` });

  const item = { id: bumpId(), name, unit, stock: Number(stock), category };
  ingredients.push(item);
  res.status(201).json(item);
}

// PUT /api/ingre/id?value=[ ,...]
export async function updateIngredient(req, res) {
  const idx = ingredients.findIndex(i => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Ingredient not found" });
  const { name, unit, stock, category } = req.body;
  if (!name || !unit || stock == null || !category)
    return res.status(400).json({ error: "name, unit, stock, category required" });

  ingredients[idx] = { ...ingredients[idx], name, unit, stock: Number(stock), category };
  res.json(ingredients[idx]);
}

// DEL /api/ingre/id?value=[ ,... ]
export async function deleteIngredient(req, res) {
  const idx = ingredients.findIndex(i => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Ingredient not found" });
  const removed = ingredients.splice(idx, 1)[0];
  res.json({ message: "Deleted", ingredient: removed });
}
