import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', (req, res) => {
  res.json({ success: true, data: [], message: 'List leagues endpoint (to be implemented)' });
});

router.get('/:id/leaderboard', (req, res) => {
  res.json({ success: true, data: [], message: 'League leaderboard endpoint (to be implemented)' });
});

export default router;
