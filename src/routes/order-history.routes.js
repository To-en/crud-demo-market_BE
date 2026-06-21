import { Router } from 'express';
import * as orderHistController from '../controllers/order-history.controller';
const router = Router();

router.post('/order/history',            orderHistController.listOrders);
router.get('/order/history/search',      orderHistController.searchOrder);      // Drop down and search bar
router.get('/order/history/recreate',    orderHistController.reuseOrder);       // reuse the previous order , by placing everything back to order 
router.delete('/order/history/:id/',     orderHistController.deleteOrder);
router.get('/order/history/:id/',        orderHistController.openOrderBill);   // Not the same as search
router.get('/order/history/:id/export',        orderHistController.exportOrderBill); // export button

export default router;
