import { useEffect, useState } from 'react'
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts'
import api from '../../utils/api'

export default function JobMatches() {
  const [jobs, setJobs] = useState([])
  const [resumes, setResumes] = useState([])
  const [selectedResume, setSelectedResume] = useState('')
  const [matches, setMatches] = useState({})
  const [loading, setLoading] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      api.get('/jobs/'),
      api.get('/resumes/mine'),
    ]).then(([jobsResponse, resumesResponse]) => {
      setJobs(jobsResponse.data)
      setResumes(resumesResponse.data)
      if (resumesResponse.data[0]) setSelectedResume(resumesResponse.data[0].id)
    }).catch(() => setError('Unable to load jobs or resumes. Please try again.'))
  }, [])

  const matchJob = async (jdId) => {
    if (!selectedResume) return
    setLoading((l) => ({ ...l, [jdId]: true }))
    setError('')
    try {
      const { data } = await api.get(`/jobs/${jdId}/match-my-resume?resume_id=${selectedResume}`)
      setMatches((m) => ({ ...m, [jdId]: data }))
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to match this resume.')
    } finally {
      setLoading((l) => ({ ...l, [jdId]: false }))
    }
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Job Matches</h2>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      {resumes.length > 0 && (
        <div className="mb-4">
          <label className="text-gray-400 text-sm mr-2">Resume:</label>
          <select className="input w-auto" value={selectedResume} onChange={(e) => setSelectedResume(e.target.value)}>
            {resumes.map((r) => <option key={r.id} value={r.id}>{r.filename}</option>)}
          </select>
        </div>
      )}
      <div className="grid gap-4">
        {jobs.map((job) => {
          const match = matches[job.id]
          return (
            <div key={job.id} className="bg-gray-800 rounded-xl p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-white font-semibold">{job.title}</h3>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {job.required_skills.slice(0, 6).map((s) => (
                      <span key={s} className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => matchJob(job.id)} disabled={loading[job.id] || !selectedResume}
                  className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg disabled:opacity-50">
                  {loading[job.id] ? '...' : 'Match'}
                </button>
              </div>
              {match && (
                <div className="mt-3 border-t border-gray-700 pt-3 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart innerRadius="60%" outerRadius="100%" data={[{ value: match.score, fill: '#6366f1' }]} startAngle={90} endAngle={-270}>
                          <RadialBar dataKey="value" cornerRadius={4} />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <p className="text-indigo-400 font-bold text-lg">{match.score}%</p>
                      <p className="text-gray-400 text-xs">Match Score</p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">Matched: {match.matched_skills.join(', ') || 'none'}</p>
                  <p className="text-red-400 text-sm">Missing: {match.missing_skills.join(', ') || 'none'}</p>
                  <p className="text-gray-400 text-xs italic">{match.explanation}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
