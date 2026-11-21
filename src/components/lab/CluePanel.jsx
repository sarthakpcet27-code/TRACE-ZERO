import { motion } from 'motion/react'
import { Check, AlertCircle, Info } from 'lucide-react'

const IMPORTANCE_STYLES = {
  critical:    { border: '#DC2626', label: 'CRITICAL',    labelColor: '#DC2626' },
  significant: { border: '#F59E0B', label: 'SIGNIFICANT', labelColor: '#F59E0B' },
  contextual:  { border: '#4B5563', label: 'CONTEXTUAL',  labelColor: '#4B5563' },
}

export default function CluePanel({ clues, collectedClueIds, onToggleClue }) {
  if (!clues || clues.length === 0) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-4 h-[1px] bg-[#B7FF3C]/30" />
        <span className="text-[9px] font-mono tracking-[0.3em] text-[#6B7280]">OBSERVATIONS</span>
        <span className="text-[8px] font-mono text-[#374151] ml-auto">
          {clues.filter(c => collectedClueIds.has(c.id)).length} / {clues.length} NOTED
        </span>
      </div>

      <div className="space-y-2">
        {clues.map((clue) => {
          const isCollected = collectedClueIds.has(clue.id)
          const style = IMPORTANCE_STYLES[clue.importance] || IMPORTANCE_STYLES.contextual

          return (
            <motion.button
              key={clue.id}
              onClick={() => onToggleClue(clue.id)}
              className="w-full text-left p-3 flex items-start gap-3 transition-all duration-200 cursor-pointer group"
              style={{
                borderLeft: `2px solid ${isCollected ? '#B7FF3C' : style.border}`,
                backgroundColor: isCollected ? 'rgba(183,255,60,0.04)' : 'rgba(0,0,0,0.2)',
                border: `1px solid ${isCollected ? '#B7FF3C20' : '#1a2222'}`,
                borderLeftWidth: '2px',
                borderLeftColor: isCollected ? '#B7FF3C' : style.border,
              }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="mt-0.5 shrink-0">
                {isCollected ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 bg-[#B7FF3C] flex items-center justify-center"
                  >
                    <Check size={10} className="text-[#080A0A]" />
                  </motion.div>
                ) : (
                  <div className="w-4 h-4 border border-[#374151] group-hover:border-[#6B7280] transition-colors" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[11px] leading-relaxed ${isCollected ? 'text-[#B7FF3C]' : 'text-[#9CA3AF] group-hover:text-white'} transition-colors`}>
                  {clue.text}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[7px] font-mono tracking-widest px-1.5 py-0.5 border" style={{ color: style.labelColor, borderColor: `${style.labelColor}30` }}>
                    {style.label}
                  </span>
                  <span className="text-[8px] font-mono text-[#2D3748]">{clue.id}</span>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
