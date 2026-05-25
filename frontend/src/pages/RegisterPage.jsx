import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  HiUser, 
  HiMail, 
  HiLockClosed, 
  HiEye, 
  HiEyeOff, 
  HiArrowRight,
  HiCheckCircle,
  HiExclamationCircle
} from 'react-icons/hi'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { register, isAuthenticated } = useAuth()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: '',
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  // Validate form on change
  useEffect(() => {
    validateForm()
  }, [formData])

  // Check password strength
  useEffect(() => {
    checkPasswordStrength(formData.password)
  }, [formData.password])

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength({ score: 0, message: '', color: '' })
      return
    }

    let score = 0
    let message = ''
    let color = ''

    // Length check
    if (password.length >= 6) score++
    if (password.length >= 8) score++
    
    // Character variety checks
    if (/[a-z]/.test(password)) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    // Determine strength
    if (score <= 2) {
      message = 'Weak password'
      color = 'text-red-500'
    } else if (score <= 4) {
      message = 'Fair password'
      color = 'text-yellow-500'
    } else if (score <= 6) {
      message = 'Good password'
      color = 'text-blue-500'
    } else {
      message = 'Strong password'
      color = 'text-green-500'
    }

    setPasswordStrength({ score, message, color })
  }

  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (!formData.name) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name cannot exceed 50 characters'
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters and spaces'
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    } else if (formData.email.length > 100) {
      newErrors.email = 'Email cannot exceed 100 characters'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    } else if (formData.password.length > 50) {
      newErrors.password = 'Password cannot exceed 50 characters'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    })
    
    // Validate form
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      }
      
      const result = await register(userData)
      
      if (result.success) {
        toast.success('Account created successfully! Welcome aboard! 🎉')
        // Redirect happens automatically in AuthContext
      } else {
        // Error is already shown in AuthContext
        console.error('Registration failed:', result.error)
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getFieldError = (fieldName) => {
    return touched[fieldName] && errors[fieldName]
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Brand Section */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <span className="text-white font-bold text-3xl">Q</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join QuizMaster Pro and start your quiz journey
          </p>
        </div>

        {/* Register Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-300 hover:shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`
                    block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    transition-all duration-200
                    ${getFieldError('name')
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                    }
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  `}
                  placeholder="John Doe"
                  disabled={isSubmitting}
                />
              </div>
              {getFieldError('name') && (
                <div className="mt-2 flex items-center space-x-1">
                  <HiExclamationCircle className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.name}
                  </p>
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`
                    block w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    transition-all duration-200
                    ${getFieldError('email')
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                    }
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  `}
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                />
              </div>
              {getFieldError('email') && (
                <div className="mt-2 flex items-center space-x-1">
                  <HiExclamationCircle className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.email}
                  </p>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`
                    block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    transition-all duration-200
                    ${getFieldError('password')
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-600'
                    }
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  `}
                  placeholder="Create a strong password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                  ) : (
                    <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            passwordStrength.score <= 2 ? 'w-1/3 bg-red-500' :
                            passwordStrength.score <= 4 ? 'w-2/3 bg-yellow-500' :
                            passwordStrength.score <= 6 ? 'w-full bg-blue-500' :
                            'w-full bg-green-500'
                          }`}
                        />
                      </div>
                    </div>
                    <p className={`text-xs ${passwordStrength.color}`}>
                      {passwordStrength.message}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Use 6+ characters with letters, numbers & symbols
                  </p>
                </div>
              )}
              
              {getFieldError('password') && (
                <div className="mt-2 flex items-center space-x-1">
                  <HiExclamationCircle className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.password}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`
                    block w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                    transition-all duration-200
                    ${getFieldError('confirmPassword')
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : formData.confirmPassword && formData.password === formData.confirmPassword && formData.confirmPassword !== ''
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }
                    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  `}
                  placeholder="Confirm your password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                  ) : (
                    <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                  )}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
                <div className="mt-2 flex items-center space-x-1">
                  <HiCheckCircle className="h-4 w-4 text-green-500" />
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Passwords match
                  </p>
                </div>
              )}
              
              {getFieldError('confirmPassword') && (
                <div className="mt-2 flex items-center space-x-1">
                  <HiExclamationCircle className="h-4 w-4 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.confirmPassword}
                  </p>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="terms" className="text-sm text-gray-700 dark:text-gray-300">
                  I agree to the{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full flex items-center justify-center px-4 py-3
                bg-gradient-to-r from-primary-600 to-primary-700
                hover:from-primary-700 hover:to-primary-800
                text-white font-semibold rounded-lg
                transition-all duration-200 transform hover:scale-[1.02]
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
              "
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <HiArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="text-xs text-gray-500 dark:text-gray-500">
            <div className="w-8 h-8 mx-auto mb-2 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <HiCheckCircle className="h-4 w-4 text-primary-600" />
            </div>
            Free access
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            <div className="w-8 h-8 mx-auto mb-2 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <HiCheckCircle className="h-4 w-4 text-primary-600" />
            </div>
            Track progress
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500">
            <div className="w-8 h-8 mx-auto mb-2 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <HiCheckCircle className="h-4 w-4 text-primary-600" />
            </div>
            Leaderboards
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage