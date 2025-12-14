// src/controllers/auth.controller.js
// Handles user registration and login.
// - Passwords are hashed with bcrypt on register.
// - Emails are normalized (trim + lowercase) for consistent lookups.
// - Login compares the provided password with the stored hash.

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

// Normalize email for consistent storage & lookup
function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

exports.register = async (req, res) => {
  try {
    const rawEmail = req.body.email;
    const password = req.body.password;
    const name = req.body.name;

    if (!rawEmail || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const email = normalizeEmail(rawEmail);

    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already in use' });

    // Hash the password before storing
    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, password: hash, name }
    });

    // Return safe user info (no password)
    return res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const rawEmail = req.body.email;
    const password = req.body.password;

    if (!rawEmail || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const email = normalizeEmail(rawEmail);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // avoid leaking which side failed
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
