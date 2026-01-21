import { Category } from '../models/category.js';

export const getCategories = async (req, res, next) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const categoriesQuery = Category.find(filter)
      .sort({ _id: 1 })
      .select('name');

    const categories = await categoriesQuery;

    res.status(200).json({ categories });
  } catch (error) {
    next(error);
  }
};
