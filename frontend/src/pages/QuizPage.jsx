import { useState, useEffect, useCallback } from 'react'
import CountdownTimer from '../components/ui/CountdownTimer'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getQuizQuestions, saveQuizResult } from '../services/quizService'
import { HiChevronLeft, HiChevronRight, HiCheckCircle, HiXCircle, HiClock, HiFlag } from 'react-icons/hi'
import toast from 'react-hot-toast'

const QuizPage = () => {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  
  const [questions, setQuestions] = useState([])
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [categoryInfo, setCategoryInfo] = useState(null)

  // Load questions on mount
  useEffect(() => {
    loadQuestions()
  }, [categoryId])

  // Timer for quiz duration
  useEffect(() => {
    let interval
    if (quizStarted && !loading && questions.length > 0 && currentQuestionIndex < questions.length) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [quizStarted, loading, questions.length, currentQuestionIndex])

  const loadQuestions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getQuizQuestions(categoryId, 10, 'all')
      
      if (response.success && response.questions) {
        setQuestions(response.questions)
        setCategoryInfo(response.category)
        setQuizStarted(true)
        toast.success(`Quiz started! ${response.questions.length} questions loaded`)
      } else {
        throw new Error('Failed to load questions')
      }
    } catch (err) {
      console.error('Error loading questions:', err)
      setError(err.response?.data?.message || 'Failed to load quiz questions. Please try again.')
      toast.error('Failed to load quiz questions')
    } finally {
      setLoading(false)
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const selectedAnswer = userAnswers[currentQuestion?._id]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const answeredCount = Object.keys(userAnswers).length
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleAnswerSelect = (questionId, answer) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

const handleNext = () => {
  if (currentQuestionIndex < questions.length - 1) {
    setCurrentQuestionIndex(prev => prev + 1);
    setTimerResetKey(prev => prev + 1); // 🔥 RESET TIMER
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

  const handlePrevious = () => {
  if (currentQuestionIndex > 0) {
    setCurrentQuestionIndex(prev => prev - 1);
    setTimerResetKey(prev => prev + 1); // 🔥 RESET TIMER
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

  const handleSubmit = async () => {
    // Check if all questions are answered
    if (answeredCount < questions.length) {
      const remaining = questions.length - answeredCount
      toast.error(`Please answer all ${questions.length} questions. ${remaining} question(s) remaining.`)
      return
    }

    if (!isAuthenticated) {
      toast.error('Please login to save your quiz results')
      navigate('/login', { state: { from: `/quiz/${categoryId}` } })
      return
    }

    try {
      setSubmitting(true)
      
      // Prepare answers for API
      const answers = Object.entries(userAnswers).map(([questionId, userAnswer]) => ({
        questionId,
        userAnswer
      }))

      const resultData = {
        categoryId,
        answers,
        timeSpent
      }

      const response = await saveQuizResult(resultData)
      
      if (response.success) {
        toast.success('Quiz completed! View your results.')
        navigate(`/result/${response.result._id}`)
      } else {
        throw new Error('Failed to save results')
      }
    } catch (err) {
      console.error('Error submitting quiz:', err)
      toast.error(err.response?.data?.message || 'Failed to submit quiz. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="container-custom py-12">
          <div className="max-w-3xl mx-auto">
            {/* Loading Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-3/4 mx-auto mb-6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8">
              <HiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Failed to Load Quiz
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <button
                onClick={loadQuestions}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // No Questions State
  if (!questions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-8">
              <HiFlag className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No Questions Available
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This category doesn't have any questions yet.
              </p>
              <button
                onClick={() => navigate('/categories')}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200"
              >
                Browse Other Categories
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container-custom py-8 md:py-12">
      <CountdownTimer
  initialTime={60}
  onComplete={handleSubmit}
  resetKey={timerResetKey}
/>
        {/* Quiz Header */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {categoryInfo?.title || 'Quiz'}
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
                    {answeredCount}/{questions.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
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
        </div>

        {/* Question Card */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Question Content */}
            <div className="p-6 md:p-8">
              {/* Question Number Badge */}
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
                Question {currentQuestionIndex + 1}
              </div>

              {/* Question Text */}
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-8 leading-relaxed">
                {currentQuestion?.question}
              </h2>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {currentQuestion?.options.map((option, index) => {
                  const optionLetter = String.fromCharCode(65 + index) // A, B, C, D
                  const isSelected = selectedAnswer === option
                  
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQuestion._id, option)}
                      className={`
                        w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                        ${isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }
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
                })}
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className={`
                    flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200
                    ${currentQuestionIndex === 0
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  <HiChevronLeft className="w-5 h-5 mr-2" />
                  Previous
                </button>

                {!isLastQuestion ? (
                  <button
                    onClick={handleNext}
                    disabled={!selectedAnswer}
                    className={`
                      flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200
                      ${selectedAnswer
                        ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-md hover:shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    Next
                    <HiChevronRight className="w-5 h-5 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || answeredCount < questions.length}
                    className={`
                      flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200
                      ${submitting || answeredCount < questions.length
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                      }
                    `}
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Quiz
                        <HiCheckCircle className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Warning Message for unanswered questions */}
              {isLastQuestion && answeredCount < questions.length && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                    ⚠️ Please answer all {questions.length - answeredCount} remaining question(s) before submitting
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Question Navigator (Quick Jump) */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Quick Navigation
            </p>
            <div className="flex flex-wrap gap-2">
              {questions.map((_, idx) => {
                const isAnswered = userAnswers[questions[idx]?._id]
                const isCurrent = idx === currentQuestionIndex
                
                return (
                  <button
  key={idx}
  onClick={() => {
    setCurrentQuestionIndex(idx);
    setTimerResetKey(prev => prev + 1);
  }}
                    className={`
                      w-10 h-10 rounded-lg font-semibold transition-all duration-200
                      ${isCurrent
                        ? 'bg-primary-600 text-white shadow-md transform scale-105'
                        : isAnswered
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }
                    `}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizPage