import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER Controller (Role-based)
export const signup = async (req, res) => {
  const { name, email, registrationNumber, password, role } = req.body;

  try {
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

    // Create new user data object
    const userData = {
      name,
      password,
      role,
    };

    // Only add email for teachers, only add registrationNumber for students
    if (role === "teacher") {
      userData.email = email;
    } else if (role === "student") {
      userData.registrationNumber = registrationNumber;
    }

    const user = new User(userData);
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
        name: user.name,
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
  const { identifier, password } = req.body;

  try {
    let user;
    
    // Find user by email or registration number
    if (identifier.includes("@")) {
      user = await User.findOne({ email: identifier });
    } else {
      user = await User.findOne({ registrationNumber: identifier });
    }

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
        name: user.name,
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
