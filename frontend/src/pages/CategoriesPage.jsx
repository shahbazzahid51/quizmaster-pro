
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getCategories } from '../services/quizService'
import { 
  HiSearch, 
  HiFilter, 
  HiX, 
  HiChevronRight,
  HiCode,
  HiCalculator,
  HiMicrophone,
  HiGlobeAlt,
  HiAcademicCap,
  HiChartBar,
  HiBeaker,
  HiHeart,
  HiCamera,
  HiChip,
  HiBookOpen,
  HiBriefcase,
  HiColorSwatch,
  HiSparkles
} from 'react-icons/hi'
import toast from 'react-hot-toast'

const CategoriesPage = () => {
  const { isAuthenticated } = useAuth()
  const [categories, setCategories] = useState([])
  const [filteredCategories, setFilteredCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [hoveredCard, setHoveredCard] = useState(null)

  // Filter options
  const filters = [
    { id: 'all', label: 'All Categories', color: 'bg-gray-500' },
    // { id: 'beginner', label: 'Beginner', color: 'bg-green-500' },
    // { id: 'intermediate', label: 'Intermediate', color: 'bg-yellow-500' },
    // { id: 'advanced', label: 'Advanced', color: 'bg-red-500' },
    // { id: 'all-levels', label: 'All Levels', color: 'bg-blue-500' },
    { id: 'popular', label: 'Most Popular', color: 'bg-purple-500' }
  ]

  // Simulate API call
  useEffect(() => {
    loadCategories()
  }, [])

  // Filter categories when search or filter changes
  useEffect(() => {
    filterCategories()
  }, [searchTerm, activeFilter, categories])

const loadCategories = async () => {
  setLoading(true)
  try {
    const res = await getCategories()

    console.log("API RESPONSE:", res)

    // 🔥 DIRECT USE
    // const data = res.data || res.categories || res.results || []
    const data = Array.isArray(res.categories)
  ? res.categories
  : Array.isArray(res.data)
  ? res.data
  : []


console.log(res)
    setCategories(data)
    setFilteredCategories(data)

  } catch (error) {
    console.error('Error loading categories:', error)
    toast.error('Failed to load categories')
  } finally {
    setLoading(false)
  }
}
const filterCategories = () => {
  let filtered = [...categories]

  // Search filter
   if (activeFilter !== 'all') {
    if (activeFilter === 'popular') {
      filtered = filtered.sort((a, b) => b.popularity - a.popularity)
    } else {
      filtered = filtered.filter(category =>
        category.difficulty === activeFilter
      )
    }
  }

  setFilteredCategories(filtered)
}

  const clearFilters = () => {
    setSearchTerm('')
    setActiveFilter('all')
  }

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      beginner: { label: 'Beginner', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
      intermediate: { label: 'Intermediate', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
      advanced: { label: 'Advanced', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
      'all-levels': { label: 'All Levels', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' }
    }
    return badges[difficulty] || badges.beginner
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="container-custom py-12">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-8"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full max-w-md mx-auto mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20">
      <div className="container-custom py-12">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-primary-600 to-gray-900 dark:from-white dark:via-primary-400 dark:to-white bg-clip-text text-transparent">
            Explore Quiz Categories
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose from 10+ categories and test your knowledge with interactive quizzes
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <HiX className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <HiFilter className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filter Chips */}
          <div className={`mt-4 transition-all duration-300 ${showFilters ? 'block' : 'hidden sm:block'}`}>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${activeFilter === filter.id
                      ? 'bg-primary-600 text-white shadow-md transform scale-105'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {filter.label}
                </button>
              ))}
              
              {(searchTerm || activeFilter !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-full text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Found <span className="font-semibold text-primary-600 dark:text-primary-400">{filteredCategories.length}</span> categories
          </p>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => {
              const categoryIcons = {
  'Web Development': HiCode,
  Mathematics: HiCalculator,
  Languages: HiMicrophone,
  'General Knowledge': HiGlobeAlt,
  History: HiAcademicCap,
  Business: HiBriefcase,
  Science: HiBeaker,
  'Health & Wellness': HiHeart,
  Photography: HiCamera,
  'Artificial Intelligence': HiChip,
  Literature: HiBookOpen,
  Design: HiColorSwatch,
}


const Icon = categoryIcons[category.title] || HiCode
              const difficultyBadge = getDifficultyBadge(category.difficulty)
              console.log(category)
              const isHovered = hoveredCard === category._id
              
              return (
                <Link
                  key={category._id}
                  to={isAuthenticated ? `/quiz/${category._id}` : '/register'}
                  
                  onMouseEnter={() => setHoveredCard(category._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group block transform transition-all duration-300 hover:-translate-y-2"
                >
                   <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full relative overflow-hidden">                    
                    {/* Animated Border Effect on Hover */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    {/* Popularity Badge */}
                    <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-full">
                      <HiSparkles className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {category.totalQuestions || 0}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/25 transition-all duration-300 group-hover:scale-110">
  <Icon className="w-7 h-7 text-white" />
</div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {category.title}
                    </h3>
                    
                    {/* Quiz Count */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>10 Questions</span>
                      </div>
                    </div>
                    
                    {/* Difficulty Badge */}
                    <div className="mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${difficultyBadge.color}`}>
                        {difficultyBadge.label}
                      </span>
                    </div>
                    
                    {/* Start Button */}
                    <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium group-hover:translate-x-2 transition-transform duration-300">
                      <span className="text-sm font-semibold">Start Quiz</span>
                      <HiChevronRight className={`ml-1 w-4 h-4 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                    </div>

                    {/* Animated Bottom Bar */}
                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${category.color} transition-all duration-300 ${isHovered ? 'w-full' : 'w-0'}`}></div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <HiSearch className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
              No categories found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We couldn't find any categories matching "{searchTerm}"
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-200"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Featured Stats Section */}
        {filteredCategories.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {categories.length}+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Categories</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {categories.reduce((sum, cat) => sum + cat.quizCount, 0)}+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Quizzes</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  50K+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Learners</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoriesPage