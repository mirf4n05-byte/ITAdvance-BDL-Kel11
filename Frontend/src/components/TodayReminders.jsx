import { useEffect, useState } from 'react'
import { getPengingat, getSchedules, addPengingat } from '../services/scheduleService'

const pick = (obj, key) => obj?.[key.toUpperCase()] ?? obj?.[key.toLowerCase()]
const todayStr = () => new Date().toLocaleDateString('en-CA') // YYYY-MM-DD, waktu lokal

function TodayReminders() {
  const [reminders, setReminders] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [pesan, setPesan] = useState('')
  const [waktu, setWaktu] = useState('20:00')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const [r, s] = await Promise.allSettled([getPengingat(), getSchedules()])
    if (r.status === 'fulfilled') {
      const list = r.value.data.pengingat || []
      setReminders(list.filter((x) => pick(x, 'status') !== 'NONAKTIF'))
    }
    if (s.status === 'fulfilled') {
      const list = s.value.data.jadwal || []
      setSessions(
        list.filter(
          (x) =>
            String(pick(x, 'tanggal_jadwal')).slice(0, 10) === todayStr() &&
            pick(x, 'status') !== 'SELESAI'
        )
      )
    }
    if (r.status === 'rejected' && s.status === 'rejected') {
      setError('Pengingat belum bisa dimuat.')
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!pesan.trim() || !waktu) {
      setFormError('Pesan dan waktu wajib diisi.')
      return
    }
    setSaving(true)
    try {
      await addPengingat(pesan.trim(), waktu)
      setPesan('')
      await load()
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Gagal menambah pengingat.')
    } finally {
      setSaving(false)
    }
  }

  const empty = reminders.length === 0 && sessions.length === 0

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Pengingat Hari Ini</h5>
        {loading && <p className="text-muted mb-0">Memuat...</p>}
        {error && <p className="text-muted mb-0">{error}</p>}
        {!loading && !error && empty && (
          <p className="text-muted">Tidak ada materi atau pengingat hari ini.</p>
        )}
        {(sessions.length > 0 || reminders.length > 0) && (
          <ul className="list-group list-group-flush mb-3">
            {sessions.map((it, i) => (
              <li key={`s${pick(it, 'id_jadwal') ?? i}`} className="list-group-item px-0">
                📚 <strong>{pick(it, 'judul_materi')}</strong>
                <span className="text-muted ms-2">{pick(it, 'durasi_jam')} jam</span>
              </li>
            ))}
            {reminders.map((it, i) => (
              <li key={`r${pick(it, 'id_pengingat') ?? i}`} className="list-group-item px-0">
                ⏰ {pick(it, 'pesan')}
                <span className="text-muted ms-2">{pick(it, 'waktu_pengingat')}</span>
              </li>
            ))}
          </ul>
        )}

        <hr />
        <h6>Tambah pengingat</h6>
        {formError && <div className="alert alert-danger py-2">{formError}</div>}
        <form className="row g-2" onSubmit={handleAdd}>
          <div className="col-12 col-md-6">
            <input
              className="form-control"
              placeholder="Contoh: Waktunya belajar malam"
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-3">
            <input
              type="time"
              className="form-control"
              value={waktu}
              onChange={(e) => setWaktu(e.target.value)}
            />
          </div>
          <div className="col-6 col-md-3">
            <button className="btn btn-primary w-100" disabled={saving}>
              {saving ? 'Menyimpan...' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TodayReminders