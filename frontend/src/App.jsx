import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardLayout from './pages/DashboardLayout'
import SeekerHome from './components/seeker/SeekerHome'
import UploadResume from './components/seeker/UploadResume'
import JobMatches from './components/seeker/JobMatches'
import RecruiterHome from './components/recruiter/RecruiterHome'
import PostJob from './components/recruiter/PostJob'
import RankCandidates from './components/recruiter/RankCandidates'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/seeker" element={<DashboardLayout requiredRole="seeker" />}>
          <Route index element={<SeekerHome />} />
          <Route path="upload" element={<UploadResume />} />
          <Route path="jobs" element={<JobMatches />} />
        </Route>
        <Route path="/recruiter" element={<DashboardLayout requiredRole="recruiter" />}>
          <Route index element={<RecruiterHome />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="rank" element={<RankCandidates />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
