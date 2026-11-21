import { useEffect, useRef, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ShieldAlert, Crosshair, Terminal } from 'lucide-react'

/* ═══════════════════════════════════════════════════════════
   ForensicRadar — Large cinematic forensic scanning display
   - Concentric rings, rotating sweep, radar beam
   - Interactive nodes with forensic inspection tooltips
   - Coordinate indicators, HUD reticles, connection matrix
   - Canvas particle background for subtle ambient telemetry
   ═══════════════════════════════════════════════════════════ */

function TickMark({ angle, innerR, outerR, cx, cy, opacity = 0.15 }) {
  const rad = (angle * Math.PI) / 180
  return (
    <line
      x1={cx + innerR * Math.cos(rad)}
      y1={cy + innerR * Math.sin(rad)}
      x2={cx + outerR * Math.cos(rad)}
      y2={cy + outerR * Math.sin(rad)}
      stroke="#B7FF3C"
      strokeWidth="0.5"
      opacity={opacity}
    />
  )
}

function CoordLabel({ angle, r, cx, cy, text }) {
  const rad = (angle * Math.PI) / 180
  const x = cx + r * Math.cos(rad)
  const y = cy + r * Math.sin(rad)
  return (
    <text
      x={x}
      y={y}
      fill="#4B5563"
      fontSize="5.5"
      textAnchor="middle"
      fontFamily="'JetBrains Mono', monospace"
      dominantBaseline="middle"
    >
      {text}
    </text>
  )
}

