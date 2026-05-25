// File: backend/models/Result.js
// Purpose: Result schema for storing quiz attempts and scores

import mongoose from 'mongoose';

/**
 * Result Schema Definition
 * Stores user quiz attempts, scores, and performance metrics
 */
const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user ID'],
      index: true, // Index for faster user-specific queries
    },
    
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide category ID'],
      index: true, // Index for category-based queries
    },
    
    score: {
      type: Number,
      required: [true, 'Please provide score'],
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100'],
      validate: {
        validator: function(value) {
          return value >= 0 && value <= this.totalQuestions;
        },
        message: 'Score cannot be greater than total questions',
      },
    },
    
    totalQuestions: {
      type: Number,
      required: [true, 'Please provide total questions'],
      min: [1, 'Total questions must be at least 1'],
      validate: {
        validator: function(value) {
          return value >= 1;
        },
        message: 'Total questions must be at least 1',
      },
    },
    
    percentage: {
      type: Number,
      required: [true, 'Percentage is required'],
      min: [0, 'Percentage cannot be negative'],
      max: [100, 'Percentage cannot exceed 100'],
      validate: {
        validator: function(value) {
          return value >= 0 && value <= 100;
        },
        message: 'Percentage must be between 0 and 100',
      },
    },
    
    answers: {
      type: [
        {
          questionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question',
            required: true,
          },
          userAnswer: {
            type: String,
            required: true,
            trim: true,
          },
          isCorrect: {
            type: Boolean,
            required: true,
          },
        },
      ],
      validate: {
        validator: function(answers) {
          return answers && answers.length > 0;
        },
        message: 'At least one answer is required',
      },
    },
    
    timeSpent: {
      type: Number, // Time in seconds
      required: [true, 'Please provide time spent'],
      min: [0, 'Time spent cannot be negative'],
      default: 0,
    },
    
    completedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Compound index for efficient queries
resultSchema.index({ userId: 1, createdAt: -1 });
resultSchema.index({ categoryId: 1, score: -1 });
resultSchema.index({ userId: 1, categoryId: 1, createdAt: -1 });

/**
 * Virtual field to get user details
 * Populates user information when needed
 */
resultSchema.virtual('userDetails', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

/**
 * Virtual field to get category details
 */
resultSchema.virtual('categoryDetails', {
  ref: 'Category',
  localField: 'categoryId',
  foreignField: '_id',
  justOne: true,
});

// Ensure virtuals are included in JSON output
resultSchema.set('toJSON', { virtuals: true });
resultSchema.set('toObject', { virtuals: true });

/**
 * Pre-save middleware to calculate percentage automatically
 */
resultSchema.pre('save', function(next) {
  if (this.isModified('score') || this.isModified('totalQuestions')) {
    this.percentage = (this.score / this.totalQuestions) * 100;
  }
  next();
});

/**
 * Instance method to get performance level
 * @returns {string} - Performance level (Excellent/Good/Average/Poor)
 */
resultSchema.methods.getPerformanceLevel = function() {
  if (this.percentage >= 80) return 'Excellent';
  if (this.percentage >= 60) return 'Good';
  if (this.percentage >= 40) return 'Average';
  return 'Poor';
};

/**
 * Instance method to get detailed result summary
 * @returns {Object} - Formatted result summary
 */
resultSchema.methods.getSummary = function() {
  const correctAnswers = this.answers.filter(a => a.isCorrect).length;
  const wrongAnswers = this.answers.filter(a => !a.isCorrect).length;
  
  return {
    totalQuestions: this.totalQuestions,
    correctAnswers,
    wrongAnswers,
    score: this.score,
    percentage: this.percentage.toFixed(2),
    performance: this.getPerformanceLevel(),
    timeSpent: this.timeSpent,
    completedAt: this.completedAt,
  };
};

/**
 * Static method to get user statistics
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User statistics
 */
resultSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
  { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalQuizzes: { $sum: 1 },
        averageScore: { $avg: '$score' },
        averagePercentage: { $avg: '$percentage' },
        bestScore: { $max: '$score' },
        totalTimeSpent: { $sum: '$timeSpent' },
      },
    },
  ]);
  
  if (stats.length === 0) {
    return {
      totalQuizzes: 0,
      averageScore: 0,
      averagePercentage: 0,
      bestScore: 0,
      totalTimeSpent: 0,
    };
  }
  
  return stats[0];
};

/**
 * Static method to get category-wise performance
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Category performance data
 */
resultSchema.statics.getCategoryPerformance = async function(userId) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$categoryId',
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: '$score' },
        bestScore: { $max: '$score' },
        averagePercentage: { $avg: '$percentage' },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'category',
      },
    },
    { $unwind: '$category' },
    {
      $project: {
        categoryId: '$_id',
        categoryTitle: '$category.title',
        totalAttempts: 1,
        averageScore: { $round: ['$averageScore', 2] },
        bestScore: 1,
        averagePercentage: { $round: ['$averagePercentage', 2] },
      },
    },
    { $sort: { averagePercentage: -1 } },
  ]);
};

/**
 * Static method to get leaderboard (top scores)
 * @param {number} limit - Number of top users
 * @returns {Promise<Array>} - Leaderboard data
 */
resultSchema.statics.getLeaderboard = async function(limit = 10) {
  return this.aggregate([
    {
      $group: {
        _id: '$userId',
        averageScore: { $avg: '$score' },
        averagePercentage: { $avg: '$percentage' },
        totalQuizzes: { $sum: 1 },
        bestScore: { $max: '$score' },
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        userId: '$_id',
        userName: '$user.name',
        userEmail: '$user.email',
        averageScore: { $round: ['$averageScore', 2] },
        averagePercentage: { $round: ['$averagePercentage', 2] },
        totalQuizzes: 1,
        bestScore: 1,
      },
    },
    { $sort: { averagePercentage: -1 } },
    { $limit: limit },
  ]);
};

// Create and export Result model
const Result = mongoose.model('Result', resultSchema);

export default Result;