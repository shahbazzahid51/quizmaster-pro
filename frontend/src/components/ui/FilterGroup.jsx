import { HiFilter, HiX } from 'react-icons/hi';
import SearchBar from './SearchBar';
import DifficultyFilter from './DifficultyFilter';
import ScoreFilter from './ScoreFilter';
import FilterSelect from './FilterSelect';

const FilterGroup = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  difficultyValue,
  onDifficultyChange,
  scoreValue,
  onScoreChange,
  categoryValue,
  onCategoryChange,
  categoryOptions = [],
  categoryPlaceholder = 'All Categories',
  showDifficulty = true,
  showScore = true,
  showCategory = true,
  showClearButton = true,
  onClearAll,
  className = '',
  variant = 'horizontal' // 'horizontal' or 'vertical'
}) => {
  const hasActiveFilters = searchValue || 
    (difficultyValue && difficultyValue !== 'all') || 
    (scoreValue && scoreValue !== 'all') || 
    (categoryValue && categoryValue !== '');

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    } else {
      if (onSearchChange) onSearchChange('');
      if (onDifficultyChange) onDifficultyChange('all');
      if (onScoreChange) onScoreChange('all');
      if (onCategoryChange) onCategoryChange('');
    }
  };

  if (variant === 'vertical') {
    return (
      <div className={`space-y-4 ${className}`}>
        {showCategory && categoryOptions.length > 0 && (
          <FilterSelect
            value={categoryValue}
            onChange={onCategoryChange}
            options={categoryOptions}
            placeholder={categoryPlaceholder}
            label="Category"
          />
        )}
        
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
        
        {showDifficulty && (
          <DifficultyFilter
            value={difficultyValue}
            onChange={onDifficultyChange}
            variant="buttons"
          />
        )}
        
        {showScore && (
          <ScoreFilter
            value={scoreValue}
            onChange={onScoreChange}
            variant="buttons"
            showLabels={false}
          />
        )}
        
        {showClearButton && hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="flex items-center text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          >
            <HiX className="w-4 h-4 mr-1" />
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-end gap-4 ${className}`}>
      {showCategory && categoryOptions.length > 0 && (
        <div className="flex-1 min-w-[150px]">
          <FilterSelect
            value={categoryValue}
            onChange={onCategoryChange}
            options={categoryOptions}
            placeholder={categoryPlaceholder}
          />
        </div>
      )}
      
      <div className="flex-1 min-w-[200px]">
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </div>
      
      {showDifficulty && (
        <div className="w-[150px]">
          <DifficultyFilter
            value={difficultyValue}
            onChange={onDifficultyChange}
          />
        </div>
      )}
      
      {showScore && (
        <div className="w-[180px]">
          <ScoreFilter
            value={scoreValue}
            onChange={onScoreChange}
          />
        </div>
      )}
      
      {showClearButton && hasActiveFilters && (
        <button
          onClick={handleClearAll}
          className="flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
          title="Clear all filters"
        >
          <HiFilter className="w-4 h-4 mr-1" />
          Clear
        </button>
      )}
    </div>
  );
};

export default FilterGroup;