import { useState } from 'react'
import api from '../../utils/api'

export default function UploadResume() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const upload = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true); setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const { data } = await api.post('/resumes/upload', fd)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-bold text-white mb-4">Upload Resume</h2>
      <form onSubmit={upload} className="bg-gray-800 rounded-xl p-6 space-y-4">
        <label className="block border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors">
          <input type="file" accept=".pdf,.docx" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
          {file ? (
            <p className="text-indigo-400">{file.name}</p>
          ) : (
            <p className="text-gray-400">Drop PDF or DOCX here, or click to browse</p>
          )}
        </label>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={!file || loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white py-2.5 rounded-lg font-semibold transition-colors">
          {loading ? 'Analyzing...' : 'Upload & Analyze'}
        </button>
      </form>

      {result && (
        <div className="mt-6 bg-gray-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-3">✅ Extracted Skills</h3>
          <div className="flex flex-wrap gap-2">
            {result.skills.map((s) => (
              <span key={s} className="text-sm bg-indigo-900 text-indigo-300 px-3 py-1 rounded-full">{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
