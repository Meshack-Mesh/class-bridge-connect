import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  grade: Number,
  feedback: String
}, { timestamps: true });

export default mongoose.model('Submission', submissionSchema);
