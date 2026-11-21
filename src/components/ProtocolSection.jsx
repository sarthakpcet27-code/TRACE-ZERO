import React, { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'

/* ═══════════════════════════════════════════════════════════════════
   ProtocolSection — Three-stage investigation sequence
   Each step has a custom animated SVG visual, hover interactions,
   staggered scroll entrance, and a connected timeline spine.
   ═══════════════════════════════════════════════════════════════════ */

/* ─── Step 01: Evidence Scanning Visual ─── */
function InvestigateVisual({ active }) {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
      <defs>
        <clipPath id="scanClip">
          <rect x="10" y="10" width="60" height="60" />
        </clipPath>
      </defs>

      {/* Evidence grid background */}
      {[0, 1, 2, 3].map(row =>
        [0, 1, 2, 3].map(col => (
          <rect
            key={`${row}-${col}`}
            x={12 + col * 15} y={12 + row * 15}
            width="12" height="12"
            rx="1"
            fill="none"
            stroke="#B7FF3C"
            strokeWidth="0.3"
            opacity={active ? 0.18 : 0.08}
            style={{ transition: 'opacity 0.4s ease' }}
          />
        ))
      )}

      {/* Evidence markers — small rectangles suggesting log entries */}
      {[
        { x: 14, y: 14, w: 8, h: 2, o: 0.5 },
        { x: 14, y: 18, w: 5, h: 2, o: 0.3 },
        { x: 29, y: 29, w: 8, h: 2, o: 0.5 },
        { x: 29, y: 33, w: 6, h: 2, o: 0.3 },
        { x: 44, y: 44, w: 8, h: 2, o: 0.5 },
        { x: 44, y: 48, w: 4, h: 2, o: 0.3 },
      ].map((m, i) => (
        <rect
          key={i}
          x={m.x} y={m.y} width={m.w} height={m.h}
          rx="0.5" fill="#B7FF3C"
          opacity={active ? m.o + 0.2 : m.o}
          style={{ transition: 'opacity 0.4s ease' }}
        />
      ))}

      {/* Pulsing anomaly marker */}
      <motion.circle
        cx="52" cy="28" r="4"
        fill="none" stroke="#DC2626" strokeWidth="1"
        animate={active ? { r: [4, 7, 4], opacity: [0.8, 0.3, 0.8] } : { opacity: 0.4 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <circle cx="52" cy="28" r="2" fill="#DC2626" opacity={active ? 0.9 : 0.5} style={{ transition: 'opacity 0.4s ease' }} />

      {/* Scan line sweeping downward */}
      <motion.line
        x1="10" x2="70"
        stroke="#B7FF3C" strokeWidth="1"
        opacity={active ? 0.5 : 0.2}
        animate={{ y1: [10, 70, 10], y2: [10, 70, 10] }}
        transition={{ duration: active ? 2 : 3.5, repeat: Infinity, ease: 'linear' }}
      />

      {/* Magnifier circle */}
      <circle cx="52" cy="28" r="12" fill="none" stroke="#B7FF3C"
        strokeWidth={active ? 0.8 : 0.4}
        opacity={active ? 0.3 : 0.12}
        style={{ transition: 'all 0.4s ease' }}
      />
      <line x1="61" y1="37" x2="67" y2="43" stroke="#B7FF3C"
        strokeWidth={active ? 1.2 : 0.6}
        opacity={active ? 0.4 : 0.15}
        style={{ transition: 'all 0.4s ease' }}
      />
    </svg>
  )
}

/* ─── Step 02: Network Reconstruction Visual ─── */
function ReconstructVisual({ active }) {
  const nodes = [
    { cx: 20, cy: 40 },
    { cx: 40, cy: 18 },
    { cx: 60, cy: 40 },
    { cx: 40, cy: 62 },
    { cx: 40, cy: 40 },
  ]
  const edges = [
    [0, 4], [1, 4], [2, 4], [3, 4], [0, 1], [1, 2], [2, 3],
  ]

  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
      {/* Connection lines animate in */}
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].cx} y1={nodes[a].cy}
          x2={nodes[b].cx} y2={nodes[b].cy}
          stroke="#22D3EE"
          strokeWidth={active ? 0.8 : 0.4}
          strokeDasharray="3 3"
          opacity={active ? 0.5 : 0.2}
          animate={active ? { opacity: [0.3, 0.6, 0.3] } : {}}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.15 }}
          style={{ transition: 'stroke-width 0.3s, opacity 0.3s' }}
        />
      ))}

      {/* Nodes */}
      {nodes.map((n, i) => {
        const isCenter = i === 4
        return (
          <g key={i}>
            <motion.circle
              cx={n.cx} cy={n.cy}
              r={isCenter ? 6 : 4}
              fill="none"
              stroke="#22D3EE"
              strokeWidth={active ? 0.8 : 0.4}
              opacity={active ? 0.3 : 0.1}
              animate={active && isCenter ? { r: [6, 10, 6], opacity: [0.3, 0.1, 0.3] } : {}}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <circle
              cx={n.cx} cy={n.cy}
              r={isCenter ? 3 : 2}
              fill="#22D3EE"
              opacity={active ? 1 : 0.4}
              style={{ transition: 'opacity 0.4s ease' }}
            />
          </g>
        )
      })}

      {/* Travelling data packet along edges */}
      <motion.circle
        r="1.5" fill="#ffffff" opacity={active ? 0.8 : 0}
        animate={active ? {
          cx: [nodes[0].cx, nodes[4].cx, nodes[1].cx, nodes[4].cx, nodes[2].cx],
          cy: [nodes[0].cy, nodes[4].cy, nodes[1].cy, nodes[4].cy, nodes[2].cy],
        } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />

      {/* Fragment labels */}
      {[{ x: 7, y: 38 }, { x: 36, y: 11 }, { x: 63, y: 38 }].map((p, i) => (
        <text
          key={i}
          x={p.x} y={p.y}
          fill="#22D3EE" fontSize="4.5" fontFamily="'JetBrains Mono', monospace"
          opacity={active ? 0.5 : 0.2}
          style={{ transition: 'opacity 0.4s ease' }}
        >
          {['EVT', 'PKT', 'LOG'][i]}
        </text>
      ))}
    </svg>
  )
}

