

import api from './api'

// Category APIs
export const getCategories = async (page = 1, limit = 10, search = '') => {
  const response = await api.get(`/categories?page=${page}&limit=${limit}&search=${search}`)
  return response.data
}

export const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`)
  return response.data
}

// Question APIs
export const getQuizQuestions = async (categoryId, limit = 10, difficulty = 'all') => {
  const response = await api.get(`/questions/category/${categoryId}?limit=${limit}&difficulty=${difficulty}`)
  return response.data
}

// Result APIs
export const saveQuizResult = async (resultData) => {
  const response = await api.post('/results', resultData)
  return response.data
}
 

// Get single result by ID
export const getResultById = async (id) => {
  const response = await api.get(`/results/${id}`);
  return response.data;
};

export const getUserResults = async (page = 1, limit = 10, categoryId = '') => {
  const url = `/results/my-results?page=${page}&limit=${limit}${categoryId ? `&categoryId=${categoryId}` : ''}`
  const response = await api.get(url)
  return response.data
}

export const getLeaderboard = async (limit = 10) => {
  const response = await api.get(`/results/leaderboard?limit=${limit}`)
  return response.data
}


