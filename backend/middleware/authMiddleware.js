// File: backend/middleware/authMiddleware.js
// Purpose: Protect routes by verifying JWT token

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to protect routes (authentication required)
 * Verifies JWT token from Authorization header
 */
export const protect = async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (format: "Bearer TOKEN")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database (exclude password)
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found, authorization denied',
        });
      }

      // Attach user to request object
      req.user = {
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
};

console.log('AUTH USER:', req.user);

next();
    } catch (error) {
      console.error('Auth middleware error:', error);

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token, authorization denied',
        });
      }

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired, please login again',
        });
      }

      res.status(401).json({
        success: false,
        message: 'Not authorized, token failed',
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

/**
 * Middleware to check if user is admin
 * Must be used AFTER protect middleware
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied: Admin only resource',
    });
  }
};

/**
 * Optional: Middleware to check specific roles
 * @param  {...string} roles - Allowed roles
 */
export const requireRoles = (...roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: `Access denied: Requires one of these roles: ${roles.join(', ')}`,
      });
    }
  };
};