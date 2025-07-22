const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
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
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { 
    timestamps: true,
    collection: 'users' // Explicitly set collection name
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to login user
userSchema.statics.login = async function(identifier, password) {
  let user;
  
  // Check if identifier is email (for teachers) or registration number (for students)
  if (identifier.includes('@')) {
    user = await this.findOne({ email: identifier });
  } else {
    user = await this.findOne({ registrationNumber: identifier });
  }

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new Error('Invalid credentials');
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);