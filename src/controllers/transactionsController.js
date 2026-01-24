import { Transaction } from '../models/transaction.js';
import { User } from '../models/user.js';
import {
  deleteTransactionById,
  updateTransactionById,
} from '../services/transaction.js';

import { validateTransactionCategoryMatch } from '../services/transaction.js';
import { autoRecalculateBalance } from './users.js';

export const createTransaction = async (req, res, next) => {
  try {
    const { type, categoryId, amount, date, comment } = req.body;
    const userId = req.user._id;

    await validateTransactionCategoryMatch(type, categoryId);

    const transaction = await Transaction.create({
      type,
      category: categoryId,
      amount,
      date,
      comment: comment?.trim() || '',
      userId,
    });

    // 🔥 АВТОМАТИЧНО ПЕРЕРАХОВУЄМО БАЛАНС
    await autoRecalculateBalance(userId);

    const populatedTransaction = await Transaction.findById(
      transaction._id,
    ).populate('category', 'name type');

    res.status(201).json(populatedTransaction);
  } catch (error) {
    next(error);
  }
};

export const getAllTransactions = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;

    const transactions = await Transaction.find({ userId })
      .populate('category', 'name type')
      .sort({ date: -1 });

    res.json({ transactions });
  } catch (error) {
    next(error);
  }
};
export const updateTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user._id;

    const { categoryId, ...rest } = req.body;

    const updateData = { ...rest };
    if (categoryId) updateData.category = categoryId;

    const { updatedTransaction } = await updateTransactionById(
      transactionId,
      userId,
      updateData,
    );

    // 🔥 АВТОМАТИЧНО ПЕРЕРАХОВУЄМО БАЛАНС
    await autoRecalculateBalance(userId);

    res.json(updatedTransaction);
  } catch (err) {
    next(err);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user._id;

    await deleteTransactionById(transactionId, userId);

    // 🔥 АВТОМАТИЧНО ПЕРЕРАХОВУЄМО БАЛАНС
    await autoRecalculateBalance(userId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
