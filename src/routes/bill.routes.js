// history subpage controller (Bill)
// display bill and has option to export to pdf 
// (into a proper bill or invoice format since the price can go up ~1000 scale)
import { Router } from 'express';
import * as billController from '../controllers/bill.controller';
import * as histController from '../controllers/order-history.controller';
const router = Router();

router.get('/history/:id/',             billController.openBill);
router.get('/history/:id/export',       billController.exportBill_pdf); // export button
router.patch('/history/:id/',            billController.deleteBill);
router.delete('/history/:id/',            histController.deleteOrder);

export default router;