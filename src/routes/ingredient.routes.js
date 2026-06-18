import { Router } from 'express';
import * as ingredientController from '../controllers/ingredient.controller';

const router = Router();

router.get('/',     ingredientController.listIngredients);
router.get('/id',  ingredientController.getIngredient);
router.post('/',    ingredientController.createIngredient);
router.put('/id',  ingredientController.updateIngredient);
router.delete('/id', ingredientController.deleteIngredient);

export default router;
