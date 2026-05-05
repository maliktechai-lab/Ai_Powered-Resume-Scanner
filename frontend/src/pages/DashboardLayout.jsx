import { Outlet, Navigate } from 'react-router-dom'
import Sidebar from '../components/common/Sidebar'
import useAuthStore from '../store/authStore'

export default function DashboardLayout({ requiredRole }) {
  const { token, role } = useAuthStore()
  if (!token) return <Navigate to="/" replace />
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />
  return (
    <div className="flex min-h-screen bg-gray-950 text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
