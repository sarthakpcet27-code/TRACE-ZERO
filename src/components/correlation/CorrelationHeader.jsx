import { motion } from 'motion/react'
import { ArrowLeft, Network, Shield, Radio, Layers, FileText, HelpCircle, Clock, ChevronRight } from 'lucide-react'

export default function CorrelationHeader({
  onBackToLab,
  onGoToReconstruct,
  connectionCount,
  validCount,
  activeMobileTab,
  onSelectMobileTab,
  onOpenHints,
  onOpenTheory,
}) {
  return (
    <header className="bg-[#060808]/95 backdrop-blur-md border-b border-[#1a2222] shrink-0 z-30">
      {/* Top Bar */}
      <div className="h-14 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Navigation & Case ID */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={onBackToLab}
            className="group flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] text-[#6B7280] hover:text-[#B7FF3C] transition-colors cursor-pointer py-1 px-2 border border-[#1a2222] bg-[#0A0D0D] hover:border-[#B7FF3C]/30"
          >
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
            <span className="hidden xs:inline">EVIDENCE</span> LAB
          </button>

          <div className="w-[1px] h-4 bg-[#1a2222]" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-[0.18em] text-white hidden sm:inline">
              TRACE<span className="text-[#B7FF3C]">//</span>ZERO
            </span>
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#B7FF3C]">#TR-2049</span>
          </div>

          <div className="w-[1px] h-4 bg-[#1a2222] hidden md:block" />

          {/* Title & Subtitle */}
          <div className="hidden md:flex flex-col">
            <div className="flex items-center gap-2">
              <Network size={12} className="text-[#B7FF3C]" />
              <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-white">
                EVIDENCE CORRELATION
              </span>
            </div>
            <span className="text-[8px] font-mono tracking-[0.15em] text-[#4B5563]">
              EVERY CLUE HAS A CONNECTION.
            </span>
          </div>
        </div>

        {/* Right: Status Pill & Quick Triggers */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Theory button */}
          <button
            onClick={onOpenTheory}
            className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#9CA3AF] hover:text-[#B7FF3C] px-2.5 py-1.5 border border-[#1a2222] bg-[#0A0D0D] hover:border-[#B7FF3C]/30 transition-all cursor-pointer"
            title="Investigator's Theory"
          >
            <FileText size={11} className="text-[#B7FF3C]" />
            <span className="hidden sm:inline">THEORY</span>
          </button>

          {/* Hints button */}
          <button
            onClick={onOpenHints}
            className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#F59E0B] hover:text-[#F59E0B] px-2.5 py-1.5 border border-[#F59E0B]/20 bg-[#F59E0B]/[0.04] hover:bg-[#F59E0B]/[0.08] transition-all cursor-pointer"
            title="Investigation Hints"
          >
            <HelpCircle size={11} />
            <span className="hidden sm:inline">HINTS</span>
          </button>

          {/* Connection stats */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#0A0D0D] border border-[#1a2222] text-[9px] font-mono">
            <span className="text-[#4B5563]">LINKS:</span>
            <span className="text-[#B7FF3C] font-bold">{connectionCount}</span>
            <span className="text-[#2D3748]">|</span>
            <span className="text-[#4B5563]">CONFIRMED:</span>
            <span className="text-[#22D3EE] font-bold">{validCount}</span>
          </div>

          {/* Reconstruct CTA Button */}
          {onGoToReconstruct && (
            <button
              onClick={onGoToReconstruct}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#22D3EE] text-[#080A0A] font-mono font-bold text-[9px] tracking-[0.15em] hover:bg-[#67e8f9] transition-all cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.25)]"
              title="Proceed to Incident Reconstruction"
            >
              <Clock size={11} />
              <span className="hidden xs:inline">RECONSTRUCT</span>
              <ChevronRight size={11} className="hidden sm:inline" />
            </button>
          )}

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#B7FF3C]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            <span className="text-[9px] font-mono tracking-[0.2em] text-[#B7FF3C] hidden xs:inline">
              ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* Mobile navigation tab strip (< lg screens) */}
      <div className="flex lg:hidden items-center justify-around border-t border-[#141A1A] bg-[#080B0B] text-[9px] font-mono tracking-widest">
        {[
          { id: 'canvas', label: 'MAP CANVAS' },
          { id: 'clues', label: 'CLUES' },
          { id: 'inspector', label: 'INSPECTOR' },
          { id: 'theory', label: 'THEORY' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => onSelectMobileTab(tab.id)}
            className={`flex-1 py-2 text-center transition-colors border-b-2 cursor-pointer ${
              activeMobileTab === tab.id
                ? 'border-[#B7FF3C] text-[#B7FF3C] bg-[#B7FF3C]/[0.04]'
                : 'border-transparent text-[#6B7280] hover:text-[#9CA3AF]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  )
}
