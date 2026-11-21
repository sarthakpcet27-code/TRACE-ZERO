/* ═══════════════════════════════════════════════════════════════
   Onboarding Tutorial Overlay — TRACE//ZERO
   Interactive guided walkthrough for new forensic investigators.
   Can be dismissed and remembered via localStorage.
   ═══════════════════════════════════════════════════════════════ */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Terminal, Shield, FileSearch, Network, Clock, CheckCircle2, X, ChevronRight, HelpCircle } from 'lucide-react'
import { getCurrentUser } from '../services/authService'
import { getUserScopedKey } from '../services/progressService'

const TUTORIAL_KEY = 'trace-zero-tutorial-dismissed'

const STEPS = [
  {
    title: 'MISSION BRIEFING & DIRECTIVE',
    icon: Shield,
    subtitle: 'NEXORA TECHNOLOGIES SECURITY INCIDENT',
    desc: 'At 02:14 UTC, unauthorized exfiltration was detected inside the Project Helios research enclave. As senior digital forensics analyst, your directive is to uncover how the adversary breached the perimeter and neutralize future exposure.',
    badge: 'PROTOCOL 01',
  },
  {
    title: 'COLLECT & ANALYZE FORENSIC ARTIFACTS',
    icon: FileSearch,
    subtitle: 'EVIDENCE ARCHIVE & CLUE EXTRACTION',
    desc: 'Examine 6 critical forensic items: spear-phishing lures, auth logs, memory dumps, PCAP network captures, and deleted file headers. Tag suspicious IOCs and extract forensic clues to build your case.',
    badge: 'PROTOCOL 02',
  },
  {
    title: 'CORRELATE THE THREAT GRAPH',
    icon: Network,
    subtitle: 'CONNECT CLUES & HYPOTHESIS TESTING',
    desc: 'Trace the causal links between clues in the interactive correlation map. Discover the attacker’s initial access vector, credential dumping tools, and C2 exfiltration channels.',
    badge: 'PROTOCOL 03',
  },
  {
    title: 'RECONSTRUCT THE TIMELINE & SIMULATE DEFENSE',
    icon: Clock,
    subtitle: 'CHRONOLOGY & ACTIVE INTERVENTION',
    desc: 'Order the attack stages chronologically against MITRE ATT&CK tactics, then deploy active defense controls within your security budget to stop the breach and generate an official audit report.',
    badge: 'PROTOCOL 04',
  },
]

export default function OnboardingModal({ forceOpen = false, onClose }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true)
      return
    }
    const user = getCurrentUser()
    const key = getUserScopedKey(TUTORIAL_KEY, user?.id)
    const seen = localStorage.getItem(key)
    if (!seen) {
      setIsOpen(true)
    }
  }, [forceOpen])

  const handleDismiss = () => {
    const user = getCurrentUser()
    const key = getUserScopedKey(TUTORIAL_KEY, user?.id)
    localStorage.setItem(key, 'true')
    setIsOpen(false)
    if (onClose) onClose()
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1)
    } else {
      handleDismiss()
    }
  }

  if (!isOpen) return null

  const stepData = STEPS[currentStep]
  const Icon = stepData.icon

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-xl border border-[#1F2937] bg-[#0A0D0D] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Top glowing rule */}
          <div className="h-1 bg-gradient-to-r from-transparent via-[#B7FF3C] to-transparent" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A2222] bg-[#060808]">
            <div className="flex items-center gap-2">
              <Terminal size={15} className="text-[#B7FF3C]" />
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-white">
                INVESTIGATOR ONBOARDING PROTOCOL
              </span>
            </div>
            <button
              onClick={handleDismiss}
              className="text-[#6B7280] hover:text-white transition-colors p-1"
              aria-label="Close tutorial"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#B7FF3C] border border-[#B7FF3C]/30 px-2.5 py-1 bg-[#B7FF3C]/5">
                {stepData.badge}
              </span>
              <span className="text-[11px] font-mono text-[#6B7280]">
                STEP {currentStep + 1} OF {STEPS.length}
              </span>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded border border-[#B7FF3C]/40 bg-[#B7FF3C]/10 flex items-center justify-center shrink-0">
                <Icon size={24} className="text-[#B7FF3C]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-mono font-bold text-white tracking-wide">
                  {stepData.title}
                </h3>
                <p className="text-[11px] font-mono tracking-wider text-[#22D3EE]">
                  {stepData.subtitle}
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed font-sans border-l-2 border-[#1F2937] pl-4 py-1">
              {stepData.desc}
            </p>

            {/* Stepper dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                    i === currentStep
                      ? 'w-8 bg-[#B7FF3C]'
                      : i < currentStep
                        ? 'w-3 bg-[#22D3EE]/60'
                        : 'w-3 bg-[#1F2937]'
                  }`}
                  aria-label={`Go to step ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#1A2222] bg-[#060808]">
            <button
              onClick={handleDismiss}
              className="text-[11px] font-mono tracking-wider text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
            >
              SKIP ONBOARDING
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-mono font-bold tracking-[0.15em] text-[#080A0A] bg-[#B7FF3C] hover:bg-[#c8ff66] transition-all cursor-pointer shadow-[0_0_15px_rgba(183,255,60,0.3)]"
            >
              <span>{currentStep === STEPS.length - 1 ? 'BEGIN INVESTIGATION' : 'NEXT PROTOCOL'}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
