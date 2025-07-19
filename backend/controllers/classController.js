// /controllers/classController.js

import Class from '../models/Class.js';
import User from '../models/User.js';

// Create a new class
export const createClass = async (req, res) => {
  try {
    const newClass = await Class.create({
      name: req.body.name,
      description: req.body.description,
      createdBy: req.user._id,
    });
    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create class', error });
  }
};

// Get all classes
export const getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find().populate('createdBy', 'name email');
    res.status(200).json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch classes', error });
  }
};

// Get class by ID
export const getClassById = async (req, res) => {
  try {
    const foundClass = await Class.findById(req.params.id).populate('createdBy', 'name email');
    if (!foundClass) return res.status(404).json({ message: 'Class not found' });
    res.status(200).json(foundClass);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch class', error });
  }
};

// Update class
export const updateClass = async (req, res) => {
  try {
    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, description: req.body.description },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update class', error });
  }
};

// Delete class
export const deleteClass = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete class', error });
  }
};

// Join class
export const joinClass = async (req, res) => {
  try {
    const classToJoin = await Class.findById(req.params.id);
    if (!classToJoin) return res.status(404).json({ message: 'Class not found' });

    const user = await User.findById(req.user._id);
    if (!user.classes.includes(classToJoin._id)) {
      user.classes.push(classToJoin._id);
      await user.save();
    }
    res.status(200).json({ message: 'Joined class successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to join class', error });
  }
};
