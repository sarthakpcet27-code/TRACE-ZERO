import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import { Search, Filter, CheckCircle2, AlertCircle, ArrowUpRight, FileText, ChevronRight } from 'lucide-react'
import { EVIDENCE_ITEMS } from '../../data/evidenceData'

const IMPORTANCE_COLORS = {
  critical: { text: '#DC2626', border: '#DC2626/30', bg: '#DC2626/10' },
  significant: { text: '#F59E0B', border: '#F59E0B/30', bg: '#F59E0B/10' },
  contextual: { text: '#4B5563', border: '#4B5563/30', bg: '#4B5563/10' },
}

export default function AvailableCluesPanel({
  collectedClueIds = new Set(),
  connections = [],
  onSelectNode,
  selectedNodeId,
  onBackToLab,
}) {
  const [filter, setFilter] = useState('ALL') // 'ALL' | 'CRITICAL' | 'E-01' ...
  const [search, setSearch] = useState('')

  // Flatten all clues with their parent evidence metadata
  const allClues = useMemo(() => {
    const list = []
    for (const item of EVIDENCE_ITEMS) {
      for (const clue of item.clues) {
        list.push({
          ...clue,
          evidenceId: item.id,
          evidenceTitle: item.title,
          category: item.category,
          accentColor: item.accentColor,
          isCollected: collectedClueIds.has(clue.id),
        })
      }
    }
    return list
  }, [collectedClueIds])

  // Count which evidence nodes are linked in active connections
  const connectedNodeIds = useMemo(() => {
    const set = new Set()
    for (const conn of connections) {
      set.add(conn.from)
      set.add(conn.to)
    }
    return set
  }, [connections])

  // Filtered clues list
  const displayClues = useMemo(() => {
    return allClues.filter((clue) => {
      // Must be collected if user has collected at least 1 clue, otherwise show preview
      const matchSearch =
        search === '' ||
        clue.text.toLowerCase().includes(search.toLowerCase()) ||
        clue.id.toLowerCase().includes(search.toLowerCase()) ||
        clue.evidenceTitle.toLowerCase().includes(search.toLowerCase())

      if (!matchSearch) return false

      if (filter === 'ALL') return true
      if (filter === 'COLLECTED') return clue.isCollected
      if (filter === 'CRITICAL') return clue.importance === 'critical'
      if (filter.startsWith('E-')) return clue.evidenceId === filter
      return true
    })
  }, [allClues, search, filter])

  const collectedCount = allClues.filter((c) => c.isCollected).length

  return (
    <aside className="w-full lg:w-[300px] xl:w-[320px] bg-[#060808] border-r border-[#1a2222] flex flex-col h-full overflow-hidden shrink-0">
      {/* Panel Header */}
      <div className="p-4 border-b border-[#1a2222] bg-[#080B0B]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-[1px] bg-[#B7FF3C]" />
            <span className="text-[9px] font-mono tracking-[0.25em] text-[#6B7280]">
              EVIDENCE ARCHIVE
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#B7FF3C] font-semibold">
            {collectedCount} / {allClues.length} NOTED
          </span>
        </div>
        <h3 className="text-xs font-bold tracking-[0.15em] text-white">
          AVAILABLE CLUES
        </h3>

        {/* Search Input */}
        <div className="mt-3 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter clues by keyword or ID..."
            className="w-full bg-[#0A0D0D] border border-[#1a2222] text-[10px] font-mono text-[#9CA3AF] placeholder:text-[#2D3748] px-3 py-1.5 pl-7 focus:outline-none focus:border-[#B7FF3C]/40 transition-colors"
          />
          <Search size={11} className="absolute left-2.5 top-2 text-[#4B5563]" />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 text-[8px] font-mono">
          {['ALL', 'CRITICAL', 'E-01', 'E-02', 'E-03', 'E-04', 'E-05', 'E-06'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-0.5 border whitespace-nowrap transition-colors cursor-pointer ${
                filter === f
                  ? 'border-[#B7FF3C] text-[#B7FF3C] bg-[#B7FF3C]/[0.08]'
                  : 'border-[#1a2222] text-[#6B7280] hover:text-[#9CA3AF]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Zero Clues Advisory Banner */}
      {collectedCount === 0 && (
        <div className="p-4 border-b border-[#F59E0B]/20 bg-[#F59E0B]/[0.04]">
          <div className="flex items-start gap-2.5">
            <AlertCircle size={14} className="text-[#F59E0B] shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="text-[10px] font-mono text-[#F59E0B] font-bold tracking-wider">
                NO CLUES COLLECTED YET
              </p>
              <p className="text-[10px] text-[#9CA3AF] leading-relaxed">
                You have not collected any clues in the Evidence Lab yet. You can still establish connections between evidence nodes directly on the map, or return to inspect files.
              </p>
              <button
                onClick={onBackToLab}
                className="inline-flex items-center gap-1.5 text-[9px] font-mono tracking-wider text-[#B7FF3C] hover:underline pt-1 cursor-pointer"
              >
                OPEN EVIDENCE LAB <ChevronRight size={10} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clues Scrollable List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#0E1414] p-2 space-y-1.5">
        {displayClues.map((clue) => {
          const isNodeActive = selectedNodeId === clue.evidenceId
          const isNodeLinked = connectedNodeIds.has(clue.evidenceId)
          const impColor = IMPORTANCE_COLORS[clue.importance] || IMPORTANCE_COLORS.contextual

          return (
            <motion.div
              key={clue.id}
              onClick={() => onSelectNode(clue.evidenceId)}
              className={`p-3 text-left border transition-all cursor-pointer group rounded-none ${
                isNodeActive
                  ? 'border-[#B7FF3C]/50 bg-[#B7FF3C]/[0.04]'
                  : 'border-[#141A1A] bg-[#080B0B] hover:border-[#1F2937] hover:bg-[#0C1010]'
              }`}
              whileHover={{ x: 2 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[8px] font-mono px-1.5 py-0.2 border"
                    style={{
                      color: clue.accentColor,
                      borderColor: `${clue.accentColor}30`,
                      backgroundColor: `${clue.accentColor}08`,
                    }}
                  >
                    {clue.evidenceId}
                  </span>
                  <span className="text-[9px] font-mono text-[#374151] font-bold">
                    {clue.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="text-[7px] font-mono tracking-widest uppercase"
                    style={{ color: impColor.text }}
                  >
                    {clue.importance}
                  </span>

                  {clue.isCollected ? (
                    <span className="text-[8px] font-mono text-[#B7FF3C] flex items-center gap-0.5">
                      <CheckCircle2 size={9} />
                    </span>
                  ) : (
                    <span className="text-[7px] font-mono text-[#374151]">ARCHIVE</span>
                  )}
                </div>
              </div>

              <p className="text-[11px] font-mono text-[#9CA3AF] group-hover:text-white leading-relaxed transition-colors mb-2">
                {clue.text}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-[#101616] text-[8px] font-mono text-[#4B5563]">
                <span className="truncate max-w-[170px]">{clue.evidenceTitle}</span>
                {isNodeLinked && (
                  <span className="text-[#22D3EE] font-medium tracking-wider">
                    LINKED
                  </span>
                )}
              </div>
            </motion.div>
          )
        })}

        {displayClues.length === 0 && (
          <div className="p-6 text-center text-[#4B5563] text-xs font-mono">
            No matching clues found.
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-[#1a2222] bg-[#080B0B] flex items-center justify-between text-[8px] font-mono text-[#374151]">
        <span>CLICK CLUE TO FOCUS NODE</span>
        <span className="text-[#B7FF3C]">{connectedNodeIds.size} NODES LINKED</span>
      </div>
    </aside>
  )
}
