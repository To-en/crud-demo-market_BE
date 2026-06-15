import { Router } from 'express';
import { ingredients, bumpId } from '../models/ingredients.js';

const router = Router();

const CATEGORIES = ["Grain", "Protein", "Vegetable", "Dairy", "Spice"];
const UNITS      = ["kg", "g", "L", "ml", "pcs"];

// GET /crud/ingredients — list all
router.get("/ingredients", (_req, res) => {
  res.json(ingredients);
});

// GET /crud/ingredients/:id — get one
router.get("/ingredients/:id", (req, res) => {
  const item = ingredients.find((i) => i.id === Number(req.params.id));
  if (!item) return res.status(404).json({ error: "Ingredient not found" });
  res.json(item);
});

// POST /crud/ingredients — create
router.post("/ingredients", (req, res) => {
  const { name, unit, stock, category } = req.body;
  if (!name || !unit || stock == null || !category) {
    return res.status(400).json({ error: "name, unit, stock, category required" });
  }
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: `category must be one of: ${CATEGORIES.join(", ")}` });
  }
  if (!UNITS.includes(unit)) {
    return res.status(400).json({ error: `unit must be one of: ${UNITS.join(", ")}` });
  }
  const item = { id: bumpId(), name, unit, stock: Number(stock), category };
  ingredients.push(item);
  res.status(201).json(item);
});

// PUT /crud/ingredients/:id — full update
router.put("/ingredients/:id", (req, res) => {
  const idx = ingredients.findIndex((i) => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Ingredient not found" });
  const { name, unit, stock, category } = req.body;
  if (!name || !unit || stock == null || !category) {
    return res.status(400).json({ error: "name, unit, stock, category required" });
  }
  ingredients[idx] = { ...ingredients[idx], name, unit, stock: Number(stock), category };
  res.json(ingredients[idx]);
});

// DELETE /crud/ingredients/:id — delete
router.delete("/ingredients/:id", (req, res) => {
  const idx = ingredients.findIndex((i) => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Ingredient not found" });
  const removed = ingredients.splice(idx, 1)[0];
  res.json({ message: "Deleted", ingredient: removed });
});

export default router;
