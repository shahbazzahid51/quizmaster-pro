


import Category from '../models/Category.js';
import Question from '../models/Question.js';

/**
 * @desc    Create a new category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
export const createCategory = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    // Validation - Check required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title and description',
      });
    }

    // Check if category already exists
    const categoryExists = await Category.findOne({ title: title.trim() });
    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Category with this title already exists',
      });
    }

    // Create category
    const category = await Category.create({
      title: title.trim(),
      description: description.trim(),
      image: image || 'https://via.placeholder.com/300x200?text=Quiz+Category',
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get all categories
 * @route   GET /api/categories
 * @access  Public
 */
export const getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    // Build search query
    const query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Get total count for pagination
    const total = await Category.countDocuments(query);
    
    // Get categories with pagination
    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Populate virtual fields (totalQuestions for each category)
    const categoriesWithStats = await Promise.all(
      categories.map(async (category) => {
        const categoryObj = category.toObject();
        const questionCount = await Question.countDocuments({ 
          categoryId: category._id 
        });
        categoryObj.totalQuestions = questionCount;
        return categoryObj;
      })
    );

    res.status(200).json({
      success: true,
      count: categories.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      categories: categoriesWithStats,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get single category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Get total questions in this category
    const totalQuestions = await Question.countDocuments({ 
      categoryId: category._id 
    });

    const categoryData = category.toObject();
    categoryData.totalQuestions = totalQuestions;

    res.status(200).json({
      success: true,
      category: categoryData,
    });
  } catch (error) {
    console.error('Get category error:', error);
    
    // Handle invalid ObjectId
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = async (req, res) => {
  try {
    const { title, description, image } = req.body;
    
    // Find category
    let category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if title is taken by another category
    if (title && title !== category.title) {
      const titleExists = await Category.findOne({ 
        title: title.trim(), 
        _id: { $ne: req.params.id } 
      });
      
      if (titleExists) {
        return res.status(400).json({
          success: false,
          message: 'Category with this title already exists',
        });
      }
    }

    // Update fields
    category.title = title?.trim() || category.title;
    category.description = description?.trim() || category.description;
    category.image = image || category.image;

    // Save updated category
    const updatedCategory = await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category: updatedCategory,
    });
  } catch (error) {
    console.error('Update category error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while updating category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if there are questions in this category
    const questionsCount = await Question.countDocuments({ 
      categoryId: category._id 
    });
    
    if (questionsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${questionsCount} questions. Delete or reassign questions first.`,
      });
    }

    // Delete category
    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid category ID format',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error while deleting category',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * @desc    Get popular categories (based on quiz attempts)
 * @route   GET /api/categories/popular
 * @access  Public
 */
export const getPopularCategories = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const popularCategories = await Category.getPopularCategories(limit);
    
    res.status(200).json({
      success: true,
      categories: popularCategories,
    });
  } catch (error) {
    console.error('Get popular categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching popular categories',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};