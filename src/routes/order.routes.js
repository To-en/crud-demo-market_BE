/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Cart and order submission. Mounted at /api/order
 *
 * /api/order/submit:
 *   post:
 *     tags: [Orders]
 *     summary: Submit order (student only)
 *     description: Creates order with pending status. Budget is NOT deducted here — deducted only when teacher confirms.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, ingreId, qty]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Monday Lunch
 *               ingreId:
 *                 type: array
 *                 items: { type: integer }
 *                 example: [1, 2, 5]
 *               qty:
 *                 type: array
 *                 items: { type: integer }
 *                 example: [2, 1, 3]
 *     responses:
 *       201:
 *         description: Order submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Missing required fields or ingreId/qty length mismatch
 *
 * /api/order/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     summary: Update order status (teacher/admin only)
 *     description: confirmed deducts budget from student; cancelled leaves budget untouched.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [confirmed, cancelled]
 *     responses:
 *       200:
 *         description: Updated order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: status must be confirmed or cancelled
 *       404:
 *         description: Order not found
 */
import { Router } from 'express';
import { requireRole } from '../middleware/auth.middleware.js';
import * as controller from '../controllers/order.controller.js';
const router = Router();

// This route serves at ingredient order page , and shopping cart
router.post('/order/submit',      requireRole(0),     controller.submitOrder);
router.patch('/order/:id/status', requireRole(1, 2), controller.updateOrderStatus);

export default router;
