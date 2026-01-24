import { Transaction } from '../models/transaction.js';

export const getSummaryForMonth = async (period, userId) => {
  const [year, month] = period.split('-');

  const start = `${year}-${month}-01`;
  const nextMonth = String(Number(month) + 1).padStart(2, '0');
  const end = `${year}-${nextMonth}-01`;

  const transactions = await Transaction.find({
    userId,
    date: { $gte: start, $lt: end },
  }).populate('category');

  const categoryMap = new Map();

  for (const tx of transactions) {
    // Skip transactions with missing/deleted categories
    if (!tx.category) {
      console.warn(`Transaction ${tx._id} has missing category`);
      continue;
    }

    const catName = tx.category.name;
    const catType = tx.category.type;

    if (!categoryMap.has(catName)) {
      categoryMap.set(catName, {
        category: catName,
        type: catType,
        total: 0,
      });
    }

    categoryMap.get(catName).total += tx.amount;
  }

  let totalIncome = 0;
  let totalExpense = 0;

  for (const tx of transactions) {
    if (tx.type === 'income') totalIncome += tx.amount;
    else totalExpense += tx.amount;
  }

  return {
    period,
    categories: Array.from(categoryMap.values()),
    totals: {
      totalIncome,
      totalExpense,
    },
  };
};
