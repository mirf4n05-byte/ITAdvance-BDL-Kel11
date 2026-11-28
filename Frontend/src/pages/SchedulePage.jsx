import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { generateSchedule, getSchedules, completeSchedule } from '../services/scheduleService'

const pick = (obj, key) => obj?.[key.toUpperCase()] ?? obj?.[key.toLowerCase()]

function SchedulePage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = async () => {
    try {
      const res = await getSchedules()
      setItems(res.data.jadwal || [])
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat jadwal.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleGenerate = async () => {
    setError('')
    setMessage('')
    setGenerating(true)
    try {
      const res = await generateSchedule()
      setMessage(res.data.message || 'Jadwal berhasil dibuat.')
      await load()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal membuat jadwal.')
    } finally {
      setGenerating(false)
    }
  }

  const handleComplete = async (id) => {
    setError('')
    try {
      await completeSchedule(id)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal menandai selesai.')
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
            <Link className="nav-link" to="/jadwal">Jadwal</Link>
            <Link className="nav-link" to="/karier">Karier</Link>
            <Link className="nav-link" to="/preferensi">Preferensi</Link>
            <button className="btn btn-sm btn-light ms-2" onClick={handleLogout}>Keluar</button>
          </div>
        </div>
      </nav>

      <div className="container py-4" style={{ maxWidth: 800 }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Jadwal Belajar</h2>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
            {generating ? 'Membuat...' : 'Buat Jadwal'}
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {loading ? (
          <p>Memuat...</p>
        ) : items.length === 0 ? (
          <p className="text-muted">Belum ada jadwal. Klik "Buat Jadwal" untuk membuatnya otomatis.</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Materi</th>
                  <th>Tanggal</th>
                  <th>Durasi</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, i) => {
                  const id = pick(it, 'id_jadwal') ?? i
                  const status = pick(it, 'status')
                  const done = status === 'SELESAI'
                  return (
                    <tr key={id}>
                      <td>{pick(it, 'judul_materi')}</td>
                      <td>{String(pick(it, 'tanggal_jadwal') ?? '').slice(0, 10)}</td>
                      <td>{pick(it, 'durasi_jam')} jam</td>
                      <td>
                        <span className={`badge ${done ? 'bg-success' : 'bg-secondary'}`}>
                          {status}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleComplete(id)}
                          disabled={done}
                        >
                          Tandai Selesai
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}

export default SchedulePage