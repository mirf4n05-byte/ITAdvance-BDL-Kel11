import { Navigate } from 'react-router-dom'

// Kalau belum login (tidak ada token), arahkan ke halaman login
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" replace />
}

export default ProtectedRoute