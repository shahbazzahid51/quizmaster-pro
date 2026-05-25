
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import PrivateRoute from './components/common/PrivateRoute'
import Navbar from './components/common/Navbar'
import DashboardLayout from './components/layout/DashboardLayout' 
import Footer from './components/common/Footer';


// Pages
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import CategoriesPage from './pages/CategoriesPage'
import QuizPage from './pages/QuizPage'
import ResultPage from './pages/ResultPage'
import LeaderboardPage from './pages/LeaderboardPage'
import AdminPage from './pages/AdminPage';



function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <Navbar />
        
        <Routes>
  {/* Public Routes */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/categories" element={<CategoriesPage />} />
  <Route path="/leaderboard" element={<LeaderboardPage />} />
  <Route path="/quiz/:categoryId" element={<QuizPage />} />
 <Route path="/result/:resultId" element={<ResultPage />} />

  {/* Dashboard */}
  <Route path="/dashboard" element={
    <PrivateRoute>
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
    </PrivateRoute>
  } />
  <Route 
  path="/admin" 
  element={
    <PrivateRoute>
      <AdminPage />
    </PrivateRoute>
  } />
</Routes>

<Footer />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App