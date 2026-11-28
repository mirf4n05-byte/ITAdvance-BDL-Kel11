import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCheckinStatus, doCheckin } from '../services/checkinService'

function DashboardPage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const [status, setStatus] = useState({ checked_in_today: false, streak_count: 0 })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getCheckinStatus()
        setStatus(res.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat data. Pastikan backend jalan.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleCheckin = async () => {
    setError('')
    setMessage('')
    setProcessing(true)
    try {
      const res = await doCheckin()
      setStatus({ checked_in_today: true, streak_count: res.data.streak_count })
      setMessage(res.data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Check-in gagal. Coba lagi.')
    } finally {
      setProcessing(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand fw-bold">ITAdvance</span>
          <div className="navbar-nav ms-auto align-items-center">
            <Link className="nav-link" to="/dashboard">Dashboard</Link>
            <Link className="nav-link" to="/preferensi">Preferensi</Link>
            <button className="btn btn-sm btn-light ms-2" onClick={handleLogout}>Keluar</button>
          </div>
        </div>
      </nav>

      <div className="container py-4" style={{ maxWidth: 720 }}>
        <h2>Halo, {user?.nama_lengkap || 'Pengguna'} 👋</h2>
        <p className="text-muted">Yuk, jaga konsistensi belajarmu hari ini.</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {loading ? (
          <p>Memuat...</p>
        ) : (
          <div className="row g-3">
            <div className="col-md-6">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <h5 className="card-title">Check-in Harian</h5>
                  <p className="card-text">
                    {status.checked_in_today
                      ? 'Kamu sudah check-in hari ini. Sampai jumpa besok!'
                      : 'Kamu belum check-in hari ini.'}
                  </p>
                  <button
                    className="btn btn-success"
                    onClick={handleCheckin}
                    disabled={status.checked_in_today || processing}
                  >
                    {processing ? 'Memproses...' : status.checked_in_today ? 'Sudah Check-in ✓' : 'Check-in Sekarang'}
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <h5 className="card-title">Streak</h5>
                  <div className="display-3 fw-bold text-warning">🔥 {status.streak_count}</div>
                  <p className="card-text">hari berturut-turut</p>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Pengingat Hari Ini</h5>
                  <p className="card-text text-muted mb-0">
                    Belum ada materi terjadwal. Fitur ini menyusul di Hari 3.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default DashboardPage