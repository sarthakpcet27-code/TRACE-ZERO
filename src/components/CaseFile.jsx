import { useRef, useState } from 'react'
import { motion, useInView } from 'motion/react'
import { FileText, Clock, MapPin, AlertCircle, Activity, Lock, Radio, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

/* ═══════════════════════════════════════════════════════════════════
   CaseFile — Incident case dossier with cinematic layout
   Left: narrative + redacted log stream
   Right: official case file panel + classified stamp
   ═══════════════════════════════════════════════════════════════════ */

/* ─── Animated redacted terminal log stream ─── */
const LOG_LINES = [
  { ts: '02:13:44', msg: 'AUTH_SUCCESS user=s.mercer@nexora.com src=10.4.1.22', hi: false },
  { ts: '02:13:51', msg: 'FILE_ACCESS  /vault/project-helios/specs_v9.pdf', hi: false },
  { ts: '02:13:59', msg: 'FILE_ACCESS  /vault/project-helios/keymap_final.bin', hi: false },
  { ts: '02:14:03', msg: 'PROCESS      lsass.exe  → unusual memory read (PID 4092)', hi: true },
  { ts: '02:14:08', msg: 'NET_ALERT    EGRESS 10.4.1.22 → 185.220.101.5:443 1.4GB', hi: true },
  { ts: '02:14:11', msg: '████████████ ████████████████████████████████', hi: false },
  { ts: '02:14:19', msg: 'DB_QUERY     SELECT * FROM cipher_vault — 2,847 rows', hi: true },
  { ts: '02:14:33', msg: '████████████ ████████████████████████████████', hi: false },
  { ts: '02:14:41', msg: 'LOG_MODIFY   event_log.db → 318 entries purged', hi: true },
  { ts: '02:15:02', msg: 'SSH_TERM     session closed src=185.220.101.5', hi: false },
]

function TerminalLog({ visible }) {
  return (
    <div className="bg-[#060808] border border-[#1a2222] font-mono text-[10px] sm:text-[11px] overflow-hidden">
      {/* Terminal header bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[#1a2222] bg-[#0A0C0C]">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1F2937]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#1F2937]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#1F2937]" />
        </div>
        <span className="text-[9px] tracking-[0.2em] text-[#4B5563] ml-2">
          NEXORA_SIEM_EVENTS — 02:13–02:15 UTC
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#B7FF3C]"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className="text-[8px] tracking-widest text-[#4B5563]">LIVE</span>
        </div>
      </div>

      {/* Log lines */}
      <div className="p-3 space-y-1 max-h-[220px] overflow-hidden">
        {LOG_LINES.map((line, i) => (
          <motion.div
            key={i}
            className="flex gap-3 items-start"
            initial={{ opacity: 0, x: -8 }}
            animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ duration: 0.3, delay: 0.6 + i * 0.08, ease: 'easeOut' }}
          >
            <span className="text-[#4B5563] shrink-0 tracking-tight">{line.ts}</span>
            <span
              className={`leading-relaxed break-all ${
                line.hi ? 'text-[#F59E0B]' : 'text-[#374151]'
              }`}
            >
              {line.msg}
            </span>
            {line.hi && (
              <span className="shrink-0 text-[#DC2626] text-[8px] tracking-widest mt-0.5">◀</span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Blinking cursor */}
      <div className="px-3 pb-3 flex items-center gap-2">
        <span className="text-[#4B5563]">$</span>
        <motion.span
          className="w-2 h-3 bg-[#B7FF3C]"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'steps(2)' }}
        />
      </div>
    </div>
  )
}

/* ─── Classified stamp overlay ─── */
function ClassifiedStamp({ visible }) {
  return (
    <motion.div
      className="absolute -top-3 -right-3 z-10 rotate-12 pointer-events-none"
      initial={{ opacity: 0, scale: 0.6, rotate: 20 }}
      animate={visible ? { opacity: 1, scale: 1, rotate: 12 } : { opacity: 0, scale: 0.6 }}
      transition={{ duration: 0.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="border-2 border-[#DC2626]/50 px-3 py-1">
        <span className="text-[9px] font-black tracking-[0.35em] text-[#DC2626]/60 font-mono">
          CLASSIFIED
        </span>
      </div>
    </motion.div>
  )
}

/* ─── Status badge ─── */
function StatusBadge({ value, type }) {
  const styles = {
    critical: 'bg-[#DC2626]/12 text-[#DC2626] border-[#DC2626]/20',
    warning: 'bg-[#F59E0B]/12 text-[#F59E0B] border-[#F59E0B]/20',
    active: 'bg-[#B7FF3C]/12 text-[#B7FF3C] border-[#B7FF3C]/20',
    neutral: 'bg-[#1F2937]/50 text-[#9CA3AF] border-[#1F2937]',
  }
  return (
    <span className={`text-[10px] font-mono font-semibold tracking-[0.15em] px-2.5 py-0.5 border ${styles[type] || styles.neutral}`}>
      {value}
    </span>
  )
}

/* ─── Main Export ─── */
export default function CaseFile() {
  const ref = useRef(null)
  const isVisible = useInView(ref, { once: true, margin: '-80px 0px' })
  const navigate = useNavigate()

  const caseMetadata = [
    {
      icon: FileText,
      label: 'CASE ID',
      value: 'TR-2049',
      badge: null,
    },
    {
      icon: MapPin,
      label: 'ORGANIZATION',
      value: 'NEXORA TECHNOLOGIES',
      badge: null,
    },
    {
      icon: Clock,
      label: 'INCIDENT TIME',
      value: '02:14:08 UTC',
      badge: null,
    },
    {
      icon: AlertCircle,
      label: 'THREAT STATUS',
      value: 'UNRESOLVED',
      badge: { value: 'UNRESOLVED', type: 'warning' },
    },
    {
      icon: Activity,
      label: 'INVESTIGATION',
      value: 'ACTIVE',
      badge: { value: 'ACTIVE', type: 'active' },
    },
    {
      icon: Lock,
      label: 'CLEARANCE REQ.',
      value: 'LEVEL 4',
      badge: { value: 'LEVEL 4', type: 'critical' },
    },
  ]

  return (
    <section id="casefile" ref={ref} className="relative py-24 overflow-hidden">
      {/* Background depth layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0D0D]/60 to-transparent" />
        <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] -translate-y-1/2 bg-[#B7FF3C]/[0.012] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Two-column layout */}
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-14 lg:gap-20 items-start">

          {/* ═══ LEFT: Narrative + terminal stream ═══ */}
          <div>
            {/* Section label */}
            <motion.div
              className="flex items-center gap-3 mb-5"
              initial={{ opacity: 0, x: -16 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-[1px] bg-[#B7FF3C]/40" />
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#6B7280] uppercase">
                Classified / Level 4
              </span>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mb-8"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight mb-1">
                CASE FILE
              </h2>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                <span className="text-[#B7FF3C]">#TR-2049</span>
              </h2>
            </motion.div>

            {/* Narrative paragraphs */}
            {[
              `On November 20, 2049, automated threat detection at NEXORA Technologies flagged anomalous activity originating from an internal employee workstation. Classified project files were accessed outside authorized hours using credentials belonging to a senior engineer.`,
              `Initial analysis suggests a sophisticated multi-stage intrusion leveraging compromised insider access. Lateral movement patterns indicate the attacker had prior knowledge of the internal network topology and targeted the CIPHER VAULT database directly.`,
              `All forensic evidence has been preserved. The investigation is ongoing. Your task is to piece together the full picture before the trail goes cold.`,
            ].map((para, i) => (
              <motion.p
                key={i}
                className="text-[#6B7280] text-sm sm:text-base leading-relaxed mb-4"
                initial={{ opacity: 0, y: 12 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
              >
                {para}
              </motion.p>
            ))}

            {/* Terminal log stream */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 16 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-4 h-[1px] bg-[#B7FF3C]/30" />
                <span className="text-[9px] font-mono tracking-[0.3em] text-[#4B5563]">
                  SIEM EVENT LOG — INCIDENT WINDOW
                </span>
              </div>
              <TerminalLog visible={isVisible} />
            </motion.div>

            {/* Investigate CTA */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.5, delay: 1.5 }}
            >
              <button
                onClick={() => navigate('/investigate')}
                className="group flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-[#B7FF3C] border border-[#B7FF3C]/20 px-5 py-2.5 hover:bg-[#B7FF3C]/[0.07] hover:border-[#B7FF3C]/40 transition-all duration-300 cursor-pointer"
              >
                OPEN CASE FILE
                <ChevronRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>

          {/* ═══ RIGHT: Official case file dossier ═══ */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 24 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Classified stamp */}
            <ClassifiedStamp visible={isVisible} />

            {/* Case file dossier panel */}
            <div className="border border-[#1a2222] bg-[#09100F] relative">

              {/* Corner reticles */}
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[#B7FF3C]/25" />
              <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-[#B7FF3C]/25" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-[#B7FF3C]/25" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[#B7FF3C]/25" />

              {/* Dossier header */}
              <div className="border-b border-[#1a2222] px-6 py-4 bg-[#0A0D0D]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText size={14} className="text-[#B7FF3C]" />
                    <div>
                      <p className="text-[9px] font-mono tracking-[0.3em] text-[#4B5563] mb-0.5">
                        INCIDENT CASE FILE
                      </p>
                      <p className="text-[11px] font-mono tracking-[0.15em] text-[#9CA3AF] font-semibold">
                        NXR-2049-INC-001
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-[#B7FF3C]"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1.6, repeat: Infinity }}
                      />
                      <span className="text-[9px] font-mono tracking-widest text-[#4B5563]">LIVE</span>
                    </div>
                    <span className="text-[8px] font-mono text-[#2D3748]">TS: 1700432048</span>
                  </div>
                </div>
              </div>

              {/* Metadata fields */}
              <div className="divide-y divide-[#111818]">
                {caseMetadata.map((item, i) => (
                  <motion.div
                    key={item.label}
                    className="flex items-center justify-between px-6 py-4 hover:bg-[#0C1010] transition-colors duration-200"
                    initial={{ opacity: 0, x: 12 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 12 }}
                    transition={{ duration: 0.4, delay: 0.5 + i * 0.08, ease: 'easeOut' }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <item.icon size={13} className="text-[#374151] shrink-0" />
                      <span className="text-[9px] font-mono tracking-[0.2em] text-[#4B5563] uppercase">
                        {item.label}
                      </span>
                    </div>
                    <div className="shrink-0 ml-4">
                      {item.badge ? (
                        <StatusBadge value={item.badge.value} type={item.badge.type} />
                      ) : (
                        <span className="text-[11px] font-mono tracking-wider text-[#9CA3AF]">
                          {item.value}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Evidence count bar */}
              <div className="border-t border-[#1a2222] px-6 py-4 bg-[#0A0D0D]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-mono tracking-[0.2em] text-[#4B5563]">
                    EVIDENCE COLLECTED
                  </span>
                  <span className="text-[9px] font-mono text-[#B7FF3C]">12 / 18 ITEMS</span>
                </div>
                <div className="h-[3px] bg-[#111818] overflow-hidden">
                  <motion.div
                    className="h-full bg-[#B7FF3C]"
                    initial={{ width: 0 }}
                    animate={isVisible ? { width: '67%' } : { width: 0 }}
                    transition={{ duration: 1.2, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
                  />
                </div>
              </div>

              {/* Suspect profile strip */}
              <div className="border-t border-[#1a2222] px-6 py-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[9px] font-mono tracking-[0.3em] text-[#4B5563]">
                    PRIMARY SUSPECT
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-mono text-[#9CA3AF] mb-0.5">
                      S. MERCER — SR. ENGINEER
                    </p>
                    <p className="text-[9px] font-mono text-[#4B5563]">
                      EMPLOYEE ID: NXR-04-7721
                    </p>
                  </div>
                  <div className="border border-[#F59E0B]/20 bg-[#F59E0B]/05 px-2 py-1">
                    <span className="text-[8px] font-mono text-[#F59E0B] tracking-widest">
                      PERSON OF INTEREST
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer — ref and timestamp */}
              <div className="border-t border-[#1a2222] px-6 py-3 bg-[#060808]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio size={10} className="text-[#374151]" />
                    <span className="text-[8px] font-mono tracking-[0.2em] text-[#2D3748]">
                      SIGNAL ENCRYPTED
                    </span>
                  </div>
                  <span className="text-[8px] font-mono tracking-[0.2em] text-[#2D3748]">
                    REF: NXR-2049-INC-001
                  </span>
                </div>
              </div>
            </div>

            {/* Redacted document shadow stack */}
            <div
              className="absolute -bottom-2 -right-2 -z-10 w-full h-full border border-[#1a2222] bg-[#060808]"
              style={{ transform: 'translate(4px, 4px)' }}
            />
            <div
              className="absolute -bottom-4 -right-4 -z-20 w-full h-full border border-[#141c1c] bg-[#060808]"
              style={{ transform: 'translate(8px, 8px)' }}
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#1F2937]/50 to-transparent" />
    </section>
  )
}
