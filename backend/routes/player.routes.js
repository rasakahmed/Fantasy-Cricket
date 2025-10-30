import express from 'express';
import {
  listPlayers,
  getPlayerDetails,
  getPlayerStats
} from '../controllers/player.controller.js';

const router = express.Router();

router.get('/', listPlayers);
router.get('/:id', getPlayerDetails);
router.get('/:id/stats', getPlayerStats);

export default router;