export default function ForensicRadar() {
  const canvasRef = useRef(null)
  const [activeNode, setActiveNode] = useState(null)
  const CX = 250, CY = 250 // Center of 500x500 coordinate space

  // ── Particle system for ambient digital dust (Canvas) ──
  const particles = useMemo(() =>
    Array.from({ length: 45 }, (_, i) => ({
      id: i,
      x: Math.random() * 500,
      y: Math.random() * 500,
      size: Math.random() * 1.2 + 0.4,
      speed: Math.random() * 0.22 + 0.06,
      opacity: Math.random() * 0.4 + 0.08,
      drift: (Math.random() - 0.5) * 0.14,
    })), []
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId
    let frame = 0
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const draw = () => {
      ctx.clearRect(0, 0, 500, 500)
      if (prefersReduced) return

      particles.forEach(p => {
        p.y -= p.speed
        p.x += p.drift
        if (p.y < 0) { p.y = 500; p.x = Math.random() * 500 }
        if (p.x < 0 || p.x > 500) { p.x = Math.random() * 500 }
        const alpha = p.opacity * (0.35 + 0.65 * Math.sin(frame * 0.015 + p.id * 0.8))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(183, 255, 60, ${Math.max(0, alpha)})`
        ctx.fill()
      })
      frame++
      animationId = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(animationId)
  }, [particles])

  // ── Forensic Data Nodes (interactive) ──
  const nodes = [
    {
      id: '0xA3F2',
      cx: 250,
      cy: 130,
      delay: 0,
      label: '0xA3F2',
      type: 'PROCESS_INJECTION',
      detail: 'PID: 4092 / LSASS MEMORY ACCESS',
      severity: 'CRITICAL',
    },
    {
      id: 'SYS_LOG',
      cx: 355,
      cy: 200,
      delay: 0.6,
      label: 'SYS_LOG',
      type: 'LOG_MODIFICATION',
      detail: 'EVENT 4624 / OUT-OF-HOURS AUTHENTICATION',
      severity: 'HIGH',
    },
    {
      id: 'EXFIL_02',
      cx: 340,
      cy: 320,
      delay: 1.0,
      label: 'EXFIL_02',
      type: 'EGRESS_DETECTED',
      detail: 'TCP 443 -> 185.220.101.5 / 1.4 GB',
      severity: 'CRITICAL',
    },
    {
      id: 'DB_DUMP',
      cx: 250,
      cy: 380,
      delay: 1.4,
      label: 'DB_DUMP',
      type: 'DATA_ACCESS',
      detail: 'CIPHER VAULT QUERY AT 02:14:19',
      severity: 'MEDIUM',
    },
    {
      id: 'AUTH_01',
      cx: 155,
      cy: 320,
      delay: 1.8,
      label: 'AUTH_01',
      type: 'CREDENTIAL_ACCESS',
      detail: 'KERBEROS TGT / SENIOR ENG TICKET',
      severity: 'HIGH',
    },
    {
      id: 'PORT:443',
      cx: 140,
      cy: 190,
      delay: 2.2,
      label: 'PORT:443',
      type: 'NETWORK_TUNNEL',
      detail: 'REVERSE SSH TUNNEL ON HTTPS PORT',
      severity: 'HIGH',
    },
    {
      id: 'SSH_KEY',
      cx: 300,
      cy: 160,
      delay: 0.8,
      label: 'SSH_KEY',
      type: 'KEY_EXFIL',
      detail: 'id_ed25519 MODIFIED IN ~/.ssh',
      color: '#22D3EE',
      severity: 'MEDIUM',
    },
    {
      id: 'FW_RULE',
      cx: 190,
      cy: 260,
      delay: 1.6,
      label: 'FW_RULE',
      type: 'SECURITY_BYPASS',
      detail: 'IPTABLES INBOUND RULE 89 OVERWRITTEN',
      color: '#22D3EE',
      severity: 'LOW',
    },
  ]

  const connections = [
    { x1: 250, y1: 130, x2: 355, y2: 200, delay: 0.8, from: '0xA3F2', to: 'SYS_LOG' },
    { x1: 355, y1: 200, x2: 340, y2: 320, delay: 1.2, from: 'SYS_LOG', to: 'EXFIL_02' },
    { x1: 340, y1: 320, x2: 250, y2: 380, delay: 1.6, from: 'EXFIL_02', to: 'DB_DUMP' },
    { x1: 250, y1: 380, x2: 155, y2: 320, delay: 2.0, from: 'DB_DUMP', to: 'AUTH_01' },
    { x1: 155, y1: 320, x2: 140, y2: 190, delay: 2.4, from: 'AUTH_01', to: 'PORT:443' },
    { x1: 140, y1: 190, x2: 250, y2: 130, delay: 2.8, from: 'PORT:443', to: '0xA3F2' },
    { x1: 250, y1: 250, x2: 250, y2: 130, delay: 1.0, from: 'CENTER', to: '0xA3F2' },
    { x1: 250, y1: 250, x2: 355, y2: 200, delay: 1.4, from: 'CENTER', to: 'SYS_LOG' },
    { x1: 250, y1: 250, x2: 155, y2: 320, delay: 1.8, from: 'CENTER', to: 'AUTH_01' },
    { x1: 250, y1: 250, x2: 340, y2: 320, delay: 2.2, from: 'CENTER', to: 'EXFIL_02' },
    { x1: 250, y1: 250, x2: 300, y2: 160, delay: 1.3, from: 'CENTER', to: 'SSH_KEY' },
    { x1: 250, y1: 250, x2: 190, y2: 260, delay: 1.7, from: 'CENTER', to: 'FW_RULE' },
  ]

  // Tick marks around the perimeter
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5)
  const majorTicks = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330]

  return (
    <div className="relative w-full aspect-square select-none">
      {/* ── Background Particle Canvas ── */}
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* ── Main SVG Radar Interface ── */}
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full relative"
        style={{ zIndex: 2 }}
      >
        <defs>
          {/* Sweep gradient */}
          <linearGradient id="sweepGrad" x1="250" y1="250" x2="250" y2="50" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#B7FF3C" stopOpacity="0" />
            <stop offset="100%" stopColor="#B7FF3C" stopOpacity="0.14" />
          </linearGradient>

          {/* Vignette gradient */}
          <radialGradient id="radarVignette" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="#B7FF3C" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#080A0A" stopOpacity="0.5" />
          </radialGradient>

          {/* Node glow filter */}
          <filter id="nodeGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Center vignette */}
        <circle cx={CX} cy={CY} r="225" fill="url(#radarVignette)" />

        {/* ── Concentric rings ── */}
        {[205, 175, 145, 115, 80, 50].map((r, i) => (
          <circle
            key={r}
            cx={CX}
            cy={CY}
            r={r}
            fill="none"
            stroke="#B7FF3C"
            strokeWidth={i === 0 ? '0.6' : '0.35'}
            opacity={i === 0 ? 0.16 : 0.08 + i * 0.01}
          />
        ))}

        {/* ── Tick marks ── */}
        {ticks.map(angle => (
          <TickMark
            key={angle}
            angle={angle}
            innerR={198}
            outerR={majorTicks.includes(angle) ? 212 : 205}
            cx={CX}
            cy={CY}
            opacity={majorTicks.includes(angle) ? 0.22 : 0.08}
          />
        ))}

        {/* ── Coordinate indicators ── */}
        <CoordLabel angle={0} r={222} cx={CX} cy={CY} text="000°" />
        <CoordLabel angle={90} r={222} cx={CX} cy={CY} text="090°" />
        <CoordLabel angle={180} r={222} cx={CX} cy={CY} text="180°" />
        <CoordLabel angle={270} r={222} cx={CX} cy={CY} text="270°" />
        <CoordLabel angle={45} r={220} cx={CX} cy={CY} text="045" />
        <CoordLabel angle={135} r={220} cx={CX} cy={CY} text="135" />
        <CoordLabel angle={225} r={220} cx={CX} cy={CY} text="225" />
        <CoordLabel angle={315} r={220} cx={CX} cy={CY} text="315" />

        {/* ── Center Crosshairs ── */}
        <line x1={CX} y1={45} x2={CX} y2={CY - 14} stroke="#B7FF3C" strokeWidth="0.4" opacity="0.12" />
        <line x1={CX} y1={CY + 14} x2={CX} y2={455} stroke="#B7FF3C" strokeWidth="0.4" opacity="0.12" />
        <line x1={45} y1={CY} x2={CX - 14} y2={CY} stroke="#B7FF3C" strokeWidth="0.4" opacity="0.12" />
        <line x1={CX + 14} y1={CY} x2={455} y2={CY} stroke="#B7FF3C" strokeWidth="0.4" opacity="0.12" />

        {/* ── Rotating outer HUD ring (CSS animated) ── */}
        <g style={{ transformOrigin: `${CX}px ${CY}px`, animation: 'radarSweep 16s linear infinite' }}>
          <circle
            cx={CX}
            cy={CY}
            r={198}
            fill="none"
            stroke="#B7FF3C"
            strokeWidth="0.7"
            strokeDasharray="6 32 2 32"
            opacity="0.22"
          />
        </g>

        {/* ── Counter-rotating secondary ring ── */}
        <g style={{ transformOrigin: `${CX}px ${CY}px`, animation: 'radarSweepReverse 22s linear infinite' }}>
          <circle
            cx={CX}
            cy={CY}
            r={188}
            fill="none"
            stroke="#22D3EE"
            strokeWidth="0.4"
            strokeDasharray="4 55"
            opacity="0.14"
          />
        </g>

        {/* ── Rotating radar sweep beam ── */}
        <g style={{ transformOrigin: `${CX}px ${CY}px`, animation: 'radarSweep 5s linear infinite' }}>
          <path
            d={`M ${CX} ${CY} L ${CX} ${CY - 205} A 205 205 0 0 1 ${CX + 205 * Math.sin(Math.PI / 4.5)} ${CY - 205 * Math.cos(Math.PI / 4.5)} Z`}
            fill="url(#sweepGrad)"
            opacity="0.65"
          />
          <line
            x1={CX}
            y1={CY}
            x2={CX}
            y2={CY - 205}
            stroke="#B7FF3C"
            strokeWidth="0.8"
            opacity="0.4"
          />
        </g>

        {/* ── Network Connection Lines ── */}
        {connections.map((c, i) => {
          const isHighlighted = activeNode && (activeNode.id === c.from || activeNode.id === c.to)
          return (
            <motion.line
              key={i}
              x1={c.x1}
              y1={c.y1}
              x2={c.x2}
              y2={c.y2}
              stroke={isHighlighted ? '#B7FF3C' : '#B7FF3C'}
              strokeWidth={isHighlighted ? '1.2' : '0.4'}
              strokeDasharray={isHighlighted ? 'none' : '3 6'}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{ opacity: isHighlighted ? 0.8 : 0.2, pathLength: 1 }}
              transition={{ duration: 1.5, delay: c.delay, ease: 'easeOut' }}
            />
          )
        })}

        {/* ── Data Nodes (Interactive) ── */}
        {nodes.map(n => {
          const isSelected = activeNode?.id === n.id
          const nodeColor = n.color || '#B7FF3C'
          return (
            <g
              key={n.id}
              className="cursor-pointer"
              onClick={() => setActiveNode(isSelected ? null : n)}
              onMouseEnter={() => setActiveNode(n)}
              onMouseLeave={() => setActiveNode(null)}
            >
              {/* Hit area for easier hover/click */}
              <circle cx={n.cx} cy={n.cy} r="18" fill="transparent" />

              {/* Pulse ripple ring */}
              <circle
                cx={n.cx}
                cy={n.cy}
                r="6"
                fill="none"
                stroke={nodeColor}
                strokeWidth="0.4"
                opacity="0"
                style={{ animation: `dataPulse 3s ease-out ${n.delay}s infinite` }}
              />

              {/* Active selection halo */}
              {isSelected && (
                <circle
                  cx={n.cx}
                  cy={n.cy}
                  r="12"
                  fill="none"
                  stroke={nodeColor}
                  strokeWidth="0.8"
                  opacity="0.8"
                  style={{ animation: 'pulseRing 1.5s ease-in-out infinite', transformOrigin: `${n.cx}px ${n.cy}px` }}
                />
              )}

              {/* Core dot */}
              <circle
                cx={n.cx}
                cy={n.cy}
                r={isSelected ? '3.5' : '2.5'}
                fill={nodeColor}
                filter="url(#nodeGlowFilter)"
                style={{
                  animation: !isSelected ? `nodeGlow 3s ease-in-out ${n.delay}s infinite` : undefined,
                  transition: 'all 0.2s ease',
                }}
              />

              {/* Node label */}
              <text
                x={n.cx + 9}
                y={n.cy + 3}
                fill={isSelected ? '#FFFFFF' : '#6B7280'}
                fontSize="6.5"
                fontFamily="'JetBrains Mono', monospace"
                fontWeight={isSelected ? 'bold' : 'normal'}
                style={{ transition: 'fill 0.2s ease' }}
              >
                {n.label}
              </text>
            </g>
          )
        })}

        {/* ── Central Incident Target Marker ── */}
        <g filter="url(#nodeGlowFilter)">
          <circle
            cx={CX}
            cy={CY}
            r="8"
            fill="none"
            stroke="#B7FF3C"
            strokeWidth="0.8"
            opacity="0.3"
            style={{ animation: 'pulseRing 2.5s ease-in-out infinite', transformOrigin: `${CX}px ${CY}px` }}
          />
          <circle
            cx={CX}
            cy={CY}
            r="15"
            fill="none"
            stroke="#B7FF3C"
            strokeWidth="0.4"
            opacity="0.15"
            style={{ animation: 'pulseRing 2.5s ease-in-out 0.5s infinite', transformOrigin: `${CX}px ${CY}px` }}
          />
        </g>
        <circle cx={CX} cy={CY} r="3" fill="#B7FF3C" opacity="0.9" />
        <circle cx={CX} cy={CY} r="1" fill="#FFFFFF" />

        {/* ── Corner Framing Brackets ── */}
        <g opacity="0.22" strokeWidth="1" stroke="#B7FF3C" fill="none">
          <path d="M 50 50 L 50 70 M 50 50 L 70 50" />
          <path d="M 450 50 L 450 70 M 450 50 L 430 50" />
          <path d="M 50 450 L 50 430 M 50 450 L 70 450" />
          <path d="M 450 450 L 450 430 M 450 450 L 430 450" />
        </g>

        {/* ── Technical HUD Labels ── */}
        <text
          x="390"
          y="75"
          fill="#4B5563"
          fontSize="6"
          fontFamily="'JetBrains Mono', monospace"
          style={{ animation: 'fadeInOut 4s ease-in-out infinite' }}
        >
          SCAN ACTIVE
        </text>
        <text
          x="55"
          y="440"
          fill="#22D3EE"
          fontSize="6"
          fontFamily="'JetBrains Mono', monospace"
          opacity="0.45"
          style={{ animation: 'fadeInOut 5s ease-in-out 1s infinite' }}
        >
          FREQ: 2.4GHz
        </text>
        <text
          x="385"
          y="440"
          fill="#4B5563"
          fontSize="6"
          fontFamily="'JetBrains Mono', monospace"
          opacity="0.45"
        >
          LAT: 40.7128
        </text>
        <text
          x="55"
          y="75"
          fill="#4B5563"
          fontSize="6"
          fontFamily="'JetBrains Mono', monospace"
          opacity="0.35"
        >
          SECTOR: ALPHA-7
        </text>

        {/* ── Data stream fragments ── */}
        <g style={{ animation: 'floatY 6s ease-in-out infinite' }}>
          <text x="315" y="135" fill="#B7FF3C" fontSize="5" fontFamily="'JetBrains Mono', monospace" opacity="0.25">
            0x4F 0xA2 0x1B
          </text>
        </g>
        <g style={{ animation: 'floatY 7s ease-in-out 1.5s infinite' }}>
          <text x="110" y="385" fill="#B7FF3C" fontSize="5" fontFamily="'JetBrains Mono', monospace" opacity="0.2">
            PKT: 2048/s
          </text>
        </g>
        <g style={{ animation: 'floatY 5s ease-in-out 3s infinite' }}>
          <text x="365" y="265" fill="#22D3EE" fontSize="5" fontFamily="'JetBrains Mono', monospace" opacity="0.2">
            TLS 1.3
          </text>
        </g>

        {/* ── Anomaly highlight arc ── */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.65, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 3.5, delay: 2 }}
        >
          <path
            d={`M ${CX + 145 * Math.cos(-0.6)} ${CY + 145 * Math.sin(-0.6)} A 145 145 0 0 1 ${CX + 145 * Math.cos(0.25)} ${CY + 145 * Math.sin(0.25)}`}
            fill="none"
            stroke="#DC2626"
            strokeWidth="1.8"
            opacity="0.55"
          />
          <circle
            cx={CX + 145 * Math.cos(-0.18)}
            cy={CY + 145 * Math.sin(-0.18)}
            r="4"
            fill="none"
            stroke="#DC2626"
            strokeWidth="1"
            opacity="0.7"
          />
        </motion.g>
      </svg>

      {/* ── Scan line sweep overlay ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-full" style={{ zIndex: 3 }}>
        <div className="scan-line" />
      </div>

      {/* ── Interactive Node Inspection Modal Tooltip ── */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none w-[90%] max-w-[280px]"
          >
            <div className="bg-[#0A0C0C]/90 backdrop-blur-md border border-[#B7FF3C]/30 p-3 shadow-[0_4px_25px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between gap-2 border-b border-[#1F2937] pb-1.5 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Crosshair size={11} className="text-[#B7FF3C]" />
                  <span className="text-[9px] font-mono font-bold tracking-wider text-white">
                    {activeNode.id}
                  </span>
                </div>
                <span
                  className={`text-[8px] font-mono px-1.5 py-0.5 rounded-xs font-semibold ${
                    activeNode.severity === 'CRITICAL'
                      ? 'bg-[#DC2626]/20 text-[#DC2626]'
                      : activeNode.severity === 'HIGH'
                      ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                      : 'bg-[#B7FF3C]/20 text-[#B7FF3C]'
                  }`}
                >
                  {activeNode.severity}
                </span>
              </div>
              <div className="text-[8px] font-mono text-[#9CA3AF] mb-1">
                TYPE: <span className="text-white">{activeNode.type}</span>
              </div>
              <div className="text-[8px] font-mono text-[#6B7280]">
                {activeNode.detail}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Center ambient glow layer ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 h-64 sm:h-80 bg-[#B7FF3C]/[0.035] rounded-full blur-[90px]" />
        <div className="absolute top-1/3 left-1/3 w-36 h-36 bg-[#22D3EE]/[0.02] rounded-full blur-[60px]" />
      </div>
    </div>
  )
}
