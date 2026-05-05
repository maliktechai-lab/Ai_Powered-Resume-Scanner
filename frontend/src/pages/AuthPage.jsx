import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import useAuthStore from '../store/authStore'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', full_name: '', role: 'seeker' })
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'login') {
        const params = new URLSearchParams({ username: form.email, password: form.password })
        const { data } = await api.post('/auth/login', params)
        login(data.access_token, data.role, data.full_name)
        navigate(data.role === 'recruiter' ? '/recruiter' : '/seeker')
      } else {
        await api.post('/auth/register', form)
        setMode('login')
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          🧠 AI Resume Scanner
        </h1>
        <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
          {['login', 'register'].map((m) => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${mode === m ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              {m === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>
        <form onSubmit={handle} className="space-y-4">
          {mode === 'register' && (
            <>
              <input className="input" placeholder="Full Name" value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
              <select className="input" value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="seeker">Job Seeker</option>
                <option value="recruiter">Recruiter</option>
              </select>
            </>
          )}
          <input className="input" type="email" placeholder="Email" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="input" type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold transition-colors">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
