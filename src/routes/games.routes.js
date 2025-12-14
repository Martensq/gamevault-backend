// src/routes/games.routes.js
const express = require('express');
const { listGames, createGame, updateGame, deleteGame } = require('../controllers/games.controller');
const { requireAuth } = require('../middlewares/auth.middleware');
const router = express.Router();

// Protected: list/create/update/delete require authentication
router.get('/', requireAuth, listGames);
router.post('/', requireAuth, createGame);
router.put('/:id', requireAuth, updateGame);
router.delete('/:id', requireAuth, deleteGame);

module.exports = router;
