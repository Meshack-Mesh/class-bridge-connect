import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

import {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass
} from '../controllers/classController.js';

const router = express.Router();

// Public or authenticated viewing
router.get("/", authMiddleware, getAllClasses);
router.get("/:id", authMiddleware, getClassById);

// Protected: only teachers can manage classes
router.post("/", authMiddleware, roleMiddleware("teacher"), createClass);
router.put("/:id", authMiddleware, roleMiddleware("teacher"), updateClass);
router.delete("/:id", authMiddleware, roleMiddleware("teacher"), deleteClass);

export default router;
