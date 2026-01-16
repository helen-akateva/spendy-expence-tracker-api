import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Category = model('Category', categorySchema);
