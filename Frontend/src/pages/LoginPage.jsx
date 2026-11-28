import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {loginUser} from '../services/authService'

function LoginPage(){
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Email dan password wajib diisi.')
      return
    }

    setLoading(true)
    try {
      const res = await loginUser({ email, password })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login gagal. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5" style={{ maxWidth: 420 }}>
      <h2 className="mb-4 text-center">Masuk</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Memproses...' : 'Login'}
        </button>
      </form>
      <p className="text-center mt-3">
        Belum punya akun? <Link to="/register">Daftar</Link>
      </p>
    </div>
  )
}

export default LoginPage