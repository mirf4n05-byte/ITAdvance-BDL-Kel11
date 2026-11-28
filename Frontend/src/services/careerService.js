import api from './api'

export const getRoadmap = () => api.get('/karier/roadmap')
export const updateChecklist = (id, status) => api.patch(`/karier/${id}/status`, { status })