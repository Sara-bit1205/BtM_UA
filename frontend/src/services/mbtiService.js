import axios from 'axios'

const API = import.meta.env.VITE_API_URL

const mbtiService = {
  getQuestions: () => axios.get(`${API}/mbti/questions`).then((r) => r.data),
  submitResult: (answers, token) =>
    axios.post(`${API}/mbti/result`, { answers }, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.data),
}

export default mbtiService
