import { Joi, Segments } from 'celebrate';
import { CATEGORIES } from '../constants/categories.js';

export const createTransactionSchema = {
  [Segments.BODY]: Joi.object({
    type: Joi.string().valid('income', 'expense').required(),
    category: Joi.string()
      .valid(...CATEGORIES.map((cat) => cat.name))
      .required(),
    amount: Joi.number().min(0.01).max(1000000).required(),
    date: Joi.string().required(),
    comment: Joi.string().min(2).max(192).optional(),
  }),
};

export const getAllTransactionsSchema = {
  [Segments.QUERY]: Joi.object({}),
};
