import axios from 'axios'

const API = import.meta.env.VITE_API_URL

const getAuthHeaders = (token) => ({ headers: { Authorization: `Bearer ${token}` } })

const userService = {
  getProfile: (token) => axios.get(`${API}/users/me`, getAuthHeaders(token)).then((r) => r.data),
  updateProfile: (data, token) => axios.put(`${API}/users/me`, data, getAuthHeaders(token)).then((r) => r.data),
  deleteAccount: (token) => axios.delete(`${API}/users/me`, getAuthHeaders(token)).then((r) => r.data),
  getFavorites: (token) => axios.get(`${API}/users/me/favorites`, getAuthHeaders(token)).then((r) => r.data),
  addFavorite: (characterId, token) =>
    axios.post(`${API}/users/me/favorites/${characterId}`, {}, getAuthHeaders(token)).then((r) => r.data),
  removeFavorite: (characterId, token) =>
    axios.delete(`${API}/users/me/favorites/${characterId}`, getAuthHeaders(token)).then((r) => r.data),
  // Solo admin
  getAll: (token) => axios.get(`${API}/users`, getAuthHeaders(token)).then((r) => r.data),
}

export default userService
