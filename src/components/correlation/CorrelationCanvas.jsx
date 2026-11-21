import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Mail,
  Key,
  FileText,
  Cpu,
  Wifi,
  Shield,
  RotateCcw,
  Zap,
  Info,
  Maximize2,
  Minimize2,
  Check,
} from 'lucide-react'
import { CORRELATION_NODES, RELATIONSHIP_TYPES } from '../../data/correlationData'

const ICON_MAP = {
  Mail,
  Key,
  FileText,
  Cpu,
  Wifi,
  Shield,
}

export default function CorrelationCanvas({
  connections = [],
  selectedNodeA,
  selectedNodeB,
  onSelectNode,
  onClearSelection,
  selectedConnectionId,
  onSelectConnection,
  collectedClueIds = new Set(),
  analyzedIds = new Set(),
}) {
  const [hoveredNodeId, setHoveredNodeId] = useState(null)
  const [hoveredConnId, setHoveredConnId] = useState(null)

  // Map node ID to coordinates
  const nodeMap = useMemo(() => {
    const map = new Map()
    for (const n of CORRELATION_NODES) {
      map.set(n.id, n)
    }
    return map
  }, [])

  // Helper to get coordinates for line endpoints
  function getLineCoordinates(fromId, toId) {
    const nodeA = nodeMap.get(fromId)
    const nodeB = nodeMap.get(toId)
    if (!nodeA || !nodeB) return null
    return {
      x1: nodeA.x,
      y1: nodeA.y,
      x2: nodeB.x,
      y2: nodeB.y,
      midX: (nodeA.x + nodeB.x) / 2,
      midY: (nodeA.y + nodeB.y) / 2,
    }
  }

  return (
    <div className="relative flex-1 h-full w-full bg-[#080A0A] overflow-hidden flex flex-col select-none">
      {/* Dynamic Grid Background with scanlines */}
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-40 z-0" />

      {/* Canvas Status & Instructional Banner */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-[#060808]/90 border border-[#1a2222] backdrop-blur-md px-3.5 py-2 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-[#B7FF3C] animate-pulse" />
          <span className="text-[10px] font-mono tracking-widest text-[#9CA3AF]">
            {selectedNodeA && !selectedNodeB && (
              <>
                ORIGIN <span className="text-[#B7FF3C] font-bold">[{selectedNodeA}]</span> SELECTED — CLICK SECOND NODE TO FORM CORRELATION
              </>
            )}
            {selectedNodeA && selectedNodeB && (
              <>
                LINK CANDIDATE: <span className="text-[#B7FF3C] font-bold">[{selectedNodeA}]</span> ↔ <span className="text-[#22D3EE] font-bold">[{selectedNodeB}]</span> — CONFIGURE IN INSPECTOR
              </>
            )}
            {!selectedNodeA && !selectedNodeB && (
              <>
                CORRELATION WORKBENCH: CLICK ANY NODE TO BEGIN CONNECTING EVIDENCE
              </>
            )}
          </span>
        </div>

        {/* Selection Clear / Reset */}
        {(selectedNodeA || selectedNodeB || selectedConnectionId) && (
          <button
            onClick={onClearSelection}
            className="pointer-events-auto flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-[#9CA3AF] hover:text-[#B7FF3C] px-3 py-1.5 bg-[#0A0D0D]/90 border border-[#1a2222] hover:border-[#B7FF3C]/40 transition-colors backdrop-blur-md cursor-pointer"
          >
            <RotateCcw size={10} />
            CLEAR SELECTION
          </button>
        )}
      </div>

      {/* Legend pill strip (bottom left of canvas) */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-3 bg-[#060808]/90 border border-[#1a2222] backdrop-blur-md px-3 py-1.5 text-[8px] font-mono">
        <span className="text-[#4B5563] tracking-widest">RELATIONSHIPS:</span>
        {Object.values(RELATIONSHIP_TYPES).map((type) => (
          <div key={type.id} className="flex items-center gap-1.5">
            <span
              className="w-2 h-0.5"
              style={{ backgroundColor: type.color }}
            />
            <span className="text-[#9CA3AF]">{type.shortLabel}</span>
          </div>
        ))}
      </div>

      {/* SVG Canvas Area */}
      <div className="flex-1 w-full h-full relative z-10 flex items-center justify-center p-2 sm:p-4">
        <svg
          viewBox="0 0 920 540"
          className="w-full h-full max-h-[750px] transition-all"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Glow filters for node rings */}
            <filter id="glow-green" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Subtle grid pattern */}
            <pattern id="canvas-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#121818" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="1" fill="#1A2424" />
            </pattern>
          </defs>

          {/* Canvas Sub-grid */}
          <rect width="920" height="540" fill="url(#canvas-grid)" opacity="0.7" />

          {/* Coordinate crosshairs */}
          <line x1="460" y1="20" x2="460" y2="520" stroke="#0E1616" strokeDasharray="3 6" strokeWidth="1" />
          <line x1="30" y1="270" x2="890" y2="270" stroke="#0E1616" strokeDasharray="3 6" strokeWidth="1" />

          {/* ════ CONNECTION PREVIEW LINE (Node A selected, hovering over canvas) ════ */}
          {selectedNodeA && !selectedNodeB && hoveredNodeId && hoveredNodeId !== selectedNodeA && (() => {
            const coords = getLineCoordinates(selectedNodeA, hoveredNodeId)
            if (!coords) return null
            return (
              <line
                x1={coords.x1}
                y1={coords.y1}
                x2={coords.x2}
                y2={coords.y2}
                stroke="#B7FF3C"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.6"
              />
            )
          })()}

          {/* ════ ESTABLISHED CONNECTION LINES ════ */}
          {connections.map((conn) => {
            const coords = getLineCoordinates(conn.from, conn.to)
            if (!coords) return null

            const relType = RELATIONSHIP_TYPES[conn.type] || RELATIONSHIP_TYPES.TEMPORAL_SEQUENCE
            const isSelected = selectedConnectionId === conn.id
            const isHovered = hoveredConnId === conn.id
            const color = relType.color

            return (
              <g
                key={conn.id}
                className="cursor-pointer group"
                onClick={() => onSelectConnection(conn.id)}
                onMouseEnter={() => setHoveredConnId(conn.id)}
                onMouseLeave={() => setHoveredConnId(null)}
              >
                {/* Wider invisible stroke for easier click target */}
                <line
                  x1={coords.x1}
                  y1={coords.y1}
                  x2={coords.x2}
                  y2={coords.y2}
                  stroke="transparent"
                  strokeWidth="20"
                />

                {/* Outer halo line on hover/select */}
                {(isSelected || isHovered) && (
                  <line
                    x1={coords.x1}
                    y1={coords.y1}
                    x2={coords.x2}
                    y2={coords.y2}
                    stroke={color}
                    strokeWidth="5"
                    opacity="0.25"
                  />
                )}

                {/* Primary connection line */}
                <line
                  x1={coords.x1}
                  y1={coords.y1}
                  x2={coords.x2}
                  y2={coords.y2}
                  stroke={color}
                  strokeWidth={isSelected ? '2.5' : isHovered ? '2' : '1.5'}
                  strokeDasharray={relType.strokeDash}
                  opacity={isSelected ? 1 : 0.8}
                />

                {/* Traveling packet pulse along the connection */}
                <motion.circle
                  r="3"
                  fill={color}
                  animate={{
                    cx: [coords.x1, coords.x2],
                    cy: [coords.y1, coords.y2],
                    opacity: [0.8, 0.2],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                {/* Connection Midpoint Badge */}
                <g transform={`translate(${coords.midX}, ${coords.midY})`}>
                  <rect
                    x="-26"
                    y="-10"
                    width="52"
                    height="20"
                    fill="#060808"
                    stroke={isSelected ? '#B7FF3C' : color}
                    strokeWidth={isSelected ? '1.5' : '1'}
                    rx="2"
                    opacity={isSelected ? 1 : 0.9}
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill={isSelected ? '#FFFFFF' : color}
                    fontSize="7.5"
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="bold"
                    letterSpacing="0.05em"
                  >
                    {relType.shortLabel}
                  </text>
                </g>
              </g>
            )
          })}

          {/* ════ NODES LAYER ════ */}
          {CORRELATION_NODES.map((node) => {
            const isOrigin = selectedNodeA === node.id
            const isTarget = selectedNodeB === node.id
            const isHovered = hoveredNodeId === node.id
            const isAnalyzed = analyzedIds.has(node.id)

            // Count clues for this node
            const clueCount = [
              'C01', 'C02', 'C03', 'C04', // E-01
              'C05', 'C06', 'C07',        // E-02
              'C08', 'C09', 'C10',        // E-03
              'C11', 'C12', 'C13',        // E-04
              'C14', 'C15', 'C16',        // E-05
              'C17', 'C18', 'C19',        // E-06
            ].filter((cid) => {
              if (node.id === 'E-01') return ['C01', 'C02', 'C03', 'C04'].includes(cid) && collectedClueIds.has(cid)
              if (node.id === 'E-02') return ['C05', 'C06', 'C07'].includes(cid) && collectedClueIds.has(cid)
              if (node.id === 'E-03') return ['C08', 'C09', 'C10'].includes(cid) && collectedClueIds.has(cid)
              if (node.id === 'E-04') return ['C11', 'C12', 'C13'].includes(cid) && collectedClueIds.has(cid)
              if (node.id === 'E-05') return ['C14', 'C15', 'C16'].includes(cid) && collectedClueIds.has(cid)
              if (node.id === 'E-06') return ['C17', 'C18', 'C19'].includes(cid) && collectedClueIds.has(cid)
              return false
            }).length

            const Icon = ICON_MAP[node.icon] || FileText

            return (
              <g
                key={node.id}
                className="cursor-pointer group"
                onClick={() => onSelectNode(node.id)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                {/* Origin selection reticle (Node A) */}
                {isOrigin && (
                  <g>
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r="42"
                      fill="none"
                      stroke="#B7FF3C"
                      strokeWidth="1.2"
                      strokeDasharray="4 2"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                    />
                    <circle cx={node.x} cy={node.y} r="46" fill="none" stroke="#B7FF3C" strokeWidth="0.5" opacity="0.4" />
                    {/* Origin badge tag */}
                    <rect x={node.x - 30} y={node.y - 58} width="60" height="15" fill="#B7FF3C" rx="1" />
                    <text
                      x={node.x}
                      y={node.y - 47}
                      textAnchor="middle"
                      fill="#080A0A"
                      fontSize="8"
                      fontFamily="'JetBrains Mono', monospace"
                      fontWeight="bold"
                      letterSpacing="0.1em"
                    >
                      ORIGIN [A]
                    </text>
                  </g>
                )}

                {/* Target selection reticle (Node B) */}
                {isTarget && (
                  <g>
                    <motion.circle
                      cx={node.x}
                      cy={node.y}
                      r="42"
                      fill="none"
                      stroke="#22D3EE"
                      strokeWidth="1.2"
                      strokeDasharray="4 2"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                      style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                    />
                    <circle cx={node.x} cy={node.y} r="46" fill="none" stroke="#22D3EE" strokeWidth="0.5" opacity="0.4" />
                    {/* Target badge tag */}
                    <rect x={node.x - 30} y={node.y - 58} width="60" height="15" fill="#22D3EE" rx="1" />
                    <text
                      x={node.x}
                      y={node.y - 47}
                      textAnchor="middle"
                      fill="#080A0A"
                      fontSize="8"
                      fontFamily="'JetBrains Mono', monospace"
                      fontWeight="bold"
                      letterSpacing="0.1em"
                    >
                      TARGET [B]
                    </text>
                  </g>
                )}

                {/* Hover ring */}
                {isHovered && !isOrigin && !isTarget && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="38"
                    fill="none"
                    stroke={node.accentColor}
                    strokeWidth="1"
                    strokeDasharray="2 3"
                    opacity="0.7"
                  />
                )}

                {/* Outer Base Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="30"
                  fill="#0A0E0E"
                  stroke={
                    isOrigin
                      ? '#B7FF3C'
                      : isTarget
                      ? '#22D3EE'
                      : isHovered
                      ? node.accentColor
                      : '#1A2424'
                  }
                  strokeWidth={isOrigin || isTarget ? '2' : '1'}
                />

                {/* Inner Circle with Category Color Tint */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="23"
                  fill={`${node.accentColor}12`}
                  stroke={`${node.accentColor}40`}
                  strokeWidth="0.8"
                />

                {/* Node ID label inside center */}
                <text
                  x={node.x}
                  y={node.y - 3}
                  textAnchor="middle"
                  fill={isOrigin ? '#B7FF3C' : isTarget ? '#22D3EE' : '#FFFFFF'}
                  fontSize="10"
                  fontFamily="'JetBrains Mono', monospace"
                  fontWeight="bold"
                >
                  {node.id}
                </text>

                {/* Clue count tag inside node bottom */}
                <text
                  x={node.x}
                  y={node.y + 11}
                  textAnchor="middle"
                  fill={clueCount > 0 ? '#B7FF3C' : '#4B5563'}
                  fontSize="7"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {clueCount > 0 ? `${clueCount} CLUES` : '0 CLUES'}
                </text>

                {/* Node Title & Subtitle Card below */}
                <g transform={`translate(${node.x}, ${node.y + 38})`}>
                  <rect
                    x="-65"
                    y="0"
                    width="130"
                    height="32"
                    fill="#060808"
                    stroke={isOrigin ? '#B7FF3C' : isTarget ? '#22D3EE' : '#141E1E'}
                    strokeWidth="0.8"
                    rx="1"
                  />
                  <text
                    x="0"
                    y="13"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="8.5"
                    fontFamily="'JetBrains Mono', monospace"
                    fontWeight="bold"
                  >
                    {node.title}
                  </text>
                  <text
                    x="0"
                    y="24"
                    textAnchor="middle"
                    fill="#6B7280"
                    fontSize="7"
                    fontFamily="'JetBrains Mono', monospace"
                  >
                    {node.subtitle}
                  </text>
                </g>

                {/* Status indicator pip at top right */}
                {isAnalyzed && (
                  <g transform={`translate(${node.x + 20}, ${node.y - 20})`}>
                    <circle cx="0" cy="0" r="5" fill="#B7FF3C" />
                    <text
                      x="0"
                      y="2.5"
                      textAnchor="middle"
                      fill="#080A0A"
                      fontSize="6"
                      fontFamily="'JetBrains Mono', monospace"
                      fontWeight="bold"
                    >
                      ✓
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
