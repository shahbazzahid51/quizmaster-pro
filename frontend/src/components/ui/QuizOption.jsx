import { HiCheckCircle } from 'react-icons/hi'

const QuizOption = ({ option, index, isSelected, onSelect, disabled }) => {
  const optionLetter = String.fromCharCode(65 + index)

  return (
    <button
      onClick={() => onSelect(option)}
      disabled={disabled}
      className={`
        w-full text-left p-4 rounded-xl border-2 transition-all duration-200
        ${isSelected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
        }
        ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className={`
          flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold
          ${isSelected
            ? 'bg-primary-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
          }
        `}>
          {optionLetter}
        </div>
        <span className="flex-1 text-gray-700 dark:text-gray-300">
          {option}
        </span>
        {isSelected && (
          <HiCheckCircle className="w-5 h-5 text-primary-500 flex-shrink-0" />
        )}
      </div>
    </button>
  )
}

export default QuizOption