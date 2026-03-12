import axios from 'axios'

const API = import.meta.env.VITE_API_URL

const authService = {
  register: (data) => axios.post(`${API}/auth/register`, data).then((r) => r.data),
  login: (data) => axios.post(`${API}/auth/login`, data).then((r) => r.data),
  verifyEmail: (token) => axios.get(`${API}/auth/verify/${token}`).then((r) => r.data),
}

export default authService
