import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ success: true, data: [], message: 'List players endpoint (to be implemented)' });
});

export default router;
