import createHttpError from 'http-errors';
import { Transaction } from '../models/transaction.js';
import { Category } from '../models/category.js';

export const createTransaction = async (req, res, next) => {
  try {
    const { category: categoryName, ...rest } = req.body;
    const categoryDoc = await Category.findOne({ name: categoryName });
    if (!categoryDoc) {
      throw createHttpError(400, 'Invalid category');
    }

    const transaction = await Transaction.create({
      ...rest,
      category: categoryDoc._id,
      userId: req.user._id,
    });

    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const getAllTransactions = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const transactions = await Transaction.find({ userId })
      .populate('category', 'name type')
      .sort({ date: 1 });

    res.json(transactions);
  } catch (error) {
    next(error);
  }
};
