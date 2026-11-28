import api from './api'

export const generateSchedule = () => api.post('/jadwal/generate', {})
export const getSchedules = () => api.get('/jadwal')
export const completeSchedule = (id, catatan_hasil) =>
  api.patch(`/jadwal/${id}/selesai`, { catatan_hasil })

export const getPengingat = () => api.get('/pengingat')
export const addPengingat = (pesan, waktu_pengingat) =>
  api.post('/pengingat', { pesan, waktu_pengingat })