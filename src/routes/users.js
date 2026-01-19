import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { getCurrentUser } from '../controllers/users.js';

const router = Router();

router.get('/current', authenticate, getCurrentUser);

export default router;
