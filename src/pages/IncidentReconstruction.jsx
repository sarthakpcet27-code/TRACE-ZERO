/* ═══════════════════════════════════════════════════════════════
   Incident Reconstruction — TRACE//ZERO Phase 6
   Interactive timeline reconstruction gameplay.
   Per-user progress saving, MITRE ATT&CK integration, and XP rewards.
   ═══════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Network,
  Clock,
  Radio,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  GripVertical,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Send,
  Shield,
  Mail,
  Key,
  FileText,
  Cpu,
  Wifi,
  Info,
  Award,
  Layers,
  X,
} from 'lucide-react'
import {
  RECONSTRUCTION_EVENTS,
  getShuffledEvents,
  evaluateReconstruction,
} from '../data/reconstructionData'
import { TOTAL_CLUES } from '../data/evidenceData'
import ProgressStepper from '../components/ProgressStepper'
import MitreAttackCard from '../components/MitreAttackCard'
import { BASE_KEYS, loadUserState, saveUserState } from '../services/progressService'

const ICON_MAP = { Mail, Key, FileText, Cpu, Wifi, Shield }

const CATEGORY_COLORS = {
  INFILTRATION: '#DC2626',
  ACCESS: '#F59E0B',
  EXFILTRATION: '#22D3EE',
  'LATERAL MOVEMENT': '#F59E0B',
  'ANTI-FORENSICS': '#DC2626',
  DETECTION: '#F59E0B',
  CONTAINMENT: '#B7FF3C',
}

function loadLabState() {
  const parsed = loadUserState(BASE_KEYS.LAB)
  if (parsed) {
    return { collectedClueIds: new Set(parsed.collectedClueIds || []) }
  }
  return { collectedClueIds: new Set() }
}

function loadCorrelationState() {
  const parsed = loadUserState(BASE_KEYS.CORR)
  if (parsed) {
    return { connections: parsed.connections || [] }
  }
  return { connections: [] }
}

function loadReconState() {
  return loadUserState(BASE_KEYS.RECON)
}

function saveReconState(state) {
  saveUserState(BASE_KEYS.RECON, state)
}

/* ─── Header ─── */
function ReconHeader({ onBack, activeMobileTab, onSelectMobileTab }) {
  return (
    <header className="bg-[#060808]/95 backdrop-blur-md border-b border-[#1a2222] shrink-0 z-30">
      <div className="h-14 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            onClick={onBack}
            className="group flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] text-[#6B7280] hover:text-[#B7FF3C] transition-colors cursor-pointer py-1 px-2 border border-[#1a2222] bg-[#0A0D0D] hover:border-[#B7FF3C]/30"
          >
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-0.5" />
            CORRELATION
          </button>
          <div className="w-[1px] h-4 bg-[#1a2222]" />
          <span className="text-xs font-bold tracking-[0.18em] text-white hidden sm:inline font-mono">
            TRACE<span className="text-[#B7FF3C]">//</span>ZERO
          </span>
          <span className="text-[10px] font-mono tracking-[0.2em] text-[#B7FF3C]">#TR-2049</span>
          <div className="w-[1px] h-4 bg-[#1a2222] hidden md:block" />
          <div className="hidden md:flex flex-col">
            <div className="flex items-center gap-2">
              <Clock size={12} className="text-[#22D3EE]" />
              <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-white">
                INCIDENT RECONSTRUCTION
              </span>
            </div>
            <span className="text-[8px] font-mono tracking-[0.15em] text-[#6B7280]">
              RECONSTRUCT THE EVENTS. UNCOVER THE BREACH.
            </span>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex lg:hidden items-center gap-1 bg-[#0A0D0D] border border-[#1a2222] p-0.5">
          {[
            { id: 'events', label: 'EVENTS' },
            { id: 'timeline', label: 'TIMELINE' },
            { id: 'inspector', label: 'INSPECT' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSelectMobileTab(tab.id)}
              className={`px-2 py-1 text-[8px] font-mono font-bold tracking-wider transition-colors cursor-pointer ${
                activeMobileTab === tab.id
                  ? 'bg-[#B7FF3C] text-[#080A0A]'
                  : 'text-[#6B7280] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-[#B7FF3C]"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <span className="text-[8px] font-mono tracking-widest text-[#B7FF3C]">TIMELINE ACTIVE</span>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ─── Timeline Slot ─── */
function TimelineSlot({
  slotIndex,
  event,
  totalSlots,
  onMoveUp,
  onMoveDown,
  onSelect,
  isSelected,
  submitted,
  feedback,
}) {
  const Icon = event ? ICON_MAP[event.icon] || Clock : null
  const catColor = event ? CATEGORY_COLORS[event.category] || '#6B7280' : 'transparent'

  return (
    <motion.div
      layout
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => event && onSelect(event.id)}
      className={`relative flex items-stretch gap-0 border transition-all duration-200 ${
        event
          ? isSelected
            ? 'border-[#22D3EE] bg-[#22D3EE]/[0.05] shadow-[0_0_20px_rgba(34,211,238,0.1)]'
            : submitted && feedback
              ? feedback.isCorrect
                ? 'border-[#B7FF3C]/40 bg-[#B7FF3C]/[0.03]'
                : 'border-[#DC2626]/30 bg-[#DC2626]/[0.03]'
              : 'border-[#1a2222] bg-[#0A0D0D] hover:border-[#1F2937] hover:bg-[#0E1212]'
          : 'border-dashed border-[#1a2222] bg-[#060808]'
      } ${event ? 'cursor-pointer' : ''}`}
    >
      {/* Slot Number & Timeline Marker */}
      <div className="flex flex-col items-center justify-center w-11 shrink-0 border-r border-[#141A1A] bg-[#080A0A]">
        <span className="text-[10px] font-mono font-bold text-[#6B7280]">
          {String(slotIndex + 1).padStart(2, '0')}
        </span>
        {event && (
          <div className="w-2 h-2 rounded-full mt-1" style={{ backgroundColor: catColor }} />
        )}
      </div>

      {/* Event Content */}
      {event ? (
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <Icon size={12} style={{ color: event.accentColor }} className="shrink-0" />
            <span
              className="text-[8px] font-mono tracking-widest px-1.5 py-0.5 border"
              style={{ color: catColor, borderColor: `${catColor}30` }}
            >
              {event.category}
            </span>
            <span className="text-[10px] font-mono text-[#22D3EE] font-bold">{event.time}</span>
            <span className="text-[8px] font-mono text-[#6B7280] ml-auto hidden sm:block">
              {event.evidenceSource}
            </span>
          </div>
          <h4 className="text-xs font-mono font-bold text-white mb-0.5 tracking-wider">
            {event.title}
          </h4>
          <p className="text-[10px] font-mono text-[#CBD5E1] leading-relaxed line-clamp-2">
            {event.description}
          </p>

          {/* Submission feedback indicator */}
          {submitted && feedback && (
            <div className="flex items-center gap-1.5 mt-2 text-[8px] font-mono">
              {feedback.isCorrect ? (
                <>
                  <CheckCircle size={11} className="text-[#B7FF3C]" />
                  <span className="text-[#B7FF3C] tracking-widest font-bold">CORRECT CHRONOLOGICAL POSITION</span>
                </>
              ) : (
                <>
                  <XCircle size={11} className="text-[#DC2626]" />
                  <span className="text-[#DC2626] tracking-widest font-bold">
                    OFF BY {feedback.drift} {feedback.drift === 1 ? 'SLOT' : 'SLOTS'}
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 p-3 flex items-center justify-center">
          <span className="text-[10px] font-mono text-[#4B5563]">EMPTY SLOT</span>
        </div>
      )}

      {/* Move Controls */}
      {!submitted && event && (
        <div className="flex flex-col items-center justify-center px-1.5 border-l border-[#141A1A] bg-[#080A0A] gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMoveUp(slotIndex)
            }}
            disabled={slotIndex === 0}
            className="p-1 text-[#6B7280] hover:text-[#B7FF3C] disabled:opacity-20 disabled:hover:text-[#6B7280] cursor-pointer transition-colors"
            title="Move Earlier"
          >
            <ChevronUp size={14} />
          </button>
          <GripVertical size={10} className="text-[#374151]" />
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMoveDown(slotIndex)
            }}
            disabled={slotIndex === totalSlots - 1}
            className="p-1 text-[#6B7280] hover:text-[#B7FF3C] disabled:opacity-20 disabled:hover:text-[#6B7280] cursor-pointer transition-colors"
            title="Move Later"
          >
            <ChevronDown size={14} />
          </button>
        </div>
      )}
    </motion.div>
  )
}

/* ─── Main IncidentReconstruction Page ─── */
export default function IncidentReconstruction() {
  const navigate = useNavigate()

  // State from prior phases
  const [labState] = useState(loadLabState)
  const [corrState] = useState(loadCorrelationState)

  // Reconstruction timeline
  const [timeline, setTimeline] = useState(() => {
    const saved = loadReconState()
    if (saved && saved.timeline && saved.timeline.length === RECONSTRUCTION_EVENTS.length) {
      return saved.timeline
    }
    return getShuffledEvents()
  })

  const [selectedEventId, setSelectedEventId] = useState(null)
  const [submitted, setSubmitted] = useState(() => {
    const saved = loadReconState()
    return saved?.submitted || false
  })
  const [result, setResult] = useState(() => {
    const saved = loadReconState()
    return saved?.result || null
  })
  const [showResults, setShowResults] = useState(false)
  const [toast, setToast] = useState(null)
  const [activeMobileTab, setActiveMobileTab] = useState('timeline')

  // Persist state
  useEffect(() => {
    saveReconState({ timeline, submitted, result })
  }, [timeline, submitted, result])

  function triggerToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  // Move event up
  const handleMoveUp = useCallback((index) => {
    if (index <= 0) return
    setTimeline((prev) => {
      const next = [...prev]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      return next
    })
  }, [])

  // Move event down
  const handleMoveDown = useCallback((index) => {
    setTimeline((prev) => {
      if (index >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      return next
    })
  }, [])

  // Submit reconstruction
  const handleSubmit = useCallback(() => {
    const orderedIds = timeline.map((e) => e.id)
    const evaluation = evaluateReconstruction(orderedIds)
    setResult(evaluation)
    setSubmitted(true)
    setShowResults(true)
    const earnedXp = Math.round(evaluation.score * 2.2)
    triggerToast(`RECONSTRUCTION EVALUATED: ${evaluation.score}% (+${earnedXp} XP)`)
  }, [timeline])

  // Reset reconstruction
  const handleReset = useCallback(() => {
    setTimeline(getShuffledEvents())
    setSubmitted(false)
    setResult(null)
    setShowResults(false)
    setSelectedEventId(null)
    triggerToast('TIMELINE SHUFFLED')
  }, [])

  // Feedback helper
  const getFeedback = useCallback(
    (eventId) => {
      if (!result || !result.eventFeedback) return null
      return result.eventFeedback.find((f) => f.id === eventId) || null
    },
    [result]
  )

  const selectedEvent = useMemo(() => {
    return timeline.find((e) => e.id === selectedEventId) || null
  }, [timeline, selectedEventId])

  const cluesCount = labState.collectedClueIds.size
  const connectionsCount = corrState.connections.length

  return (
    <div className="h-screen flex flex-col bg-[#080A0A] overflow-hidden select-none">
      {/* Background */}
      <div className="fixed inset-0 grid-bg opacity-30 pointer-events-none z-0" />

      {/* Header */}
      <ReconHeader
        onBack={() => navigate('/correlate')}
        activeMobileTab={activeMobileTab}
        onSelectMobileTab={setActiveMobileTab}
      />

      {/* Navigation Stepper */}
      <ProgressStepper />

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* LEFT: Event Reference Pool */}
        <div className={`${activeMobileTab === 'events' ? 'flex flex-1' : 'hidden'} lg:flex lg:flex-none h-full`}>
          <aside className="w-full lg:w-[280px] bg-[#060808] border-r border-[#1a2222] flex flex-col h-full overflow-hidden shrink-0">
            <div className="p-4 border-b border-[#1a2222] bg-[#080B0B]">
              <div className="flex items-center gap-2 mb-1">
                <Layers size={12} className="text-[#22D3EE]" />
                <span className="text-[9px] font-mono tracking-[0.25em] text-[#6B7280]">
                  RECONSTRUCTION EVENTS
                </span>
              </div>
              <h3 className="text-xs font-bold tracking-[0.15em] text-white font-mono">
                EVENT REFERENCE
              </h3>
              <p className="text-[8px] font-mono text-[#6B7280] mt-1">
                {RECONSTRUCTION_EVENTS.length} INCIDENT EVENTS
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {RECONSTRUCTION_EVENTS.map((evt) => {
                const Icon = ICON_MAP[evt.icon] || Clock
                const isSelected = selectedEventId === evt.id

                return (
                  <button
                    key={evt.id}
                    onClick={() => setSelectedEventId(evt.id)}
                    className={`w-full text-left p-2.5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#22D3EE]/50 bg-[#22D3EE]/[0.05]'
                        : 'border-[#141A1A] bg-[#0A0D0D] hover:border-[#1F2937]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={10} style={{ color: evt.accentColor }} />
                      <span className="text-[8px] font-mono font-bold text-[#6B7280]">{evt.id}</span>
                      <span className="text-[8px] font-mono text-[#22D3EE] ml-auto">{evt.time}</span>
                    </div>
                    <p className="text-[10px] font-mono text-white font-bold tracking-wider truncate">
                      {evt.title}
                    </p>
                    <p className="text-[8px] font-mono text-[#6B7280] truncate">{evt.subtitle}</p>
                  </button>
                )
              })}
            </div>

            {/* Investigation readiness meter */}
            <div className="p-3 border-t border-[#1a2222] bg-[#080B0B] space-y-2 text-[8px] font-mono">
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">CLUES NOTED:</span>
                <span className="text-[#B7FF3C]">{cluesCount} / {TOTAL_CLUES}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6B7280]">CORRELATIONS:</span>
                <span className="text-[#22D3EE]">{connectionsCount}</span>
              </div>
            </div>
          </aside>
        </div>

        {/* CENTER: Interactive Timeline */}
        <div className={`${activeMobileTab === 'timeline' ? 'flex flex-1' : 'hidden'} lg:flex lg:flex-1 h-full`}>
          <div className="flex-1 h-full overflow-hidden flex flex-col">
            {/* Timeline header */}
            <div className="px-4 sm:px-6 py-3 border-b border-[#1a2222] bg-[#080A0A]/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={14} className="text-[#22D3EE]" />
                <div>
                  <h3 className="text-xs font-mono font-bold text-white tracking-widest">
                    INCIDENT TIMELINE
                  </h3>
                  <p className="text-[9px] font-mono text-[#6B7280]">
                    Arrange events chronologically from initial access to data exfiltration
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {submitted && result && (
                  <button
                    onClick={() => setShowResults(true)}
                    className="text-[9px] font-mono px-2.5 py-1 border text-white cursor-pointer hover:bg-[#0E1414] transition-colors"
                    style={{ borderColor: `${result.gradeColor}40`, color: result.gradeColor }}
                  >
                    GRADE: {result.grade} ({result.score}%)
                  </button>
                )}
                {!submitted && (
                  <button
                    onClick={handleReset}
                    className="text-[9px] font-mono tracking-widest text-[#6B7280] hover:text-[#9CA3AF] flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={10} /> SHUFFLE
                  </button>
                )}
              </div>
            </div>

            {/* Timeline content area */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
              {/* MITRE ATT&CK Matrix Card */}
              <MitreAttackCard />

              {/* Start marker */}
              <div className="flex items-center gap-3 text-[9px] font-mono text-[#6B7280]">
                <div className="w-3 h-3 border border-[#22D3EE] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#22D3EE]" />
                </div>
                <span className="tracking-widest">INCIDENT INCEPTION — 02:08:14 UTC</span>
                <div className="flex-1 h-[1px] bg-[#1a2222]" />
              </div>

              {/* Timeline slots */}
              {timeline.map((event, index) => (
                <TimelineSlot
                  key={event.id}
                  slotIndex={index}
                  event={event}
                  totalSlots={timeline.length}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onSelect={(id) => {
                    setSelectedEventId(id)
                    if (window.innerWidth < 1024) setActiveMobileTab('inspector')
                  }}
                  isSelected={selectedEventId === event.id}
                  submitted={submitted}
                  feedback={getFeedback(event.id)}
                />
              ))}

              {/* End marker */}
              <div className="flex items-center gap-3 text-[9px] font-mono text-[#6B7280] pt-2">
                <div className="w-3 h-3 border border-[#B7FF3C] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-[#B7FF3C]" />
                </div>
                <span className="tracking-widest">BREACH COMPLETED / LOG PURGE — 02:15:02 UTC</span>
                <div className="flex-1 h-[1px] bg-[#1a2222]" />
              </div>

              {/* Submit / Proceed bar */}
              <div className="pt-4 pb-12 flex items-center justify-between gap-4 flex-wrap">
                {!submitted ? (
                  <button
                    onClick={handleSubmit}
                    className="flex items-center gap-2 px-6 py-3 bg-[#B7FF3C] text-[#080A0A] font-mono font-bold text-xs tracking-[0.2em] hover:bg-[#c8ff66] transition-all cursor-pointer shadow-[0_0_20px_rgba(183,255,60,0.3)] active:scale-95"
                  >
                    <Send size={14} />
                    SUBMIT RECONSTRUCTION FOR EVALUATION
                  </button>
                ) : (
                  <div className="flex items-center gap-3 flex-wrap">
                    <button
                      onClick={() => navigate('/replay')}
                      className="flex items-center gap-2 px-6 py-3 bg-[#22D3EE] text-[#080A0A] font-mono font-bold text-xs tracking-[0.2em] hover:bg-[#67e8f9] transition-all cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-95"
                    >
                      <Shield size={14} />
                      PROCEED TO DEFENSE REPLAY
                      <ChevronRight size={14} />
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-4 py-3 border border-[#1F2937] text-[#9CA3AF] font-mono text-xs hover:text-white transition-colors cursor-pointer"
                    >
                      RE-ATTEMPT
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Detail Inspector */}
        <div className={`${activeMobileTab === 'inspector' ? 'flex flex-1' : 'hidden'} lg:flex lg:flex-none h-full`}>
          <aside className="w-full lg:w-[320px] bg-[#060808] border-l border-[#1a2222] flex flex-col h-full overflow-hidden shrink-0">
            <div className="p-4 border-b border-[#1a2222] bg-[#080B0B]">
              <span className="text-[9px] font-mono tracking-[0.25em] text-[#6B7280]">EVENT INSPECTOR</span>
              <h3 className="text-xs font-mono font-bold text-white tracking-widest mt-0.5">
                {selectedEvent ? selectedEvent.id : 'SELECT AN EVENT'}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedEvent ? (
                <>
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-[#22D3EE] tracking-widest">TIMESTAMP: {selectedEvent.time}</span>
                    <h4 className="text-sm font-mono font-bold text-white">{selectedEvent.title}</h4>
                    <p className="text-[10px] font-mono text-[#F59E0B]">{selectedEvent.subtitle}</p>
                  </div>

                  <div className="border border-[#1a2222] bg-[#0A0D0D] p-3 space-y-2">
                    <span className="text-[8px] font-mono tracking-widest text-[#6B7280]">EVIDENCE ATTRIBUTION</span>
                    <p className="text-[11px] font-mono text-[#D1D5DB] leading-relaxed">
                      {selectedEvent.description}
                    </p>
                  </div>

                  <div className="border border-[#1a2222] bg-[#0A0D0D] p-3 space-y-1 text-[9px] font-mono">
                    <div className="flex justify-between text-[#6B7280]">
                      <span>SOURCE SYSTEM:</span>
                      <span className="text-white">{selectedEvent.evidenceSource}</span>
                    </div>
                    <div className="flex justify-between text-[#6B7280]">
                      <span>CATEGORY:</span>
                      <span className="text-[#22D3EE]">{selectedEvent.category}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-[10px] font-mono text-[#6B7280]">
                  Click any event in the timeline to inspect its technical details.
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Toast */}
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
