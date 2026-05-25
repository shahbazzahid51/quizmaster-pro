import { createContext, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { loginUser, registerUser, getCurrentUser } from '../services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const navigate = useNavigate()

  // Load user on mount and token change
  useEffect(() => {
    if (token) {
      loadUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const loadUser = async () => {
    try {
      setLoading(true)
      const response = await getCurrentUser()
      setUser(response.user)
    } catch (error) {
      console.error('Load user error:', error)
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

//   const login = async (email, password) => {
//     try {
//       setLoading(true)
//       const response = await loginUser(email, password)
      
//       if (response.success) {
//         localStorage.setItem('token', response.token)
//         setToken(response.token)
//         setUser(response.user)
//         toast.success(response.message || 'Login successful!')
//         navigate('/dashboard')
//         return { success: true }
//       }
//     } catch (error) {
//       console.error('Login error:', error)
//       toast.error(error.response?.data?.message || 'Login failed')
//       return { success: false, error: error.response?.data?.message }
//     } finally {
//       setLoading(false)
//     }
//   }

const login = async (email, password) => {
  try {
    setLoading(true)
    const response = await loginUser(email, password)

    if (response.success) {
      localStorage.setItem('token', response.token)
      setToken(response.token)
      setUser(response.user)
      toast.success(response.message || 'Login successful!')
      navigate('/dashboard')
      return { success: true }
    } else {
      return { success: false, error: response.message }
    }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed'
    }
  } finally {
    setLoading(false)
  }
}

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await registerUser(userData)
      
      if (response.success) {
        localStorage.setItem('token', response.token)
        setToken(response.token)
        setUser(response.user)
        toast.success(response.message || 'Registration successful!')
        navigate('/dashboard')
        return { success: true }
      }
    } catch (error) {
      console.error('Register error:', error)
      toast.error(error.response?.data?.message || 'Registration failed')
      return { success: false, error: error.response?.data?.message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const value = {
  user,
  loading,
  isAuthenticated: !!user,
  isAdmin: user?.role === 'admin' || user?.user?.role === 'admin',
  login,
  register,
  logout,
}

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}