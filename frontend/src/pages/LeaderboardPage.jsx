import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLeaderboard } from '../services/quizService';
import {
  HiStar,
  HiUserGroup,
  HiChartBar,
  HiDocumentText,
  HiTrendingUp,
  HiRefresh,
  HiXCircle,
  HiBadgeCheck
} from 'react-icons/hi';
import toast from 'react-hot-toast';

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('averagePercentage');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getLeaderboard(50);
      
      if (response.success) {
        setLeaderboard(response.leaderboard || []);
      } else {
        throw new Error('Failed to fetch leaderboard');
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      setError(err.response?.data?.message || 'Failed to load leaderboard');
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getSortedLeaderboard = () => {
    const sorted = [...leaderboard];
    if (sortBy === 'userName') {
      sorted.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.userName.localeCompare(b.userName);
        } else {
          return b.userName.localeCompare(a.userName);
        }
      });
    } else {
      sorted.sort((a, b) => {
        const aVal = a[sortBy] || 0;
        const bVal = b[sortBy] || 0;
        if (sortOrder === 'asc') {
          return aVal - bVal;
        } else {
          return bVal - aVal;
        }
      });
    }
    return sorted;
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <HiStar className="w-6 h-6 text-yellow-500" />;
if (rank === 2) return <HiStar className="w-6 h-6 text-gray-400" />;
if (rank === 3) return <HiStar className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">#{rank}</span>;
  };

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    if (rank === 2) return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    if (rank === 3) return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-500';
  };

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 80) return { label: 'Expert', color: 'text-green-600 dark:text-green-400' };
    if (percentage >= 60) return { label: 'Advanced', color: 'text-blue-600 dark:text-blue-400' };
    if (percentage >= 40) return { label: 'Intermediate', color: 'text-yellow-600 dark:text-yellow-400' };
    return { label: 'Beginner', color: 'text-gray-600 dark:text-gray-400' };
  };

  const sortedLeaderboard = getSortedLeaderboard();
const currentUserRank =
  leaderboard.findIndex(
    entry => entry.userId?.toString() === (user?._id || user?.id)?.toString()
  ) + 1;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="container-custom py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header Skeleton */}
            <div className="text-center mb-12 animate-pulse">
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg w-96 mx-auto"></div>
            </div>

            {/* Table Skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <th key={i} className="px-6 py-4">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                      <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                        {[1, 2, 3, 4, 5].map((j) => (
                          <td key={j} className="px-6 py-4">
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse"></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8">
              <HiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Failed to Load Leaderboard
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <button
                onClick={fetchLeaderboard}
                className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200"
              >
                <HiRefresh className="w-5 h-5 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (leaderboard.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <HiUserGroup className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No Leaderboard Data Yet
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Be the first to take a quiz and appear on the leaderboard!
              </p>
              <Link
                to="/categories"
                className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all"
              >
                Start Your First Quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container-custom py-8 md:py-12">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <HiStar className="w-12 h-12 text-yellow-500 mr-2" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-primary-600 to-gray-900 dark:from-white dark:via-primary-400 dark:to-white bg-clip-text text-transparent">
            Global Leaderboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Top performers from around the world
          </p>
        </div>

        {/* User's Rank Card (if logged in) */}
        {user && currentUserRank > 0 && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <HiBadgeCheck className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-primary-100 text-sm">Your Current Rank</p>
                    <p className="text-3xl font-bold text-white">#{currentUserRank}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div>
                    <p className="text-primary-100 text-sm">Total Quizzes</p>
                    <p className="text-2xl font-bold text-white">
                      {leaderboard.find(entry => entry.userId === user.id)?.totalQuizzes || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-primary-100 text-sm">Avg. Score</p>
                    <p className="text-2xl font-bold text-white">
                      {Math.round(leaderboard.find(entry => entry.userId === user.id)?.averagePercentage || 0)}%
                    </p>
                  </div>
                </div>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-all"
                >
                  View Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Sorting Controls */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Sort by:</span>
            <button
              onClick={() => handleSort('averagePercentage')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                sortBy === 'averagePercentage'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Avg. Score {sortBy === 'averagePercentage' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => handleSort('totalQuizzes')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                sortBy === 'totalQuizzes'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Quizzes {sortBy === 'totalQuizzes' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => handleSort('bestScore')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                sortBy === 'bestScore'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Best Score {sortBy === 'bestScore' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              onClick={() => handleSort('userName')}
              className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                sortBy === 'userName'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              Name {sortBy === 'userName' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-400">
                      User
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-400">
                      <div className="flex items-center justify-center space-x-1">
                        <HiDocumentText className="w-4 h-4" />
                        <span>Quizzes</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-400">
                      <div className="flex items-center justify-center space-x-1">
                        <HiChartBar className="w-4 h-4" />
                        <span>Avg. Score</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-400">
                      <div className="flex items-center justify-center space-x-1">
                        <HiStar className="w-4 h-4" />
                        <span>Best Score</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Level
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLeaderboard.map((entry, index) => {
                    const rank = index + 1;
                    const performance = getPerformanceLevel(entry.averagePercentage);
                    const isCurrentUser = entry.userId === user?.id;
                    const rankBadgeColor = getRankBadgeColor(rank);
                    
                    return (
                      <tr
                        key={entry.userId}
                        className={`
                          border-b border-gray-200 dark:border-gray-700 transition-colors
                          ${isCurrentUser ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}
                        `}
                      >
                        {/* Rank */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {getRankIcon(rank)}
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${rankBadgeColor}`}>
                              {rank}
                            </span>
                          </div>
                        </td>
                        
                        {/* User Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {entry.userName?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {entry.userName}
                                {isCurrentUser && (
                                  <span className="ml-2 text-xs text-primary-600 dark:text-primary-400">(You)</span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {entry.userEmail}
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        {/* Total Quizzes */}
                        <td className="px-6 py-4 text-center">
                          <span className="text-lg font-semibold text-gray-900 dark:text-white">
                            {entry.totalQuizzes || 0}
                          </span>
                        </td>
                        
                        {/* Average Score */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                              {Math.round(entry.averagePercentage || 0)}%
                            </span>
                            <div className="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                              <div
                                className="h-full bg-primary-600 rounded-full"
                                style={{ width: `${Math.min(100, entry.averagePercentage || 0)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        
                        {/* Best Score */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center space-x-1">
                            <HiStar className="w-4 h-4 text-yellow-500" />
                            <span className="text-lg font-semibold text-gray-900 dark:text-white">
                              {entry.bestScore || 0}
                            </span>
                          </div>
                        </td>
                        
                        {/* Level */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center">
                            <div className="flex items-center space-x-1">
                              <HiTrendingUp className={`w-4 h-4 ${performance.color}`} />
                              <span className={`text-sm font-medium ${performance.color}`}>
                                {performance.label}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="max-w-6xl mx-auto mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Leaderboard updates in real-time as users complete quizzes
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;