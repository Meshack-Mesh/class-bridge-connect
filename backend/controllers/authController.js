import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User already exists' });

  const user = await User.create({ name, email, password, role });
  const token = generateToken(user);
  res.status(201).json({ ...user._doc, token });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user);
    res.json({ ...user._doc, token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};
