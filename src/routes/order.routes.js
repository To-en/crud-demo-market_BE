import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';

const router = Router();

router.post('/',          orderController.submitOrder);
router.get('/',           orderController.listOrders);
router.get('/id',        orderController.getOrder);
router.patch('/id/status', orderController.updateOrderStatus);

export default router;
