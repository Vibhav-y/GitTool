export const verifyToken = (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ error: "No GitHub token provided" });
  }
  next();
};
