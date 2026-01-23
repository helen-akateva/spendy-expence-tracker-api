import { Transaction } from '../models/transaction.js';
import { User } from '../models/user.js';
import {
  deleteTransactionById,
  updateTransactionById,
} from '../services/transaction.js';

import { validateTransactionCategoryMatch } from '../services/transaction.js';

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

    // 🔥 ОНОВЛЮЄМО БАЛАНС
    const balanceChange = type === 'income' ? amount : -amount;

    await User.findByIdAndUpdate(userId, {
      $inc: { balance: balanceChange },
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

    // стара транзакція
    const oldTransaction = await Transaction.findOne({
      _id: transactionId,
      userId,
    });

    if (!oldTransaction) {
      return res.status(404).json({ message: 'Транзакцію не знайдено' });
    }

    const { categoryId, ...rest } = req.body;

    const updateData = { ...rest };
    if (categoryId) updateData.category = categoryId;

    const updated = await updateTransactionById(
      transactionId,
      userId,
      updateData,
    );

    // 🔥 ПЕРЕРАХУНОК БАЛАНСУ
    const oldValue =
      oldTransaction.type === 'income'
        ? oldTransaction.amount
        : -oldTransaction.amount;

    const newValue =
      updated.type === 'income' ? updated.amount : -updated.amount;

    const diff = newValue - oldValue;

    await User.findByIdAndUpdate(userId, {
      $inc: { balance: diff },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
export const deleteTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user._id;

    const deleted = await deleteTransactionById(transactionId, userId);

    const balanceChange =
      deleted.type === 'income' ? -deleted.amount : deleted.amount;

    await User.findByIdAndUpdate(userId, {
      $inc: { balance: balanceChange },
    });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
