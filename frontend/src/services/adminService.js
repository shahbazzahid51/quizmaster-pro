import api from './api';

// ============ Category APIs ============

export const getCategories = async (page = 1, limit = 100, search = '') => {
  const response = await api.get(`/categories?page=${page}&limit=${limit}&search=${search}`);
  return response.data;
};

export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await api.post('/categories', categoryData);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

// ============ Question APIs ============

export const getAllQuestions = async (params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.categoryId) queryParams.append('categoryId', params.categoryId);
  if (params.difficulty) queryParams.append('difficulty', params.difficulty);
  if (params.search) queryParams.append('search', params.search);
  
  const response = await api.get(`/questions?${queryParams.toString()}`);
  return response.data;
};

export const getQuestionsByCategory = async (categoryId, limit = 10, difficulty = 'all') => {
  const response = await api.get(`/questions/category/${categoryId}?limit=${limit}&difficulty=${difficulty}`);
  return response.data;
};

export const getQuestionById = async (id) => {
  const response = await api.get(`/questions/${id}`);
  return response.data;
};

export const createQuestion = async (questionData) => {
  const response = await api.post('/questions', questionData);
  return response.data;
};

export const updateQuestion = async (id, questionData) => {
  const response = await api.put(`/questions/${id}`, questionData);
  return response.data;
};

export const deleteQuestion = async (id) => {
  const response = await api.delete(`/questions/${id}`);
  return response.data;
};