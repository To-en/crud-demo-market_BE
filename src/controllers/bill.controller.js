import { orders } from '../models/orders.model';
import { ingredient } from '../models/ingredients.model';

// GET /api/history/:id
export function openBill(_req, res) {
  // select from that id and show all rows in json
  res.json(ingredients);
}

// GET /api/ingre/:id/export
export function exportBill_pdf(req, res) {
  // pdf logic
  res.status(200).json(item);
}

// PUT /api/ingre/id?value=[ ,...]
export function reuse_order(req, res) {
  const idx = ingredients.findIndex(i => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Ingredient not found" });
  const { name, unit, stock, category } = req.body;
  if (!name || !unit || stock == null || !category)
    return res.status(400).json({ error: "name, unit, stock, category required" });

  ingredients[idx] = { ...ingredients[idx], name, unit, stock: Number(stock), category };
  res.json(ingredients[idx]);
}

