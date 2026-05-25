import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  HiSparkles,
  HiChartBar,
  HiUsers,
  HiDocumentText,
  HiClock,
  HiChevronRight,
  HiStar,
  HiAcademicCap,
  HiCalculator,
  HiGlobeAlt,
  HiMicrophone,
  HiCode,
  HiArrowRight,
  HiLightBulb   // ✅ correct name
} from 'react-icons/hi'

import { HiTrophy } from 'react-icons/hi2' // ✅ correct

const LandingPage = () => {
  const { isAuthenticated } = useAuth()
  const [animatedStats, setAnimatedStats] = useState({
    users: 0,
    quizzes: 0,
    questions: 0,
    countries: 0
  })

  // Statistics data
  const stats = [
    { id: 'users', label: 'Active Users', value: 50000, icon: HiUsers, suffix: '+' },
    { id: 'quizzes', label: 'Quizzes Taken', value: 250000, icon: HiDocumentText, suffix: '+' },
    { id: 'questions', label: 'Questions', value: 10000, icon: HiSparkles, suffix: '+' },
    { id: 'countries', label: 'Countries', value: 50, icon: HiGlobeAlt, suffix: '+' }
  ]

  // Features data
  const features = [
    {
      icon: HiSparkles,
      title: 'AI-Powered Quizzes',
      description: 'Smart quiz generation that adapts to your skill level and learning pace.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: HiChartBar,
      title: 'Detailed Analytics',
      description: 'Track your progress with comprehensive statistics and performance insights.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: HiTrophy,
      title: 'Global Leaderboards',
      description: 'Compete with learners worldwide and climb the rankings.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: HiLightBulb,
      title: 'Instant Feedback',
      description: 'Get immediate explanations and learn from your mistakes.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: HiClock,
      title: 'Timed Challenges',
      description: 'Test your speed with timed quizzes and improve response time.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: HiAcademicCap,
      title: 'Certificates',
      description: 'Earn certificates for completing courses and achieving high scores.',
      color: 'from-indigo-500 to-purple-500'
    }
  ]

  // Popular categories data
  const categories = [
    {
      name: 'Science & Technology',
      icon: HiCode,
      quizzes: 45,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50 dark:bg-cyan-900/20'
    },
    {
      name: 'Mathematics',
      icon: HiCalculator,
      quizzes: 38,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      name: 'Languages',
      icon: HiMicrophone,
      quizzes: 52,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      name: 'General Knowledge',
      icon: HiGlobeAlt,
      quizzes: 67,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
    {
      name: 'History & Culture',
      icon: HiAcademicCap,
      quizzes: 41,
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20'
    },
    {
      name: 'Business & Finance',
      icon: HiChartBar,
      quizzes: 33,
      color: 'from-teal-500 to-cyan-500',
      bgColor: 'bg-teal-50 dark:bg-teal-900/20'
    }
  ]

  // Animate statistics on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateStats()
            observer.disconnect()
          }
        })
      },
      { threshold: 0.5 }
    )

    const statsSection = document.getElementById('statistics-section')
    if (statsSection) {
      observer.observe(statsSection)
    }

    return () => observer.disconnect()
  }, [])

  const animateStats = () => {
    const duration = 2000
    const stepTime = 20
    const steps = duration / stepTime

    stats.forEach(stat => {
      let current = 0
      const increment = stat.value / steps
      const interval = setInterval(() => {
        current += increment
        if (current >= stat.value) {
          setAnimatedStats(prev => ({ ...prev, [stat.id]: stat.value }))
          clearInterval(interval)
        } else {
          setAnimatedStats(prev => ({ ...prev, [stat.id]: Math.floor(current) }))
        }
      }, stepTime)
    })
  }

  const scrollToCategories = () => {
    document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full filter blur-3xl opacity-10 animate-pulse"></div>
        </div>

        <div className="container-custom relative">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-6">
              <HiSparkles className="w-4 h-4 mr-1" />
              <span>Trusted by 50,000+ learners</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-primary-600 to-gray-900 dark:from-white dark:via-primary-400 dark:to-white bg-clip-text text-transparent">
              Master Any Subject
              <br />
              With Interactive Quizzes
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of learners and test your knowledge with our engaging quiz platform. 
              Get instant feedback, track your progress, and compete globally.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-full hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Go to Dashboard
                  <HiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-full hover:from-primary-700 hover:to-primary-800 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Get Started Free
                    <HiArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/categories"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-full hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
                  >
                    Explore Categories
                  </Link>
                </>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
              <div className="flex items-center space-x-2">
                <HiStar className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">4.9/5 Rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <HiUsers className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">50K+ Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <HiDocumentText className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">10K+ Quizzes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container-custom">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Powerful features designed to help you learn faster and retain more information
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section id="categories" className="py-20">
        <div className="container-custom">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Popular Categories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Explore our most popular quiz categories and start learning today
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <Link
                  key={index}
                  to={isAuthenticated ? `/quiz/category/${category.name.toLowerCase().replace(/\s+/g, '-')}` : '/register'}
                  className="group block"
                >
                  <div className={`${category.bgColor} rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                        <HiDocumentText className="w-4 h-4" />
                        <span>{category.quizzes} quizzes</span>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    
                    <div className="flex items-center text-primary-600 dark:text-primary-400 font-medium">
                      <span className="text-sm">Start Quiz</span>
                      <HiChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              to="/categories"
              className="inline-flex items-center px-6 py-3 text-lg font-semibold text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-400 rounded-full hover:bg-primary-600 hover:text-white dark:hover:bg-primary-400 dark:hover:text-gray-900 transition-all duration-200"
            >
              View All Categories
              <HiChevronRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="statistics-section" className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.id}
                  className="text-center text-white transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold mb-2">
                    {animatedStats[stat.id].toLocaleString()}{stat.suffix}
                  </div>
                  <div className="text-white/90 font-medium">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20">
        <div className="container-custom">
          <div className="relative overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-16 text-center">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full filter blur-3xl opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full filter blur-3xl opacity-10"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Ready to Challenge Yourself?
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of learners and start mastering new subjects today. 
                It's free, fun, and takes just a minute to get started!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {isAuthenticated ? (
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
                  >
                    Go to Dashboard
                    <HiArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
                    >
                      Get Started Free
                      <HiArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                    <Link
                      to="/categories"
                      className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-200"
                    >
                      Browse Categories
                    </Link>
                  </>
                )}
              </div>
              
              {/* Small print */}
              <p className="mt-6 text-sm text-gray-400">
                No credit card required • Free forever • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage