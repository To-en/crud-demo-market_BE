import { Router } from 'express';
import * as ingreController from '../controllers/ingredient.controller';
const router = Router();

router.get('/ingre',     ingreController.listIngredients);
router.get('/ingre/id',  ingreController.getIngredient);
router.post('/ingre/create',    ingreController.createIngredient);
router.put('/ingre/id',  ingreController.updateIngredient);
router.delete('/ingre/id', ingreController.deleteIngredient);

export default router;
