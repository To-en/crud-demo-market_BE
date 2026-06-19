import { Op, Sequelize } from 'sequelize'
import { models } from '../models/orders.model';
// GET /api/history
export function listOrders(_req, res) {
  res.json(orders);
}

// get report option for 
async function getDropDownOptions(req, res) {

  try {
    const [s, deviceTypes, events] = await Promise.all([
      models.Site.findAll({ attributes: ["id", "siteName"], where: { deleteAt: null }, raw: true }),
      models.DeviceType.findAll({ attributes: ["id", "deviceType"], raw: true }),
      models.Event.findAll({ attributes: ["id", "displayName"], where: { deleteAt: null }, raw: true }),
    ]);
    res.status(200).json({
      status: 200,
      sites: sites.map((r) => ({ id: r.id, name: r.siteName })),
      deviceTypes: deviceTypes.map((r) => ({ id: r.id, name: r.deviceType })),
      events: events.map((r) => ({ id: r.id, name: r.displayName })),
    });
  } catch (err) {
    console.error("500 Failed to fetch report options:", err);
    res.status(500).json({ error: "Failed to fetch report options" });
  }
}

// GET /api/ingre/id?value=[ , ... ]
export function getIngredient(req, res) {
  // Extract proper param value for this one 
  const item = ingredients.find(i => i.id === Number(req.query.id));
  if (!item) return res.status(404).json({ error: "Ingredient not found" });
  res.json(item);
}

export function createIngredient(req, res) {
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
export function updateIngredient(req, res) {
  const idx = ingredients.findIndex(i => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Ingredient not found" });
  const { name, unit, stock, category } = req.body;
  if (!name || !unit || stock == null || !category)
    return res.status(400).json({ error: "name, unit, stock, category required" });

  ingredients[idx] = { ...ingredients[idx], name, unit, stock: Number(stock), category };
  res.json(ingredients[idx]);
}

// DEL /api/ingre/id?value=[ ,... ]
export function deleteIngredient(req, res) {
  const idx = ingredients.findIndex(i => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Ingredient not found" });
  const removed = ingredients.splice(idx, 1)[0];
  res.json({ message: "Deleted", ingredient: removed });
}
