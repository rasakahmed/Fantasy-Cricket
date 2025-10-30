import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  listLeagues,
  getLeagueDetails,
  getLeagueLeaderboard,
  createLeague,
  joinLeague
} from '../controllers/league.controller.js';

const router = express.Router();

// Public routes (no auth required)
router.get('/', listLeagues);

// Protected routes
router.use(authenticateToken);

router.get('/:id', getLeagueDetails);
router.get('/:id/leaderboard', getLeagueLeaderboard);
router.post('/', createLeague);
router.post('/:id/join', joinLeague);

export default router;
