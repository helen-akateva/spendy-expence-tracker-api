import { Router } from 'express';
import { getCategories } from '../controllers/categoriesController.js';

const categoriesRoutes = Router();

categoriesRoutes.get('/categories', getCategories);

export default categoriesRoutes;
