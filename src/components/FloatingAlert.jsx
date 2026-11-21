import { motion } from 'motion/react'

/* ═══════════════════════════════════════════════════════
   FloatingAlert — Anomaly alert panel floating near radar
   ═══════════════════════════════════════════════════════ */

export default function FloatingAlert() {
  const rows = [
    { label: 'CASE', value: 'TR-2049', color: 'text-[#9CA3AF]' },
    { label: 'SOURCE', value: 'UNKNOWN', color: 'text-[#F59E0B]' },
    { label: 'TIME', value: '02:14:08', color: 'text-[#9CA3AF]' },
    { label: 'SEVERITY', value: 'HIGH', color: 'text-[#DC2626] font-bold' },
  ]

  return (
    <motion.div
      className="absolute bottom-2 right-2 sm:bottom-4 sm:right-3 lg:bottom-6 lg:right-4 z-20 origin-bottom-right scale-90 sm:scale-100"
      initial={{ opacity: 0, y: 14, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="bg-[#0A0C0C]/85 backdrop-blur-md border border-[#DC2626]/25 p-3 sm:p-3.5 min-w-[170px] max-w-[190px] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        {/* Header with animated alert indicator */}
        <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-[#1F2937]/60">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DC2626]" />
          </span>
          <span className="text-[9px] font-mono tracking-[0.2em] text-[#DC2626] font-semibold uppercase">
            Anomaly Detected
          </span>
        </div>

        {/* Telemetry data rows */}
        <div className="space-y-1.5">
          {rows.map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-[8px] font-mono tracking-[0.16em] text-[#6B7280]">
                {row.label}
              </span>
              <span className={`text-[9px] font-mono tracking-wider ${row.color}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Precision tactical corner notches */}
        <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#DC2626]/40" />
        <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#DC2626]/40" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#DC2626]/40" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#DC2626]/40" />
      </div>
    </motion.div>
  )
}
