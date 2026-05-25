import express from 'express';
import {
  createQuestion,
  getAllQuestions,
  getQuestionsByCategory,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from '../controllers/questionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
//router.get('/category/:categoryId', getQuestionsByCategory);
// Public routes
router.get('/category/:categoryId', getQuestionsByCategory);
router.get('/quiz/:categoryId', getQuestionsByCategory); // ✅ ADD THIS LINE

// Admin only routes
router.route('/')
  .post(protect, admin, createQuestion)
  .get(protect, admin, getAllQuestions);

router.route('/:id')
  .get(protect, admin, getQuestionById)
  .put(protect, admin, updateQuestion)
  .delete(protect, admin, deleteQuestion);

export default router;