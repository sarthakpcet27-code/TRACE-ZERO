import React, { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Shield, Radio, Lock, AlertTriangle,
  Clock, MapPin, FileText, Activity, ChevronRight,
  Eye, Zap, Database, Cpu, Server, Wifi, X, CheckCircle2
} from 'lucide-react'
import TransitionOverlay from '../components/TransitionOverlay'

/* ═══════════════════════════════════════════════════════════════════
   InvestigationBriefing — Phase 3
   The player's first screen inside the investigation.
   Full forensic assignment dossier + interactive panels.
   ═══════════════════════════════════════════════════════════════════ */

/* ─── Briefing header bar ─── */
function BriefingHeader({ onBack }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#060808]/90 backdrop-blur-md border-b border-[#1a2222]">
      <div className="w-full mx-auto px-6 sm:px-8 lg:px-12 h-14 flex items-center justify-between">
        {/* Left: logo + case */}
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-[#4B5563] hover:text-[#B7FF3C] transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
            OVERVIEW
          </button>
          <div className="w-[1px] h-4 bg-[#1F2937]" />
          <div className="flex items-center gap-2.5">
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <circle cx="12" cy="12" r="8"  fill="none" stroke="#B7FF3C" strokeWidth="0.8" opacity="0.6" />
              <circle cx="12" cy="12" r="3.5" fill="none" stroke="#B7FF3C" strokeWidth="0.6" opacity="0.4" />
              <circle cx="12" cy="12" r="1.5" fill="#B7FF3C" />
              <line x1="12" y1="2"  x2="12" y2="7"  stroke="#B7FF3C" strokeWidth="0.6" opacity="0.5" />
              <line x1="12" y1="17" x2="12" y2="22" stroke="#B7FF3C" strokeWidth="0.6" opacity="0.5" />
              <line x1="2"  y1="12" x2="7"  y2="12" stroke="#B7FF3C" strokeWidth="0.6" opacity="0.5" />
              <line x1="17" y1="12" x2="22" y2="12" stroke="#B7FF3C" strokeWidth="0.6" opacity="0.5" />
            </svg>
            <span className="text-xs font-bold tracking-[0.18em] text-white">
              TRACE<span className="text-[#B7FF3C]">//</span>ZERO
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[9px] font-mono tracking-[0.15em] text-[#374151]">DIGITAL FORENSICS DIVISION</span>
          </div>
        </div>

        {/* Center: case id */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#6B7280]">CASE</span>
          <span className="text-sm font-mono font-bold tracking-[0.2em] text-[#B7FF3C]">#TR-2049</span>
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#B7FF3C]"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <span className="text-[9px] font-mono tracking-[0.2em] text-[#B7FF3C]">ACTIVE</span>
          </div>
        </div>

        {/* Right: status */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <Radio size={11} className="text-[#22D3EE]" />
            <span className="text-[9px] font-mono tracking-[0.15em] text-[#374151]">SECURE CHANNEL</span>
          </div>
          <div className="border border-[#F59E0B]/30 bg-[#F59E0B]/05 px-3 py-1">
            <span className="text-[9px] font-mono tracking-[0.2em] text-[#F59E0B]">UNRESOLVED</span>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ─── Animated forensic grid background ─── */
function BriefingBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0 bg-[#080A0A]" />
      <div className="absolute inset-0 grid-bg opacity-70" />
      {/* Ambient glow blobs */}
      <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-[#B7FF3C]/[0.015] rounded-full blur-[150px]" />
      <div className="absolute bottom-[15%] right-[8%] w-[400px] h-[400px] bg-[#22D3EE]/[0.012] rounded-full blur-[130px]" />
      {/* Scan line */}
      <div className="scan-line" />
    </div>
  )
}

/* ─── Section label ─── */
function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-5 h-[1px] bg-[#B7FF3C]/40" />
      <span className="text-[9px] font-mono tracking-[0.3em] text-[#6B7280] uppercase">{children}</span>
    </div>
  )
}

/* ─── Mission briefing text panel ─── */
function MissionBriefing({ visible }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <SectionLabel>Mission Assignment</SectionLabel>
      <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.0] text-white mb-2">
        THE MIDNIGHT
      </h1>
      <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.0] mb-8">
        <span className="text-[#B7FF3C]">BREACH.</span>
      </h1>

      <div className="space-y-4 mb-8">
        {[
          'At 02:14 UTC on November 20, 2049, threat detection flagged anomalous egress traffic from NEXORA Technologies\'s classified infrastructure.',
          'A senior engineer\'s credentials were used to access restricted project vaults and exfiltrate 1.4 GB of classified data to an unknown external IP address.',
          'The attacker covered their tracks by purging 318 event log entries. Fragments remain. Your task is to recover the full sequence of events before the evidence degrades.',
        ].map((para, i) => (
          <motion.p
            key={i}
            className="text-[#6B7280] text-sm leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.1 }}
          >
            {para}
          </motion.p>
        ))}
      </div>

      {/* Threat classification bar */}
      <motion.div
        className="border border-[#DC2626]/20 bg-[#DC2626]/[0.04] p-4 mb-8"
        initial={{ opacity: 0, x: -12 }}
        animate={visible ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.45 }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle size={14} className="text-[#DC2626] shrink-0 mt-0.5" />
          <div>
            <p className="text-[9px] font-mono tracking-[0.25em] text-[#DC2626] mb-1">THREAT CLASSIFICATION — CRITICAL</p>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              APT actor with insider access. Multi-stage exfiltration. Active log tampering. Lateral movement confirmed. Suspect still unidentified.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Objectives */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        <p className="text-[9px] font-mono tracking-[0.3em] text-[#4B5563] mb-3">YOUR OBJECTIVES</p>
        <div className="space-y-2.5">
          {[
            { num: '01', text: 'Reconstruct the full attack timeline from recovered log fragments', done: false },
            { num: '02', text: 'Identify the exfiltrated data and determine its classification level', done: false },
            { num: '03', text: 'Establish the identity and motive of the primary suspect', done: false },
            { num: '04', text: 'Determine the attack vector and exploited vulnerability', done: false },
          ].map((obj) => (
            <div key={obj.num} className="flex items-start gap-3">
              <span className="text-[9px] font-mono text-[#374151] shrink-0 mt-0.5">{obj.num}</span>
              <div className="flex-1 flex items-center gap-3">
                <div className="w-1.5 h-1.5 border border-[#374151] shrink-0 mt-0.5" />
                <p className="text-xs text-[#9CA3AF]">{obj.text}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

/* ─── Evidence node map SVG ─── */
function EvidenceNetworkMap() {
  const nodes = [
    { id: 'AUTH',  x: 50,  y: 30,  color: '#B7FF3C', label: 'AUTH LOGS',    sub: '10.4.1.22',   status: 'recovered' },
    { id: 'VAULT', x: 160, y: 70,  color: '#22D3EE', label: 'FILE VAULT',   sub: 'helios/specs', status: 'recovered' },
    { id: 'PROC',  x: 250, y: 30,  color: '#F59E0B', label: 'PROCESS MEM',  sub: 'lsass.exe',    status: 'partial'   },
    { id: 'NET',   x: 310, y: 110, color: '#DC2626', label: 'NET EGRESS',   sub: '185.220.101.5',status: 'flagged'   },
    { id: 'DB',    x: 160, y: 155, color: '#F59E0B', label: 'DB QUERY',     sub: 'cipher_vault', status: 'partial'   },
    { id: 'LOG',   x: 50,  y: 130, color: '#DC2626', label: 'LOG PURGE',    sub: '318 entries',  status: 'flagged'   },
  ]
  const edges = [
    ['AUTH', 'VAULT'], ['VAULT', 'PROC'], ['PROC', 'NET'],
    ['VAULT', 'DB'],   ['DB', 'NET'],     ['AUTH', 'LOG'],
  ]

  const getNode = (id) => nodes.find((n) => n.id === id)

  const [hovered, setHovered] = useState(null)

  return (
    <div className="relative">
      <SectionLabel>Evidence Network — Partial Reconstruction</SectionLabel>
      <div className="border border-[#1a2222] bg-[#060808] p-4 relative overflow-hidden">
        {/* Corner reticles */}
        <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-[#B7FF3C]/20" />
        <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-[#B7FF3C]/20" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-[#B7FF3C]/20" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-[#B7FF3C]/20" />

        <svg viewBox="0 0 360 200" className="w-full" style={{ height: '200px' }}>
          {/* Edges */}
          {edges.map(([a, b], i) => {
            const na = getNode(a)
            const nb = getNode(b)
            const isActive = hovered === a || hovered === b
            return (
              <motion.line
                key={i}
                x1={na.x} y1={na.y}
                x2={nb.x} y2={nb.y}
                stroke={isActive ? na.color : '#1F2937'}
                strokeWidth={isActive ? 1.2 : 0.6}
                strokeDasharray="4 3"
                animate={{ opacity: isActive ? [0.6, 1, 0.6] : [0.4, 0.6, 0.4] }}
                transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
              />
            )
          })}

          {/* Data packet travelling (always on) */}
          <motion.circle
            r="2" fill="#B7FF3C" opacity={0.7}
            animate={{
              cx: [50, 160, 250, 310, 160, 50],
              cy: [30,  70,  30,  110, 155, 130],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          />

          {/* Nodes */}
          {nodes.map((n) => {
            const isHov = hovered === n.id
            return (
              <g
                key={n.id}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: 'default' }}
              >
                {/* Pulse ring */}
                <motion.circle
                  cx={n.x} cy={n.y} r={12}
                  fill="none" stroke={n.color}
                  strokeWidth={isHov ? 0.8 : 0.4}
                  animate={{ opacity: [0.1, 0.3, 0.1], r: isHov ? [12, 16, 12] : [10, 12, 10] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {/* Node circle */}
                <circle
                  cx={n.x} cy={n.y} r={5}
                  fill={n.color}
                  opacity={isHov ? 1 : 0.6}
                  style={{ transition: 'opacity 0.3s, r 0.3s' }}
                />
                {/* Status indicator */}
                {n.status === 'flagged' && (
                  <circle cx={n.x + 5} cy={n.y - 5} r={2.5} fill="#DC2626" opacity={0.8} />
                )}
                {n.status === 'partial' && (
                  <circle cx={n.x + 5} cy={n.y - 5} r={2.5} fill="#F59E0B" opacity={0.8} />
                )}
                {/* Label */}
                <text
                  x={n.x} y={n.y + 20}
                  textAnchor="middle"
                  fill={isHov ? n.color : '#4B5563'}
                  fontSize="6.5"
                  fontFamily="'JetBrains Mono', monospace"
                  style={{ transition: 'fill 0.3s' }}
                >
                  {n.label}
                </text>
                <text
                  x={n.x} y={n.y + 29}
                  textAnchor="middle"
                  fill="#2D3748"
                  fontSize="5.5"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {n.sub}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Hovered node detail */}
        <AnimatePresence>
          {hovered && (() => {
            const n = getNode(hovered)
            return (
              <motion.div
                key={hovered}
                className="absolute bottom-3 right-3 border px-3 py-2 text-[9px] font-mono"
                style={{ borderColor: `${n.color}30`, backgroundColor: `${n.color}08` }}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
              >
                <p style={{ color: n.color }} className="tracking-widest mb-0.5">{n.label}</p>
                <p className="text-[#4B5563]">{n.sub}</p>
                <p className={`tracking-wider mt-1 ${
                  n.status === 'flagged' ? 'text-[#DC2626]'
                  : n.status === 'partial' ? 'text-[#F59E0B]'
                  : 'text-[#B7FF3C]'
                }`}>
                  {n.status.toUpperCase()}
                </p>
              </motion.div>
            )
          })()}
        </AnimatePresence>

        {/* Legend */}
        <div className="flex gap-4 mt-2">
          {[
            { color: '#B7FF3C', label: 'RECOVERED' },
            { color: '#F59E0B', label: 'PARTIAL' },
            { color: '#DC2626', label: 'FLAGGED' },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: l.color }} />
              <span className="text-[8px] font-mono text-[#374151] tracking-widest">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Case dossier metrics strip ─── */
function CaseMetrics({ visible }) {
  const metrics = [
    { icon: Clock,       label: 'BREACH TIME',     value: '02:14:08 UTC',      color: '#9CA3AF' },
    { icon: MapPin,      label: 'ORIGIN IP',        value: '10.4.1.22',         color: '#9CA3AF' },
    { icon: Wifi,        label: 'EXFIL DEST',       value: '185.220.101.5',     color: '#DC2626' },
    { icon: Database,    label: 'DATA EXFILTRATED', value: '1.4 GB',            color: '#DC2626' },
    { icon: FileText,    label: 'LOGS PURGED',      value: '318 ENTRIES',       color: '#F59E0B' },
    { icon: Shield,      label: 'CLEARANCE REQ.',   value: 'LEVEL 4',           color: '#B7FF3C' },
  ]

  return (
    <div className="border border-[#1a2222] divide-y divide-[#111818]">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          className="flex items-center justify-between px-4 py-3 hover:bg-[#0A0D0D] transition-colors duration-150"
          initial={{ opacity: 0, x: 10 }}
          animate={visible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.35, delay: 0.2 + i * 0.07 }}
        >
          <div className="flex items-center gap-2.5">
            <m.icon size={11} className="text-[#374151] shrink-0" />
            <span className="text-[9px] font-mono tracking-[0.2em] text-[#4B5563]">{m.label}</span>
          </div>
          <span className="text-[10px] font-mono tracking-wider" style={{ color: m.color }}>
            {m.value}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

/* ─── Suspect profile card ─── */
function SuspectProfile({ visible }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <SectionLabel>Primary Suspect</SectionLabel>
      <button
        className="w-full text-left border border-[#1a2222] bg-[#060808] hover:bg-[#0A0D0D] transition-colors duration-200 cursor-pointer group"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar placeholder — SVG silhouette */}
            <div className="w-10 h-10 border border-[#F59E0B]/20 bg-[#F59E0B]/04 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <circle cx="12" cy="8" r="4" fill="none" stroke="#F59E0B" strokeWidth="0.8" opacity="0.5" />
                <path d="M4 20 C4 15.5 8 13 12 13 C16 13 20 15.5 20 20" fill="none" stroke="#F59E0B" strokeWidth="0.8" opacity="0.5" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-mono font-bold text-[#9CA3AF] tracking-wider">S. MERCER</p>
              <p className="text-[9px] font-mono text-[#4B5563] tracking-[0.15em]">SR. ENGINEER — NXR-04-7721</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block border border-[#F59E0B]/25 bg-[#F59E0B]/05 px-2.5 py-0.5">
              <span className="text-[8px] font-mono text-[#F59E0B] tracking-widest">PERSON OF INTEREST</span>
            </div>
            <ChevronRight
              size={12}
              className={`text-[#374151] transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`}
            />
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border-t border-[#1a2222] px-4 py-4 space-y-2.5">
                {[
                  { label: 'DEPARTMENT',   value: 'RESEARCH & DEVELOPMENT' },
                  { label: 'ACCESS TIER',  value: 'TIER-3 VAULT — PROJECT HELIOS' },
                  { label: 'SESSION START', value: '02:13:44 UTC — AUTH SUCCESS' },
                  { label: 'WORKSTATION',  value: 'WS-NXR-0244 / 10.4.1.22' },
                  { label: 'ANOMALY',      value: 'AFTER-HOURS ACCESS + BULK DOWNLOAD' },
                  { label: 'STATUS',       value: 'UNLOCATED — LAST PING 02:19 UTC' },
                ].map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4">
                    <span className="text-[8px] font-mono text-[#374151] tracking-widest shrink-0">{row.label}</span>
                    <span className="text-[9px] font-mono text-[#6B7280] text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  )
}

/* ─── Evidence inventory ─── */
function EvidenceInventory({ visible }) {
  const items = [
    { id: 'EV-001', name: 'AUTHENTICATION LOGS',    type: 'LOG',    status: 'RECOVERED', accent: '#B7FF3C' },
    { id: 'EV-002', name: 'NETWORK PACKET CAPTURE', type: 'PCAP',   status: 'RECOVERED', accent: '#B7FF3C' },
    { id: 'EV-003', name: 'LSASS MEMORY DUMP',      type: 'MEM',    status: 'PARTIAL',   accent: '#F59E0B' },
    { id: 'EV-004', name: 'DB QUERY HISTORY',       type: 'SQL',    status: 'PARTIAL',   accent: '#F59E0B' },
    { id: 'EV-005', name: 'PURGED EVENT LOG FRAG.', type: 'LOG',    status: 'CORRUPTED', accent: '#DC2626' },
    { id: 'EV-006', name: 'EXFIL DESTINATION TRACE',type: 'NET',    status: 'PENDING',   accent: '#374151' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.35 }}
    >
      <SectionLabel>Evidence Inventory — 12 / 18 Items</SectionLabel>
      <div className="border border-[#1a2222] divide-y divide-[#0E1414]">
        {/* Table header */}
        <div className="flex items-center gap-3 px-4 py-2 bg-[#060808]">
          <span className="text-[8px] font-mono tracking-[0.2em] text-[#374151] w-16">ID</span>
          <span className="text-[8px] font-mono tracking-[0.2em] text-[#374151] flex-1">ITEM</span>
          <span className="text-[8px] font-mono tracking-[0.2em] text-[#374151] w-10">TYPE</span>
          <span className="text-[8px] font-mono tracking-[0.2em] text-[#374151] w-20 text-right">STATUS</span>
        </div>
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#0A0D0D] transition-colors duration-150 group"
            initial={{ opacity: 0, x: -8 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.06 }}
          >
            <span className="text-[9px] font-mono text-[#374151] w-16 tracking-wider">{item.id}</span>
            <span className="text-[9px] font-mono text-[#6B7280] flex-1 group-hover:text-[#9CA3AF] transition-colors truncate">{item.name}</span>
            <span className="text-[8px] font-mono text-[#374151] w-10">{item.type}</span>
            <span
              className="text-[8px] font-mono tracking-widest w-20 text-right"
              style={{ color: item.accent }}
            >
              {item.status}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── System readiness panel ─── */
function SystemReadiness({ visible }) {
  const systems = [
    { name: 'EVIDENCE PARSER',   pct: 100, color: '#B7FF3C', icon: Cpu },
    { name: 'LOG RECONSTRUCTOR', pct: 100, color: '#B7FF3C', icon: FileText },
    { name: 'NETWORK ANALYZER',  pct: 78,  color: '#22D3EE', icon: Wifi },
    { name: 'TIMELINE ENGINE',   pct: 55,  color: '#F59E0B', icon: Activity },
    { name: 'SUSPECT PROFILER',  pct: 40,  color: '#F59E0B', icon: Eye },
    { name: 'DEFENSE REPLAY',    pct: 0,   color: '#374151', icon: Zap },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <SectionLabel>Investigation Systems</SectionLabel>
      <div className="border border-[#1a2222] bg-[#060808] p-4 space-y-3">
        {systems.map((sys, i) => (
          <motion.div
            key={sys.name}
            initial={{ opacity: 0, x: 10 }}
            animate={visible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.35, delay: 0.55 + i * 0.08 }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <sys.icon size={10} style={{ color: sys.pct === 0 ? '#374151' : sys.color }} />
                <span className="text-[9px] font-mono tracking-[0.15em]" style={{ color: sys.pct === 0 ? '#374151' : '#6B7280' }}>
                  {sys.name}
                </span>
              </div>
              <span className="text-[9px] font-mono" style={{ color: sys.pct === 0 ? '#374151' : sys.color }}>
                {sys.pct === 0 ? 'LOCKED' : `${sys.pct}%`}
              </span>
            </div>
            <div className="h-[2px] bg-[#111818] overflow-hidden">
              <motion.div
                className="h-full"
                style={{ backgroundColor: sys.pct === 0 ? '#1F2937' : sys.color }}
                initial={{ width: 0 }}
                animate={visible ? { width: `${sys.pct}%` } : { width: 0 }}
                transition={{ duration: 0.9, delay: 0.6 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ─── Begin investigation CTA block ─── */
function BeginCTA({ visible, onBegin }) {
  return (
    <motion.div
      className="border border-[#B7FF3C]/15 bg-[#B7FF3C]/[0.03] p-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 16 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.7 }}
    >
      {/* Corner reticles */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[#B7FF3C]/30" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[#B7FF3C]/30" />

      <p className="text-[9px] font-mono tracking-[0.3em] text-[#6B7280] mb-3">INVESTIGATION STATUS</p>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-mono text-white tracking-wider mb-1">
            12 EVIDENCE ITEMS LOADED
          </p>
          <p className="text-xs text-[#4B5563]">
            6 items pending recovery. Begin your investigation.
          </p>
        </div>
        <motion.button
          onClick={onBegin}
          className="group flex items-center gap-3 text-[13px] font-mono tracking-[0.2em] font-bold text-[#080A0A] bg-[#B7FF3C] px-8 sm:px-10 py-4 sm:py-[18px] hover:bg-[#c8ff66] transition-all duration-200 cursor-pointer shadow-[0_0_25px_rgba(183,255,60,0.3)] hover:shadow-[0_0_40px_rgba(183,255,60,0.5)] active:scale-[0.98] shrink-0"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          OPEN EVIDENCE LAB
          <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
        </motion.button>
      </div>

      {/* Disclaimer */}
      <p className="text-[8px] font-mono text-[#2D3748] mt-4 tracking-[0.15em]">
        ALL DATA IS FICTIONAL — TRACE//ZERO IS A DIGITAL FORENSICS SIMULATION FOR PIXEL WARS X26
      </p>
    </motion.div>
  )
}

/* ─── Live intel feed ticker ─── */
const INTEL_LINES = [
  'ANOMALY DETECTED — EGRESS SPIKE 02:14:08 UTC',
  'PROCESS INJECTION FLAGGED — PID 4092 LSASS',
  'DATABASE EXFILTRATION — 2847 ROWS CIPHER_VAULT',
  'EVENT LOG PURGE — 318 ENTRIES DESTROYED',
  'SSH SESSION TERMINATED — SRC 185.220.101.5',
  'CASE STATUS: ACTIVE — ANALYST ASSIGNMENT PENDING',
]

function IntelTicker() {
  return (
    <div className="flex items-center gap-4 overflow-hidden">
      <span className="text-[8px] font-mono tracking-[0.3em] text-[#DC2626] shrink-0">LIVE INTEL</span>
      <div className="flex-1 overflow-hidden relative">
        <motion.div
          className="flex gap-16 whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        >
          {[...INTEL_LINES, ...INTEL_LINES].map((line, i) => (
            <span key={i} className="text-[9px] font-mono text-[#374151] tracking-wider shrink-0">
              <span className="text-[#DC2626]/50 mr-3">◆</span>{line}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

/* ─── Main page export ─── */
export default function InvestigationBriefing() {
  const navigate = useNavigate()
  const ref = useRef(null)
  const isVisible = useInView(ref, { once: true, amount: 0.05 })
  const [booting, setBooting] = useState(true)
  const [labModal, setLabModal] = useState(false)

  return (
    <div className="min-h-screen bg-[#080A0A] relative">
      <BriefingBackground />

      {/* Cinematic Transition & Boot Overlay */}
      <TransitionOverlay active={booting} onDone={() => setBooting(false)} />

      {/* Fixed header */}
      <BriefingHeader onBack={() => navigate('/')} />

      {/* Live intel ticker bar */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-[#040606]/80 backdrop-blur-sm border-b border-[#0E1414] px-6 sm:px-8 lg:px-12 py-2">
        <IntelTicker />
      </div>

      {/* Main content */}
      <main
        ref={ref}
        className="relative z-10 w-full mx-auto px-6 sm:px-8 lg:px-12 pt-36 pb-20"
      >
        {/* ─── Top status strip ─── */}
        <motion.div
          className="flex flex-wrap items-center gap-6 mb-10 pb-6 border-b border-[#1a2222]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3">
            <Server size={12} className="text-[#B7FF3C]" />
            <span className="text-[9px] font-mono tracking-[0.3em] text-[#6B7280]">
              NEXORA TECHNOLOGIES — INCIDENT RESPONSE UNIT
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Lock size={11} className="text-[#374151]" />
            <span className="text-[9px] font-mono tracking-[0.2em] text-[#374151]">CLEARANCE: LEVEL 4</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-mono tracking-[0.2em] text-[#374151]">ANALYST: [YOU]</span>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#B7FF3C]"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <span className="text-[9px] font-mono tracking-[0.3em] text-[#B7FF3C]">CASE ACTIVE</span>
          </div>
        </motion.div>

        {/* ─── Asymmetric two-column layout ─── */}
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-start">

          {/* ══ LEFT COLUMN ══ */}
          <div className="space-y-10">
            <MissionBriefing visible={isVisible} />
            <EvidenceNetworkMap />
            <EvidenceInventory visible={isVisible} />
          </div>

          {/* ══ RIGHT COLUMN ══ */}
          <div className="space-y-8">
            {/* Case metrics */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <SectionLabel>Incident Parameters</SectionLabel>
              <CaseMetrics visible={isVisible} />
            </motion.div>

            <SuspectProfile visible={isVisible} />
            <SystemReadiness visible={isVisible} />
            <BeginCTA visible={isVisible} onBegin={() => navigate('/lab')} />

            {/* Case reference strip */}
            <motion.div
              className="flex flex-wrap items-center justify-between gap-3 pt-2"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <span className="text-[8px] font-mono tracking-[0.2em] text-[#2D3748]">
                REF: NXR-2049-INC-001
              </span>
              <span className="text-[8px] font-mono tracking-[0.2em] text-[#2D3748]">
                ENCRYPTED SESSION
              </span>
              <span className="text-[8px] font-mono tracking-[0.2em] text-[#2D3748]">
                SIGNAL: SECURE
              </span>
            </motion.div>
          </div>
        </div>
      </main>

      {/* ─── Interactive Evidence Lab Dialog ─── */}
      <AnimatePresence>
        {labModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25 }}
              className="w-full max-w-lg border border-[#B7FF3C]/30 bg-[#090C0C] p-6 sm:p-8 relative shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#B7FF3C]" />
              <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#B7FF3C]" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#B7FF3C]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#B7FF3C]" />

              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <Shield size={16} className="text-[#B7FF3C]" />
                  <span className="text-xs font-mono font-bold tracking-[0.2em] text-white">
                    FORENSIC LAB ACCESS
                  </span>
                </div>
                <button
                  onClick={() => setLabModal(false)}
                  className="text-[#4B5563] hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="border border-[#1a2222] bg-[#060808] p-3 text-[10px] font-mono text-[#9CA3AF] space-y-1">
                  <div className="text-[#B7FF3C]">STATUS: MISSION BRIEFING RATIFIED</div>
                  <div className="text-[#6B7280]">TARGET: NEXORA HELIOS INCIDENT RECOVERY</div>
                  <div className="text-[#22D3EE]">CLEARANCE: LEVEL 4 VALIDATED</div>
                </div>

                <p className="text-xs text-[#9CA3AF] leading-relaxed">
                  You are now assigned as Lead Investigator for Case <span className="text-[#B7FF3C] font-mono font-semibold">#TR-2049</span>.
                  Proceed to the Evidence Lab to inspect recovered evidence, log clues, correlate the attack chain, reconstruct the incident timeline, and simulate defensive countermeasures.
                </p>
                <p className="text-[11px] text-[#4B5563] font-mono leading-relaxed">
                  All briefing files and network telemetry have been logged to your secure terminal session.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 justify-end pt-2 border-t border-[#1a2222]">
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 border border-[#1a2222] text-[10px] font-mono tracking-wider text-[#9CA3AF] hover:text-white hover:border-[#374151] transition-colors cursor-pointer"
                >
                  RETURN TO HOME
                </button>
                <button
                  onClick={() => {
                    setLabModal(false)
                    navigate('/lab')
                  }}
                  className="px-5 py-2 bg-[#B7FF3C] text-[#080A0A] font-mono font-bold text-[10px] tracking-wider hover:bg-[#c8ff66] transition-all cursor-pointer shadow-[0_0_20px_rgba(183,255,60,0.2)]"
                >
                  ENTER EVIDENCE LAB
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
