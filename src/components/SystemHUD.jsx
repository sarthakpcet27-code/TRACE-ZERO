import { motion } from 'motion/react'

/* ═══════════════════════════════════════════════
   SystemHUD — Live technical HUD near radar
   ═══════════════════════════════════════════════ */

export default function SystemHUD() {
  const indicators = [
    { label: 'SYSTEM', value: 'ONLINE', color: '#B7FF3C' },
    { label: 'SCANNER', value: 'ACTIVE', color: '#B7FF3C' },
    { label: 'SIGNAL', value: 'STABLE', color: '#22D3EE' },
    { label: 'CASE', value: 'TR-2049', color: '#9CA3AF' },
  ]

  return (
    <motion.div
      className="absolute top-2 left-2 sm:top-4 sm:left-3 lg:top-6 lg:left-4 z-20 origin-top-left scale-90 sm:scale-100"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="bg-[#0A0C0C]/80 backdrop-blur-md border border-[#1F2937]/60 px-3 py-2.5 min-w-[135px] shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <div className="space-y-1.5">
          {indicators.map((item, i) => (
            <div key={item.label} className="flex items-center justify-between gap-3.5">
              <span className="text-[8px] font-mono tracking-[0.16em] text-[#6B7280]">
                {item.label}
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: i < 2 ? `0 0 6px ${item.color}` : undefined,
                    animation: i < 2 ? 'nodeGlow 2.5s ease-in-out infinite' : undefined,
                    animationDelay: `${i * 0.35}s`,
                  }}
                />
                <span
                  className="text-[8px] font-mono tracking-wider font-medium"
                  style={{ color: item.color }}
                >
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Subtle corner notches */}
        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-l border-t border-[#B7FF3C]/30" />
        <div className="absolute top-0 right-0 w-1.5 h-1.5 border-r border-t border-[#B7FF3C]/30" />
        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-l border-b border-[#B7FF3C]/30" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-r border-b border-[#B7FF3C]/30" />
      </div>
    </motion.div>
  )
}
