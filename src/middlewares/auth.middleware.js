// src/middlewares/auth.middleware.js
// Verify JWT in Authorization header and attach req.userId
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

exports.requireAuth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Missing token' });
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
