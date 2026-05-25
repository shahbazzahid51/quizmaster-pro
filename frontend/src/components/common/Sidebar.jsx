import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { HiTrophy } from 'react-icons/hi2'
import DarkModeToggle from '../ui/DarkModeToggle';
import { useSidebar } from '../../context/SidebarContext'
import {
  HiOutlineCollection,
  HiOutlineChartBar,
  HiOutlineUserGroup,
  HiOutlineCog,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineViewGrid
} from 'react-icons/hi'

const Sidebar = () => {
  const { isCollapsed, isMobileOpen, toggleSidebar, closeMobileSidebar } = useSidebar()
  const { isAdmin, user } = useAuth()
  const location = useLocation()
  const [hoveredItem, setHoveredItem] = useState(null)

  // Close mobile sidebar on route change
  useEffect(() => {
    closeMobileSidebar()
  }, [location, closeMobileSidebar])

  // Menu items configuration
  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: HiOutlineViewGrid,
      allowed: true,
    },
    {
      path: '/categories',
      name: 'Categories',
      icon: HiOutlineCollection,
      allowed: true,
    },
    
  //{
//   path: '/dashboard',
//   name: 'Results',
//   icon: HiOutlineChartBar,
//   allowed: true,
// },
    {
      path: '/leaderboard',
      name: 'Leaderboard',
      icon: HiTrophy,
      allowed: true,
    },
    {
      path: '/admin',
      name: 'Admin',
      icon: HiOutlineUserGroup,
      allowed: isAdmin,
    },
    {
      path: '/settings',
      name: 'Settings',
      icon: HiOutlineCog,
      allowed: true,
    },
  ]

  const visibleMenuItems = menuItems.filter(item => item.allowed)

  // Don't render sidebar if no menu items
  if (visibleMenuItems.length === 0) return null

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="fixed bottom-4 right-4 z-50 lg:hidden bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-all duration-200"
      >
        <HiOutlineMenu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 shadow-xl transition-all duration-300 z-30
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* User Profile Section */}
        <div className={`p-4 border-b border-gray-200 dark:border-gray-700 transition-all duration-300
          ${isCollapsed ? 'text-center' : ''}
        `}>
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || 'user@example.com'}
                </p>
                {user?.role === 'admin' && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full">
                    Admin
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path || 
                               (item.path !== '/' && location.pathname.startsWith(item.path))
              
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive: navActive }) => `
                      relative flex items-center rounded-lg transition-all duration-200 group
                      ${isCollapsed ? 'justify-center' : 'space-x-3'}
                      ${navActive || isActive
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                      ${isCollapsed ? 'p-3' : 'px-3 py-2.5'}
                    `}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Icon className={`w-5 h-5 transition-transform duration-200 
                      ${!isCollapsed && 'group-hover:scale-110'}
                    `} />
                    
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}

                    {/* Tooltip for collapsed mode */}
                    {isCollapsed && hoveredItem === item.name && (
                      <div className="fixed left-16 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 pointer-events-none">
                        {item.name}
                      </div>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom Section - Collapse Toggle */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
          onClick={toggleSidebar}
            className={`
              w-full flex items-center justify-center rounded-lg transition-all duration-200
              text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800
              ${isCollapsed ? 'p-2' : 'px-3 py-2 space-x-3'}
            `}
          >
            {isCollapsed ? (
              <HiOutlineChevronRight className="w-5 h-5" />
            ) : (
              <>
                <HiOutlineChevronLeft className="w-5 h-5" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Spacing Adjustment (to be used in dashboard layout) */}
      <style>{`
        .main-content-padding {
          margin-left: ${isCollapsed ? '5rem' : '16rem'};
          transition: margin-left 0.3s ease;
        }
        @media (max-width: 1024px) {
          .main-content-padding {
            margin-left: 0;
          }
        }
      `}</style>
    </>
  )
}

export default Sidebar