import User from '../models/User.js';
import Class from '../models/Class.js';

/**
 * Get all students (for teacher/admin views)
 */
export const getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch students', error: err.message });
  }
};

/**
 * Get student by ID
 */
export const getStudentById = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get student', error: err.message });
  }
};

/**
 * Get logged-in student profile
 */
export const getStudentProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user.id).select('-password');
    if (!student || student.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get profile', error: err.message });
  }
};

/**
 * Enroll student in a class
 */
export const enrollInClass = async (req, res) => {
  const { classId } = req.body;

  try {
    const selectedClass = await Class.findById(classId);
    if (!selectedClass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Add student to class if not already enrolled
    if (!selectedClass.students.includes(req.user.id)) {
      selectedClass.students.push(req.user.id);
      await selectedClass.save();
    }

    res.status(200).json({ message: 'Enrollment successful' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to enroll in class', error: err.message });
  }
};
