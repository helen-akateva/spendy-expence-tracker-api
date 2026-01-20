export const getCurrentUser = async (req, res, next) => {
  try {
    const userObject = req.user.toObject ? req.user.toObject() : req.user;
    delete userObject.password;

    res.status(200).json(userObject);
  } catch (error) {
    next(error);
  }
};
