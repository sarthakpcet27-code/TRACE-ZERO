/* ═══════════════════════════════════════════════════════════════
   Evidence Lab — TRACE//ZERO Phase 4
   Interactive forensic investigation workspace.
   Per-user progress saving, rich progress tracker, and hint system.
   ═══════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Radio, CheckCircle, Shield, Menu, Network, ArrowRight, Lightbulb, HelpCircle, X } from 'lucide-react'
import { EVIDENCE_ITEMS, TOTAL_CLUES } from '../data/evidenceData'
import EvidenceSidebar from '../components/lab/EvidenceSidebar'
import EmailViewer from '../components/lab/EmailViewer'
import LogViewer from '../components/lab/LogViewer'
import NetworkViewer from '../components/lab/NetworkViewer'
import CluePanel from '../components/lab/CluePanel'
import InvestigationProgress from '../components/lab/InvestigationProgress'
import InvestigationNotes from '../components/lab/InvestigationNotes'
import ProgressStepper from '../components/ProgressStepper'
import { BASE_KEYS, loadUserState, saveUserState } from '../services/progressService'

function loadLabState() {
  const parsed = loadUserState(BASE_KEYS.LAB)
  if (parsed) {
    return {
      analyzedIds: new Set(parsed.analyzedIds || []),
      collectedClueIds: new Set(parsed.collectedClueIds || []),
      openedIds: new Set(parsed.openedIds || []),
      notes: parsed.notes || '',
    }
  }
  return { analyzedIds: new Set(), collectedClueIds: new Set(), openedIds: new Set(), notes: '' }
}

function saveLabState(state) {
  saveUserState(BASE_KEYS.LAB, {
    analyzedIds: [...state.analyzedIds],
    collectedClueIds: [...state.collectedClueIds],
    openedIds: [...state.openedIds],
    notes: state.notes,
  })
}

/* ─── Evidence content renderer ─── */
function EvidenceContentViewer({ evidence }) {
  if (evidence.content.type === 'email') {
    return <EmailViewer evidence={evidence} />
  }
  if (evidence.content.type === 'network') {
    return <NetworkViewer evidence={evidence} />
  }
  return <LogViewer evidence={evidence} />
}

