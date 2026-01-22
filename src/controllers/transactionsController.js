import createHttpError from 'http-errors';
import { Transaction } from '../models/transaction.js';
import { Category } from '../models/category.js';
import {
  deleteTransactionById,
  updateTransactionById,
} from '../services/transaction.js';
import { validateTransactionCategoryMatch } from '../services/transaction.js';

export const createTransaction = async (req, res, next) => {
  try {
    const { type, categoryId, amount, date, comment } = req.body;

    await validateTransactionCategoryMatch(type, categoryId);

    const transaction = await Transaction.create({
      type,
      category: categoryId,
      amount,
      date,
      comment: comment?.trim(),
      userId: req.user._id,
    });

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
    const updateData = { ...req.body };

    // Якщо оновлюється category (передається ім'я), конвертуємо в ID
    if (updateData.category) {
      const categoryDoc = await Category.findOne({ name: updateData.category });
      if (!categoryDoc) {
        throw createHttpError(400, 'Невірна категорія');
      }
      updateData.category = categoryDoc._id;
    }

    const updated = await updateTransactionById(
      transactionId,
      userId,
      updateData,
    );

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user._id;

    await deleteTransactionById(transactionId, userId);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
