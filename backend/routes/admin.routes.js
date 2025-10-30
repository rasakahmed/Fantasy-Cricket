import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import {
  listGameweeks,
  createGameweek,
  updateGameweek,
  deleteGameweek,
  listFixtures,
  createFixture,
  updateFixture,
  addPlayerPoints,
  bulkAddPlayerPoints
} from '../controllers/admin.controller.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Gameweek routes
router.get('/gameweeks', listGameweeks);
router.post('/gameweeks', createGameweek);
router.patch('/gameweeks/:id', updateGameweek);
router.delete('/gameweeks/:id', deleteGameweek);

// Fixture routes
router.get('/fixtures', listFixtures);
router.post('/fixtures', createFixture);
router.patch('/fixtures/:id', updateFixture);

// Player points routes
router.post('/player-points', addPlayerPoints);
router.post('/player-points/bulk', bulkAddPlayerPoints);

export default router;