/* ─── Step 03: Security Shield Visual ─── */
function DefendVisual({ active }) {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full" aria-hidden="true">
      {/* Outer protective pulse rings */}
      {[22, 30].map((r, i) => (
        <motion.circle
          key={r}
          cx="40" cy="40" r={r}
          fill="none" stroke="#F59E0B"
          strokeWidth={active ? 0.6 : 0.3}
          animate={active ? { opacity: [0.15, 0.3, 0.15], scale: [1, 1.04, 1] } : { opacity: 0.08 }}
          transition={{ duration: 2.5 + i, repeat: Infinity, delay: i * 0.6 }}
          style={{ transformOrigin: '40px 40px', transition: 'stroke-width 0.4s' }}
        />
      ))}

      {/* Shield path */}
      <motion.path
        d="M40 14 L56 21 L56 38 C56 50 48 58 40 62 C32 58 24 50 24 38 L24 21 Z"
        fill="none"
        stroke="#F59E0B"
        strokeWidth={active ? 1.2 : 0.7}
        strokeLinejoin="round"
        opacity={active ? 0.7 : 0.35}
        style={{ transition: 'all 0.4s ease' }}
      />

      {/* Shield fill gradient tint */}
      <path
        d="M40 14 L56 21 L56 38 C56 50 48 58 40 62 C32 58 24 50 24 38 L24 21 Z"
        fill="#F59E0B"
        opacity={active ? 0.06 : 0.02}
        style={{ transition: 'opacity 0.4s ease' }}
      />

      {/* Checkmark / lock icon inside shield */}
      <motion.path
        d="M33 40 L38 45 L48 34"
        fill="none" stroke="#F59E0B"
        strokeWidth={active ? 1.5 : 0.8}
        strokeLinecap="round" strokeLinejoin="round"
        opacity={active ? 0.9 : 0.4}
        animate={active ? { opacity: [0.7, 1, 0.7] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transition: 'stroke-width 0.4s ease' }}
      />

      {/* Top status indicator bar */}
      <rect x="27" y="11" width="26" height="2" rx="1"
        fill="#F59E0B"
        opacity={active ? 0.3 : 0.1}
        style={{ transition: 'opacity 0.4s ease' }}
      />

      {/* Scanning arc */}
      <motion.path
        d="M28 38 A12 12 0 0 1 52 38"
        fill="none" stroke="#F59E0B" strokeWidth="0.6"
        opacity={active ? 0.5 : 0}
        animate={active ? { rotate: [0, 360] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: '40px 40px' }}
      />
    </svg>
  )
}

