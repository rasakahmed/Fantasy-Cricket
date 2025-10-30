import express from 'express';
import { register, login, verifyToken } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticateToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import { registerSchema, loginSchema } from '../utils/validators.js';

const router = express.Router();

// Register new user
router.post('/register', authLimiter, validate(registerSchema), register);

// Login user
router.post('/login', authLimiter, validate(loginSchema), login);

// Verify token
router.get('/verify', authenticateToken, verifyToken);

export default router;
