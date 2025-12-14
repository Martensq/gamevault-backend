// src/controllers/games.controller.js
// CRUD for Game entity.
// - listGames supports pagination, filtering by platform/status and search (q).
// - create/update/delete are protected and use whitelist sanitization.

const prisma = require('../prismaClient');

// Allowed fields coming from the client for create/update
const allowedGameFields = ['title', 'platform', 'description', 'status', 'hoursPlayed', 'favorite'];

function sanitizeGameInput(input) {
  const out = {};
  for (const key of allowedGameFields) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      out[key] = input[key];
    }
  }
  return out;
}

// Build a Prisma where object from query params
function buildWhereFromQuery(qs) {
  const where = {};

  // Filter by platform or status if present and not 'all'
  if (qs.platform && qs.platform !== 'all') {
    where.platform = qs.platform;
  }
  if (qs.status && qs.status !== 'all') {
    where.status = qs.status;
  }

  // Full-text-ish search on title OR description (case-insensitive)
  if (qs.q) {
    where.OR = [
      { title: { contains: qs.q, mode: 'insensitive' } },
      { description: { contains: qs.q, mode: 'insensitive' } }
    ];
  }

  return where;
}

exports.listGames = async (req, res) => {
  const userId = req.userId;

  const page = Math.max(1, parseInt(req.query.page || '1', 10));
  const limit = Math.max(1, parseInt(req.query.limit || '8', 10)); // default 8 to match frontend
  const skip = (page - 1) * limit;

  // Base filter: only games owned by the current user
  const where = {
    ownerId: userId,
    ...buildWhereFromQuery({
      platform: req.query.platform,
      status: req.query.status,
      q: req.query.q,
    }),
  };

  try {
    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.game.count({ where })
    ]);

    res.json({ data: games, meta: { total, page, limit } });
  } catch (err) {
    console.error('listGames error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createGame = async (req, res) => {
  const ownerId = req.userId;
  const data = sanitizeGameInput(req.body);

  if (!data.title || !data.title.trim()) {
    return res.status(400).json({ error: 'Title required' });
  }

  if (typeof data.hoursPlayed !== 'undefined') {
    data.hoursPlayed = Number(data.hoursPlayed) || 0;
  }

  if (typeof data.favorite !== 'undefined') {
    data.favorite = Boolean(data.favorite);
  }

  try {
    const game = await prisma.game.create({
      data: { ...data, ownerId }
    });
    return res.status(201).json(game);
  } catch (err) {
    console.error('createGame error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.updateGame = async (req, res) => {
  const gameId = parseInt(req.params.id, 10);
  const userId = req.userId;
  const data = sanitizeGameInput(req.body);

  if (Number.isNaN(gameId)) return res.status(400).json({ error: 'Invalid game id' });

  if (typeof data.hoursPlayed !== 'undefined') {
    data.hoursPlayed = Number(data.hoursPlayed) || 0;
  }
  if (typeof data.favorite !== 'undefined') {
    data.favorite = Boolean(data.favorite);
  }

  try {
    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (!game.ownerId || game.ownerId !== userId) return res.status(403).json({ error: 'Forbidden' });

    const updated = await prisma.game.update({
      where: { id: gameId },
      data
    });
    return res.json(updated);
  } catch (err) {
    console.error('updateGame error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteGame = async (req, res) => {
  const gameId = parseInt(req.params.id, 10);
  const userId = req.userId;

  if (Number.isNaN(gameId)) return res.status(400).json({ error: 'Invalid game id' });

  try {
    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) return res.status(404).json({ error: 'Game not found' });
    if (!game.ownerId || game.ownerId !== userId) return res.status(403).json({ error: 'Forbidden' });

    await prisma.game.delete({ where: { id: gameId } });
    res.status(204).send();
  } catch (err) {
    console.error('deleteGame error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
