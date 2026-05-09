import axios from 'axios'

// In Docker: nginx proxies /api → backend. In dev: vite proxy handles /api → localhost:8000
const api = axios.create({ baseURL: "https://aipowered-resume-scanner-production.up.railway.app" || '/api' })

export default api
