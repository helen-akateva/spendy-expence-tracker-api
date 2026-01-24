import { Router } from 'express';
import { celebrate } from 'celebrate';
import {
  createTransactionSchema,
  getAllTransactionsSchema,
} from '../validations/transactionValidation.js';
import {
  transactionIdSchema,
  updateTransactionSchema,
} from '../validations/updateTransactionValidation.js';
import {
  createTransaction,
  getAllTransactions,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionsController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Endpoints for managing user transactions (create, read, update, delete)
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - category
 *               - amount
 *               - date
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: "expense"
 *               category:
 *                 type: string
 *                 example: "Products"
 *               amount:
 *                 type: number
 *                 minimum: 0.01
 *                 maximum: 1000000
 *                 example: 1250.50
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-15"
 *               comment:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 192
 *                 example: "Grocery shopping"
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 type:
 *                   type: string
 *                 category:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 date:
 *                   type: string
 *                 comment:
 *                   type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - invalid or missing token
 *       500:
 *         description: Internal server error
 */
router.post(
  '/',
  authenticate,
  celebrate(createTransactionSchema),
  createTransaction,
);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all user transactions
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of transactions per page
 *     responses:
 *       200:
 *         description: List of transactions retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       type:
 *                         type: string
 *                       category:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       date:
 *                         type: string
 *                       comment:
 *                         type: string
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  '/',
  authenticate,
  celebrate(getAllTransactionsSchema),
  getAllTransactions,
);

/**
 * @swagger
 * /transactions/{transactionId}:
 *   patch:
 *     summary: Update an existing transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the transaction to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: "expense"
 *               category:
 *                 type: string
 *                 example: "Car"
 *               amount:
 *                 type: number
 *                 example: 450.00
 *               date:
 *                 type: string
 *                 example: "2025-01-20"
 *               comment:
 *                 type: string
 *                 example: "Car service"
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 type:
 *                   type: string
 *                 category:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 date:
 *                   type: string
 *                 comment:
 *                   type: string
 *       400:
 *         description: Validation error or invalid data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - transaction belongs to another user
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  '/:transactionId',
  authenticate,
  celebrate({ ...transactionIdSchema, ...updateTransactionSchema }),
  updateTransaction,
);

/**
 * @swagger
 * /transactions/{transactionId}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the transaction to delete
 *     responses:
 *       204:
 *         description: Transaction deleted successfully (no content)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - transaction belongs to another user
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  '/:transactionId',
  authenticate,
  celebrate(transactionIdSchema),
  deleteTransaction,
);

export default router;
