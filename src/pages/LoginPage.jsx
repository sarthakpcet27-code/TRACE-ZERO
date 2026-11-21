/* ═══════════════════════════════════════════════════════════════
   Login Page — TRACE//ZERO
   ANALYST ACCESS authentication screen.
   ═══════════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, User, Mail, Lock, Shield, Terminal, ChevronRight, Fingerprint } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getPasswordStrength } from '../services/authService'

/* ── Matrix Rain Background ── */
function MatrixRain() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>{}[]|/\\~^αβγδεφ░▒▓█'
    const fontSize = 13
    const cols = Math.ceil(canvas.width / fontSize)
    const drops = Array.from({ length: cols }, () => Math.random() * -50)

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const draw = () => {
      ctx.fillStyle = 'rgba(8, 10, 10, 0.06)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'rgba(183, 255, 60, 0.12)'
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`

      for (let i = 0; i < drops.length; i++) {
        const ch = chars[Math.floor(Math.random() * chars.length)]
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Vary brightness for depth
        const brightness = Math.random() > 0.95 ? '0.5' : '0.08'
        ctx.fillStyle = `rgba(183, 255, 60, ${brightness})`
        ctx.fillText(ch, x, y)

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += 0.5
      }
      animId = requestAnimationFrame(draw)
    }

    if (!prefersReduced) {
      draw()
    }

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
}

/* ── Terminal Boot Sequence ── */
function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([])
  const bootLines = [
    { text: '> INITIALIZING SECURE CHANNEL...', delay: 200 },
    { text: '> ENCRYPTED TUNNEL ESTABLISHED .............. OK', delay: 600 },
    { text: '> LOADING FORENSIC PROTOCOLS ................ OK', delay: 400 },
    { text: '> VERIFYING SYSTEM INTEGRITY ................ OK', delay: 500 },
    { text: '> TRACE//ZERO v2.049 READY', delay: 300 },
    { text: '> AWAITING ANALYST CREDENTIALS', delay: 400 },
  ]

  useEffect(() => {
    let timeout
    let idx = 0

    const addLine = () => {
      if (idx >= bootLines.length) {
        setTimeout(onComplete, 600)
        return
      }
      setLines(prev => [...prev, bootLines[idx].text])
      timeout = setTimeout(() => {
        idx++
        addLine()
      }, bootLines[idx].delay)
    }

    timeout = setTimeout(addLine, 500)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="font-mono text-[11px] leading-relaxed space-y-1">
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className={line.includes('OK') || line.includes('READY')
            ? 'text-[#B7FF3C]/80'
            : 'text-[#6B7280]'
          }
        >
          {line}
        </motion.div>
      ))}
      {lines.length < bootLines.length && (
        <span className="text-[#B7FF3C] blink-cursor text-xs">&nbsp;</span>
      )}
    </div>
  )
}

/* ── Password Strength Bar ── */
function StrengthMeter({ password }) {
  const { score, label, color } = getPasswordStrength(password)
  if (!password) return null
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className="h-[3px] flex-1 rounded-full transition-all duration-300"
            style={{ backgroundColor: i <= score ? color : '#1F2937' }}
          />
        ))}
      </div>
      <p className="text-[9px] font-mono tracking-widest" style={{ color }}>
        SECURITY LEVEL: {label}
      </p>
    </div>
  )
}

/* ── Main Login Page ── */
export default function LoginPage() {
  const navigate = useNavigate()
  const { login, register, loginAsGuest, isAuthenticated } = useAuth()

  const [booting, setBooting] = useState(true)
  const [tab, setTab] = useState('login') // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [status, setStatus] = useState(null) // { type: 'error' | 'success', message }
  const [submitting, setSubmitting] = useState(false)
  const [accessGranted, setAccessGranted] = useState(false)

  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [callsign, setCallsign] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  const resetForm = useCallback(() => {
    setEmail('')
    setPassword('')
    setCallsign('')
    setConfirmPassword('')
    setStatus(null)
    setShowPassword(false)
    setShowConfirmPassword(false)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setStatus(null)

    const result = await login(email, password)
    if (result.success) {
      setAccessGranted(true)
      setStatus({ type: 'success', message: 'ACCESS GRANTED — WELCOME, ANALYST' })
      setTimeout(() => navigate('/', { replace: true }), 1800)
    } else {
      setStatus({ type: 'error', message: result.error })
    }
    setSubmitting(false)
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (submitting) return

    if (password !== confirmPassword) {
      setStatus({ type: 'error', message: 'PASSWORD MISMATCH DETECTED' })
      return
    }

    setSubmitting(true)
    setStatus(null)

    const result = await register(callsign, email, password)
    if (result.success) {
      setAccessGranted(true)
      setStatus({ type: 'success', message: 'IDENTITY REGISTERED — ACCESS GRANTED' })
      setTimeout(() => navigate('/', { replace: true }), 1800)
    } else {
      setStatus({ type: 'error', message: result.error })
    }
    setSubmitting(false)
  }

  const handleGuest = () => {
    loginAsGuest()
    setAccessGranted(true)
    setStatus({ type: 'success', message: 'GUEST ACCESS GRANTED — DEMO MODE' })
    setTimeout(() => navigate('/', { replace: true }), 1200)
  }

  return (
    <div className="fixed inset-0 bg-[#080A0A] flex items-center justify-center overflow-hidden">
      {/* Matrix rain background */}
      <MatrixRain />

      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-[1]" aria-hidden="true">
        <div className="scan-line" />
      </div>

      {/* Grid background */}
      <div className="fixed inset-0 grid-bg-animated pointer-events-none" aria-hidden="true" />

      {/* Vignette */}
      <div className="fixed inset-0 pointer-events-none z-[1]" aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(8,10,10,0.8) 100%)' }}
      />

      {/* Auth Card */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-4"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Glow behind card */}
        <div className="absolute -inset-1 bg-[#B7FF3C]/[0.03] blur-xl rounded-sm" aria-hidden="true" />

        <div className="relative border border-[#1F2937]/80 bg-[#080A0A]/90 backdrop-blur-xl overflow-hidden">
          {/* Top accent line */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#B7FF3C] to-transparent" />

          {/* Header */}
          <div className="px-6 pt-6 pb-4 text-center border-b border-[#1F2937]/50">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <Shield size={20} className="text-[#B7FF3C]" />
              <span className="text-sm font-bold tracking-[0.25em] text-white">
                TRACE<span className="text-[#B7FF3C]">//</span>ZERO
              </span>
            </div>
            <p className="text-[10px] font-mono tracking-[0.2em] text-[#6B7280] mb-4">
              EVERY BREACH LEAVES A TRACE.
            </p>

            {/* Boot sequence or Access Granted */}
            <AnimatePresence mode="wait">
              {accessGranted ? (
                <motion.div
                  key="granted"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-4"
                >
                  <Fingerprint size={40} className="text-[#B7FF3C] mx-auto mb-2" />
                  <p className="text-sm font-mono font-bold tracking-[0.2em] text-[#B7FF3C] text-glow-green">
                    ACCESS GRANTED
                  </p>
                </motion.div>
              ) : booting ? (
                <motion.div key="boot" exit={{ opacity: 0 }} className="py-2 text-left">
                  <BootSequence onComplete={() => setBooting(false)} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* Don't show form during boot or access granted */}
          {!booting && !accessGranted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Tab Switcher */}
              <div className="flex border-b border-[#1F2937]/50">
                {['login', 'register'].map(t => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); resetForm() }}
                    className={`flex-1 py-3 text-[11px] font-mono font-bold tracking-[0.2em] transition-all cursor-pointer ${
                      tab === t
                        ? 'text-[#B7FF3C] border-b-2 border-[#B7FF3C] bg-[#B7FF3C]/[0.03]'
                        : 'text-[#6B7280] hover:text-[#9CA3AF] border-b-2 border-transparent'
                    }`}
                  >
                    {t === 'login' ? 'LOGIN' : 'REGISTER'}
                  </button>
                ))}
              </div>

              {/* Form */}
              <form
                onSubmit={tab === 'login' ? handleLogin : handleRegister}
                className="p-6 space-y-4"
              >
                {/* Register: Callsign */}
                <AnimatePresence mode="wait">
                  {tab === 'register' && (
                    <motion.div
                      key="callsign"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-[9px] font-mono tracking-[0.2em] text-[#6B7280] mb-1.5">
                        CALLSIGN (DISPLAY NAME)
                      </label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" />
                        <input
                          type="text"
                          value={callsign}
                          onChange={e => setCallsign(e.target.value)}
                          placeholder="SHADOW_ANALYST"
                          className="w-full bg-[#0A0D0D] border border-[#1F2937] text-white text-xs font-mono pl-9 pr-4 py-3 tracking-wider placeholder:text-[#2a3a3a] focus:outline-none focus:border-[#B7FF3C]/50 transition-colors"
                          required
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
                <div>
                  <label className="block text-[9px] font-mono tracking-[0.2em] text-[#6B7280] mb-1.5">
                    ANALYST EMAIL
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="analyst@nexora.dev"
                      className="w-full bg-[#0A0D0D] border border-[#1F2937] text-white text-xs font-mono pl-9 pr-4 py-3 tracking-wider placeholder:text-[#2a3a3a] focus:outline-none focus:border-[#B7FF3C]/50 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[9px] font-mono tracking-[0.2em] text-[#6B7280] mb-1.5">
                    PASSWORD
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#0A0D0D] border border-[#1F2937] text-white text-xs font-mono pl-9 pr-10 py-3 tracking-wider placeholder:text-[#2a3a3a] focus:outline-none focus:border-[#B7FF3C]/50 transition-colors"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#9CA3AF] cursor-pointer transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  {tab === 'register' && <StrengthMeter password={password} />}
                </div>

                {/* Register: Confirm Password */}
                <AnimatePresence mode="wait">
                  {tab === 'register' && (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label className="block text-[9px] font-mono tracking-[0.2em] text-[#6B7280] mb-1.5">
                        CONFIRM PASSWORD
                      </label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4B5563]" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#0A0D0D] border border-[#1F2937] text-white text-xs font-mono pl-9 pr-10 py-3 tracking-wider placeholder:text-[#2a3a3a] focus:outline-none focus:border-[#B7FF3C]/50 transition-colors"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#9CA3AF] cursor-pointer transition-colors"
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Status Message */}
                <AnimatePresence>
                  {status && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className={`text-[10px] font-mono tracking-wider px-3 py-2.5 border ${
                        status.type === 'error'
                          ? 'text-[#DC2626] border-[#DC2626]/30 bg-[#DC2626]/5'
                          : 'text-[#B7FF3C] border-[#B7FF3C]/30 bg-[#B7FF3C]/5'
                      }`}
                    >
                      <Terminal size={10} className="inline mr-2" />
                      {status.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full text-[11px] font-mono font-bold tracking-[0.2em] text-[#080A0A] bg-[#B7FF3C] py-3.5 hover:bg-[#c8ff66] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(183,255,60,0.3)] active:scale-[0.98]"
                >
                  {submitting
                    ? '⟳ AUTHENTICATING...'
                    : tab === 'login'
                      ? 'AUTHENTICATE'
                      : 'REGISTER IDENTITY'
                  }
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1">
                  <div className="flex-1 h-[1px] bg-[#1F2937]" />
                  <span className="text-[8px] font-mono tracking-[0.3em] text-[#4B5563]">OR</span>
                  <div className="flex-1 h-[1px] bg-[#1F2937]" />
                </div>

                {/* Guest Button */}
                <button
                  type="button"
                  onClick={handleGuest}
                  className="w-full group text-[10px] font-mono tracking-[0.15em] text-[#6B7280] border border-[#1F2937] py-3 hover:text-[#B7FF3C] hover:border-[#B7FF3C]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ChevronRight size={12} className="text-[#4B5563] group-hover:text-[#B7FF3C] transition-colors" />
                  CONTINUE AS GUEST (DEMO MODE)
                </button>
              </form>

              {/* Demo credentials hint */}
              <div className="px-6 pb-5 pt-1">
                <div className="border border-[#1a2222] bg-[#0A0D0D] p-3">
                  <p className="text-[8px] font-mono tracking-[0.2em] text-[#4B5563] mb-1">DEMO CREDENTIALS</p>
                  <p className="text-[10px] font-mono text-[#6B7280]">
                    <span className="text-[#22D3EE]">analyst@nexora.dev</span>
                    {' / '}
                    <span className="text-[#22D3EE]">Trace@2849</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Bottom accent line */}
          <div className="h-[1px] bg-gradient-to-r from-transparent via-[#1F2937] to-transparent" />
        </div>

        {/* Case reference */}
        <div className="mt-4 text-center">
          <p className="text-[9px] font-mono tracking-[0.2em] text-[#2a3a3a]">
            CASE #TR-2049 · THE MIDNIGHT BREACH · NEXORA TECHNOLOGIES
          </p>
        </div>
      </motion.div>
    </div>
  )
}
