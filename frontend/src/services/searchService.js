import axios from 'axios'

const API = import.meta.env.VITE_API_URL

// Búsqueda de personajes con filtros opcionales
// params: { query, universe, personality, mbtiType }
const searchService = {
  search: (params) => axios.get(`${API}/search`, { params }).then((r) => r.data),
}

export default searchService
