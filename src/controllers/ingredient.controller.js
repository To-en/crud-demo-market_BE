import { Op } from 'sequelize';
import config from '../config.js';
import models from '../models/index.js';
import * as service from '../services/ingredient.service.js';


// GET /ingredient → all ingredients (paginated)
// req.query always returns strings — parseInt before arithmetic; clamp prevents runaway DB scan
export async function listIngredients(req, res) {
  const page  = Math.max(1,   parseInt(req.query.page)  || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 15);

  try {
    const { count, rows } = await models.Ingre.findAndCountAll({
      offset: (page - 1) * limit,
      limit,
    });

    res.status(200).json({
      total: count,
      page,
      limit,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ingredients" });
  }
}

// GET /ingredient?category=โปรตีน           → filter by category
// GET /ingredient?q=หมู                     → search by name (case-insensitive)
// GET /ingredient?category=โปรตีน&q=หมู    → both combined
// GET /ingredient?category=โปรตีน&page=2   → filter + paginate
export async function getIngredients(req, res) {
  const { category, q, inStock } = req.query;
  const page  = Math.max(1,   parseInt(req.query.page)  || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 15);

  const where = {};
  if (category) where.category = category;
  if (q)        where.name = { [Op.iLike]: `%${q}%` };
  if (inStock === 'true') where.stock = { [Op.gt]: 0 };

  try {
    const { count, rows } = await models.Ingre.findAndCountAll({
      where,
      offset: (page - 1) * limit,
      limit,
    });

    res.status(200).json({
      total: count,
      page,
      limit,
      data: rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ingredients" });
  }
}

// POST /api/ingre/
/**
request JSON body
{
  "id":     od,
  "Name":   od,
  "qty":    od,
  "price":  od,
  "category": od,
}
 */
export async function createIngredient(req, res) {
  const { name, unit, stock, category } = req.body;
  if (!name || !unit || stock == null || !category)
    return res.status(400).json({ error: "name, unit, stock, category required" });

  try {
    const item = await models.Ingre.create({
      name,
      unit,
      stock: Number(stock),
      category
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: "Failed to create ingredient" });
  }
}

// PUT /api/ingre/id?value=[ ,...]
export async function updateIngredient(req, res) {
  const { name, unit, stock, category } = req.body;
  if (!name || !unit || stock == null || !category)
    return res.status(400).json({ error: "name, unit, stock, category required" });

  try {
    const ingredient = await models.Ingre.findOne({ where: { id: Number(req.params.id) } });
    if (!ingredient) return res.status(404).json({ error: "Ingredient not found" });
    await ingredient.update({
      name,
      unit,
      stock: Number(stock),
      category
    });
    res.status(200).json(ingredient);
  } catch (error) {
    res.status(500).json({ error: "Failed to update ingredient" });
  }
}

// DEL /api/ingre/id?value=[ ,... ]
export async function deleteIngredient(req, res) {
  try {
    const ingredient = await models.Ingre.findOne({ where: { id: Number(req.params.id) } });
    if (!ingredient) return res.status(404).json({ error: "Ingredient not found" });
    await ingredient.destroy();
    res.status(200).json({ message: "Deleted", ingredient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
