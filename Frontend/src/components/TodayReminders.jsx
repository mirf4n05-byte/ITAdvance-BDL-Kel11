import { useEffect, useState } from 'react'
import { getTodayReminders } from '../services/scheduleService'

// Oracle mengembalikan nama kolom huruf besar, jadi baca dua-duanya
const pick = (obj, key) => obj?.[key.toUpperCase()] ?? obj?.[key.toLowerCase()]

function TodayReminders() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getTodayReminders()
        // ASUMSI: response berbentuk { reminders: [...] }
        setItems(res.data.reminders || [])
      } catch {
        setError('Pengingat belum bisa dimuat.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Pengingat Hari Ini</h5>
        {loading && <p className="text-muted mb-0">Memuat...</p>}
        {error && <p className="text-muted mb-0">{error}</p>}
        {!loading && !error && items.length === 0 && (
          <p className="text-muted mb-0">Tidak ada materi terjadwal hari ini.</p>
        )}
        {items.length > 0 && (
          <ul className="list-group list-group-flush">
            {items.map((it, i) => (
              <li key={pick(it, 'id_jadwal') ?? i} className="list-group-item px-0">
                <strong>{pick(it, 'judul') || pick(it, 'title')}</strong>
                <span className="text-muted ms-2">{pick(it, 'jam_mulai')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default TodayReminders