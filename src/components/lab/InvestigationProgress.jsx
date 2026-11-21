import { motion } from 'motion/react'

export default function InvestigationProgress({ analyzedCount, totalEvidence, clueCount, totalClues }) {
  const evidencePct = totalEvidence > 0 ? (analyzedCount / totalEvidence) * 100 : 0
  const cluePct = totalClues > 0 ? (clueCount / totalClues) * 100 : 0
  const isComplete = analyzedCount >= totalEvidence

  return (
    <div className="border border-[#1a2222] bg-[#060808] p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-[1px] bg-[#B7FF3C]/30" />
        <span className="text-[9px] font-mono tracking-[0.3em] text-[#6B7280]">INVESTIGATION PROGRESS</span>
      </div>

      <div className="space-y-3">
        {/* Evidence progress */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-mono tracking-[0.15em] text-[#4B5563]">EVIDENCE ANALYZED</span>
            <span className="text-[9px] font-mono text-[#B7FF3C]">{analyzedCount} / {totalEvidence}</span>
          </div>
          <div className="h-[3px] bg-[#111818] overflow-hidden">
            <motion.div
              className="h-full bg-[#B7FF3C]"
              animate={{ width: `${evidencePct}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        {/* Clue progress */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[9px] font-mono tracking-[0.15em] text-[#4B5563]">CLUES COLLECTED</span>
            <span className="text-[9px] font-mono text-[#22D3EE]">{clueCount} / {totalClues}</span>
          </div>
          <div className="h-[3px] bg-[#111818] overflow-hidden">
            <motion.div
              className="h-full bg-[#22D3EE]"
              animate={{ width: `${cluePct}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between pt-2 border-t border-[#111818]">
          <span className="text-[9px] font-mono tracking-[0.15em] text-[#4B5563]">STATUS</span>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: isComplete ? '#B7FF3C' : '#F59E0B' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <span className="text-[9px] font-mono tracking-widest" style={{ color: isComplete ? '#B7FF3C' : '#F59E0B' }}>
              {isComplete ? 'COMPLETE' : 'IN PROGRESS'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
