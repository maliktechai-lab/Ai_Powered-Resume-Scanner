import { useEffect, useState } from 'react'
import api from '../../utils/api'

export default function RecruiterHome() {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    api.get('/jobs/').then(({ data }) => setJobs(data))
  }, [])

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Posted Jobs</h2>
      {jobs.length === 0 ? (
        <p className="text-gray-400">No jobs posted yet.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((j) => (
            <div key={j.id} className="bg-gray-800 rounded-xl p-4">
              <p className="text-white font-semibold">{j.title}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {j.required_skills.map((s) => (
                  <span key={s} className="text-xs bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
