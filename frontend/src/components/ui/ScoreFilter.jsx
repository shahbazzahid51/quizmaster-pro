import {  HiStar} from 'react-icons/hi';

const scoreRanges = [
  { value: 'all', label: 'All Scores', min: 0, max: 100 },
  { value: 'excellent', label: 'Excellent (80%+)', min: 80, max: 100 },
  { value: 'good', label: 'Good (60-79%)', min: 60, max: 79 },
  { value: 'average', label: 'Average (40-59%)', min: 40, max: 59 },
  { value: 'poor', label: 'Needs Improvement (<40%)', min: 0, max: 39 }
];

const ScoreFilter = ({
  value,
  onChange,
  variant = 'select', // 'select' or 'buttons'
  className = '',
  disabled = false,
  showLabels = true
}) => {
  const getScoreColor = (rangeValue) => {
    switch (rangeValue) {
      case 'excellent': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'good': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'average': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'poor': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getScoreEmoji = (rangeValue) => {
    switch (rangeValue) {
      case 'excellent': return '🏆';
      case 'good': return '👍';
      case 'average': return '📚';
      case 'poor': return '💪';
      default: return '🎯';
    }
  };

  const filterByScore = (percentage, filterValue) => {
    if (filterValue === 'all') return true;
    const range = scoreRanges.find(r => r.value === filterValue);
    return range && percentage >= range.min && percentage <= range.max;
  };

  if (variant === 'buttons') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {scoreRanges.map((range) => (
          <button
            key={range.value}
            onClick={() => onChange(range.value)}
            disabled={disabled}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
              ${value === range.value
                ? getScoreColor(range.value) + ' ring-2 ring-offset-2 ring-primary-500'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span className="mr-1">{getScoreEmoji(range.value)}</span>
            {showLabels ? range.label : range.label.split(' ')[0]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {showLabels && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          <HiStar className="inline w-4 h-4 mr-1" />
          Score Range
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {scoreRanges.map((range) => (
          <option key={range.value} value={range.value}>
            {range.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ScoreFilter;

// Helper function to filter results by score
export const filterResultsByScore = (results, filterValue) => {
  if (filterValue === 'all') return results;
  const range = scoreRanges.find(r => r.value === filterValue);
  if (!range) return results;
  return results.filter(result => {
    const percentage = result.percentage || (result.score / result.totalQuestions) * 100;
    return percentage >= range.min && percentage <= range.max;
  });
};