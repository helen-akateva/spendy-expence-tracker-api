import { Transaction } from '../models/transaction.js';
import { Category } from '../models/category.js';

export const validateTransactionCategoryMatch = async (type, categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error('Категорію не знайдено');
    error.status = 400;
    throw error;
  }

  if (type === 'income' && category.name !== 'Incomes') {
    const error = new Error(
      'Для доходів можна використовувати тільки категорію "Incomes"',
    );
    error.status = 400;
    throw error;
  }

  if (type === 'expense' && category.name === 'Incomes') {
    const error = new Error(
      'Категорія "Incomes" може використовуватись тільки для доходів',
    );
    error.status = 400;
    throw error;
  }

  return category;
};
export const updateTransactionById = async (transactionId, userId, data) => {
  const oldTransaction = await Transaction.findOne({
    _id: transactionId,
    userId,
  })
    .populate('category')
    .lean();

  if (!oldTransaction) {
    const error = new Error(
      'Транзакцію не знайдено або вона не належить користувачу',
    );
    error.status = 404;
    throw error;
  }

  if (data.type || data.category) {
    const typeToCheck = data.type || oldTransaction.type;
    const categoryToCheck = data.category || oldTransaction.category._id;

    await validateTransactionCategoryMatch(typeToCheck, categoryToCheck);
  }

  const updatedTransaction = await Transaction.findOneAndUpdate(
    { _id: transactionId, userId },
    data,
    { new: true, runValidators: true },
  )
    .populate('category')
    .lean();

  return { oldTransaction, updatedTransaction };
};

// Видалити транзакцію
export const deleteTransactionById = async (transactionId, userId) => {
  const deleted = await Transaction.findOneAndDelete({
    _id: transactionId,
    userId,
  }).lean();

  if (!deleted) {
    const error = new Error(
      'Транзакцію не знайдено або вона не належить користувачу',
    );
    error.status = 404;
    throw error;
  }

  return deleted;
};
