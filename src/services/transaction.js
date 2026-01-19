import { Transaction } from '../models/transaction.js';
import { Category } from '../models/category.js';

export const updateTransactionById = async (transactionId, userId, data) => {
  const existing = await Transaction.findOne({
    _id: transactionId,
    userId,
  });

  if (!existing) {
    const error = new Error(
      'Транзакцію не знайдено або вона не належить користувачу',
    );
    error.status = 404;
    throw error;
  }

  if (data.category) {
    const categoryExists = await Category.findById(data.category);
    if (!categoryExists) {
      const error = new Error('Категорію не знайдено');
      error.status = 400;
      throw error;
    }
  }

  const updated = await Transaction.findByIdAndUpdate(transactionId, data, {
    new: true,
  }).populate('category');

  return updated;
};

export const deleteTransactionById = async (transactionId, userId) => {
  const deleted = await Transaction.findOneAndDelete({
    _id: transactionId,
    userId,
  });

  if (!deleted) {
    const error = new Error(
      'Транзакцію не знайдено або вона не належить користувачу',
    );
    error.status = 404;
    throw error;
  }

  return deleted;
};
