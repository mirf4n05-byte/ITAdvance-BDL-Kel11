import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import PreferencesPage from './pages/PreferencesPage'
import DashboardPage from './pages/DashboardPage'
import SchedulePage from './pages/SchedulePage'
import CareerPage from './pages/CareerPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/preferensi" element={<ProtectedRoute><PreferencesPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/jadwal" element={<ProtectedRoute><SchedulePage /></ProtectedRoute>} />
        <Route path="/karier" element={<ProtectedRoute><CareerPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App