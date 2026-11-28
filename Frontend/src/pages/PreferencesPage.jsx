import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBidangIT, getProfil, saveProfil } from '../services/profilService'

// Oracle mengembalikan nama kolom huruf besar, jadi baca dua-duanya
const pick = (obj, key) => obj?.[key.toUpperCase()] ?? obj?.[key.toLowerCase()]

function PreferencesPage() {
  const navigate = useNavigate()
  const [bidang, setBidang] = useState([])
  const [form, setForm] = useState({
    universitas: '',
    jurusan: '',
    semester: '',
    target_lulus: '',
    tingkat_awal: 'PEMULA',
    jam_belajar_harian: 1,
    waktu_pilihan: 'MALAM',
    cita_cita_karier: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const [bidangRes, profilRes] = await Promise.all([getBidangIT(), getProfil()])
        setBidang(bidangRes.data.bidang || [])

        if (profilRes.data.has_profil) {
          const p = profilRes.data.profil
          setForm({
            universitas: pick(p, 'universitas') || '',
            jurusan: pick(p, 'jurusan') || '',
            semester: pick(p, 'semester') || '',
            target_lulus: pick(p, 'target_lulus') || '',
            tingkat_awal: pick(p, 'tingkat_awal') || 'PEMULA',
            jam_belajar_harian: pick(p, 'jam_belajar_harian') || 1,
            waktu_pilihan: pick(p, 'waktu_pilihan') || 'MALAM',
            cita_cita_karier: pick(p, 'cita_cita_karier') || '',
          })
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Gagal memuat data. Pastikan backend jalan.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.cita_cita_karier) {
      setError('Pilih bidang IT yang kamu minati.')
      return
    }

    setSaving(true)
    try {
      await saveProfil(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan. Coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="container py-5 text-center">Memuat...</div>

  return (
    <div className="container py-4" style={{ maxWidth: 640 }}>
      <h2 className="mb-1">Preferensi Belajar</h2>
      <p className="text-muted">Isi dulu supaya jadwal belajarmu sesuai kebutuhan.</p>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Bidang IT yang diminati *</label>
          {/* ASUMSI SEMENTARA: backend belum punya kolom bidang, jadi disimpan di cita_cita_karier */}
          <select
            className="form-select"
            name="cita_cita_karier"
            value={form.cita_cita_karier}
            onChange={handleChange}
          >
            <option value="">-- Pilih bidang --</option>
            {bidang.map((b) => (
              <option key={pick(b, 'id_bidang')} value={pick(b, 'nama_bidang')}>
                {pick(b, 'nama_bidang')}
              </option>
            ))}
          </select>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Universitas</label>
            <input className="form-control" name="universitas" value={form.universitas} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Jurusan</label>
            <input className="form-control" name="jurusan" value={form.jurusan} onChange={handleChange} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Semester</label>
            <input type="number" min="1" max="14" className="form-control" name="semester" value={form.semester} onChange={handleChange} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Target lulus</label>
            <input type="date" className="form-control" name="target_lulus" value={form.target_lulus} onChange={handleChange} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Tingkat awal *</label>
            <select className="form-select" name="tingkat_awal" value={form.tingkat_awal} onChange={handleChange}>
              <option value="PEMULA">Pemula</option>
              <option value="MENENGAH">Menengah</option>
              <option value="MAHIR">Mahir</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Jam belajar per hari *</label>
            <input type="number" min="1" max="12" className="form-control" name="jam_belajar_harian" value={form.jam_belajar_harian} onChange={handleChange} />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Waktu pilihan *</label>
            <select className="form-select" name="waktu_pilihan" value={form.waktu_pilihan} onChange={handleChange}>
              <option value="PAGI">Pagi</option>
              <option value="SIANG">Siang</option>
              <option value="SORE">Sore</option>
              <option value="MALAM">Malam</option>
            </select>
          </div>
        </div>

        <button className="btn btn-primary w-100" disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
    </div>
  )
}

export default PreferencesPage