import { useState } from 'react'
import { HiEye, HiEyeOff } from 'react-icons/hi'

const PasswordInput = ({ value, onChange, onBlur, error, touched, disabled, placeholder = 'Enter password' }) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        name="password"
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`
          block w-full pl-3 pr-12 py-3 border rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          transition-all duration-200
          ${touched && error
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
            : 'border-gray-300 dark:border-gray-600'
          }
          bg-white dark:bg-gray-700 text-gray-900 dark:text-white
        `}
        placeholder={placeholder}
        disabled={disabled}
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
  )
}

export default PasswordInput