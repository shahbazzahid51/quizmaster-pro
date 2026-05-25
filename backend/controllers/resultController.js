// File: backend/controllers/resultController.js
// Purpose: Handle result CRUD operations
import mongoose from 'mongoose';
import Result from '../models/Result.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Question from '../models/Question.js';

/**
 * @desc    Save quiz result
 * @route   POST /api/results
 * @access  Private
 */
export const saveResult = async (req, res) => {
  try {
    const { 
      categoryId, 
      answers, 
      timeSpent,
      calculateScore = true 
    } = req.body;

    // Validation
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category ID',
      });
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide answers array',
      });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Get all questions for this category to verify answers
    const questions = await Question.find({ categoryId });
    
    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No questions found for this category',
      });
    }

    // Calculate score based on answers
    let correctCount = 0;
    const processedAnswers = [];

    for (const answer of answers) {
      const question = questions.find(
        q => q._id.toString() === answer.questionId
      );

      if (!question) {
        return res.status(400).json({
          success: false,
          message: `Question not found: ${answer.questionId}`,
        });
      }

      const isCorrect = question.isAnswerCorrect(answer.userAnswer);
      if (isCorrect) correctCount++;

      processedAnswers.push({
        questionId: answer.questionId,
        userAnswer: answer.userAnswer,
        isCorrect,
      });
    }

    // Calculate percentage
    const totalQuestions = questions.length;
    const score = calculateScore ? correctCount : req.body.score || correctCount;
    const percentage = (score / totalQuestions) * 100;

    // Create result
    const result = await Result.create({
      userId: req.user.id,
      categoryId,
      score,
      totalQuestions,
      percentage,
      answers: processedAnswers,
      timeSpent: timeSpent || 0,
      completedAt: new Date(),
    });

    // Populate user and category details
    const populatedResult = await Result.findById(result._id)
      .populate('userId', 'name email')
      .populate('categoryId', 'title description');

    res.status(201).json({
      success: true,
      message: 'Result saved successfully',
      result: {
        ...populatedResult.toObject(),
        summary: populatedResult.getSummary(),
      },
    });
  } catch (error) {
    console.error('Save result error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while saving result',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get all results (admin only)
 * @route   GET /api/results
 * @access  Private/Admin
 */
export const getAllResults = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      userId, 
      categoryId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter query
    const query = {};
    if (userId) query.userId = userId;
    if (categoryId) query.categoryId = categoryId;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get total count for pagination
    const total = await Result.countDocuments(query);
    
    // Get results with pagination
    const results = await Result.find(query)
      .populate('userId', 'name email role')
      .populate('categoryId', 'title description')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Add summary to each result
    const resultsWithSummary = results.map(result => ({
      ...result.toObject(),
      summary: result.getSummary(),
    }));

    res.status(200).json({
      success: true,
      count: results.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      results: resultsWithSummary,
    });
  } catch (error) {
    console.error('Get all results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching results',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get logged-in user's results
 * @route   GET /api/results/my-results
 * @access  Private
 */
export const getUserResults = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      categoryId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter query
    const query = { userId: req.user.id };
    if (categoryId) query.categoryId = categoryId;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get total count for pagination
    const total = await Result.countDocuments(query);
    
    // Get results with pagination
    const results = await Result.find(query)
      .populate('categoryId', 'title description image')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Add summary to each result
    const resultsWithSummary = results.map(result => ({
      ...result.toObject(),
      summary: result.getSummary(),
    }));

    // Get user statistics
    const stats = await Result.getUserStats(req.user.id);
    const categoryPerformance = await Result.getCategoryPerformance(req.user.id);

    res.status(200).json({
      success: true,
      count: results.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      stats,
      categoryPerformance,
      results: resultsWithSummary,
    });
  } catch (error) {
    console.error('Get user results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user results',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get single result by ID
 * @route   GET /api/results/:id
 * @access  Private (owner or admin)
 */
export const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('categoryId', 'title description')
      .populate('answers.questionId', 'question options correctAnswer');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found',
      });
    }

    // Check if user is authorized (owner or admin)

const resultUserId = result.userId?._id || result.userId;
const loggedInUserId = req.user?._id || req.user?.id;

const isOwner = resultUserId.toString() === loggedInUserId.toString();
const isAdmin = req.user.role === 'admin';

if (!isOwner && !isAdmin) {
  return res.status(403).json({
    success: false,
    message: 'Access denied. You can only view your own results.',
  });
}

    // For non-admin users, remove correct answers from review
    const resultData = result.toObject();
    if (!isAdmin) {
      resultData.answers = resultData.answers.map(answer => ({
        questionId: answer.questionId._id,
        question: answer.questionId.question,
        options: answer.questionId.options,
        userAnswer: answer.userAnswer,
        isCorrect: answer.isCorrect,
        // Don't include correctAnswer for non-admin
      }));
    }

    res.status(200).json({
      success: true,
      result: {
        ...resultData,
        summary: result.getSummary(),
      },
    });
  } catch (error) {
    console.error('Get result error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid result ID format',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching result',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Delete result (admin only)
 * @route   DELETE /api/results/:id
 * @access  Private/Admin
 */
export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found',
      });
    }

    await result.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Result deleted successfully',
    });
  } catch (error) {
    console.error('Delete result error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid result ID format',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting result',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get leaderboard
 * @route   GET /api/results/leaderboard
 * @access  Public
 */
export const getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await Result.getLeaderboard(limit);

    res.status(200).json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching leaderboard',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get category statistics (admin)
 * @route   GET /api/results/stats/category/:categoryId
 * @access  Private/Admin
 */
export const getCategoryStats = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    const stats = await Result.aggregate([
      { $match: { categoryId: mongoose.Types.ObjectId(categoryId) } },
      {
        $group: {
          _id: null,
          totalAttempts: { $sum: 1 },
          averageScore: { $avg: '$score' },
          averagePercentage: { $avg: '$percentage' },
          highestScore: { $max: '$score' },
          lowestScore: { $min: '$score' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || {
        totalAttempts: 0,
        averageScore: 0,
        averagePercentage: 0,
        highestScore: 0,
        lowestScore: 0,
      },
    });
  } catch (error) {
    console.error('Get category stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
