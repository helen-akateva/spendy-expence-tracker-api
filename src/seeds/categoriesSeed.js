import { Category } from '../models/category.js';
import { CATEGORIES } from '../constants/categories.js';

export const seedCategories = async () => {
  const total = await Category.countDocuments();

  if (total === 0) {
    await Category.create(CATEGORIES);
    console.log('✅ Categories seeded');
  }
};
