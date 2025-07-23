// backend/middleware/roleMiddleware.js

export default function roleMiddleware(requiredRole) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ message: "Access denied: insufficient role" });
    }
    next();
  };
}
