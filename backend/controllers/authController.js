const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// @desc  Register first admin (run once on setup)
// @route POST /api/auth/register
const registerAdmin = async (req, res) => {
  const { username, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Admin already exists' });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ username, email, passwordHash });
  res.status(201).json({ _id: user._id, username: user.username, token: generateToken(user._id) });
};

// @desc  Login admin
// @route POST /api/auth/login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    res.json({ _id: user._id, username: user.username, role: user.role, token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc  Get logged-in admin profile
// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ _id: req.user._id, username: req.user.username, role: req.user.role });
};

// Auto-seed admin user from env if no admin exists
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@falconyouth.org';
    const adminPass  = process.env.ADMIN_PASSWORD || 'Admin@Falcon2026';
    const exists = await User.findOne({ email: adminEmail });
    if (!exists) {
      const passwordHash = await bcrypt.hash(adminPass, 12);
      await User.create({ username: 'SuperAdmin', email: adminEmail, passwordHash, role: 'admin' });
      console.log(`🔑 Default Admin created: ${adminEmail}`);
    }
  } catch (err) {
    console.error('Error seeding admin user:', err.message);
  }
};

module.exports = { registerAdmin, loginAdmin, getMe, seedAdmin };

