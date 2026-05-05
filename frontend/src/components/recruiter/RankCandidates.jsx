import { useEffect, useState } from 'react'
import api from '../../utils/api'

export default function RankCandidates() {
  const [jobs, setJobs] = useState([])
  const [selectedJob, setSelectedJob] = useState('')
  const [files, setFiles] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/jobs/').then(({ data }) => { setJobs(data); if (data[0]) setSelectedJob(data[0].id) })
  }, [])

  const rank = async (e) => {
    e.preventDefault()
    if (!selectedJob || files.length === 0) return
    setLoading(true)
    const fd = new FormData()
    Array.from(files).forEach((f) => fd.append('files', f))
    const { data } = await api.post(`/jobs/${selectedJob}/rank`, fd)
    setResults(data)
    setLoading(false)
  }

  const scoreColor = (score) => score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400'

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Rank Candidates</h2>
      <form onSubmit={rank} className="bg-gray-800 rounded-xl p-5 space-y-4 mb-6">
        <div>
          <label className="text-gray-400 text-sm block mb-1">Select Job</label>
          <select className="input" value={selectedJob} onChange={(e) => setSelectedJob(e.target.value)}>
            {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
          </select>
        </div>
        <div>
          <label className="text-gray-400 text-sm block mb-1">Upload Resumes (PDF/DOCX)</label>
          <input type="file" accept=".pdf,.docx" multiple className="text-gray-300 text-sm"
            onChange={(e) => setFiles(e.target.files)} />
        </div>
        <button type="submit" disabled={loading || !files.length}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg font-semibold">
          {loading ? 'Ranking...' : '🏆 Rank Candidates'}
        </button>
      </form>

      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-white font-semibold">Results (ranked by score)</h3>
          {results.map((r, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-5 border border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-500">#{i + 1}</span>
                  <p className="text-white font-medium">{r.filename}</p>
                </div>
                <span className={`text-2xl font-bold ${scoreColor(r.score)}`}>{r.score}%</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">✅ Matched Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {r.matched_skills.length ? r.matched_skills.map((s) => (
                      <span key={s} className="bg-green-900 text-green-300 px-2 py-0.5 rounded-full text-xs">{s}</span>
                    )) : <span className="text-gray-500 text-xs">none</span>}
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">❌ Missing Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {r.missing_skills.length ? r.missing_skills.map((s) => (
                      <span key={s} className="bg-red-900 text-red-300 px-2 py-0.5 rounded-full text-xs">{s}</span>
                    )) : <span className="text-gray-500 text-xs">none</span>}
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-xs mt-3 italic border-t border-gray-700 pt-2">{r.explanation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