/* ─── Lab header ─── */
function LabHeader({ onBack, onToggleMobile, onCorrelate }) {
  return (
    <header className="h-12 bg-[#060808]/95 backdrop-blur-md border-b border-[#1a2222] flex items-center px-4 sm:px-6 shrink-0 z-20">
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        {/* Mobile menu trigger */}
        <button
          onClick={onToggleMobile}
          className="lg:hidden flex items-center gap-1.5 px-2 py-1 bg-[#0E1212] border border-[#1a2222] text-[9px] font-mono tracking-widest text-[#B7FF3C] hover:bg-[#141A1A] transition-colors cursor-pointer"
          aria-label="Toggle evidence archive drawer"
        >
          <Menu size={12} />
          <span>EVIDENCE</span>
        </button>

        <button
          onClick={onBack}
          className="group flex items-center gap-1.5 text-[9px] font-mono tracking-[0.2em] text-[#6B7280] hover:text-[#B7FF3C] transition-colors cursor-pointer"
        >
          <ArrowLeft size={11} className="transition-transform group-hover:-translate-x-0.5" />
          BRIEFING
        </button>
        <div className="w-[1px] h-4 bg-[#1a2222]" />
        <span className="text-[10px] font-bold tracking-[0.15em] text-white hidden sm:inline font-mono">
          TRACE<span className="text-[#B7FF3C]">//</span>ZERO
        </span>
        <div className="w-[1px] h-4 bg-[#1a2222] hidden sm:block" />
        <span className="text-[9px] font-mono tracking-[0.2em] text-[#B7FF3C] hidden md:inline">#TR-2049</span>
        <span className="text-[9px] font-mono tracking-[0.15em] text-[#6B7280] hidden lg:inline">NEXORA TECHNOLOGIES</span>
      </div>
      <div className="flex items-center gap-3">
        {/* Correlation Map Entry */}
        <button
          onClick={onCorrelate}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#B7FF3C] text-[#080A0A] font-mono font-bold text-[9px] tracking-[0.15em] hover:bg-[#c8ff66] transition-all cursor-pointer shadow-[0_0_15px_rgba(183,255,60,0.2)]"
        >
          <Network size={11} />
          <span>CORRELATE MAP</span>
        </button>

        <div className="hidden sm:flex items-center gap-1.5">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-[#B7FF3C]"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className="text-[8px] font-mono tracking-widest text-[#B7FF3C]">LIVE ARTIFACTS</span>
        </div>
      </div>
    </header>
  )
}

/* ─── Main EvidenceLab component ─── */
export default function EvidenceLab() {
  const navigate = useNavigate()
  const [state, setState] = useState(loadLabState)
  const [activeId, setActiveId] = useState('E-01')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [showHintModal, setShowHintModal] = useState(false)
  const [toast, setToast] = useState(null)

  // Persist state on change
  useEffect(() => {
    saveLabState(state)
  }, [state])

  // Build items with opened flag for sidebar status
  const items = EVIDENCE_ITEMS.map((item) => ({
    ...item,
    _opened: state.openedIds.has(item.id),
  }))

  const activeEvidence = items.find((i) => i.id === activeId)

  // Mark as opened when selected
  const handleSelectEvidence = useCallback((id) => {
    setActiveId(id)
    setState((prev) => {
      const next = { ...prev, openedIds: new Set(prev.openedIds) }
      next.openedIds.add(id)
      return next
    })
  }, [])

  // Toggle clue collection
  const handleToggleClue = useCallback((clueId) => {
    setState((prev) => {
      const next = { ...prev, collectedClueIds: new Set(prev.collectedClueIds) }
      if (next.collectedClueIds.has(clueId)) {
        next.collectedClueIds.delete(clueId)
      } else {
        next.collectedClueIds.add(clueId)
        showToast('FORENSIC CLUE COLLECTED (+15 XP)')
      }
      return next
    })
  }, [])

  // Mark evidence as analyzed
  const handleMarkAnalyzed = useCallback(() => {
    if (state.analyzedIds.has(activeId)) return
    setState((prev) => {
      const next = { ...prev, analyzedIds: new Set(prev.analyzedIds) }
      next.analyzedIds.add(activeId)
      return next
    })
    showToast('ARTIFACT ANALYZED (+25 XP)')
  }, [activeId, state.analyzedIds])

  // Update notes
  const handleUpdateNotes = useCallback((text) => {
    setState((prev) => ({ ...prev, notes: text }))
  }, [])

  // Toast helper
  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  // Active item specific forensic hints
  const HINT_DATA = {
    'E-01': 'The attachment invoice_oct2049.pdf.exe carries a deceptive double extension. Notice the sender domain differs from the actual mail server IP (185.220.101.5), failing SPF and DKIM.',
    'E-02': 'Look closely at PID 4092 executing powershell.exe with an obfuscated Base64 parameter targeting lsass.exe process memory to extract plaintext credentials.',
    'E-03': 'Examine the SSH auth record at 02:14:08 UTC. The user s.mercer authenticated from an unexpected internal workstation subnet instead of the jump-box VPN.',
    'E-04': 'Review the database transaction logs for SQL query SELECT * FROM cipher_vault. 2,847 master encryption keys were touched within 42 seconds.',
    'E-05': 'Inspect destination IP 185.220.101.5 on port 443. A sudden 1.46 GB outbound burst was compressed and exfiltrated over an encrypted TLS 1.3 socket.',
    'E-06': 'Notice Event ID 1102 generated by wevtutil.exe cl Security at 02:14:41 UTC. The adversary cleared 318 audit log entries to obstruct timeline attribution.',
  }

  if (!activeEvidence) return null

  const analyzedCount = state.analyzedIds.size
  const progressPercent = Math.round((analyzedCount / EVIDENCE_ITEMS.length) * 100)

  return (
    <div className="h-screen flex flex-col bg-[#080A0A] overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 grid-bg opacity-40 pointer-events-none z-0" />

      {/* Lab header */}
      <LabHeader
        onBack={() => navigate('/investigate')}
        onToggleMobile={() => setMobileOpen((o) => !o)}
        onCorrelate={() => navigate('/correlate')}
      />

      {/* Persistent Navigation Stepper */}
      <ProgressStepper />

      {/* Investigation Progress Banner */}
      <div className="bg-[#0A0D0D] border-b border-[#1A2222] px-4 sm:px-6 py-2.5 flex items-center justify-between flex-wrap gap-3 z-10">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#B7FF3C]">
            FORENSIC ARCHIVE AUDIT:
          </span>
          <span className="text-xs font-mono font-bold text-white">
            {analyzedCount} / {EVIDENCE_ITEMS.length} ANALYZED ({progressPercent}%)
          </span>
          <div className="w-24 sm:w-36 h-2 bg-[#1A2222] overflow-hidden">
            <motion.div
              className="h-full bg-[#B7FF3C]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-[#22D3EE] tracking-wider">
            {state.collectedClueIds.size} / {TOTAL_CLUES} CLUES EXTRACTED
          </span>
          <button
            onClick={() => setShowHintModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-[9px] font-mono text-[#F59E0B] border border-[#F59E0B]/40 bg-[#F59E0B]/5 hover:bg-[#F59E0B]/15 transition-colors cursor-pointer"
          >
            <Lightbulb size={11} />
            <span>FORENSIC HINT (-15 XP)</span>
          </button>
        </div>
      </div>

      {/* Main workspace area */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Sidebar */}
        <EvidenceSidebar
          items={items}
          activeId={activeId}
          onSelect={handleSelectEvidence}
          analyzedIds={state.analyzedIds}
          onToggleMobile={() => setMobileOpen((o) => !o)}
          mobileOpen={mobileOpen}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 pb-24"
            >
              {/* Evidence header */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-[10px] font-mono tracking-[0.3em] text-[#6B7280] font-bold">
                    {activeEvidence.id}
                  </span>
                  <span
                    className="text-[9px] font-mono tracking-widest px-2 py-0.5 border font-semibold"
                    style={{ color: activeEvidence.accentColor, borderColor: `${activeEvidence.accentColor}40` }}
                  >
                    {activeEvidence.category}
                  </span>
                  {state.analyzedIds.has(activeId) && (
                    <span className="text-[9px] font-mono tracking-widest text-[#B7FF3C] flex items-center gap-1 font-bold">
                      <CheckCircle size={10} /> ANALYZED
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-white mb-1">
                  {activeEvidence.title}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-[#6B7280]">
                  <span>SOURCE SYSTEM: {activeEvidence.source}</span>
                  <span>ACQUISITION TIME: {activeEvidence.timestamp}</span>
                </div>
              </div>

              {/* Two-column: Content + Sidebar panels */}
              <div className="grid xl:grid-cols-[1fr_320px] gap-6 items-start">
                {/* Left: Evidence content */}
                <div>
                  <EvidenceContentViewer evidence={activeEvidence} />
                </div>

                {/* Right: Clues + Progress + Controls */}
                <div className="space-y-5">
                  {/* Clue observations */}
                  <CluePanel
                    clues={activeEvidence.clues}
                    collectedClueIds={state.collectedClueIds}
                    onToggleClue={handleToggleClue}
                  />

                  {/* Mark analyzed button */}
                  <div>
                    {state.analyzedIds.has(activeId) ? (
                      <div className="flex items-center gap-2 px-4 py-3 border border-[#B7FF3C]/30 bg-[#B7FF3C]/[0.05]">
                        <CheckCircle size={14} className="text-[#B7FF3C]" />
                        <span className="text-[10px] font-mono tracking-[0.2em] text-[#B7FF3C] font-bold">
                          EVIDENCE MARKED AS ANALYZED (+25 XP)
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={handleMarkAnalyzed}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-[#B7FF3C]/40 bg-[#B7FF3C]/[0.08] text-[10px] font-mono tracking-[0.2em] text-[#B7FF3C] font-bold hover:bg-[#B7FF3C]/[0.15] hover:border-[#B7FF3C] transition-all cursor-pointer shadow-[0_0_15px_rgba(183,255,60,0.15)]"
                      >
                        <Shield size={14} />
                        MARK EVIDENCE AS ANALYZED
                      </button>
                    )}
                  </div>

                  {/* Progress Card */}
                  <InvestigationProgress
                    analyzedCount={state.analyzedIds.size}
                    totalEvidence={EVIDENCE_ITEMS.length}
                    clueCount={state.collectedClueIds.size}
                    totalClues={TOTAL_CLUES}
                  />

                  {/* Correlation Workspace Action Block */}
                  <div className="border border-[#1a2222] bg-[#060808] p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-[1px] bg-[#B7FF3C]" />
                        <span className="text-[9px] font-mono tracking-[0.25em] text-[#6B7280] font-bold">
                          NEXT STAGE
                        </span>
                      </div>
                      <span className="text-[8px] font-mono text-[#B7FF3C] px-1.5 py-0.5 border border-[#B7FF3C]/30 bg-[#B7FF3C]/[0.05] font-bold">
                        CORRELATION
                      </span>
                    </div>

                    <p className="text-[10px] font-mono text-[#CBD5E1] leading-relaxed">
                      Connect evidence files, identify chronological and causal relationships, and form your breach hypothesis on the interactive map.
                    </p>

                    <button
                      onClick={() => navigate('/correlate')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#B7FF3C] text-[#080A0A] font-mono font-bold text-[10px] tracking-[0.2em] hover:bg-[#c8ff66] transition-all cursor-pointer shadow-[0_0_20px_rgba(183,255,60,0.25)] active:scale-[0.98]"
                    >
                      <Network size={12} />
                      CORRELATE EVIDENCE MAP
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Investigation Notes Drawer */}
      <InvestigationNotes
        notes={state.notes}
        onUpdateNotes={handleUpdateNotes}
        isOpen={notesOpen}
        onToggle={() => setNotesOpen((o) => !o)}
      />

      {/* Forensic Hint Modal */}
      <AnimatePresence>
        {showHintModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="relative w-full max-w-md border border-[#F59E0B]/50 bg-[#0A0D0D] p-6 shadow-[0_0_40px_rgba(245,158,11,0.2)]"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1A2222]">
                <div className="flex items-center gap-2 text-[#F59E0B]">
                  <Lightbulb size={16} />
                  <span className="text-xs font-mono font-bold tracking-widest">
                    ANALYST FORENSIC HINT [{activeId}]
                  </span>
                </div>
                <button
                  onClick={() => setShowHintModal(false)}
                  className="text-[#6B7280] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs font-mono text-[#D1D5DB] leading-relaxed border-l-2 border-[#F59E0B] pl-3 py-1 bg-[#F59E0B]/5">
                  {HINT_DATA[activeId] || 'Examine related timestamps and IP addresses across other evidence items.'}
                </p>

                <div className="flex items-center justify-between pt-2 text-[9px] font-mono text-[#F59E0B]">
                  <span>HINT PENALTY APPLIED: -15 XP</span>
                  <button
                    onClick={() => setShowHintModal(false)}
                    className="px-4 py-2 bg-[#F59E0B] text-black font-bold tracking-wider cursor-pointer hover:bg-[#fbbf24]"
                  >
                    ACKNOWLEDGE
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-[#B7FF3C] text-[#080A0A] text-[10px] font-mono font-bold tracking-[0.2em] shadow-[0_0_30px_rgba(183,255,60,0.4)]"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
