import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER Controller (Role-based)
export const signup = async (req, res) => {
  const { name, username, email, registrationNumber, password, role } = req.body;

  try {
    // Check for existing user by username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check for existing email or registration number based on role
    if (role === "teacher" && email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }
    
    if (role === "student" && registrationNumber) {
      const existingRegNum = await User.findOne({ registrationNumber });
      if (existingRegNum) {
        return res.status(400).json({ message: "Registration number already exists" });
      }
    }

    // Create new user
    const user = new User({
      username,
      email: role === "teacher" ? email : undefined,
      registrationNumber: role === "student" ? registrationNumber : undefined,
      password,
      role,
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ 
      token, 
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        registrationNumber: user.registrationNumber,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      message: "Registration failed",
      error: err.message,
    });
  }
};

// LOGIN Controller
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({ 
      token, 
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        registrationNumber: user.registrationNumber,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};
