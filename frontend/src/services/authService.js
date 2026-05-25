
import api from './api'

// ✅ REGISTER
export const registerUser = async (data) => {
  const response = await api.post('/auth/register', data)
  return response.data
}

// ✅ LOGIN
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

// ✅ GET USER
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

// ✅ UPDATE PROFILE
export const updateUserProfile = async (userData) => {
  const response = await api.put('/auth/profile', userData)
  return response.data
}
