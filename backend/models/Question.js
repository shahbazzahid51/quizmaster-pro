// File: backend/models/Question.js

import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Please add question text'],
      trim: true,
      minlength: [5, 'Question must be at least 5 characters'],
      maxlength: [500, 'Question cannot exceed 500 characters'],
    },
    
    options: {
      type: [String],
      required: [true, 'Please add options'],
      validate: {
        validator: function(options) {
          return options && options.length === 4;
        },
        message: 'Questions must have exactly 4 options',
      },
    },
    
    correctAnswer: {
      type: String,
      required: [true, 'Please add correct answer'],
      trim: true,
      validate: {
        validator: function(answer) {
          return this.options.includes(answer);
        },
        message: 'Correct answer must match one of the options',
      },
    },
    
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please provide category ID'],
      index: true,
    },
    
    difficulty: {
      type: String,
      required: [true, 'Please add difficulty level'],
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: '{VALUE} is not a valid difficulty level',
      },
      default: 'medium',
    },
    
    explanation: {
      type: String,
      trim: true,
      maxlength: [500, 'Explanation cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
questionSchema.index({ categoryId: 1, difficulty: 1 });

// Instance method to check answer
questionSchema.methods.isAnswerCorrect = function(userAnswer) {
  return this.correctAnswer === userAnswer;
};

// Instance method to get question without answer (for quiz)
questionSchema.methods.getQuizQuestion = function() {
  const obj = this.toObject();
  delete obj.correctAnswer;
  delete obj.explanation;
  return obj;
};

// Static method to get random questions
questionSchema.statics.getRandomQuestions = async function(categoryId, limit = 10, difficulty = null) {
  const matchQuery = { categoryId: new mongoose.Types.ObjectId(categoryId) };
  if (difficulty && difficulty !== 'all') {
    matchQuery.difficulty = difficulty;
  }
  
  const questions = await this.aggregate([
    { $match: matchQuery },
    { $sample: { size: parseInt(limit) } },
    {
      $project: {
        question: 1,
        options: 1,
        difficulty: 1,
        categoryId: 1,
      },
    },
  ]);
  
  return questions;
};

const Question = mongoose.model('Question', questionSchema);
export default Question;