import { Transaction } from '../models/transaction.js';
import { User } from '../models/user.js';

export const getCurrentUser = async (req, res, next) => {
  try {
    const userObject = req.user.toObject ? req.user.toObject() : req.user;
    delete userObject.password;

    res.status(200).json(userObject);
  } catch (error) {
    next(error);
  }
};

// Helper function to automatically recalculate balance
export const autoRecalculateBalance = async (userId) => {
  // Convert to string to ensure consistent comparison
  const userIdString = userId.toString();
  
  const transactions = await Transaction.find({ userId: userIdString });

  let balance = 0;
  for (const transaction of transactions) {
    if (transaction.type === 'income') {
      balance += transaction.amount;
    } else {
      balance -= transaction.amount;
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userIdString,
    { balance },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    throw new Error('User not found during balance update');
  }

  return balance;
};

export const recalculateBalance = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const balance = await autoRecalculateBalance(userId);

    res.json({
      message: 'Balance recalculated successfully',
      balance,
      transactionsCount: (await Transaction.find({ userId })).length,
    });
  } catch (error) {
    next(error);
  }
};
