import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

/* ═══════════════════════════════════════════════════════════════════
   TransitionOverlay — Cinematic system-init screen shown when
   navigating from landing → investigation briefing.
   Props:
     active  : boolean  — when true the overlay is visible
     onDone  : fn       — called when the boot sequence finishes
   ═══════════════════════════════════════════════════════════════════ */

const BOOT_LINES = [
  { delay: 0.1,  text: 'TRACE//ZERO FORENSIC OS v2.049' },
  { delay: 0.35, text: 'SECURE CHANNEL ESTABLISHED' },
  { delay: 0.55, text: 'INITIALIZING INVESTIGATION PROTOCOL...' },
  { delay: 0.78, text: 'ACCESSING CASE ARCHIVE...' },
  { delay: 1.02, text: 'DECRYPTING EVIDENCE MANIFEST...' },
  { delay: 1.28, text: 'CASE #TR-2049 — NEXORA BREACH — LOADED.' },
  { delay: 1.55, text: 'CLEARANCE LEVEL 4 CONFIRMED.' },
]

function GlitchBar() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="glitch-bar"
          style={{
            animationDelay: `${i * 0.18}s`,
            top: `${15 + i * 22}%`,
          }}
        />
      ))}
    </div>
  )
}

export default function TransitionOverlay({ active, onDone }) {
  const [progress, setProgress] = useState(0)
  const [linesVisible, setLinesVisible] = useState(0)

  useEffect(() => {
    if (!active) {
      setProgress(0)
      setLinesVisible(0)
      return
    }

    const handleKey = (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        onDone?.()
      }
    }
    window.addEventListener('keydown', handleKey)

    // drive progress bar over ~1.8 s
    let pVal = 0
    const pInterval = setInterval(() => {
      pVal += 100 / 60 // reach 100 in ~60 ticks × 30ms = 1.8s
      setProgress(Math.min(pVal, 100))
      if (pVal >= 100) clearInterval(pInterval)
    }, 30)

    // reveal boot lines one by one
    BOOT_LINES.forEach((_, i) => {
      setTimeout(() => setLinesVisible(i + 1), BOOT_LINES[i].delay * 1000)
    })

    // fire done after 2.1 s — parent will navigate / reveal
    const done = setTimeout(() => {
      onDone?.()
    }, 2100)

    return () => {
      window.removeEventListener('keydown', handleKey)
      clearInterval(pInterval)
      clearTimeout(done)
    }
  }, [active, onDone])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="transition"
          className="fixed inset-0 z-[9000] bg-[#080A0A] flex flex-col items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
          transition={{ duration: 0.15 }}
        >
          {/* Grid background */}
          <div className="absolute inset-0 grid-bg opacity-60" />

          {/* Scan line */}
          <div className="scan-line" />

          {/* Glitch bars */}
          <GlitchBar />

          {/* Central HUD panel */}
          <div className="relative z-10 w-full max-w-lg px-6">
            {/* Top bracket + logo */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#B7FF3C]/40" />
              <span className="text-xs font-mono tracking-[0.3em] text-[#B7FF3C]">
                TRACE<span className="opacity-60">//</span>ZERO
              </span>
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#B7FF3C]/40" />
            </div>

            {/* System icon */}
            <div className="flex justify-center mb-8">
              <div className="relative w-20 h-20">
                {/* Rotating outer ring */}
                <svg viewBox="0 0 80 80" className="w-full h-full transition-overlay-spin">
                  <circle cx="40" cy="40" r="36" fill="none" stroke="#B7FF3C" strokeWidth="0.6" strokeDasharray="6 4" opacity="0.4" />
                  <circle cx="40" cy="40" r="28" fill="none" stroke="#22D3EE" strokeWidth="0.4" strokeDasharray="3 6" opacity="0.25" />
                </svg>
                {/* Static center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 40 40" className="w-12 h-12">
                    <circle cx="20" cy="20" r="12" fill="none" stroke="#B7FF3C" strokeWidth="0.8" opacity="0.6" />
                    <circle cx="20" cy="20" r="5"  fill="none" stroke="#B7FF3C" strokeWidth="0.5" opacity="0.4" />
                    <circle cx="20" cy="20" r="2"  fill="#B7FF3C" />
                    <line x1="20" y1="4"  x2="20" y2="12" stroke="#B7FF3C" strokeWidth="0.7" opacity="0.5" />
                    <line x1="20" y1="28" x2="20" y2="36" stroke="#B7FF3C" strokeWidth="0.7" opacity="0.5" />
                    <line x1="4"  y1="20" x2="12" y2="20" stroke="#B7FF3C" strokeWidth="0.7" opacity="0.5" />
                    <line x1="28" y1="20" x2="36" y2="20" stroke="#B7FF3C" strokeWidth="0.7" opacity="0.5" />
                  </svg>
                </div>
                {/* Ping rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="animate-ping absolute w-10 h-10 rounded-full bg-[#B7FF3C]/10" />
                </div>
              </div>
            </div>

            {/* Terminal boot log */}
            <div className="bg-[#060808] border border-[#1a2222] font-mono text-[11px] mb-6 overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-1.5 border-b border-[#1a2222] bg-[#0A0C0C]">
                <span className="text-[8px] tracking-[0.2em] text-[#4B5563]">FORENSIC OS — BOOT SEQUENCE</span>
                <div className="ml-auto flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#1F2937]" />
                  <span className="w-2 h-2 rounded-full bg-[#1F2937]" />
                  <span className="w-2 h-2 rounded-full bg-[#B7FF3C]/40" />
                </div>
              </div>
              <div className="p-3 space-y-1 min-h-[140px]">
                {BOOT_LINES.map((line, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-2"
                    initial={{ opacity: 0, x: -6 }}
                    animate={linesVisible > i ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-[#374151] shrink-0">{'>'}</span>
                    <span
                      className={
                        line.text.includes('LOADED') || line.text.includes('CONFIRMED')
                          ? 'text-[#B7FF3C]'
                          : line.text.includes('DECRYPTING') || line.text.includes('ACCESSING')
                          ? 'text-[#22D3EE]'
                          : 'text-[#4B5563]'
                      }
                    >
                      {line.text}
                    </span>
                  </motion.div>
                ))}
                {/* Blinking cursor */}
                {linesVisible > 0 && linesVisible <= BOOT_LINES.length && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[#374151]">{'>'}</span>
                    <motion.span
                      className="w-2 h-3 bg-[#B7FF3C]"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'steps(2)' }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="h-[2px] bg-[#1a2222] overflow-hidden">
                <motion.div
                  className="h-full bg-[#B7FF3C]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono tracking-[0.2em] text-[#4B5563]">
                LOADING INVESTIGATION ENVIRONMENT
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-mono text-[#B7FF3C]">
                  {Math.round(progress)}%
                </span>
                <button
                  onClick={() => onDone?.()}
                  className="text-[8px] font-mono tracking-[0.2em] text-[#4B5563] hover:text-[#B7FF3C] border border-[#1a2222] hover:border-[#B7FF3C]/40 px-2 py-0.5 transition-colors cursor-pointer"
                >
                  SKIP [ESC]
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
