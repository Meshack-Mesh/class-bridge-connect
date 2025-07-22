const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Create JWT Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = createToken(user._id);

  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  // Remove password from output
  const userOutput = {
    _id: user._id,
    username: user.username,
    email: user.email,
    registrationNumber: user.registrationNumber,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: userOutput
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, registrationNumber } = req.body;

    // Validate required fields
    if (!username || !password || !role) {
      return res.status(400).json({
        success: false,
        error: "Please provide username, password, and role"
      });
    }

    // Role-specific validation
    if (role === 'teacher' && !email) {
      return res.status(400).json({
        success: false,
        error: "Email is required for teachers"
      });
    }

    if (role === 'student' && !registrationNumber) {
      return res.status(400).json({
        success: false,
        error: "Registration number is required for students"
      });
    }

    // Check for existing user
    let existingUser;
    if (role === 'teacher') {
      existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Email already exists"
        });
      }
    } else if (role === 'student') {
      existingUser = await User.findOne({ registrationNumber });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Registration number already exists"
        });
      }
    }

    // Create user data object
    const userData = {
      username,
      password,
      role,
    };

    if (role === 'teacher') {
      userData.email = email;
    } else if (role === 'student') {
      userData.registrationNumber = registrationNumber;
    }

    // Create user (password will be hashed automatically by pre-save middleware)
    const user = await User.create(userData);

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: error.message || "Server Error"
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, registrationNumber, password } = req.body;

    // Validate email/registrationNumber and password
    if (!password) {
      return res.status(400).json({
        success: false,
        error: "Please provide password"
      });
    }

    if (!email && !registrationNumber) {
      return res.status(400).json({
        success: false,
        error: "Please provide email or registration number"
      });
    }

    // Use the static login method from the User model
    const identifier = email || registrationNumber;
    const user = await User.login(identifier, password);

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({
      success: false,
      error: error.message || "Invalid credentials"
    });
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
const logoutUser = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
};

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
const verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  verifyToken
};