import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function LandingPage() {
  const navigate = useNavigate()
  const { setRole } = useAuthStore()

  const enterAs = (role) => {
    setRole(role)
    navigate(role === 'recruiter' ? '/recruiter' : '/seeker')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">AI Resume Scanner</h1>
        <p className="text-gray-400 mt-3 max-w-2xl">
          Match resumes to jobs instantly and review skill fit with clear explanations.
          Choose how you want to use the platform.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-10">
          <button
            type="button"
            onClick={() => enterAs('seeker')}
            className="text-left bg-gray-900 border border-gray-800 rounded-xl p-7 hover:border-indigo-500 transition-colors"
          >
            <p className="text-indigo-400 text-sm font-semibold">JOB SEEKER</p>
            <p className="text-2xl font-bold mt-2">Upload Resume</p>
            <p className="text-gray-400 mt-3 text-sm">
              Add your resume, extract skills, and compare your profile with open roles.
            </p>
          </button>

          <button
            type="button"
            onClick={() => enterAs('recruiter')}
            className="text-left bg-gray-900 border border-gray-800 rounded-xl p-7 hover:border-indigo-500 transition-colors"
          >
            <p className="text-indigo-400 text-sm font-semibold">RECRUITER</p>
            <p className="text-2xl font-bold mt-2">Rank Candidates</p>
            <p className="text-gray-400 mt-3 text-sm">
              Post job descriptions, upload candidate resumes, and rank matches by score.
            </p>
          </button>
        </div>
      </div>
    </div>
  )
}
