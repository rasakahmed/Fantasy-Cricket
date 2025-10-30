import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.warn('Invalid token attempt', { error: error.message });
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    logger.warn('Unauthorized admin access attempt', { userId: req.user?.id });
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

export default { authenticateToken, requireAdmin };
