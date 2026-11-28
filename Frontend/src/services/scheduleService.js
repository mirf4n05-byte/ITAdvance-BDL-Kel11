import api from './api'

// ASUMSI SEMENTARA: ubah di sini kalau backend sudah jadi
export const generateSchedule = () => api.post('/schedules/generate')
export const getSchedules = () => api.get('/schedules')
export const completeSchedule = (id) => api.patch(`/schedules/${id}/complete`)
export const getTodayReminders = () => api.get('/reminders/today')