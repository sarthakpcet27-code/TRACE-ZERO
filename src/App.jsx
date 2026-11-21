import { Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage'
import InvestigationBriefing from './pages/InvestigationBriefing'
import EvidenceLab from './pages/EvidenceLab'
import EvidenceCorrelation from './pages/EvidenceCorrelation'
import IncidentReconstruction from './pages/IncidentReconstruction'
import DefenseReplay from './pages/DefenseReplay'
import ForensicReport from './pages/ForensicReport'
import LoadingScreen from './components/LoadingScreen'
import NoiseOverlay from './components/NoiseOverlay'

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AuthProvider>
      <NoiseOverlay />
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen key="loading" onComplete={() => setLoading(false)} />
        ) : (
          <Routes>
            {/* Public Auth Route */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Application Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <LandingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/investigate"
              element={
                <ProtectedRoute>
                  <InvestigationBriefing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/lab"
              element={
                <ProtectedRoute>
                  <EvidenceLab />
                </ProtectedRoute>
              }
            />
            <Route
              path="/correlate"
              element={
                <ProtectedRoute>
                  <EvidenceCorrelation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reconstruct"
              element={
                <ProtectedRoute>
                  <IncidentReconstruction />
                </ProtectedRoute>
              }
            />
            <Route
              path="/replay"
              element={
                <ProtectedRoute>
                  <DefenseReplay />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <ForensicReport />
                </ProtectedRoute>
              }
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </AnimatePresence>
    </AuthProvider>
  )
}
