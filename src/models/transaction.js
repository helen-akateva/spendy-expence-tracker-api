import { Schema, model } from 'mongoose';

const transactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: [0.01, 'Сума має бути більше 0'],
      max: [1000000, 'Сума не може перевищувати 1000000'],
    },

    date: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, 'Дата має бути у форматі рррр-мм-дд'],
    },

    comment: {
      type: String,
      minlength: [2, 'Коментар має містити мінімум 2 символи'],
      maxlength: [192, 'Коментар не може перевищувати 192 символи'],
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Transaction = model('Transaction', transactionSchema);
