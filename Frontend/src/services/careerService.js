import api from './api'

// ASUMSI SEMENTARA: ubah di sini kalau backend sudah jadi
export const getRoadmap = () => api.get('/career/roadmap')
export const updateChecklist = (itemId, status) =>
  api.patch(`/career/checklist/${itemId}`, { status })
export const saveLinkedin = (linkedin_url) => api.put('/career/linkedin', { linkedin_url })
export const getLinkedinSummary = () => api.get('/career/linkedin-summary')