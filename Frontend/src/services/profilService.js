import api from './api'

export const getBidangIT = () => api.get('/profil/bidang')
export const getProfil = () => api.get('/profil')

// ASUMSI SEMENTARA nama field: universitas, jurusan, semester, target_lulus,
// tingkat_awal, jam_belajar_harian, waktu_pilihan, cita_cita_karier
export const saveProfil = (data) => api.put('/profil', data)