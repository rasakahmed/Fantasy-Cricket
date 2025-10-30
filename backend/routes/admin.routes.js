import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Placeholder routes - to be implemented
router.get('/gameweeks', (req, res) => {
  res.json({ success: true, data: [], message: 'Admin gameweeks endpoint (to be implemented)' });
});

router.post('/gameweeks', (req, res) => {
  res.json({ success: true, message: 'Create gameweek endpoint (to be implemented)' });
});

router.get('/fixtures', (req, res) => {
  res.json({ success: true, data: [], message: 'Admin fixtures endpoint (to be implemented)' });
});

router.post('/fixtures', (req, res) => {
  res.json({ success: true, message: 'Create fixture endpoint (to be implemented)' });
});

router.post('/player-points', (req, res) => {
  res.json({ success: true, message: 'Add player points endpoint (to be implemented)' });
});

router.post('/player-points/bulk', (req, res) => {
  res.json({ success: true, message: 'Bulk add player points endpoint (to be implemented)' });
});

export default router;
