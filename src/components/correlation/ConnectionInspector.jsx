import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Link2,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Info,
  Layers,
  Check,
  X,
  Shield,
  HelpCircle,
} from 'lucide-react'
import { RELATIONSHIP_TYPES, CORRELATION_NODES } from '../../data/correlationData'
import { EVIDENCE_ITEMS } from '../../data/evidenceData'

export default function ConnectionInspector({
  selectedNodeA,
  selectedNodeB,
  selectedConnection,
  connections = [],
  onEstablishConnection,
  onUpdateConnection,
  onRemoveConnection,
  onSelectConnection,
  onSelectNode,
  onClearSelection,
  collectedClueIds = new Set(),
}) {
  const [selectedRelType, setSelectedRelType] = useState('TEMPORAL_SEQUENCE')
  const [noteText, setNoteText] = useState('')
  const [isEditingExisting, setIsEditingExisting] = useState(false)
  const [editNote, setEditNote] = useState('')

  // Reset form when selection changes
  useEffect(() => {
    if (selectedNodeA && selectedNodeB) {
      // Check if connection already exists
      const existing = connections.find(
        (c) =>
          (c.from === selectedNodeA && c.to === selectedNodeB) ||
          (c.from === selectedNodeB && c.to === selectedNodeA)
      )
      if (existing) {
        setSelectedRelType(existing.type)
        setNoteText(existing.notes || '')
      } else {
        setSelectedRelType('TEMPORAL_SEQUENCE')
        setNoteText('')
      }
    }
  }, [selectedNodeA, selectedNodeB, connections])

  // Sync edit note when inspecting an existing connection
  useEffect(() => {
    if (selectedConnection) {
      setEditNote(selectedConnection.notes || '')
      setIsEditingExisting(false)
    }
  }, [selectedConnection])

  // Resolve nodes
  const nodeA = CORRELATION_NODES.find((n) => n.id === selectedNodeA)
  const nodeB = CORRELATION_NODES.find((n) => n.id === selectedNodeB)
  const singleNode = nodeA && !nodeB ? nodeA : null

  // Evidence item for single node clues
  const singleEvidence = singleNode ? EVIDENCE_ITEMS.find((e) => e.id === singleNode.id) : null

  // Check if connection exists between selected A and B
  const existingConnBetweenSelected =
    nodeA && nodeB
      ? connections.find(
          (c) =>
            (c.from === nodeA.id && c.to === nodeB.id) ||
            (c.from === nodeB.id && c.to === nodeA.id)
        )
      : null

  // Submit handler
  function handleEstablish() {
    if (!nodeA || !nodeB) return
    onEstablishConnection({
      from: nodeA.id,
      to: nodeB.id,
      type: selectedRelType,
      notes: noteText.trim(),
    })
  }

  function handleSaveEdit() {
    if (!selectedConnection) return
    onUpdateConnection(selectedConnection.id, {
      notes: editNote.trim(),
    })
    setIsEditingExisting(false)
  }

  return (
    <aside className="w-full lg:w-[320px] xl:w-[350px] bg-[#060808] border-l border-[#1a2222] flex flex-col h-full overflow-hidden shrink-0">
      {/* ════ PANEL HEADER ════ */}
      <div className="p-4 border-b border-[#1a2222] bg-[#080B0B] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 size={13} className="text-[#B7FF3C]" />
          <h3 className="text-xs font-bold tracking-[0.18em] text-white">
            CONNECTION INSPECTOR
          </h3>
        </div>
        {(selectedNodeA || selectedNodeB || selectedConnection) && (
          <button
            onClick={onClearSelection}
            className="text-[9px] font-mono text-[#4B5563] hover:text-[#9CA3AF] transition-colors cursor-pointer"
          >
            DESELECT
          </button>
        )}
      </div>

      {/* ════ CONTENT BODY ════ */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ─── CASE 1: TWO NODES SELECTED (CONNECT EVIDENCE MODE) ─── */}
        {nodeA && nodeB && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono tracking-[0.25em] text-[#B7FF3C]">
                {existingConnBetweenSelected ? 'LINK CONFIGURATION' : 'ESTABLISH LINK'}
              </span>
              <div className="flex-1 h-[1px] bg-[#B7FF3C]/30" />
            </div>

            {/* Selected Nodes Comparison Box */}
            <div className="border border-[#1a2222] bg-[#0A0D0D] p-3 space-y-2">
              {/* Node A (Origin) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-[#B7FF3C] text-[#080A0A]">
                    A
                  </span>
                  <div>
                    <p className="text-[11px] font-mono font-bold text-white leading-tight">
                      {nodeA.title}
                    </p>
                    <p className="text-[8px] font-mono text-[#6B7280]">
                      {nodeA.id} • {nodeA.category}
                    </p>
                  </div>
                </div>
                <span className="text-[8px] font-mono text-[#4B5563]">{nodeA.time}</span>
              </div>

              <div className="flex items-center justify-center my-1">
                <span className="text-[9px] font-mono text-[#4B5563] tracking-widest">
                  ↕ CORRELATION ↕
                </span>
              </div>

              {/* Node B (Target) */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-[#22D3EE] text-[#080A0A]">
                    B
                  </span>
                  <div>
                    <p className="text-[11px] font-mono font-bold text-white leading-tight">
                      {nodeB.title}
                    </p>
                    <p className="text-[8px] font-mono text-[#6B7280]">
                      {nodeB.id} • {nodeB.category}
                    </p>
                  </div>
                </div>
                <span className="text-[8px] font-mono text-[#4B5563]">{nodeB.time}</span>
              </div>
            </div>

            {/* Existing link advisory */}
            {existingConnBetweenSelected && (
              <div className="p-2.5 border border-[#22D3EE]/30 bg-[#22D3EE]/[0.05] text-[9px] font-mono text-[#22D3EE] flex items-center gap-2">
                <Info size={12} className="shrink-0" />
                <span>Connection exists between these nodes. Updating will refine the classification.</span>
              </div>
            )}

            {/* Relationship Type Selector */}
            <div>
              <p className="text-[9px] font-mono tracking-[0.2em] text-[#6B7280] mb-2">
                SELECT RELATIONSHIP TYPE
              </p>
              <div className="space-y-1.5">
                {Object.values(RELATIONSHIP_TYPES).map((rel) => {
                  const isSelected = selectedRelType === rel.id
                  return (
                    <button
                      key={rel.id}
                      onClick={() => setSelectedRelType(rel.id)}
                      className={`w-full text-left p-2.5 border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#B7FF3C] bg-[#B7FF3C]/[0.05]'
                          : 'border-[#141A1A] bg-[#0A0D0D] hover:border-[#1F2937]'
                      }`}
                      style={{
                        borderLeftColor: rel.color,
                        borderLeftWidth: '3px',
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-[9px] font-mono font-bold tracking-wider"
                          style={{ color: isSelected ? '#FFFFFF' : rel.color }}
                        >
                          {rel.label}
                        </span>
                        {isSelected && <Check size={10} className="text-[#B7FF3C]" />}
                      </div>
                      <p className="text-[8px] font-mono text-[#6B7280] leading-tight">
                        {rel.description}
                      </p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Optional Investigator Rationale Note */}
            <div>
              <p className="text-[9px] font-mono tracking-[0.2em] text-[#6B7280] mb-1.5">
                INVESTIGATION NOTE (OPTIONAL)
              </p>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Document your hypothesis or why these two evidence items connect..."
                className="w-full h-20 bg-[#0A0D0D] border border-[#1a2222] text-[10px] font-mono text-[#9CA3AF] placeholder:text-[#2D3748] p-2.5 resize-none focus:outline-none focus:border-[#B7FF3C]/30 transition-colors"
                spellCheck={false}
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleEstablish}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#B7FF3C] text-[#080A0A] font-mono font-bold text-[10px] tracking-[0.2em] hover:bg-[#c8ff66] transition-all cursor-pointer shadow-[0_0_20px_rgba(183,255,60,0.2)] active:scale-[0.98]"
              >
                <Link2 size={12} />
                {existingConnBetweenSelected ? 'UPDATE CONNECTION' : 'ESTABLISH CONNECTION'}
              </button>

              <button
                onClick={onClearSelection}
                className="w-full py-2 border border-[#1a2222] text-[9px] font-mono tracking-widest text-[#6B7280] hover:text-white transition-colors cursor-pointer"
              >
                CANCEL SELECTION
              </button>
            </div>
          </motion.div>
        )}

        {/* ─── CASE 2: EXISTING CONNECTION SELECTED (INSPECT MODE) ─── */}
        {!nodeB && selectedConnection && (() => {
          const fromNode = CORRELATION_NODES.find((n) => n.id === selectedConnection.from)
          const toNode = CORRELATION_NODES.find((n) => n.id === selectedConnection.to)
          const relType = RELATIONSHIP_TYPES[selectedConnection.type] || RELATIONSHIP_TYPES.TEMPORAL_SEQUENCE

          return (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono tracking-[0.25em] text-[#22D3EE]">
                  CONNECTION DETAILS
                </span>
                <div className="flex-1 h-[1px] bg-[#22D3EE]/30" />
              </div>

              {/* Connected Nodes Summary */}
              <div className="border border-[#1a2222] bg-[#0A0D0D] p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-[#B7FF3C] font-bold">
                    {fromNode?.id} — {fromNode?.title}
                  </span>
                  <span className="text-[8px] font-mono text-[#4B5563]">{fromNode?.category}</span>
                </div>
                <div className="text-center text-[9px] font-mono text-[#374151]">
                  ━━━ {relType.shortLabel} ━━━
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-[#22D3EE] font-bold">
                    {toNode?.id} — {toNode?.title}
                  </span>
                  <span className="text-[8px] font-mono text-[#4B5563]">{toNode?.category}</span>
                </div>
              </div>

              {/* Relationship Type Card */}
              <div
                className="border p-3 space-y-1.5"
                style={{
                  borderColor: `${relType.color}30`,
                  backgroundColor: `${relType.color}06`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[9px] font-mono font-bold tracking-wider"
                    style={{ color: relType.color }}
                  >
                    {relType.label}
                  </span>
                  <span
                    className="text-[7px] font-mono px-1.5 py-0.5 border"
                    style={{ borderColor: `${relType.color}40`, color: relType.color }}
                  >
                    CLASSIFIED
                  </span>
                </div>
                <p className="text-[8px] font-mono text-[#9CA3AF] leading-tight">
                  {relType.description}
                </p>
              </div>

              {/* Evaluation Feedback */}
              <div className="border border-[#1a2222] bg-[#0A0D0D] p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <Shield size={11} className={selectedConnection.isValid ? 'text-[#B7FF3C]' : 'text-[#F59E0B]'} />
                  <span className="text-[8px] font-mono tracking-widest text-[#6B7280]">
                    CORRELATION ENGINE
                  </span>
                </div>
                <p className="text-[10px] font-mono text-[#D1D5DB] leading-relaxed">
                  {selectedConnection.feedback || 'RELATIONSHIP RECORDED TO CASE FILE.'}
                </p>
              </div>

              {/* Notes Section */}
              <div className="border border-[#1a2222] bg-[#0A0D0D] p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[8px] font-mono tracking-widest text-[#6B7280]">
                    INVESTIGATION NOTES
                  </span>
                  {!isEditingExisting && (
                    <button
                      onClick={() => setIsEditingExisting(true)}
                      className="text-[8px] font-mono text-[#B7FF3C] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 size={9} /> EDIT
                    </button>
                  )}
                </div>

                {isEditingExisting ? (
                  <div className="space-y-2 mt-2">
                    <textarea
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      className="w-full h-16 bg-[#060808] border border-[#1a2222] text-[9px] font-mono text-[#D1D5DB] p-2 focus:outline-none focus:border-[#B7FF3C]/30"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setIsEditingExisting(false)}
                        className="text-[8px] font-mono text-[#6B7280] px-2 py-1 border border-[#1a2222] cursor-pointer"
                      >
                        CANCEL
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="text-[8px] font-mono text-[#080A0A] bg-[#B7FF3C] px-2 py-1 font-bold cursor-pointer"
                      >
                        SAVE
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[9px] font-mono text-[#9CA3AF] italic">
                    {selectedConnection.notes || 'No investigation notes recorded for this link.'}
                  </p>
                )}
              </div>

              {/* Remove Connection Button */}
              <div className="pt-2">
                <button
                  onClick={() => onRemoveConnection(selectedConnection.id)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-[#DC2626]/30 bg-[#DC2626]/[0.05] text-[#DC2626] font-mono text-[9px] tracking-widest hover:bg-[#DC2626]/[0.1] transition-colors cursor-pointer"
                >
                  <Trash2 size={11} />
                  REMOVE CONNECTION
                </button>
              </div>
            </motion.div>
          )
        })()}

        {/* ─── CASE 3: SINGLE NODE SELECTED (INSTRUCTIONAL MODE) ─── */}
        {singleNode && !selectedConnection && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono tracking-[0.25em] text-[#B7FF3C]">
                ORIGIN NODE SELECTED
              </span>
              <div className="flex-1 h-[1px] bg-[#B7FF3C]/30" />
            </div>

            <div className="border border-[#B7FF3C]/30 bg-[#B7FF3C]/[0.03] p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono font-bold text-[#B7FF3C]">
                  {singleNode.id}
                </span>
                <span className="text-[8px] font-mono text-[#4B5563]">
                  {singleNode.category}
                </span>
              </div>
              <h4 className="text-sm font-mono font-bold text-white">{singleNode.title}</h4>
              <p className="text-[10px] font-mono text-[#9CA3AF] leading-relaxed">
                {singleNode.summary}
              </p>
            </div>

            {/* Instruction Banner */}
            <div className="p-3 border border-[#F59E0B]/30 bg-[#F59E0B]/[0.04] space-y-1">
              <p className="text-[9px] font-mono font-bold text-[#F59E0B] tracking-wider">
                STEP 2: CHOOSE SECOND NODE
              </p>
              <p className="text-[9px] text-[#9CA3AF] leading-relaxed">
                Click any other evidence node on the canvas to configure the forensic relationship between them.
              </p>
            </div>

            {/* Collected Clues for this Node */}
            {singleEvidence && (
              <div>
                <p className="text-[9px] font-mono tracking-[0.2em] text-[#6B7280] mb-2">
                  ASSOCIATED CLUES ({singleEvidence.clues.length})
                </p>
                <div className="space-y-1.5">
                  {singleEvidence.clues.map((c) => {
                    const isCollected = collectedClueIds.has(c.id)
                    return (
                      <div
                        key={c.id}
                        className={`p-2 border text-[9px] font-mono ${
                          isCollected
                            ? 'border-[#B7FF3C]/20 bg-[#B7FF3C]/[0.02] text-[#D1D5DB]'
                            : 'border-[#141A1A] text-[#4B5563]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[#374151] font-bold">{c.id}</span>
                          <span className="text-[7px] uppercase" style={{ color: isCollected ? '#B7FF3C' : '#4B5563' }}>
                            {isCollected ? 'NOTED' : 'UNCOLLECTED'}
                          </span>
                        </div>
                        <p className="leading-snug">{c.text}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ─── CASE 4: NOTHING SELECTED (DEFAULT LIST / INSTRUCTIONS) ─── */}
        {!nodeA && !nodeB && !selectedConnection && (
          <div className="space-y-4">
            <div className="border border-[#1a2222] bg-[#0A0D0D] p-3.5 space-y-2">
              <div className="flex items-center gap-2">
                <Info size={13} className="text-[#B7FF3C]" />
                <span className="text-[10px] font-mono font-bold text-white tracking-wider">
                  HOW TO CORRELATE
                </span>
              </div>
              <ol className="text-[9px] font-mono text-[#9CA3AF] space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>Click an origin evidence node on the map.</li>
                <li>Click a second node to connect.</li>
                <li>Choose the relationship classification.</li>
                <li>Validate with the correlation engine.</li>
              </ol>
            </div>

            {/* Established Connections List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono tracking-[0.2em] text-[#6B7280]">
                  ACTIVE CONNECTIONS ({connections.length})
                </span>
              </div>

              {connections.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-[#1a2222] text-[#4B5563] text-[10px] font-mono space-y-1">
                  <p>NO EVIDENCE LINKS ESTABLISHED YET.</p>
                  <p className="text-[8px]">Select two nodes to form the first link.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {connections.map((conn) => {
                    const fromNode = CORRELATION_NODES.find((n) => n.id === conn.from)
                    const toNode = CORRELATION_NODES.find((n) => n.id === conn.to)
                    const rel = RELATIONSHIP_TYPES[conn.type] || RELATIONSHIP_TYPES.TEMPORAL_SEQUENCE

                    return (
                      <div
                        key={conn.id}
                        className="p-2.5 border border-[#141A1A] bg-[#0A0D0D] hover:border-[#1F2937] transition-all"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className="text-[8px] font-mono font-bold px-1.5 py-0.2 border"
                            style={{
                              color: rel.color,
                              borderColor: `${rel.color}40`,
                              backgroundColor: `${rel.color}08`,
                            }}
                          >
                            {rel.shortLabel}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onSelectConnection(conn.id)}
                              className="text-[8px] font-mono text-[#9CA3AF] hover:text-[#B7FF3C] cursor-pointer"
                            >
                              INSPECT
                            </button>
                            <button
                              onClick={() => onRemoveConnection(conn.id)}
                              className="text-[#4B5563] hover:text-[#DC2626] transition-colors cursor-pointer"
                              title="Delete Connection"
                            >
                              <Trash2 size={10} />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-[9px] font-mono text-white">
                          <span>{fromNode?.title || conn.from}</span>
                          <span className="text-[#4B5563]">↔</span>
                          <span>{toNode?.title || conn.to}</span>
                        </div>

                        {conn.notes && (
                          <p className="text-[8px] font-mono text-[#6B7280] truncate mt-1">
                            "{conn.notes}"
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ════ PANEL FOOTER ════ */}
      <div className="p-3 border-t border-[#1a2222] bg-[#080B0B] flex items-center justify-between text-[8px] font-mono text-[#4B5563]">
        <span>CASE #TR-2049</span>
        <span className="text-[#B7FF3C]">{connections.length} LINKS SAVED</span>
      </div>
    </aside>
  )
}
