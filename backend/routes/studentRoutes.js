const express = require("express");
const { 
  getAllStudents, 
  getStudentPerformance, 
  searchStudents 
} = require("../controllers/studentController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get all students with performance data
router.get("/", getAllStudents);

// Search students
router.get("/search", searchStudents);

// Get specific student performance
router.get("/:identifier", getStudentPerformance);

module.exports = router;