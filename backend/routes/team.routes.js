import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', (req, res) => {
  res.json({ success: true, data: [], message: 'List fantasy teams endpoint (to be implemented)' });
});

export default router;
