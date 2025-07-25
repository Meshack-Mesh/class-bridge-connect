// controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      console.log("⚠️ Missing signup fields:", { name, email, password, role });
      return res.status(400).json({ message: "All fields are required." });
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      console.log("❌ Signup failed: User already exists:", normalizedEmail);
      return res.status(400).json({ message: "User already exists with this email." });
    }


    const newUser = new User({
      name,
      email: normalizedEmail,
      password,
      role,
    });

    await newUser.save();

    console.log("✅ Signup successful for:", normalizedEmail);
    
    // Generate token for immediate login after registration
    const token = jwt.sign(
      { userId: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ 
      success: true,
      message: "User registered successfully.",
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      }
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    console.log("🔐 Login attempt:", { email, password, role });

    if (!email || !password || !role) {
      console.log("⚠️ Missing login fields:", { email, password, role });
      return res.status(400).json({ message: "Email, password, and role are required." });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      console.log("❌ Login failed: No user found with email", normalizedEmail);
      return res.status(401).json({ message: "Invalid credentials. Please try again." });
    } else {
      console.log("🔎 User found:", { email: user.email, role: user.role });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("❌ Login failed: Incorrect password for", normalizedEmail);
      return res.status(401).json({ message: "Invalid credentials. Please try again." });
    } else {
      console.log("🔐 Password match successful");
    }

    if (user.role !== role) {
      console.log(`❌ Login failed: Role mismatch (expected "${user.role}", got "${role}")`);
      return res.status(401).json({ message: "Role mismatch. Please check your role." });
    } else {
      console.log("✅ Role match confirmed");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login successful:", user.email);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
