import { Router } from 'express';
import * as ingreController from '../controllers/ingredient.controller';
const router = Router();

// Public client Endpoint (Listing , querying)
router.get('/ingredient',     ingreController.listIngredients);
router.get('/ingredient/search',  ingreController.getIngredient);

// Protected route
// -- Admin side route 
router.post('/ingredient/create',    ingreController.createIngredient);
router.put('/ingredient/id',  ingreController.updateIngredient);
router.delete('/ingredient/id', ingreController.deleteIngredient);

export default router;
