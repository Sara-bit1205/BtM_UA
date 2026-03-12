import axios from 'axios'

const API = import.meta.env.VITE_API_URL

const characterService = {
  getAll: (params) => axios.get(`${API}/characters`, { params }).then((r) => r.data),
  getById: (id) => axios.get(`${API}/characters/${id}`).then((r) => r.data),
  create: (data, token) =>
    axios.post(`${API}/characters`, data, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data),
  update: (id, data, token) =>
    axios.put(`${API}/characters/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data),
  remove: (id, token) =>
    axios.delete(`${API}/characters/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data),
  getByMBTI: (mbtiType) => axios.get(`${API}/characters/mbti/${mbtiType}`).then((r) => r.data),
}

export default characterService
