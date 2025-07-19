import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: String,
  description: String,
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: Date,
  maxGrade: Number
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema);
