
import express from 'express';

import {
  saveResult,
  getAllResults,
  getUserResults,
  getResultById,
  deleteResult,
  getLeaderboard,
  getCategoryStats,
} from '../controllers/resultController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/leaderboard', getLeaderboard);

// Protected routes
router.post('/', protect, saveResult);
router.get('/my-results', protect, getUserResults);

// Admin routes
router.get('/stats/category/:categoryId', protect, admin, getCategoryStats);
router.get('/', protect, admin, getAllResults);

// Single result route
router.get('/:id', protect, getResultById);

// Delete result
router.delete('/:id', protect, admin, deleteResult);

export default router;