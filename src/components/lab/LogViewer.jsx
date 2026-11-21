/* ═══════════════════════════════════════════════════════════════
   LogViewer — TRACE//ZERO Evidence Lab
   Rich log table with severity chips, suspicious row highlights,
   expandable forensic record details, and quick filter controls.
   ═══════════════════════════════════════════════════════════════ */

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ChevronRight, Filter, AlertTriangle, ShieldCheck, Terminal, Search } from 'lucide-react'

const SEVERITY_CONFIG = {
  CRITICAL: { color: '#DC2626', bg: 'rgba(220, 38, 38, 0.12)', border: 'rgba(220, 38, 38, 0.4)' },
  HIGH: { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.4)' },
  MEDIUM: { color: '#22D3EE', bg: 'rgba(34, 211, 238, 0.08)', border: 'rgba(34, 211, 238, 0.3)' },
  SUSPICIOUS: { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.4)' },
  ALERT: { color: '#DC2626', bg: 'rgba(220, 38, 38, 0.12)', border: 'rgba(220, 38, 38, 0.4)' },
  NORMAL: { color: '#6B7280', bg: 'transparent', border: '#1F2937' },
}

export default function LogViewer({ evidence }) {
  const [selectedIdx, setSelectedIdx] = useState(null)
  const [filterType, setFilterType] = useState('ALL') // 'ALL' | 'SUSPICIOUS' | 'CRITICAL'
  const [searchQuery, setSearchQuery] = useState('')

  const records = evidence.content.records || []
  const isAudit = evidence.category === 'AUDIT'
  const isEndpoint = evidence.category === 'ENDPOINT'

  const filteredRecords = useMemo(() => {
    return records.filter((rec) => {
      const severity = (rec.severity || rec.status || 'NORMAL').toUpperCase()
      const isCritical = severity.includes('CRITICAL') || severity.includes('ALERT')
      const isSuspicious = isCritical || severity.includes('SUSPICIOUS') || severity.includes('HIGH')

      if (filterType === 'CRITICAL' && !isCritical) return false
      if (filterType === 'SUSPICIOUS' && !isSuspicious) return false

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const text = `${rec.time} ${rec.event} ${rec.detail || ''} ${rec.process || ''} ${rec.source || ''}`.toLowerCase()
        if (!text.includes(q)) return false
      }

      return true
    })
  }, [records, filterType, searchQuery])

  return (
    <div className="space-y-4">
      {/* ── Toolbar: Filters & Search ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#060808] p-3 border border-[#1a2222]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9px] font-mono text-[#6B7280] tracking-widest mr-1">FILTER:</span>
          {['ALL', 'SUSPICIOUS', 'CRITICAL'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-2.5 py-1 text-[9px] font-mono font-bold tracking-wider transition-all cursor-pointer border ${
                filterType === f
                  ? 'border-[#B7FF3C] text-[#080A0A] bg-[#B7FF3C]'
                  : 'border-[#1F2937] text-[#9CA3AF] bg-[#0A0D0D] hover:border-[#B7FF3C]/30 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-48">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#4B5563]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search event logs..."
            className="w-full bg-[#0A0D0D] border border-[#1F2937] text-white text-[10px] font-mono pl-7 pr-2.5 py-1 focus:outline-none focus:border-[#B7FF3C]/50 placeholder:text-[#374151]"
          />
        </div>
      </div>

      {/* ── Table Header ── */}
      <div className="border border-[#1a2222] divide-y divide-[#0E1414] overflow-hidden bg-[#060808]">
        <div className="flex items-center gap-3 px-4 py-2 bg-[#0A0D0D] text-[9px] font-mono tracking-[0.2em] text-[#6B7280] font-bold">
          <span className="w-16 shrink-0">TIMESTAMP</span>
          <span className="flex-1">LOGGED EVENT / DESCRIPTOR</span>
          {isEndpoint && <span className="w-24 hidden md:block">PROCESS</span>}
          {isAudit && <span className="w-20 hidden md:block">SUBSYSTEM</span>}
          {!isAudit && !isEndpoint && <span className="w-24 hidden md:block truncate">TARGET PATH</span>}
          <span className="w-20 text-right shrink-0">SEVERITY</span>
        </div>

        {/* ── Records Stream ── */}
        {filteredRecords.length === 0 ? (
          <div className="py-8 text-center text-[10px] font-mono text-[#6B7280]">
            NO LOG ENTRIES MATCH THE ACTIVE FILTER.
          </div>
        ) : (
          filteredRecords.map((rec, i) => {
            const isOpen = selectedIdx === i
            const rawStatus = (rec.severity || rec.status || 'NORMAL').toUpperCase()
            const cfg = SEVERITY_CONFIG[rawStatus] || SEVERITY_CONFIG.NORMAL
            const isFlagged = rawStatus === 'CRITICAL' || rawStatus === 'ALERT' || rawStatus === 'HIGH' || rawStatus === 'SUSPICIOUS'

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: Math.min(i * 0.03, 0.3) }}
                className={isFlagged ? 'bg-[#DC2626]/[0.02]' : ''}
              >
                <button
                  type="button"
                  className="w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-[#0E1414] transition-colors cursor-pointer group"
                  style={{ borderLeft: `3px solid ${cfg.color}` }}
                  onClick={() => setSelectedIdx(isOpen ? null : i)}
                >
                  <span className="text-[10px] font-mono text-[#9CA3AF] w-16 shrink-0 font-medium">
                    {rec.time}
                  </span>
                  <span className="text-[11px] font-mono text-[#E2E8F0] flex-1 truncate group-hover:text-white transition-colors">
                    {rec.event}
                  </span>
                  {isEndpoint && (
                    <span className="text-[10px] font-mono text-[#22D3EE] w-24 hidden md:block truncate">
                      {rec.process}
                    </span>
                  )}
                  {isAudit && (
                    <span className="text-[10px] font-mono text-[#9CA3AF] w-20 hidden md:block truncate">
                      {rec.source}
                    </span>
                  )}
                  {!isAudit && !isEndpoint && (
                    <span className="text-[10px] font-mono text-[#9CA3AF] w-24 hidden md:block truncate">
                      {rec.device || rec.path || '—'}
                    </span>
                  )}
                  <span
                    className="text-[8px] font-mono font-bold tracking-widest px-1.5 py-0.5 border text-right shrink-0"
                    style={{
                      color: cfg.color,
                      borderColor: cfg.border,
                      backgroundColor: cfg.bg,
                    }}
                  >
                    {rawStatus}
                  </span>
                  <ChevronRight
                    size={12}
                    className={`text-[#4B5563] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-90 text-[#B7FF3C]' : ''}`}
                  />
                </button>

                {/* Expanded Details Pane */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-3 pt-1 border-l-2 ml-[3px]" style={{ borderColor: cfg.border }}>
                        <div className="bg-[#030505] border border-[#1a2222] p-3.5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono tracking-widest text-[#B7FF3C] font-bold">
                              RECORD FORENSIC INSPECTION
                            </span>
                            {rec.pid && (
                              <span className="text-[9px] font-mono text-[#F59E0B] border border-[#F59E0B]/30 px-1.5 py-0.2 bg-[#F59E0B]/10">
                                PID: {rec.pid}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-mono text-[#CBD5E1] leading-relaxed">
                            {rec.detail}
                          </p>
                          {rec.path && (
                            <p className="text-[10px] font-mono text-[#22D3EE] break-all bg-[#080A0A] p-1.5 border border-[#1F2937]">
                              TARGET PATH: {rec.path}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
