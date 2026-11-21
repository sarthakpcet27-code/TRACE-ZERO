/* ═══════════════════════════════════════════════════════════════
   Navbar — TRACE//ZERO
   Unified technical header with user session, analyst rank,
   leaderboard, onboarding guide, and navigation.
   ═══════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Trophy, HelpCircle, LogOut, Shield, Award, Terminal } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { calculateUserXP, getRankDetails } from '../services/rankService'
import LeaderboardModal from './LeaderboardModal'
import OnboardingModal from './OnboardingModal'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [xp, setXp] = useState(0)

  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Update rank & XP
  const updateRankState = useCallback(() => {
    if (user?.id) {
      const userXp = calculateUserXP(user.id)
      setXp(userXp)
    }
  }, [user])

  useEffect(() => {
    updateRankState()

    const handleProgressUpdate = () => updateRankState()
    window.addEventListener('trace-zero-progress-updated', handleProgressUpdate)
    window.addEventListener('storage', handleProgressUpdate)

    const handleScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('trace-zero-progress-updated', handleProgressUpdate)
      window.removeEventListener('storage', handleProgressUpdate)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [updateRankState])

  const rankInfo = getRankDetails(xp)

  const scrollTo = (id) => {
    setMobileOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 150)
      return
    }
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const navLinks = [
    { label: 'Overview', target: 'hero' },
    { label: 'Protocol', target: 'protocol' },
    { label: 'Case File', target: 'casefile' },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#080A0A]/95 backdrop-blur-md border-b border-[#1F2937]/70 shadow-[0_4px_25px_rgba(0,0,0,0.5)]'
            : 'bg-[#080A0A]/60 backdrop-blur-sm border-b border-[#1F2937]/30'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => {
              if (location.pathname !== '/') navigate('/')
              else window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="flex items-center gap-3 group cursor-pointer focus:outline-none shrink-0"
          >
            <div className="relative w-7 h-7 flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <circle
                  cx="16"
                  cy="16"
                  r="10"
                  fill="none"
                  stroke="#B7FF3C"
                  strokeWidth="1.2"
                  className="group-hover:drop-shadow-[0_0_8px_rgba(183,255,60,0.6)] transition-all"
                />
                <circle cx="16" cy="16" r="4.5" fill="none" stroke="#B7FF3C" strokeWidth="0.8" opacity="0.6" />
                <circle cx="16" cy="16" r="2" fill="#B7FF3C" />
                <line x1="16" y1="2" x2="16" y2="9" stroke="#B7FF3C" strokeWidth="0.8" opacity="0.6" />
                <line x1="16" y1="23" x2="16" y2="30" stroke="#B7FF3C" strokeWidth="0.8" opacity="0.6" />
                <line x1="2" y1="16" x2="9" y2="16" stroke="#B7FF3C" strokeWidth="0.8" opacity="0.6" />
                <line x1="23" y1="16" x2="30" y2="16" stroke="#B7FF3C" strokeWidth="0.8" opacity="0.6" />
              </svg>
            </div>
            <span className="text-sm font-mono font-bold tracking-[0.2em] text-white">
              TRACE<span className="text-[#B7FF3C]">//</span>ZERO
            </span>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollTo(link.target)}
                className="text-xs font-mono tracking-[0.18em] text-[#9CA3AF] hover:text-[#B7FF3C] transition-colors uppercase cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Controls: User info, Leaderboard, Help, CTA, Logout */}
          <div className="hidden md:flex items-center gap-3 sm:gap-4">
            {/* Analyst Info & Rank Badge */}
            {user && (
              <div className="flex items-center gap-2 px-3 py-1.5 border border-[#1F2937] bg-[#0A0D0D]/90">
                <div className="w-2 h-2 rounded-full bg-[#B7FF3C] animate-pulse" />
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-white tracking-wider">
                      {user.callsign || 'ANALYST'}
                    </span>
                    <span
                      className="text-[8px] font-mono font-bold px-1.5 py-0.2 border"
                      style={{
                        color: rankInfo.current.color,
                        borderColor: `${rankInfo.current.color}40`,
                        backgroundColor: `${rankInfo.current.color}10`,
                      }}
                    >
                      {rankInfo.current.badge}
                    </span>
                  </div>
                  <span className="text-[8px] font-mono text-[#6B7280] tracking-widest">
                    {xp} XP · {rankInfo.current.name}
                  </span>
                </div>
              </div>
            )}

            {/* Leaderboard button */}
            <button
              onClick={() => setShowLeaderboard(true)}
              className="p-2 border border-[#1F2937] bg-[#0A0D0D] text-[#D1D5DB] hover:text-[#F59E0B] hover:border-[#F59E0B]/40 transition-colors cursor-pointer"
              title="View Leaderboard"
              aria-label="View Leaderboard"
            >
              <Trophy size={15} />
            </button>

            {/* Onboarding Help button */}
            <button
              onClick={() => setShowOnboarding(true)}
              className="p-2 border border-[#1F2937] bg-[#0A0D0D] text-[#D1D5DB] hover:text-[#22D3EE] hover:border-[#22D3EE]/40 transition-colors cursor-pointer"
              title="Investigation Protocol Guide"
              aria-label="Investigation Protocol Guide"
            >
              <HelpCircle size={15} />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => navigate('/investigate')}
              className="text-[11px] font-mono tracking-[0.15em] font-semibold text-[#080A0A] bg-[#B7FF3C] px-3.5 py-2 hover:bg-[#c8ff66] transition-all cursor-pointer hover:shadow-[0_0_20px_rgba(183,255,60,0.35)] active:scale-95"
            >
              INITIALIZE INVESTIGATION
            </button>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="p-2 text-[#6B7280] hover:text-[#DC2626] transition-colors cursor-pointer"
              title="Logout Analyst"
              aria-label="Logout Analyst"
            >
              <LogOut size={16} />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setShowLeaderboard(true)}
              className="p-1.5 text-[#D1D5DB] border border-[#1F2937] cursor-pointer"
              aria-label="Leaderboard"
            >
              <Trophy size={14} />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-white p-2 cursor-pointer focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} className="text-[#B7FF3C]" /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden bg-[#080A0A]/98 backdrop-blur-md border-b border-[#1F2937] overflow-hidden"
            >
              <div className="px-6 py-5 flex flex-col gap-4">
                {user && (
                  <div className="flex items-center justify-between pb-3 border-b border-[#1F2937]">
                    <div>
                      <p className="text-xs font-mono font-bold text-white tracking-wider">
                        {user.callsign}
                      </p>
                      <p className="text-[10px] font-mono text-[#B7FF3C]">
                        {rankInfo.current.name} · {xp} XP
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-[10px] font-mono text-[#DC2626] border border-[#DC2626]/30 px-2 py-1 flex items-center gap-1"
                    >
                      <LogOut size={12} />
                      LOGOUT
                    </button>
                  </div>
                )}

                {navLinks.map((link) => (
                  <button
                    key={link.target}
                    onClick={() => scrollTo(link.target)}
                    className="text-xs font-mono tracking-[0.18em] text-[#9CA3AF] hover:text-[#B7FF3C] text-left uppercase py-1"
                  >
                    {link.label}
                  </button>
                ))}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      setShowOnboarding(true)
                    }}
                    className="flex-1 py-2 text-center text-[10px] font-mono border border-[#1F2937] text-[#D1D5DB]"
                  >
                    PROTOCOL GUIDE
                  </button>
                  <button
                    onClick={() => {
                      setMobileOpen(false)
                      setShowLeaderboard(true)
                    }}
                    className="flex-1 py-2 text-center text-[10px] font-mono border border-[#1F2937] text-[#F59E0B]"
                  >
                    LEADERBOARD
                  </button>
                </div>

                <button
                  onClick={() => {
                    setMobileOpen(false)
                    navigate('/investigate')
                  }}
                  className="text-[11px] font-mono font-bold tracking-[0.15em] text-[#080A0A] bg-[#B7FF3C] py-3 text-center mt-1"
                >
                  INITIALIZE INVESTIGATION
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Modals */}
      <LeaderboardModal isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
      <OnboardingModal forceOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
    </>
  )
}
