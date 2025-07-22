const User = require("../models/User");
const Class = require("../models/Class");
const Assignment = require("../models/Assignment");
const Submission = require("../models/Submission");

// Get all students with their performance data
const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .populate({
        path: 'grades.assignment',
        model: 'Assignment'
      })
      .select('-password')
      .sort({ username: 1 });

    // Calculate performance metrics for each student
    const studentsWithPerformance = students.map(student => {
      const grades = student.grades || [];
      const totalGrades = grades.length;
      
      let averageGrade = 0;
      if (totalGrades > 0) {
        const sum = grades.reduce((acc, grade) => acc + (grade.grade || 0), 0);
        averageGrade = sum / totalGrades;
      }

      return {
        ...student._doc,
        performanceMetrics: {
          totalAssignments: totalGrades,
          averageGrade: Math.round(averageGrade * 100) / 100,
          completionRate: totalGrades > 0 ? 100 : 0 // Can be enhanced with submission tracking
        }
      };
    });

    res.status(200).json(studentsWithPerformance);
  } catch (err) {
    res.status(500).json({ error: err.message || "Server Error" });
  }
};

// Get specific student performance by ID or registration number
const getStudentPerformance = async (req, res) => {
  try {
    const { identifier } = req.params; // Can be _id or registrationNumber
    
    let student;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      // If it's a valid ObjectId
      student = await User.findById(identifier);
    } else {
      // Otherwise search by registration number
      student = await User.findOne({ registrationNumber: identifier });
    }

    if (!student || student.role !== 'student') {
      return res.status(404).json({ error: "Student not found" });
    }

    // Get detailed performance data
    const submissions = await Submission.find({ student: student._id })
      .populate('assignment')
      .sort({ createdAt: -1 });

    const classes = await Class.find({ students: student._id })
      .populate('teacher', 'username email');

    const performanceData = {
      student: {
        _id: student._id,
        username: student.username,
        registrationNumber: student.registrationNumber,
        createdAt: student.createdAt
      },
      classes: classes,
      submissions: submissions,
      metrics: {
        totalSubmissions: submissions.length,
        gradedSubmissions: submissions.filter(s => s.grade !== undefined).length,
        averageGrade: submissions.length > 0 ? 
          submissions.reduce((acc, s) => acc + (s.grade || 0), 0) / submissions.filter(s => s.grade !== undefined).length : 0,
        pendingGrading: submissions.filter(s => s.grade === undefined).length
      }
    };

    res.status(200).json(performanceData);
  } catch (err) {
    res.status(500).json({ error: err.message || "Server Error" });
  }
};

// Search students by name or registration number
const searchStudents = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const searchRegex = new RegExp(query, 'i');
    
    const students = await User.find({
      role: 'student',
      $or: [
        { username: searchRegex },
        { registrationNumber: searchRegex }
      ]
    })
    .populate({
      path: 'grades.assignment',
      model: 'Assignment'
    })
    .select('-password')
    .sort({ username: 1 });

    // Add performance metrics
    const studentsWithPerformance = students.map(student => {
      const grades = student.grades || [];
      const totalGrades = grades.length;
      
      let averageGrade = 0;
      if (totalGrades > 0) {
        const sum = grades.reduce((acc, grade) => acc + (grade.grade || 0), 0);
        averageGrade = sum / totalGrades;
      }

      return {
        ...student._doc,
        performanceMetrics: {
          totalAssignments: totalGrades,
          averageGrade: Math.round(averageGrade * 100) / 100,
          completionRate: totalGrades > 0 ? 100 : 0
        }
      };
    });

    res.status(200).json(studentsWithPerformance);
  } catch (err) {
    res.status(500).json({ error: err.message || "Server Error" });
  }
};

module.exports = {
  getAllStudents,
  getStudentPerformance,
  searchStudents
};
