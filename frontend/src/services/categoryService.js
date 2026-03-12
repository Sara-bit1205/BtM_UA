import axios from 'axios'

const API = import.meta.env.VITE_API_URL

const categoryService = {
  getAll: () => axios.get(`${API}/categories`).then((r) => r.data),
  getById: (id) => axios.get(`${API}/categories/${id}`).then((r) => r.data),
  create: (data, token) =>
    axios.post(`${API}/categories`, data, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data),
  update: (id, data, token) =>
    axios.put(`${API}/categories/${id}`, data, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data),
  remove: (id, token) =>
    axios.delete(`${API}/categories/${id}`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data),
}

export default categoryService
