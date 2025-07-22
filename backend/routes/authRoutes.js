const express = require("express");
const { 
  registerUser, 
  loginUser, 
  logoutUser, 
  getMe, 
  verifyToken 
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/logout", protect, logoutUser);
router.get("/me", protect, getMe);
router.get("/verify", protect, verifyToken);

module.exports = router;
