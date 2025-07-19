import express from 'express';
import {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass
} from '../controllers/classController.js';

const router = express.Router();

router.route('/')
  .post(createClass)
  .get(getClasses);

router.route('/:id')
  .get(getClassById)
  .put(updateClass)
  .delete(deleteClass);

export default router;
