import { useEffect, useState } from 'react'
import api from '../../utils/api'

export default function SeekerHome() {
  const [resumes, setResumes] = useState([])

  useEffect(() => {
    api.get('/resumes/mine').then(({ data }) => setResumes(data))
  }, [])

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">My Resumes</h2>
      {resumes.length === 0 ? (
        <p className="text-gray-400">No resumes yet. Upload one to get started!</p>
      ) : (
        <div className="grid gap-4">
          {resumes.map((r) => (
            <div key={r.id} className="bg-gray-800 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-white font-medium">{r.filename}</p>
                {r.ats_score && (
                  <span className="text-indigo-400 font-bold">{r.ats_score}%</span>
                )}
              </div>
              <div className="flex flex-wrap gap-1">
                {r.skills.map((s) => (
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
