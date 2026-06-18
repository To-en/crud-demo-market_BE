import { Router } from 'express';
import 
import ingredientsRouter from './ingredients.routes.js';

const rootRouter = Router();
rootRouter.use('/market', );
rootRouter.use('/shoppingCart', ingredientsRouter);

export default rootRouter;
