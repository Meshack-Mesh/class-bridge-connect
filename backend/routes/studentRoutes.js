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

// Public or general endpoints (if needed)
router.get("/", getAllStudents);
router.get("/:id", getStudentById);

// Must be logged in and be a student
router.get("/profile", authMiddleware, roleMiddleware("student"), getStudentProfile);
router.post("/enroll", authMiddleware, roleMiddleware("student"), enrollInClass);

export default router;
