// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Format time (seconds to MM:SS)
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Get performance badge color
export const getPerformanceColor = (percentage) => {
  if (percentage >= 80) return 'text-green-600 bg-green-100'
  if (percentage >= 60) return 'text-blue-600 bg-blue-100'
  if (percentage >= 40) return 'text-yellow-600 bg-yellow-100'
  return 'text-red-600 bg-red-100'
}

// Get performance label
export const getPerformanceLabel = (percentage) => {
  if (percentage >= 80) return 'Excellent'
  if (percentage >= 60) return 'Good'
  if (percentage >= 40) return 'Average'
  return 'Poor'
}

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Validate email
export const isValidEmail = (email) => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return regex.test(email)
}

// Save to localStorage with expiry
export const setWithExpiry = (key, value, ttl) => {
  const now = new Date()
  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  }
  localStorage.setItem(key, JSON.stringify(item))
}

// Get from localStorage with expiry check
export const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key)
  if (!itemStr) return null
  
  const item = JSON.parse(itemStr)
  const now = new Date()
  
  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key)
    return null
  }
  
  return item.value
}

// Scroll to top
export const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Debounce function
export const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}