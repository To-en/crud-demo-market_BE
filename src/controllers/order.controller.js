import { model } from '../models'
import { service } from '../services/order.service'

// order id
const orders = [];
let nextOrderId = 1;


// POST /order/create
/** JSON BODY
{
  "key1": ["",""],
  "key2": "",  
}
*/
export async function submitOrder(req, res) {
  const { studentId, items } = req.body;
  if (!studentId || !Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: "studentId and items required" });

  for (const { ingredientId, qty } of items) {
    const ing = ingredients.find(i => i.id === ingredientId);
    if (!ing) return res.status(404).json({ error: `Ingredient ${ingredientId} not found` });
    if (ing.stock < qty) return res.status(400).json({ error: `${ing.name} insufficient stock` });
  }

  for (const { ingredientId, qty } of items) {
    ingredients.find(i => i.id === ingredientId).stock -= qty;
  }


  // Call budget calculation service
    // THis must be async operation

  // Session queue (Simulate DB)
  const order = {
    id: nextOrderId++, // always point to next 
    studentId,
    items,
    placedAt: new Date().toISOString(),
    status: 'pending',
  };
  orders.push(order);
  res.status(201).json(
    order // return order payload at least (Dev inspect)
  );

}

// PATCH /order/:id/status
export async function updateOrderStatus(req, res) {
  const order = orders.find(o => o.id === Number(req.params.id));
  if (!order) return res.status(404).json({ error: "Order not found" });
  const { status } = req.body;
  if (!['confirmed', 'cancelled'].includes(status))
    return res.status(400).json({ error: "status must be confirmed or cancelled" });
  order.status = status;
  res.json(order);
}


