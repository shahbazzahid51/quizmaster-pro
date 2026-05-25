
const FilterChip = ({ label, active, onClick, color }) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
        ${active
          ? 'bg-primary-600 text-white shadow-md transform scale-105'
          : `bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700`
        }
      `}
    >
      {label}
    </button>
  )
}

export default FilterChip