import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getRoadmap, updateChecklist } from '../services/careerService'
import { getCheckinStatus } from '../services/checkinService'

const pick = (obj, key) => obj?.[key.toUpperCase()] ?? obj?.[key.toLowerCase()]

function CareerPage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const [items, setItems] = useState([])
  const [linkedin, setLinkedin] = useState(localStorage.getItem('linkedin_url') || '')
  const [summary, setSummary] = useState('')
  const [showSummary, setShowSummary] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const doneCount = items.filter((it) => pick(it, 'status') === 'SELESAI').length
  const percent = items.length ? Math.round((doneCount / items.length) * 100) : 0

  const load = async () => {
    try {
      const res = await getRoadmap()
      setItems(res.data.roadmap || [])
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal memuat roadmap.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleToggle = async (it) => {
    setError('')
    const id = pick(it, 'id_langkah')
    const done = pick(it, 'status') === 'SELESAI'
    try {
      await updateChecklist(id, done ? 'BELUM' : 'SELESAI')
      await load()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Gagal memperbarui status.')
    }
  }

  // Backend belum punya endpoint LinkedIn, jadi URL disimpan di browser
  const handleSaveLinkedin = () => {
    setError('')
    setMessage('')
    if (!linkedin.trim()) {
      setError('Isi alamat profil LinkedIn dulu.')
      return
    }
    localStorage.setItem('linkedin_url', linkedin.trim())
    setMessage('Alamat LinkedIn tersimpan di browser ini.')
  }

  // Ringkasan dibuat di frontend dari data streak dan checklist
  const handleSummary = async () => {
    setError('')
    let streak = 0
    try {
      const res = await getCheckinStatus()
      streak = res.data.streak_count || 0
    } catch {
      // abaikan, pakai 0
    }
    const nama = user?.nama_lengkap || 'Saya'
    const text =
      `${nama} sedang belajar IT secara terarah lewat ITAdvance. ` +
      `Konsisten belajar ${streak} hari berturut-turut dan telah menyelesaikan ` +
      `${doneCount} dari ${items.length} langkah persiapan karier (${percent}%).` +
      (linkedin ? ` Profil LinkedIn: ${linkedin}` : '')
    setSummary(text)
    setShowSummary(true)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setMessage('Ringkasan disalin ke clipboard.')
      setShowSummary(false)
    } catch {
      setError('Gagal menyalin. Salin manual dari kotak teks.')
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
        <h2>Career Roadmap</h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {loading ? (
          <p>Memuat...</p>
        ) : (
          <>
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Kesiapan Karier</h5>
                <div className="progress" style={{ height: 24 }}>
                  <div className="progress-bar" style={{ width: `${percent}%` }}>
                    {percent}%
                  </div>
                </div>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Checklist Persiapan</h5>
                {items.length === 0 ? (
                  <p className="text-muted mb-0">Belum ada checklist.</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {items.map((it, i) => {
                      const done = pick(it, 'status') === 'SELESAI'
                      return (
                        <li
                          key={pick(it, 'id_langkah') ?? i}
                          className="list-group-item d-flex align-items-center px-0"
                        >
                          <input
                            type="checkbox"
                            className="form-check-input me-3"
                            checked={done}
                            onChange={() => handleToggle(it)}
                          />
                          <span className={done ? 'text-decoration-line-through text-muted' : ''}>
                            {pick(it, 'judul_langkah')}
                          </span>
                          <span className="badge bg-info text-dark ms-2">{pick(it, 'kategori')}</span>
                          <span className={`badge ms-auto ${done ? 'bg-success' : 'bg-secondary'}`}>
                            {pick(it, 'status')}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Profil LinkedIn</h5>
                <div className="input-group mb-2">
                  <input
                    type="url"
                    className="form-control"
                    placeholder="https://www.linkedin.com/in/namamu"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                  <button className="btn btn-primary" onClick={handleSaveLinkedin}>
                    Simpan
                  </button>
                </div>
                <button className="btn btn-outline-primary" onClick={handleSummary}>
                  Ringkasan Pencapaian
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showSummary && (
        <div className="modal d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Ringkasan Pencapaian</h5>
                <button className="btn-close" onClick={() => setShowSummary(false)}></button>
              </div>
              <div className="modal-body">
                <textarea className="form-control" rows="6" value={summary} readOnly />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowSummary(false)}>
                  Tutup
                </button>
                <button className="btn btn-primary" onClick={handleCopy}>
                  Salin ke Clipboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CareerPage