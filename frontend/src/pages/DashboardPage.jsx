import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserResults } from '../services/quizService';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  HiChartBar,
  HiStar,
  HiDocumentText,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiArrowRight,
  HiRefresh,
  HiTrendingUp,
  HiCalendar,
  HiTag
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    averagePercentage: 0,
    bestScore: 0,
    totalTimeSpent: 0
  });
  const [categoryPerformance, setCategoryPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    fetchUserResults();
  }, []);

  const fetchUserResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserResults(1, 50);

      if (response.success) {
        setResults(response.results || []);
        setStats(response.stats || {
          totalQuizzes: 0,
          averageScore: 0,
          averagePercentage: 0,
          bestScore: 0,
          totalTimeSpent: 0
        });
        setCategoryPerformance(response.categoryPerformance || []);
      } else {
        throw new Error('Failed to fetch results');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Prepare score trend data
  const getScoreTrendData = () => {
    const sortedResults = [...results].sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
    return sortedResults.slice(-10).map((result, index) => ({
      attempt: index + 1,
      date: new Date(result.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      percentage: Math.round(result.percentage),
      score: result.score,
      totalQuestions: result.totalQuestions,
      category: result.categoryId?.title || 'Quiz'
    }));
  };

  // Prepare category performance data for charts
  const getCategoryChartData = () => {
    return categoryPerformance.map(cat => ({
      name: cat.categoryTitle?.length > 15 ? cat.categoryTitle.substring(0, 12) + '...' : cat.categoryTitle,
      fullName: cat.categoryTitle,
      percentage: Math.round(cat.averagePercentage),
      attempts: cat.totalAttempts,
      bestScore: cat.bestScore
    })).sort((a, b) => b.percentage - a.percentage);
  };

  // Prepare pie chart data
  const getPieChartData = () => {
    const totalCorrect = stats.averageScore || 0;
    const totalQuestions = results.reduce((sum, r) => sum + r.totalQuestions, 0);
    const totalIncorrect = totalQuestions - totalCorrect;
    
    return [
      { name: 'Correct Answers', value: totalCorrect, color: '#10b981' },
      { name: 'Incorrect Answers', value: totalIncorrect, color: '#ef4444' }
    ];
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
          {payload.map((p, idx) => (
            <p key={idx} className="text-sm" style={{ color: p.color }}>
              {p.name}: {p.value}{p.unit === '%' ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins} min ${secs} sec`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPerformanceBadge = (percentage) => {
    if (percentage >= 80) return { label: 'Excellent', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
    if (percentage >= 50) return { label: 'Good', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' };
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
  };

  const scoreTrendData = getScoreTrendData();
  const categoryChartData = getCategoryChartData();
  const pieData = getPieChartData();

  // Stat cards data
  const statCards = [
    {
      title: 'Total Quizzes',
      value: stats.totalQuizzes,
      icon: HiDocumentText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Average Score',
      value: `${Math.round(stats.averagePercentage)}%`,
      icon: HiChartBar,
      color: 'bg-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Best Score',
     // value: `${Math.round(stats.bestScore)}/${results[0]?.totalQuestions || 0}`,
     value: Math.round(stats.bestScore),
      icon: HiStar,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      title: 'Total Time',
      value: formatTime(stats.totalTimeSpent),
      icon: HiClock,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-lg w-96"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-4"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8 max-w-md mx-auto">
          <HiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Failed to Load Dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchUserResults}
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all"
          >
            <HiRefresh className="w-5 h-5 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (results.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            You haven't taken any quizzes yet. Start your first quiz to see your progress!
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <HiDocumentText className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Quiz Attempts Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start your learning journey by taking your first quiz!
          </p>
          <Link
            to="/categories"
            className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all"
          >
            Browse Categories
            <HiArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here's your quiz performance overview
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.textColor}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Score Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <HiTrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Score Trend
            </h2>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 text-sm rounded-lg transition-all ${
                chartType === 'line'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Line
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1 text-sm rounded-lg transition-all ${
                chartType === 'area'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 text-sm rounded-lg transition-all ${
                chartType === 'bar'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Bar
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          {chartType === 'line' && (
            <LineChart data={scoreTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis 
                dataKey="attempt" 
                stroke="#6B7280"
                label={{ value: 'Quiz Attempts', position: 'bottom', offset: 0, fill: '#6B7280' }}
              />
              <YAxis 
                stroke="#6B7280"
                label={{ value: 'Score (%)', angle: -90, position: 'insideLeft', fill: '#6B7280' }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 6 }}
                activeDot={{ r: 8 }}
                name="Score Percentage"
                unit="%"
              />
            </LineChart>
          )}
          {chartType === 'area' && (
            <AreaChart data={scoreTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="attempt" stroke="#6B7280" />
              <YAxis stroke="#6B7280" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="percentage"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
                name="Score Percentage"
                unit="%"
              />
            </AreaChart>
          )}
          {chartType === 'bar' && (
            <BarChart data={scoreTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="attempt" stroke="#6B7280" />
              <YAxis stroke="#6B7280" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="percentage" fill="#3b82f6" name="Score Percentage" unit="%" radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
        {scoreTrendData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Complete more quizzes to see your score trend</p>
          </div>
        )}
      </div>

      {/* Category Performance and Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-6">
            <HiTag className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Category Performance
            </h2>
          </div>
          {categoryChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={categoryChartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis type="number" domain={[0, 100]} stroke="#6B7280" unit="%" />
                <YAxis type="category" dataKey="name" stroke="#6B7280" width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="percentage" fill="#10b981" name="Average Score" unit="%" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Take quizzes in different categories to see performance</p>
            </div>
          )}
        </div>

        {/* Score Distribution Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center space-x-2 mb-6">
            <HiChartBar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Score Distribution
            </h2>
          </div>
          {pieData[0].value > 0 || pieData[1].value > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Complete quizzes to see your score distribution</p>
            </div>
          )}
        </div>
      </div>

      {/* Category Performance Table Section */}
      {categoryPerformance.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Category Performance Details
          </h2>
          <div className="space-y-4">
            {categoryPerformance.map((category, idx) => {
              const badge = getPerformanceBadge(category.averagePercentage);
              return (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {category.categoryTitle}
                    </p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {category.totalAttempts} attempts
                      </span>
                      <span className={`text-sm font-medium ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getPerformanceColor(category.averagePercentage)}`}>
                      {Math.round(category.averagePercentage)}%
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Best: {category.bestScore}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Activity Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <HiCalendar className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Quizzes
            </h2>
          </div>
          <Link
            to="/dashboard"
            className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {results.slice(0, 5).map((result) => {
            const percentage = result.percentage;
            const badge = getPerformanceBadge(percentage);
            const scoreColor = getPerformanceColor(percentage);

            return (
              <div
                key={result._id}
                className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-lg px-2 -mx-2"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {result.categoryId?.title || 'Quiz'}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(result.completedAt)}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {result.timeSpent && formatTime(result.timeSpent)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${scoreColor}`}>
                    {result.score}/{result.totalQuestions}
                  </p>
                  <p className={`text-sm font-medium ${scoreColor}`}>
                    {Math.round(percentage)}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          to="/categories"
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-xl p-6 text-center transition-all transform hover:scale-105"
        >
          <h3 className="text-lg font-semibold text-white mb-1">Take New Quiz</h3>
          <p className="text-primary-100 text-sm">Challenge yourself with new categories</p>
        </Link>

        <Link
          to="/leaderboard"
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 rounded-xl p-6 text-center transition-all transform hover:scale-105"
        >
          <h3 className="text-lg font-semibold text-white mb-1">View Leaderboard</h3>
          <p className="text-yellow-100 text-sm">Compete with top learners</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;