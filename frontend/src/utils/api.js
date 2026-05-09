import axios from 'axios'

// In Docker: nginx proxies /api → backend. In dev: vite proxy handles /api → localhost:8000
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '/api' })

export default api
