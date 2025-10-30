import express from 'express';
import {
  listFixtures,
  getFixtureDetails
} from '../controllers/fixture.controller.js';

const router = express.Router();

router.get('/', listFixtures);
router.get('/:id', getFixtureDetails);

export default router;
