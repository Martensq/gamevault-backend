// src/app.js
// Configure Express app: CORS, JSON parser, routes.
// Keep CORS restricted in dev; change origin in production.
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const gamesRoutes = require('./routes/games.routes');

const app = express();

// CORS configuration - allow your Vite dev origin.
// If you host front on another domain, change this.
// In dev you can also use app.use(cors()) to allow all origins.
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Use built-in JSON parser (express.json replaces body-parser)
app.use(express.json());

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);

// Simple healthcheck
app.get('/', (req, res) => res.json({ ok: true }));

module.exports = app;
