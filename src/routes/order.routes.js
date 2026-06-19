import { Router } from 'express';
import * as orderController from '../controllers/order.controller.js';
const router = Router();


// List all if null, search if filters are provided 
router.get('/order',           orderController.getOrder);
router.get('/order/search',           orderController.getOrder);

// Received shopping cart from frontend and parse it into db entry 
router.post('/order/create',             orderController.submitOrder);
 
router.patch('/order/:id/status',  orderController.updateOrderStatus); 
  // This will call balancededuction service
// For bigger scale there should be other API like grpc which linked to payment service

// Purchased , not purchased
router.patch('/order/:id/status',  orderController.updateOrderStatus); 
  // This will call balancededuction service
// For bigger scale there should be other API like grpc which linked to payment service

export default router;
