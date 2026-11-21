import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { Terminal, Radio, Shield, AlertCircle } from 'lucide-react'

const LEVEL_COLORS = {
  '[BLOCK]': '#B7FF3C',
  '[CONTAIN]': '#B7FF3C',
  '[SUCCESS]': '#B7FF3C',
  '[RESTRICT]': '#22D3EE',
  '[DETECT]': '#F59E0B',
  '[MITIGATE]': '#38BDF8',
  '[AUDIT]': '#A78BFA',
  '[INFO]': '#9CA3AF',
  '[WARN]': '#F59E0B',
  '[CRITICAL]': '#DC2626',
  '[ALERT]': '#DC2626',
}

export default function ReplayTerminal({ logs = [], isSimulating = false }) {
  const terminalEndRef = useRef(null)

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div className="border border-[#1a2222] bg-[#060808] flex flex-col h-60 sm:h-72 overflow-hidden relative">
      {/* Terminal Title Bar */}
      <div className="h-9 px-3.5 bg-[#090C0C] border-b border-[#1a2222] flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-[#22D3EE]" />
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-white">
            SIMULATION TELEMETRY CONSOLE // SOC REPLAY EVENT STREAM
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isSimulating && (
            <div className="flex items-center gap-1.5 text-[8px] font-mono text-[#22D3EE]">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#22D3EE]"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
              <span>STREAMING</span>
            </div>
          )}
          <span className="text-[8px] font-mono text-[#4B5563]">BUFFER: {logs.length} EVENTS</span>
        </div>
      </div>

      {/* Terminal Content Stream */}
      <div className="flex-1 p-3.5 font-mono text-[10px] overflow-y-auto space-y-1.5 relative selection:bg-[#22D3EE] selection:text-black">
        {logs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[#4B5563] text-xs">
            <p className="tracking-widest">AWAITING SIMULATION INITIATION...</p>
          </div>
        ) : (
          logs.map((log, index) => {
            const badgeColor = LEVEL_COLORS[log.level] || '#9CA3AF'
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-start gap-2 leading-relaxed hover:bg-[#0A0D0D] py-0.5 px-1 -mx-1"
              >
                <span className="text-[#4B5563] shrink-0">{log.time}</span>
                <span
                  className="font-bold shrink-0 text-[9px] px-1 py-0.2 border"
                  style={{
                    color: badgeColor,
                    borderColor: `${badgeColor}30`,
                    backgroundColor: `${badgeColor}08`,
                  }}
                >
                  {log.level}
                </span>
                <span className="text-[#6B7280] shrink-0">[{log.source}]</span>
                <span className="text-[#D1D5DB] break-all">{log.message}</span>
              </motion.div>
            )
          })
        )}
        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Footer */}
      <div className="h-6 px-3 bg-[#080B0B] border-t border-[#141A1A] flex items-center justify-between text-[8px] font-mono text-[#4B5563]">
        <span>CHANNEL: ETH-SIEM-REPLAY</span>
        <span>SECURITY ORCHESTRATION AUTOMATED RESPONSE (SOAR) ACTIVE</span>
      </div>
    </div>
  )
}
