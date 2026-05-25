import { SidebarProvider } from '../../context/SidebarContext'
import Sidebar from '../common/Sidebar'
import { useSidebar } from '../../context/SidebarContext'

const DashboardContent = ({ children }) => {
  const { isCollapsed, isMobileOpen } = useSidebar()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main
        className={`
          transition-all duration-300 pt-20
          ${!isMobileOpen && (isCollapsed ? 'lg:ml-20' : 'lg:ml-64')}
        `}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}

const DashboardLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}

export default DashboardLayout