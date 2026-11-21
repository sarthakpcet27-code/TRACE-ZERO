import { useState, useMemo, useRef } from 'react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, FileText, Shield, CheckCircle, XCircle, AlertTriangle,
  Clock, Award, Printer, ChevronRight, Mail, Key, Cpu, Wifi,
  Database, Network, Activity, TrendingUp, Lock, Eye,
} from 'lucide-react'
import { EVIDENCE_ITEMS, TOTAL_CLUES } from '../data/evidenceData'
import { RECONSTRUCTION_EVENTS } from '../data/reconstructionData'
import { DEFENSIVE_CONTROLS, ATTACK_CHAIN_STAGES, runDefenseSimulation, TOTAL_BUDGET } from '../data/defenseData'

const LAB_KEY = 'trace-zero-lab-state'
const CORR_KEY = 'trace-zero-correlation-state'
const RECON_KEY = 'trace-zero-recon-state'
const REPLAY_KEY = 'trace-zero-replay-state'

function safeLoad(key) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : null } catch { return null }
}

/* ═══ Section Wrapper ═══ */
function ReportSection({ title, icon: Icon, children, accentColor = '#B7FF3C' }) {
  return (
    <section className="border border-[#1a2222] bg-[#0A0D0D] overflow-hidden print:border-gray-300 print:bg-white">
      <div className="px-5 py-3 border-b border-[#141A1A] bg-[#060808] flex items-center gap-2 print:bg-gray-50">
        {Icon && <Icon size={14} style={{ color: accentColor }} />}
        <h3 className="text-xs font-mono font-bold tracking-[0.2em] text-white print:text-black">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </section>
  )
}

function MetricCard({ label, value, sub, color = '#9CA3AF' }) {
  return (
    <div className="border border-[#1a2222] bg-[#060808] p-3 text-center print:border-gray-300">
      <p className="text-[8px] font-mono tracking-widest text-[#6B7280] mb-1 print:text-gray-500">{label}</p>
      <p className="text-lg font-mono font-bold print:text-black" style={{ color }}>{value}</p>
      {sub && <p className="text-[8px] font-mono text-[#4B5563] mt-0.5">{sub}</p>}
    </div>
  )
}

