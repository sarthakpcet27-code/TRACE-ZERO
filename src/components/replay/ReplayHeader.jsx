import { motion } from 'motion/react'
import { ArrowLeft, Shield, Radio, ShieldCheck, Cpu } from 'lucide-react'

export default function ReplayHeader({
  onBack,
  simState, // 'CONFIGURING' | 'SIMULATING' | 'COMPLETED'
  pointsRemaining,
  totalBudget,
}) {
  const getStatusInfo = () => {
    switch (simState) {
      case 'SIMULATING':
        return { text: 'REPLAY IN PROGRESS', color: '#22D3EE', ping: true }
      case 'COMPLETED':
        return { text: 'ANALYSIS COMPLETE', color: '#B7FF3C', ping: false }
      default:
        return { text: 'DEFENSE SIMULATION ACTIVE', color: '#B7FF3C', ping: false }
    }
  }

  const status = getStatusInfo()

  return (
    <header className="bg-[#060808]/95 backdrop-blur-md border-b border-[#1a2222] shrink-0 z-30">
      <div className="h-14 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Navigation & Branding */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={onBack}
            className="group flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] text-[#6B7280] hover:text-[#B7FF3C] transition-colors cursor-pointer py-1 px-2 border border-[#1a2222] bg-[#0A0D0D] hover:border-[#B7FF3C]/30 shrink-0"
          >
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden xs:inline">RECONSTRUCTION</span>
            <span className="xs:hidden">BACK</span>
          </button>

          <div className="w-[1px] h-4 bg-[#1a2222]" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-[0.18em] text-white hidden sm:inline">
              TRACE<span className="text-[#B7FF3C]">//</span>ZERO
            </span>
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#B7FF3C]">#TR-2049</span>
            <span className="text-[9px] font-mono tracking-[0.15em] text-[#4B5563] hidden md:inline">
              NEXORA TECHNOLOGIES
            </span>
          </div>

          <div className="w-[1px] h-4 bg-[#1a2222] hidden lg:block" />

          {/* Subtitle / Mode */}
          <div className="hidden lg:flex flex-col">
            <div className="flex items-center gap-1.5">
              <Shield size={12} className="text-[#B7FF3C]" />
              <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-white">
                DEFENSE REPLAY
              </span>
            </div>
            <span className="text-[8px] font-mono tracking-[0.15em] text-[#4B5563]">
              PHASE 7 // ADVERSARY SIMULATION & DEFENSE RECONSTRUCTION
            </span>
          </div>
        </div>

        {/* Right: Status & Budget Indicator */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick budget chip */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-[#0A0D0D] border border-[#1a2222] text-[9px] font-mono">
            <span className="text-[#6B7280]">POINTS:</span>
            <span className="text-[#B7FF3C] font-bold">
              {pointsRemaining} / {totalBudget}
            </span>
          </div>

          {/* Status pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 bg-[#0A0D0D] border border-[#1a2222]">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: status.color }}
              animate={status.ping ? { opacity: [1, 0.2, 1], scale: [1, 1.3, 1] } : { opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <span
              className="text-[9px] font-mono tracking-[0.15em] font-bold hidden sm:inline"
              style={{ color: status.color }}
            >
              {status.text}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
