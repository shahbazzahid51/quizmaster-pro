
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getResultById } from '../services/quizService';
import { HiCheckCircle, HiXCircle, HiChartBar, HiClock, HiHome, HiStar, HiArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';

const ResultPage = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (resultId) {
      fetchResult();
    }
  }, [resultId]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getResultById(resultId);
      
      if (response.success) {
        setResult(response.result);
      } else {
        throw new Error('Failed to fetch result');
      }
    } catch (err) {
      console.error('Error fetching result:', err);
      setError(err.response?.data?.message || 'Failed to load quiz result');
      toast.error('Failed to load quiz result');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 80) {
      return { message: 'Excellent! Keep up the great work! 🎉', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/30' };
    } else if (percentage >= 50) {
      return { message: 'Good effort! Keep practicing to improve! 💪', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30' };
    } else {
      return { message: 'Keep learning! Try again to master this topic! 📚', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/30' };
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="container-custom py-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-48 mx-auto mb-6"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6"></div>
              <div className="space-y-4">
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
                <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8">
              <HiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Result Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error || "We couldn't find your quiz result. Please try again."}
              </p>
              <button
                onClick={() => navigate('/categories')}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200"
              >
                Browse Categories
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const summary = result.summary || result;
  const percentage = summary.percentage || result.percentage;
  const performance = getPerformanceMessage(percentage);
  const scoreColor = getScoreColor(percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container-custom py-8 md:py-12">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Completed! 🎯
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's how you performed
          </p>
        </div>

        {/* Main Result Card */}
        <div className="max-w-3xl mx-auto">
          {/* Score Circle */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6 text-center">
            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={2 * Math.PI * 88}
                  strokeDashoffset={2 * Math.PI * 88 * (1 - percentage / 100)}
                  className={`${scoreColor} transition-all duration-1000 ease-out`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${scoreColor}`}>
                  {Math.round(percentage)}%
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Score
                </span>
              </div>
            </div>

            {/* Performance Message */}
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${performance.bgColor} mb-4`}>
              <span className={`font-semibold ${performance.color}`}>
                {performance.message}
              </span>
            </div>

            {/* Score Breakdown */}
            <div className="flex justify-center gap-8 mt-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <HiCheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {summary.correctAnswers || result.score}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Correct</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <HiXCircle className="w-5 h-5 text-red-500" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {summary.wrongAnswers || (result.totalQuestions - result.score)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Incorrect</p>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Questions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <HiChartBar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.totalQuestions}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Questions</p>
            </div>

            {/* Score */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <HiStar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.score}/{result.totalQuestions}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Your Score</p>
            </div>

            {/* Time Spent */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <HiClock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatTime(result.timeSpent || summary.timeSpent || 0)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Time Spent</p>
            </div>
          </div>

          {/* Category Info */}
          {result.categoryId && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Category: {result.categoryId.title}
              </h3>
              {result.categoryId.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {result.categoryId.description}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/categories')}
              className="flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <HiHome className="w-5 h-5 mr-2" />
              Back to Categories
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <HiArrowLeft className="w-5 h-5 mr-2" />
              Go to Dashboard
            </button>

            <button
              onClick={() => navigate('/leaderboard')}
              className="flex items-center justify-center px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              <HiStar className="w-5 h-5 mr-2" />
              View Leaderboard
            </button>
          </div>

          {/* Share/Retake Section */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate(`/quiz/${result.categoryId?._id || result.categoryId}`)}
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              Retake this Quiz →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;