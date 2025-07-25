import express from 'express';
import { signup, login } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', signup);
router.post('/login', login);
router.post('/logout', authMiddleware, (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});
router.get('/verify', authMiddleware, (req, res) => {
  res.status(200).json({ 
    success: true, 
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

export default router;
