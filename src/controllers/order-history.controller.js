import { Op, Sequelize } from 'sequelize'
import models from '../models';
import * as service from '../services/order-history.service'

// GET /order/history
export async function listOrders(req, res) {
  try {
    const orders = await models.Order.findAll({
      attributes: ['id', 'name', 'ingreId'],
      where: { userId: req.user.id },
      order: [['createDate', 'DESC']],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
}

// GET /order/history/search?value=
export async function searchOrder(req, res) {
  const { value } = req.query;
  if (!value) return res.status(400).json({ error: "query param 'value' required" });

  const numericId = Number(value);
  const whereClause = {
    userId: req.user.id,
    [Op.or]: [
      { name: { [Op.iLike]: `%${value}%` } },
      ...(Number.isInteger(numericId) && numericId > 0 ? [{ id: numericId }] : []),
    ],
  };

  try {
    const orders = await models.Order.findAll({
      attributes: ['id', 'name', 'ingreId'],
      where: whereClause,
      order: [['createDate', 'DESC']],
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
}

// GET /ingre/id?value=[ ,...]
export function reuseOrder(req, res) {

  // extract the parameter container orderId

  // scaffold ingredient id array use that orderId, sents the array back as 
  // response , and use the frontend 

  const idx = ingredients.findIndex(i => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Ingredient not found" });
  const { name, unit, stock, category } = req.body;
  if (!name || !unit || stock == null || !category)
    return res.status(400).json({ error: "name, unit, stock, category required" });

  ingredients[idx] = { ...ingredients[idx], name, unit, stock: Number(stock), category };
  res.json(ingredients[idx]);
}



// DEL /api/ingre/id?value=[ ,... ]
export async function deleteOrder(req, res) {
  const idx = ingredients.findIndex(i => i.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "Ingredient not found" });
  const removed = ingredients.splice(idx, 1)[0];
  res.json({ message: "Deleted", ingredient: removed });
}  



// GET /history/:id
export async function openOrderBill(_req, res) {
  // select from that id and show all rows in json
  res.json(ingredients);
}



// GET /api/ingre/:id/export
export async function exportOrderBill(req, res) {
  
  // extract GET parameter with th 
  const orderId = req.params.id
  
  // call .csv parsing logic (csv when open in excel always parse auto convert)

  // call pdf parsing logic


  res.status(200).json(item);
}  

