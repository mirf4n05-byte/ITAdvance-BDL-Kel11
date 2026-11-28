import { useEffect, useState } from 'react'
import { getPengingat, getSchedules } from '../services/scheduleService'

const pick = (obj, key) => obj?.[key.toUpperCase()] ?? obj?.[key.toLowerCase()]
const todayStr = () => new Date().toLocaleDateString('en-CA') // YYYY-MM-DD, waktu lokal

function TodayReminders() {
  const [reminders, setReminders] = useState([])
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
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
    load()
  }, [])

  const empty = reminders.length === 0 && sessions.length === 0

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Pengingat Hari Ini</h5>
        {loading && <p className="text-muted mb-0">Memuat...</p>}
        {error && <p className="text-muted mb-0">{error}</p>}
        {!loading && !error && empty && (
          <p className="text-muted mb-0">Tidak ada materi atau pengingat hari ini.</p>
        )}
        {(sessions.length > 0 || reminders.length > 0) && (
          <ul className="list-group list-group-flush">
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
      </div>
    </div>
  )
}

export default TodayReminders