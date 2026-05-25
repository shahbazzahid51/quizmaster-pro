// File: backend/models/Category.js
// Purpose: Category schema for quiz categorization

import mongoose from 'mongoose';

/**
 * Category Schema Definition
 * Defines the structure for quiz categories in MongoDB
 */
const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a category title'],
      unique: true,
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    
    description: {
      type: String,
      required: [true, 'Please add a category description'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    
    image: {
      type: String,
      required: [true, 'Please add an image URL'],
      trim: true,
      // Basic URL validation
      match: [
        /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))$/i,
        'Please provide a valid image URL (PNG, JPG, JPEG, GIF, SVG, WEBP)',
      ],
      default: 'https://via.placeholder.com/300x200?text=Quiz+Category',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

/**
 * Virtual field to count total questions in this category
 * Useful for displaying quiz count on frontend
 */
categorySchema.virtual('totalQuestions', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'categoryId',
  count: true,
});

/**
 * Virtual field to get average score for this category
 * Useful for statistics
 */
categorySchema.virtual('averageScore', {
  ref: 'Result',
  localField: '_id',
  foreignField: 'categoryId',
  options: { sort: { score: -1 } },
});

// Ensure virtual fields are included in JSON output
categorySchema.set('toJSON', { virtuals: true });
categorySchema.set('toObject', { virtuals: true });

/**
 * Pre-save middleware to format title (capitalize first letter of each word)
 */
categorySchema.pre('save', function (next) {
  if (this.isModified('title')) {
    // Capitalize first letter of each word
    this.title = this.title
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
  next();
});

/**
 * Static method to get popular categories (with most quizzes taken)
 * @param {number} limit - Number of categories to return
 */
categorySchema.statics.getPopularCategories = async function (limit = 5) {
  return this.aggregate([
    {
      $lookup: {
        from: 'results',
        localField: '_id',
        foreignField: 'categoryId',
        as: 'attempts',
      },
    },
    {
      $addFields: {
        attemptCount: { $size: '$attempts' },
      },
    },
    {
      $sort: { attemptCount: -1 },
    },
    {
      $limit: limit,
    },
    {
      $project: {
        title: 1,
        description: 1,
        image: 1,
        attemptCount: 1,
        createdAt: 1,
      },
    },
  ]);
};

// Create and export Category model
const Category = mongoose.model('Category', categorySchema);

export default Category;