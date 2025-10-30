import express from 'express';

const router = express.Router();

router.get('/stats', (req, res) => {
  res.json({ success: true, data: {}, message: 'Meta stats endpoint (to be implemented)' });
});

export default router;
