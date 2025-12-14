// src/app.js
// Configure Express app: CORS, JSON parser, routes.
// Keep CORS restricted in dev; change origin in production.
const express = require('express');
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'https://martensq.github.io'
];

const authRoutes = require('./routes/auth.routes');
const gamesRoutes = require('./routes/games.routes');

const app = express();

// CORS configuration - allow your Vite dev origin.
app.use(cors({
  origin: (origin, cb) => {
    // allow tools like curl/postman (no origin) and same-origin
    if (!origin) return cb(null, true);
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Use built-in JSON parser (express.json replaces body-parser)
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);

// Simple healthcheck
app.get('/', (req, res) => res.json({ ok: true }));

module.exports = app;
