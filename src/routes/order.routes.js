import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
const router = Router();

router.patch('/order/:id/status',   orderController.updateOrderStatus); 
  // This will call balancededuction service
// For bigger scale there should be other API like grpc which linked to payment service
router.post('/order/submit',        orderController.submitOrder);
router.get('/order/submit',         orderController.orderPayment);
// over budget will notify to frontend and won't let user proceed

router.delete('/order/', DeletefromCart)

export default router;
