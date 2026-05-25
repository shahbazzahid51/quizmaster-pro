
import mongoose from 'mongoose';
import Question from '../models/Question.js';
import Category from '../models/Category.js';

// @desc    Create new question
// @route   POST /api/questions
// @access  Private/Admin
export const createQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer, categoryId, difficulty, explanation } = req.body;

    // Validation
    if (!question || !options || !correctAnswer || !categoryId || !difficulty) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
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

    // Validate options array
    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({
        success: false,
        message: 'Options must be an array of exactly 4 items',
      });
    }

    // Validate correctAnswer is in options
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({
        success: false,
        message: 'Correct answer must be one of the options',
      });
    }

    const newQuestion = await Question.create({
      question: question.trim(),
      options,
      correctAnswer,
      categoryId,
      difficulty,
      explanation: explanation || '',
    });

    const populatedQuestion = await Question.findById(newQuestion._id).populate('categoryId', 'title');

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      question: populatedQuestion,
    });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating question',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Get all questions
// @route   GET /api/questions
// @access  Private/Admin
export const getAllQuestions = async (req, res) => {
  try {
    const { page = 1, limit = 20, categoryId, difficulty } = req.query;
    
    const query = {};
    if (categoryId) query.categoryId = categoryId;
    if (difficulty) query.difficulty = difficulty;
    
    const total = await Question.countDocuments(query);
    
    const questions = await Question.find(query)
      .populate('categoryId', 'title')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    res.status(200).json({
      success: true,
      count: questions.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      questions,
    });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching questions',
    });
  }
};

// @desc    Get questions by category
// @route   GET /api/questions/category/:categoryId
// @access  Public
export const getQuestionsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { limit = 10, difficulty = 'all' } = req.query;

    let query = {
      categoryId: new mongoose.Types.ObjectId(categoryId)
    };

    if (difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    const questions = await Question.find(query).limit(Number(limit));

    if (!questions.length) {
      return res.status(404).json({
        success: false,
        message: "No questions found",
      });
    }

    res.status(200).json({
      success: true,
      totalQuestions: questions.length,
      questions,
    });

  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Private/Admin
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id).populate('categoryId', 'title');
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }
    
    res.status(200).json({
      success: true,
      question,
    });
  } catch (error) {
    console.error('Get question error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID format',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while fetching question',
    });
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private/Admin
export const updateQuestion = async (req, res) => {
  try {
    const { question, options, correctAnswer, categoryId, difficulty, explanation } = req.body;
    
    const existingQuestion = await Question.findById(req.params.id);
    if (!existingQuestion) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }
    
    // Validate options if provided
    if (options) {
      if (!Array.isArray(options) || options.length !== 4) {
        return res.status(400).json({
          success: false,
          message: 'Options must be an array of exactly 4 items',
        });
      }
      existingQuestion.options = options;
    }
    
    // Validate correctAnswer if provided
    const currentOptions = options || existingQuestion.options;
    if (correctAnswer && !currentOptions.includes(correctAnswer)) {
      return res.status(400).json({
        success: false,
        message: 'Correct answer must be one of the options',
      });
    }
    
    // Check category if being updated
    if (categoryId && categoryId !== existingQuestion.categoryId.toString()) {
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }
      existingQuestion.categoryId = categoryId;
    }
    
    // Update fields
    if (question) existingQuestion.question = question.trim();
    if (correctAnswer) existingQuestion.correctAnswer = correctAnswer;
    if (difficulty) existingQuestion.difficulty = difficulty;
    if (explanation !== undefined) existingQuestion.explanation = explanation;
    
    await existingQuestion.save();
    
    const updatedQuestion = await Question.findById(req.params.id).populate('categoryId', 'title');
    
    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      question: updatedQuestion,
    });
  } catch (error) {
    console.error('Update question error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID format',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating question',
    });
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }
    
    await question.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error) {
    console.error('Delete question error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid question ID format',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while deleting question',
    });
  }
};