/* ─── Connector spine between steps ─── */
function StepConnector({ visible, color }) {
  return (
    <div className="hidden lg:flex items-center justify-center flex-1 px-2 relative" aria-hidden="true">
      <div className="w-full h-[1px] relative overflow-hidden bg-[#1F2937]">
        <motion.div
          className="absolute inset-y-0 left-0 h-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={visible ? { width: '100%' } : { width: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
        />
      </div>
      {/* Arrow head */}
      <motion.div
        className="absolute right-2 w-0 h-0"
        style={{
          borderTop: '4px solid transparent',
          borderBottom: '4px solid transparent',
          borderLeft: `6px solid ${color}`,
          opacity: visible ? 0.4 : 0,
          transition: 'opacity 0.5s ease 0.9s',
        }}
      />
    </div>
  )
}

/* ─── Individual Step Card ─── */
function ProtocolStep({ step, index, isVisible }) {
  const [hovered, setHovered] = useState(false)

  const VisualComponent = {
    '01': InvestigateVisual,
    '02': ReconstructVisual,
    '03': DefendVisual,
  }[step.num]

  const techLabels = {
    '01': ['EVIDENCE SCAN', 'LOG PARSER', 'ANOMALY DETECT'],
    '02': ['NODE MAPPING', 'CHAIN ANALYSIS', 'EVENT SEQUENCE'],
    '03': ['THREAT MODEL', 'REPLAY ENGINE', 'DEFENSE VERIFY'],
  }[step.num]

  return (
    <motion.div
      className="relative flex-1 min-w-0"
      initial={{ opacity: 0, y: 28 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="relative border bg-[#0C0E0E] h-full flex flex-col cursor-default overflow-hidden"
        style={{
          borderColor: hovered ? `${step.accent}40` : '#1a2020',
          boxShadow: hovered ? `0 0 30px ${step.accent}0a, 0 4px 20px rgba(0,0,0,0.5)` : '0 2px 12px rgba(0,0,0,0.3)',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{ borderColor: hovered ? `${step.accent}40` : '#1a2020' }}
        transition={{ duration: 0.3 }}
      >
        {/* Top accent bar */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[2px]"
          initial={{ scaleX: 0 }}
          animate={isVisible ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ duration: 0.8, delay: 0.4 + index * 0.2, ease: 'easeOut' }}
          style={{ transformOrigin: 'left', backgroundColor: step.accent }}
        />

        {/* Large ghost step number */}
        <span
          className="absolute top-4 right-5 text-[72px] font-black leading-none select-none pointer-events-none font-mono"
          style={{ color: step.accent, opacity: hovered ? 0.1 : 0.05, transition: 'opacity 0.4s ease' }}
        >
          {step.num}
        </span>

        {/* Animated Visual */}
        <div className="p-6 pb-0">
          <div
            className="w-16 h-16 mb-6 flex items-center justify-center transition-all duration-400"
            style={{
              backgroundColor: hovered ? `${step.accent}0f` : `${step.accent}06`,
              border: `1px solid ${hovered ? step.accent + '30' : step.accent + '14'}`,
            }}
          >
            <div className="w-10 h-10">
              <VisualComponent active={hovered} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-8 flex flex-col flex-1">
          {/* Step label */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[9px] font-mono tracking-[0.3em] text-[#4B5563]">
              STEP {step.num}
            </span>
            <div
              className="h-[1px] flex-1 max-w-[20px] transition-all duration-400"
              style={{ backgroundColor: hovered ? step.accent : `${step.accent}30` }}
            />
          </div>

          {/* Title */}
          <h3
            className="text-xl font-black tracking-widest mb-3 transition-all duration-300"
            style={{ color: step.accent, textShadow: hovered ? `0 0 20px ${step.accent}30` : 'none' }}
          >
            {step.title}
          </h3>

          {/* Description */}
          <p className="text-[#6B7280] text-sm leading-relaxed mb-5 group-hover:text-[#9CA3AF] transition-colors duration-300">
            {step.description}
          </p>

          {/* Technical labels */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {techLabels.map(tag => (
              <span
                key={tag}
                className="text-[8px] font-mono tracking-[0.15em] px-2 py-0.5 border transition-all duration-300"
                style={{
                  color: hovered ? step.accent : '#4B5563',
                  borderColor: hovered ? `${step.accent}30` : '#1F2937',
                  backgroundColor: hovered ? `${step.accent}08` : 'transparent',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom left accent mark */}
        <div
          className="absolute bottom-0 left-0 h-[1px] transition-all duration-500"
          style={{
            width: hovered ? '100%' : '0%',
            backgroundColor: step.accent,
            opacity: 0.4,
          }}
        />
      </motion.div>
    </motion.div>
  )
}

/* ─── Main Export ─── */
export default function ProtocolSection() {
  const ref = useRef(null)
  const isVisible = useInView(ref, { once: true, margin: '-100px 0px' })

  const steps = [
    {
      num: '01',
      title: 'INVESTIGATE',
      description: 'Inspect digital evidence, system logs and suspicious activity across compromised infrastructure.',
      accent: '#B7FF3C',
    },
    {
      num: '02',
      title: 'RECONSTRUCT',
      description: 'Connect the evidence and determine the precise sequence of events that led to the breach.',
      accent: '#22D3EE',
    },
    {
      num: '03',
      title: 'DEFEND',
      description: 'Replay the incident with defensive controls enabled to validate your security response.',
      accent: '#F59E0B',
    },
  ]

  return (
    <section id="protocol" ref={ref} className="relative py-24 overflow-hidden">
      {/* Subtle section divider glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#B7FF3C]/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-[1px] bg-[#B7FF3C]/40" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#6B7280] uppercase">
              Investigation Protocol
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              THE <span className="text-[#B7FF3C]">PROTOCOL</span>
            </h2>
            <p className="text-[#4B5563] text-xs font-mono tracking-widest max-w-[200px] sm:text-right">
              THREE STAGES /<br />ONE OBJECTIVE
            </p>
          </div>
        </motion.div>

        {/* Steps row + connectors */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 items-stretch">
          {steps.map((step, i) => (
            <React.Fragment key={step.num}>
              <ProtocolStep step={step} index={i} isVisible={isVisible} />
              {i < steps.length - 1 && (
                <StepConnector visible={isVisible} color={steps[i + 1].accent} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Bottom sequence label */}
        <motion.div
          className="mt-10 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <div className="flex-1 h-[1px] bg-[#1F2937]" />
          <span className="text-[9px] font-mono tracking-[0.3em] text-[#4B5563]">
            INCIDENT RESPONSE SEQUENCE — CASE TR-2049
          </span>
          <div className="flex-1 h-[1px] bg-[#1F2937]" />
        </motion.div>
      </div>

      {/* Bottom divider glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#1F2937]/60 to-transparent" />
    </section>
  )
}
