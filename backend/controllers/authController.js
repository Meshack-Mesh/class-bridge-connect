const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Create JWT
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, registrationNumber } = req.body;

    // Check for existing user based on role
    let existingUser;
    if (role === 'teacher') {
      existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json("Email already exists");
      }
    } else if (role === 'student') {
      existingUser = await User.findOne({ registrationNumber });
      if (existingUser) {
        return res.status(400).json("Registration number already exists");
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userData = {
      username,
      password: hashedPassword,
      role,
    };

    if (role === 'teacher') {
      userData.email = email;
    } else if (role === 'student') {
      userData.registrationNumber = registrationNumber;
    }

    const newUser = new User(userData);
    await newUser.save();

    res.status(201).json("User registered successfully");
  } catch (err) {
    res.status(500).json(err.message || "Server Error");
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password, registrationNumber } = req.body;

    let user;
    if (email) {
      user = await User.findOne({ email });
    } else if (registrationNumber) {
      user = await User.findOne({ registrationNumber });
    }

    if (!user) {
      return res.status(400).json("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json("Invalid credentials");
    }

    const token = createToken(user._id);

    const { password: pwd, ...userWithoutPassword } = user._doc;
    res.status(200).json({ user: userWithoutPassword, token });
  } catch (err) {
    res.status(500).json(err.message || "Server Error");
  }
};

module.exports = { registerUser, loginUser };
