import { useState } from 'react'
import api from '../../utils/api'

export default function PostJob() {
  const [form, setForm] = useState({ title: '', description: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { data } = await api.post('/jobs/', form)
    setResult(data)
    setLoading(false)
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-bold text-white mb-4">Post Job Description</h2>
      <form onSubmit={submit} className="bg-gray-800 rounded-xl p-6 space-y-4">
        <input className="input" placeholder="Job Title" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea className="input h-40 resize-none" placeholder="Paste full job description..."
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <button type="submit" disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold">
          {loading ? 'Analyzing...' : 'Post & Extract Skills'}
        </button>
      </form>
      {result && (
        <div className="mt-4 bg-gray-800 rounded-xl p-5">
          <p className="text-white font-semibold mb-2">✅ Extracted Required Skills</p>
          <div className="flex flex-wrap gap-2">
            {result.required_skills.map((s) => (
              <span key={s} className="text-sm bg-indigo-900 text-indigo-300 px-3 py-1 rounded-full">{s}</span>
            ))}
          </div>
          <p className="text-gray-500 text-xs mt-3">Job ID: {result.id}</p>
        </div>
      )}
    </div>
  )
}
