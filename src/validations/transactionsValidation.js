import { Joi, Segments } from 'celebrate';

export const transactionIdSchema = {
  [Segments.PARAMS]: Joi.object({
    transactionId: Joi.string().hex().length(24).required().messages({
      'string.hex': 'transactionId має бути валідним ObjectId',
      'string.length': 'transactionId має містити 24 символи',
    }),
  }),
};

export const updateTransactionSchema = {
  [Segments.BODY]: Joi.object({
    type: Joi.string().valid('income', 'expense'),

    category: Joi.string().hex().length(24),

    amount: Joi.number().min(0.01).max(1000000),

    date: Joi.string()
      .pattern(/^\d{4}-(0[1-9]|1[0-2])-[0-3]\d$/)
      .messages({
        'string.pattern.base': 'Дата має бути у форматі YYYY-MM-DD',
      }),

    comment: Joi.string().min(2).max(192).allow(''),
  })
    .min(1)
    .messages({
      'object.min': 'Потрібно передати хоча б одне поле для оновлення',
    }),
};
