import { Router } from 'express';
import * as histController from '../controllers/order-history.controller.js';
const router = Router();

router.post('/history/getDropdown',   histController.getDropdown);
router.get('/history/getLog',         histController.getLog);       // Drop down and search bar
router.get('/history/recreate',       histController.getReuseOrder)   // reuse the previous order , by placing everything back to order 

export default router;
