/**
 * @swagger
 * /api/log:
 *   get:
 *     tags: [Logs]
 *     summary: Tail a backend log file (admin only)
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: file
 *         schema: { type: string, enum: [combined, error], default: combined }
 *       - in: query
 *         name: lines
 *         schema: { type: integer, default: 200, maximum: 1000 }
 *     responses:
 *       200:
 *         description: Last N log lines
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 file:  { type: string }
 *                 count: { type: integer }
 *                 lines: { type: array, items: { type: string } }
 *       403:
 *         description: Not an admin
 */
import { Router } from 'express';
import { requireRole } from '../middleware/auth.middleware.js';
import * as controller from '../controllers/log.controller.js';
const router = Router();

router.get('/log', requireRole(2), controller.tailLog);

export default router;
