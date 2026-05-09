import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'

const seekerLinks = [
  { to: '/seeker', label: 'Home', end: true },
  { to: '/seeker/upload', label: 'Upload Resume' },
  { to: '/seeker/jobs', label: 'Job Matches' },
]

const recruiterLinks = [
  { to: '/recruiter', label: 'Home', end: true },
  { to: '/recruiter/post-job', label: 'Post Job' },
  { to: '/recruiter/rank', label: 'Rank Candidates' },
]

export default function Sidebar() {
  const { role, clearRole } = useAuthStore()
  const navigate = useNavigate()
  const links = role === 'recruiter' ? recruiterLinks : seekerLinks

  const handleSwitchRole = () => {
    clearRole()
    navigate('/')
  }

  return (
    <aside className="w-60 min-h-screen bg-gray-900 flex flex-col p-4 border-r border-gray-800">
      <div className="mb-8">
        <p className="text-indigo-400 font-bold text-lg">ResumeAI</p>
        <p className="text-gray-400 text-sm mt-1">Role selected</p>
        <span className="text-xs bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded-full capitalize">{role}</span>
      </div>
      <nav className="flex-1 space-y-1">
        {links.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `block px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`
            }>
            {label}
          </NavLink>
        ))}
      </nav>
      <button onClick={handleSwitchRole} className="text-gray-500 hover:text-red-400 text-sm mt-4 text-left px-3">
        Change Role
      </button>
    </aside>
  )
}
