const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: function() {
        return this.role === 'teacher';
      },
      unique: true,
      sparse: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Email is invalid"],
    },
    registrationNumber: {
      type: String,
      required: function() {
        return this.role === 'student';
      },
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ['student', 'teacher'],
      required: [true, "Role is required"],
    },
    // Performance tracking for students
    grades: [{
      assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment'
      },
      grade: Number,
      submittedAt: Date,
      gradedAt: Date
    }],
    overallGPA: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
