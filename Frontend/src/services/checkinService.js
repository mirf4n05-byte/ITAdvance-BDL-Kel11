import api from './api'

export const getCheckinStatus = () => api.get('/checkin/status')
// ASUMSI SEMENTARA: body berisi { catatan } (opsional)
export const doCheckin = (catatan) => api.post('/checkin', { catatan })