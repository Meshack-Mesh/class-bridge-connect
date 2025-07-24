import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getAllStudents,
  getStudentById,
  getStudentProfile,
  enrollInClass
} from "../controllers/studentController.js";

const router = express.Router();

// Public or general endpoints
router.get("/", getAllStudents);

// ✅ Specific routes must come before dynamic routes
router.get("/profile", authMiddleware, roleMiddleware("student"), getStudentProfile);
router.post("/enroll", authMiddleware, roleMiddleware("student"), enrollInClass);

// ✅ Dynamic route last to prevent conflicts
router.get("/:id", getStudentById);

export default router;
