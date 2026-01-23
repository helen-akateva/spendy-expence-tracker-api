import { Joi, Segments } from 'celebrate';

export const createTransactionSchema = {
  [Segments.BODY]: Joi.object({
    type: Joi.string().valid('income', 'expense').required(),
    categoryId: Joi.string().hex().length(24).required(),
    amount: Joi.number().min(0.01).max(1000000).required(),
    date: Joi.string()
      .pattern(/^\d{4}-(0[1-9]|1[0-2])-[0-3]\d$/)
      .required()
      .messages({
        'string.pattern.base': 'Дата має бути у форматі YYYY-MM-DD',
      }),
    comment: Joi.string().min(2).max(192).allow('').optional(),
  }),
};

export const getAllTransactionsSchema = {
  [Segments.QUERY]: Joi.object({}),
};
