import { Transaction } from '../models/transaction.js';
import { Category } from '../models/category.js';

export const validateTransactionCategoryMatch = async (type, categoryId) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error('Category not found');
    error.status = 400;
    throw error;
  }

  if (type === 'income' && category.name !== 'Incomes') {
    const error = new Error(
      'For income transactions, only "Incomes" category can be used',
    );
    error.status = 400;
    throw error;
  }

  if (type === 'expense' && category.name === 'Incomes') {
    const error = new Error(
      '"Incomes" category can only be used for income transactions',
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
      'Transaction not found or does not belong to user',
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
      'Transaction not found or does not belong to user',
    );
    error.status = 404;
    throw error;
  }

  return deleted;
};
