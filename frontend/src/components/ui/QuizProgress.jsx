import { HiClock, HiFlag } from 'react-icons/hi'

const QuizProgress = ({ current, total, answered, timeSpent, formatTime }) => {
  const progress = (current / total) * 100

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quiz
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Test your knowledge
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
            <HiClock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span className="font-mono font-semibold text-gray-900 dark:text-white">
              {formatTime(timeSpent)}
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
            <HiFlag className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span className="font-semibold text-gray-900 dark:text-white">
              {answered}/{total}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Question {current} of {total}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default QuizProgress