function StatusPill({ status, color }) {
  return (
    <span
      className="text-[8px] font-mono font-bold tracking-widest px-2 py-0.5 border inline-flex items-center gap-1"
      style={{ color, borderColor: `${color}40`, backgroundColor: `${color}10` }}
    >
      {status}
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Final Forensic Report — TRACE//ZERO Phase 8
   Case #TR-2049 — THE MIDNIGHT BREACH
   ═══════════════════════════════════════════════════════════════ */
export default function ForensicReport() {
  const navigate = useNavigate()
  const reportRef = useRef(null)

  // Load all persistent state
  const labState = useMemo(() => {
    const d = safeLoad(LAB_KEY)
    return d ? { analyzedIds: new Set(d.analyzedIds || []), collectedClueIds: new Set(d.collectedClueIds || []), notes: d.notes || '' } : { analyzedIds: new Set(), collectedClueIds: new Set(), notes: '' }
  }, [])

  const corrState = useMemo(() => {
    const d = safeLoad(CORR_KEY)
    return d || { connections: [], hypothesis: '', unlockedHintLevel: 0 }
  }, [])

  const reconState = useMemo(() => safeLoad(RECON_KEY), [])
  const replayState = useMemo(() => safeLoad(REPLAY_KEY), [])

  // Compute replay simulation from saved control IDs
  const replayResult = useMemo(() => {
    if (replayState?.selectedControlIds?.length > 0) {
      return runDefenseSimulation(replayState.selectedControlIds)
    }
    return null
  }, [replayState])

  const selectedControls = replayState?.selectedControlIds || []

  // Completion status
  const labComplete = labState.analyzedIds.size >= EVIDENCE_ITEMS.length
  const cluesCollected = labState.collectedClueIds.size
  const correlationsDone = corrState.connections.length
  const reconSubmitted = reconState?.submitted === true
  const replayDone = replayState?.simState === 'COMPLETED'

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' })

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-[#080A0A] text-white print:bg-white print:text-black">
      {/* ─── Header ─── */}
      <header className="bg-[#060808]/95 backdrop-blur-md border-b border-[#1a2222] shrink-0 z-30 sticky top-0 print:hidden">
        <div className="h-14 flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/replay')}
              className="group flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] text-[#6B7280] hover:text-[#B7FF3C] transition-colors cursor-pointer py-1 px-2 border border-[#1a2222] bg-[#0A0D0D] hover:border-[#B7FF3C]/30"
            >
              <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
              DEFENSE REPLAY
            </button>
            <div className="w-[1px] h-4 bg-[#1a2222]" />
            <span className="text-xs font-bold tracking-[0.18em] text-white hidden sm:inline">
              TRACE<span className="text-[#B7FF3C]">//</span>ZERO
            </span>
            <span className="text-[10px] font-mono tracking-[0.2em] text-[#B7FF3C]">#TR-2049</span>
            <div className="w-[1px] h-4 bg-[#1a2222] hidden lg:block" />
            <div className="hidden lg:flex flex-col">
              <div className="flex items-center gap-1.5">
                <FileText size={12} className="text-[#B7FF3C]" />
                <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-white">FORENSIC REPORT</span>
              </div>
              <span className="text-[8px] font-mono tracking-[0.15em] text-[#4B5563]">FINAL INVESTIGATION DOSSIER</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-[#B7FF3C] text-[#080A0A] font-mono font-bold text-[10px] tracking-[0.15em] hover:bg-[#c8ff66] transition-all cursor-pointer shadow-[0_0_15px_rgba(183,255,60,0.25)]"
            >
              <Printer size={12} />
              PRINT / SAVE PDF
            </button>
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#B7FF3C]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          </div>
        </div>
      </header>

      {/* ─── Report Content ─── */}
      <main ref={reportRef} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 print:max-w-none print:px-8">

        {/* ═══ Report Cover / Title Block ═══ */}
        <div className="border border-[#B7FF3C]/30 bg-[#090C0C] p-6 sm:p-8 relative overflow-hidden print:border-gray-400 print:bg-white">
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[#B7FF3C] print:hidden" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-[#B7FF3C] print:hidden" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-[#B7FF3C] print:hidden" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[#B7FF3C] print:hidden" />

          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield size={18} className="text-[#B7FF3C]" />
              <span className="text-[9px] font-mono tracking-[0.3em] text-[#6B7280]">TRACE//ZERO — DIGITAL FORENSICS DIVISION</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-mono font-black tracking-tight text-white print:text-black">
              FINAL FORENSIC INVESTIGATION REPORT
            </h1>
            <p className="text-lg font-mono font-bold text-[#B7FF3C] tracking-wider print:text-green-700">
              CASE #TR-2049 — THE MIDNIGHT BREACH
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-[9px] font-mono text-[#6B7280] pt-2">
              <span>COMPANY: NEXORA TECHNOLOGIES</span>
              <span>|</span>
              <span>CLASSIFICATION: CRITICAL</span>
              <span>|</span>
              <span>DATE: {dateStr}</span>
              <span>|</span>
              <span>TIME: {timeStr}</span>
            </div>
            <p className="text-[8px] font-mono text-[#4B5563] pt-2">
              THIS REPORT IS GENERATED FROM INVESTIGATOR ACTIVITY WITHIN THE TRACE//ZERO SIMULATION. ALL DATA IS FICTIONAL.
            </p>
          </div>
        </div>

        {/* ═══ 1. INCIDENT SUMMARY ═══ */}
        <ReportSection title="INCIDENT SUMMARY" icon={AlertTriangle} accentColor="#DC2626">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard label="CASE ID" value="#TR-2049" color="#B7FF3C" />
            <MetricCard label="INCIDENT TIME" value="02:14 UTC" sub="NOVEMBER 20, 2049" color="#22D3EE" />
            <MetricCard label="THREAT LEVEL" value="CRITICAL" sub="APT / INSIDER" color="#DC2626" />
            <MetricCard label="DATA EXFILTRATED" value="1.46 GB" sub="PROJECT HELIOS VAULT" color="#F59E0B" />
          </div>
          <div className="text-[11px] font-mono text-[#D1D5DB] leading-relaxed space-y-2 print:text-black">
            <p>At 02:14 UTC on November 20, 2049, threat detection flagged anomalous egress traffic from NEXORA Technologies' classified infrastructure. A senior engineer's credentials were used to access restricted Project Helios vaults and exfiltrate 1.46 GB of classified data to external IP 185.220.101.5 over an encrypted TLS 1.3 tunnel.</p>
            <p>The attacker covered their tracks by purging 318 event log entries via wevtutil.exe. Forensic fragments were recovered and analyzed across 6 evidence sources over 7 attack chain stages.</p>
          </div>
        </ReportSection>

        {/* ═══ 2. EVIDENCE COLLECTED ═══ */}
        <ReportSection title="EVIDENCE LAB — COLLECTED ARTIFACTS" icon={Database}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            <MetricCard label="EVIDENCE ANALYZED" value={`${labState.analyzedIds.size} / ${EVIDENCE_ITEMS.length}`} color={labComplete ? '#B7FF3C' : '#F59E0B'} />
            <MetricCard label="CLUES COLLECTED" value={`${cluesCollected} / ${TOTAL_CLUES}`} color={cluesCollected >= TOTAL_CLUES ? '#B7FF3C' : '#22D3EE'} />
            <MetricCard label="LAB STATUS" value={labComplete ? 'COMPLETE' : 'PARTIAL'} color={labComplete ? '#B7FF3C' : '#F59E0B'} />
          </div>
          <div className="space-y-1.5">
            {EVIDENCE_ITEMS.map((item) => {
              const analyzed = labState.analyzedIds.has(item.id)
              return (
                <div key={item.id} className="flex items-center justify-between py-1.5 px-3 border border-[#141A1A] bg-[#060808] text-[10px] font-mono">
                  <div className="flex items-center gap-2">
                    {analyzed ? <CheckCircle size={10} className="text-[#B7FF3C]" /> : <XCircle size={10} className="text-[#4B5563]" />}
                    <span className="text-[#6B7280]">{item.id}</span>
                    <span className="text-white">{item.title}</span>
                  </div>
                  <StatusPill status={analyzed ? 'ANALYZED' : 'PENDING'} color={analyzed ? '#B7FF3C' : '#6B7280'} />
                </div>
              )
            })}
          </div>
          {labState.notes && (
            <div className="mt-3 p-3 border border-[#1a2222] bg-[#060808]">
              <p className="text-[8px] font-mono tracking-widest text-[#6B7280] mb-1">INVESTIGATOR NOTES</p>
              <p className="text-[10px] font-mono text-[#D1D5DB] leading-relaxed whitespace-pre-wrap">{labState.notes}</p>
            </div>
          )}
        </ReportSection>

        {/* ═══ 3. EVIDENCE CORRELATION ═══ */}
        <ReportSection title="EVIDENCE CORRELATION — RELATIONSHIP MAP" icon={Network} accentColor="#22D3EE">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            <MetricCard label="CONNECTIONS MADE" value={correlationsDone} color={correlationsDone > 0 ? '#22D3EE' : '#6B7280'} />
            <MetricCard label="VALID LINKS" value={corrState.connections.filter(c => c.isValid).length} color="#B7FF3C" />
            <MetricCard label="HINTS USED" value={corrState.unlockedHintLevel} color="#F59E0B" />
          </div>
          {corrState.connections.length > 0 && (
            <div className="space-y-1.5">
              {corrState.connections.map((conn, i) => (
                <div key={conn.id || i} className="flex items-center justify-between py-1.5 px-3 border border-[#141A1A] bg-[#060808] text-[10px] font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-[#9CA3AF]">{conn.from}</span>
                    <span className="text-[#4B5563]">→</span>
                    <span className="text-[#9CA3AF]">{conn.to}</span>
                    <span className="text-[#22D3EE]">[{conn.type}]</span>
                  </div>
                  <StatusPill status={conn.isValid ? 'CONFIRMED' : 'UNVERIFIED'} color={conn.isValid ? '#B7FF3C' : '#F59E0B'} />
                </div>
              ))}
            </div>
          )}
          {corrState.hypothesis && (
            <div className="mt-3 p-3 border border-[#22D3EE]/30 bg-[#22D3EE]/[0.03]">
              <p className="text-[8px] font-mono tracking-widest text-[#22D3EE] mb-1">INVESTIGATOR'S HYPOTHESIS</p>
              <p className="text-[11px] font-mono text-[#D1D5DB] leading-relaxed">{corrState.hypothesis}</p>
            </div>
          )}
          {correlationsDone === 0 && (
            <p className="text-[10px] font-mono text-[#6B7280] italic text-center py-4">No evidence correlations were established during this investigation session.</p>
          )}
        </ReportSection>

        {/* ═══ 4. RECONSTRUCTED TIMELINE ═══ */}
        <ReportSection title="INCIDENT RECONSTRUCTION — CANONICAL TIMELINE" icon={Clock} accentColor="#22D3EE">
          {reconSubmitted && reconState?.result ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                <MetricCard label="POSITION ACCURACY" value={`${reconState.result.positionAccuracy}%`} color={reconState.result.positionAccuracy >= 75 ? '#B7FF3C' : '#F59E0B'} />
                <MetricCard label="SEQUENCE ACCURACY" value={`${reconState.result.sequenceAccuracy}%`} color={reconState.result.sequenceAccuracy >= 75 ? '#B7FF3C' : '#F59E0B'} />
                <MetricCard label="GRADE" value={reconState.result.grade} color={reconState.result.gradeColor} sub={reconState.result.gradeLabel} />
                <MetricCard label="EVENTS CORRECT" value={`${reconState.result.correctCount} / ${reconState.result.totalEvents}`} color="#9CA3AF" />
              </div>
            </>
          ) : (
            <p className="text-[10px] font-mono text-[#6B7280] italic text-center py-2">Timeline reconstruction was not submitted during this session.</p>
          )}
          <div className="space-y-1.5">
            {RECONSTRUCTION_EVENTS.map((evt) => (
              <div key={evt.id} className="flex items-center gap-3 py-2 px-3 border border-[#141A1A] bg-[#060808] text-[10px] font-mono">
                <span className="text-[#4B5563] font-bold w-6">{evt.id.replace('RE-', '')}</span>
                <span className="text-[#22D3EE] font-bold w-24 shrink-0">{evt.time}</span>
                <span className="text-white flex-1">{evt.title}</span>
                <span className="text-[8px] tracking-widest px-1.5 py-0.2 border hidden sm:inline" style={{ color: evt.accentColor, borderColor: `${evt.accentColor}30` }}>{evt.category}</span>
              </div>
            ))}
          </div>
        </ReportSection>

        {/* ═══ 5. DEFENSE REPLAY ═══ */}
        <ReportSection title="DEFENSE REPLAY — SIMULATION RESULTS" icon={Shield}>
          {replayDone && replayResult ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                <MetricCard label="EFFECTIVENESS" value={`${replayResult.stats.effectivenessScore}%`} color={replayResult.stats.gradeColor} />
                <MetricCard label="DEFENSE GRADE" value={replayResult.stats.grade} sub={replayResult.stats.gradeLabel} color={replayResult.stats.gradeColor} />
                <MetricCard label="BUDGET USED" value={`${replayResult.stats.pointsConsumed} / ${TOTAL_BUDGET}`} color="#9CA3AF" />
                <MetricCard label="STAGES PREVENTED" value={`${replayResult.stats.stagesPrevented} / ${replayResult.stats.totalStages}`} color="#B7FF3C" />
              </div>

              {/* Deployed Controls */}
              <div className="p-3 border border-[#1a2222] bg-[#060808]">
                <p className="text-[8px] font-mono tracking-widest text-[#6B7280] mb-2">DEPLOYED DEFENSIVE CONTROLS</p>
                <div className="flex flex-wrap gap-2">
                  {selectedControls.map((id) => {
                    const ctrl = DEFENSIVE_CONTROLS.find(c => c.id === id)
                    return ctrl ? (
                      <span key={id} className="text-[9px] font-mono font-bold px-2 py-1 border text-white" style={{ borderColor: `${ctrl.accentColor}40`, backgroundColor: `${ctrl.accentColor}10` }}>
                        {ctrl.name} ({ctrl.cost} PTS)
                      </span>
                    ) : null
                  })}
                </div>
              </div>

              {/* Stage Outcomes */}
              <div className="space-y-1.5 mt-3">
                {replayResult.comparisons.map((c) => (
                  <div key={c.stageId} className="flex items-center justify-between py-1.5 px-3 border border-[#141A1A] bg-[#060808] text-[10px] font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-[#4B5563] font-bold">{c.number}</span>
                      <span className="text-white">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] text-[#DC2626] line-through">{c.originalStatus}</span>
                      <span className="text-[#4B5563]">→</span>
                      <StatusPill status={c.simulatedStatus} color={c.simulatedColor} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Insights */}
              {replayResult.insights.length > 0 && (
                <div className="mt-3 p-3 border border-[#1a2222] bg-[#060808]">
                  <p className="text-[8px] font-mono tracking-widest text-[#6B7280] mb-2">DEFENSE INSIGHTS</p>
                  <div className="space-y-1.5">
                    {replayResult.insights.map((insight, i) => {
                      const isNeg = insight.includes('lacked') || insight.includes('Unrestricted') || insight.includes('Absence') || insight.includes('No egress') || insight.includes('Without')
                      return (
                        <div key={i} className="flex items-start gap-2 text-[10px] font-mono">
                          {isNeg ? <AlertTriangle size={10} className="text-[#DC2626] shrink-0 mt-0.5" /> : <CheckCircle size={10} className="text-[#B7FF3C] shrink-0 mt-0.5" />}
                          <span className="text-[#D1D5DB]">{insight}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-[10px] font-mono text-[#6B7280] italic text-center py-4">Defense replay simulation was not completed during this session.</p>
          )}
        </ReportSection>

        {/* ═══ 6. SECURITY RECOMMENDATIONS ═══ */}
        <ReportSection title="SECURITY RECOMMENDATIONS" icon={TrendingUp}>
          <div className="space-y-3 text-[11px] font-mono text-[#D1D5DB] leading-relaxed print:text-black">
            {[
              { num: '01', title: 'ENFORCE PHISHING-RESISTANT MFA', desc: 'Deploy FIDO2/WebAuthn hardware tokens organization-wide to prevent credential re-use attacks like the one modeled in this simulation.' },
              { num: '02', title: 'IMPLEMENT CONDITIONAL ACCESS POLICIES', desc: 'Enforce device compliance, geographic restrictions, and temporal access controls. The modeled after-hours login from an unmanaged device should trigger step-up challenges.' },
              { num: '03', title: 'APPLY LEAST PRIVILEGE ACCESS CONTROLS', desc: 'Ensure VAULT-ADMIN elevation requires dual authorization. No single set of credentials should grant unrestricted access to classified resources.' },
              { num: '04', title: 'DEPLOY BEHAVIORAL ENDPOINT DETECTION', desc: 'Real-time EDR with process tree analysis to detect credential-dumping techniques like LSASS memory scraping within seconds.' },
              { num: '05', title: 'IMPLEMENT DLP AND EGRESS MONITORING', desc: 'Deploy deep packet inspection and anomalous volume detection on all egress points. The 1.46 GB TLS 1.3 tunnel should have triggered automated severing.' },
              { num: '06', title: 'CENTRALIZE IMMUTABLE AUDIT LOGGING', desc: 'Stream all system events to write-once-read-many (WORM) storage in real time to protect against anti-forensics log purging.' },
            ].map((rec) => (
              <div key={rec.num} className="flex items-start gap-3 p-3 border border-[#141A1A] bg-[#060808]">
                <span className="text-[#B7FF3C] font-bold shrink-0 mt-0.5">{rec.num}</span>
                <div>
                  <p className="text-white font-bold tracking-wider mb-0.5">{rec.title}</p>
                  <p className="text-[#9CA3AF] text-[10px]">{rec.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </ReportSection>

        {/* ═══ 7. CONCLUSION ═══ */}
        <ReportSection title="CONCLUSION" icon={Award} accentColor="#B7FF3C">
          <div className="text-[11px] font-mono text-[#D1D5DB] leading-relaxed space-y-3 print:text-black">
            <p>
              Case #TR-2049 — THE MIDNIGHT BREACH — has been fully investigated through forensic evidence analysis,
              evidence correlation, incident timeline reconstruction, and defensive control simulation.
            </p>
            <p>
              The investigation revealed a sophisticated multi-stage attack chain beginning with spearphishing delivery at 01:58 UTC,
              progressing through credential compromise, classified vault access, endpoint exploitation, data exfiltration of 1.46 GB,
              and culminating in anti-forensic log destruction of 318 event entries.
            </p>
            <p>
              The defense replay simulation demonstrated that strategic deployment of layered security controls
              can significantly alter the incident outcome — from complete data breach to effective containment —
              within the constraints of this fictional scenario.
            </p>
            <p className="text-[#6B7280] text-[9px] italic">
              DISCLAIMER: This report was generated by TRACE//ZERO, a digital forensics simulation created for Pixel Wars X26.
              All organizations, persons, systems, IP addresses, and incidents described are entirely fictional.
              No real-world cybersecurity claims or guarantees are made.
            </p>
          </div>
        </ReportSection>

        {/* ═══ Report Footer ═══ */}
        <div className="border-t border-[#1a2222] pt-6 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] font-mono text-[#4B5563] print:border-gray-300">
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-[#B7FF3C]" />
            <span className="text-white font-bold tracking-wider">TRACE<span className="text-[#B7FF3C]">//</span>ZERO</span>
            <span>|</span>
            <span>THE MIDNIGHT BREACH</span>
            <span>|</span>
            <span>PIXEL WARS X26</span>
          </div>
          <span>GENERATED: {dateStr} {timeStr}</span>
        </div>
      </main>
    </div>
  )
}
