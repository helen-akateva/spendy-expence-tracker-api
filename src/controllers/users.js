export const getCurrentUser = async (req, res) => {
  res.status(200).json(req.user);
};
