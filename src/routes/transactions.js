import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  createTransactionSchema,
  getAllTransactionsSchema,
} from '../validations/transactionValidation.js';
import {
  createTransaction,
  getAllTransactions,
} from '../controllers/transactionsController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.post(
  '/',
  celebrate(createTransactionSchema),
  authenticate,
  createTransaction,
);

router.get(
  '/all',
  celebrate(getAllTransactionsSchema),
  authenticate,
  getAllTransactions,
);

export default router;
