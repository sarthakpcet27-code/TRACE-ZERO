/* ═══════════════════════════════════════════════════════════════
   Investigation Progress Stepper — TRACE//ZERO
   Shows the current investigation stage across all workspace pages.
   ═══════════════════════════════════════════════════════════════ */

import { useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FileSearch, Network, Clock, Shield, FileText } from 'lucide-react'

const STEPS = [
  { id: 'lab', label: 'EVIDENCE', path: '/lab', icon: FileSearch },
  { id: 'correlate', label: 'CORRELATE', path: '/correlate', icon: Network },
  { id: 'reconstruct', label: 'RECONSTRUCT', path: '/reconstruct', icon: Clock },
  { id: 'replay', label: 'DEFEND', path: '/replay', icon: Shield },
  { id: 'report', label: 'REPORT', path: '/report', icon: FileText },
]

export default function ProgressStepper() {
  const navigate = useNavigate()
  const location = useLocation()

  const currentIdx = useMemo(() => {
    const idx = STEPS.findIndex(s => location.pathname === s.path)
    return idx >= 0 ? idx : -1
  }, [location.pathname])

  if (currentIdx < 0) return null

  return (
    <div className="w-full bg-[#060808]/80 backdrop-blur-sm border-b border-[#1F2937]/40 px-4 py-2">
      <div className="max-w-6xl mx-auto flex items-center justify-center gap-1 sm:gap-2">
        {STEPS.map((step, i) => {
          const Icon = step.icon
          const isActive = i === currentIdx
          const isCompleted = i < currentIdx
          const isFuture = i > currentIdx

          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => navigate(step.path)}
                className={`flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-[8px] sm:text-[9px] font-mono tracking-[0.15em] transition-all cursor-pointer border ${
                  isActive
                    ? 'text-[#B7FF3C] border-[#B7FF3C]/30 bg-[#B7FF3C]/[0.06]'
                    : isCompleted
                      ? 'text-[#22D3EE] border-[#22D3EE]/20 bg-[#22D3EE]/[0.03] hover:bg-[#22D3EE]/[0.06]'
                      : 'text-[#4B5563] border-[#1F2937]/30 hover:text-[#6B7280]'
                }`}
                aria-current={isActive ? 'step' : undefined}
              >
                <Icon size={11} />
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-4 sm:w-6 h-[1px] mx-0.5 ${
                  isCompleted ? 'bg-[#22D3EE]/40' : 'bg-[#1F2937]/50'
                }`} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
