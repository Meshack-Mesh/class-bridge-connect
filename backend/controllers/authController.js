import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// REGISTER Controller (Role-based)
export const signup = async (req, res) => {
  const { name, email, registrationNumber, password, role } = req.body;

  try {
    // Check for existing user based on role
    const query = role === "teacher" ? { email } : { registrationNumber };
    const existingUser = await User.findOne(query);

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
       username: name,
      email: role === "teacher" ? email : null,
      registrationNumber: role === "student" ? registrationNumber : null,
      password: hashedPassword,
      role,
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, user });
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
  const { email, registrationNumber, password } = req.body;

  try {
    // Determine login method
    const query = email ? { email } : { registrationNumber };
    const user = await User.findOne(query);

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

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};
