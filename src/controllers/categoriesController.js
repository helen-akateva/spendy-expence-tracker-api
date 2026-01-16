import { Category } from '../models/category.js';

export const getCategories = async (req, res) => {
  const { type = 'expense' } = req.query;

  try {
    const categoriesQuery = Category.find({ type })
      .sort({ _id: 1 })
      .select('name');

    const categories = await categoriesQuery;

    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
