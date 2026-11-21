/* ═══════════════════════════════════════════════════════════════
   Evidence Correlation — TRACE//ZERO Phase 5
   Interactive evidence correlation & relationship mapping tool.
   Per-user progress saving, instant link feedback, and hint penalty tracking.
   ═══════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import CorrelationHeader from '../components/correlation/CorrelationHeader'
import AvailableCluesPanel from '../components/correlation/AvailableCluesPanel'
import CorrelationCanvas from '../components/correlation/CorrelationCanvas'
import ConnectionInspector from '../components/correlation/ConnectionInspector'
import CorrelationBottomBar from '../components/correlation/CorrelationBottomBar'
import ProgressStepper from '../components/ProgressStepper'
import { evaluateConnection, INVESTIGATION_HINTS } from '../data/correlationData'
import { TOTAL_CLUES } from '../data/evidenceData'
import { BASE_KEYS, loadUserState, saveUserState } from '../services/progressService'

// Load Phase 4 lab state safely
function loadLabState() {
  const parsed = loadUserState(BASE_KEYS.LAB)
  if (parsed) {
    return {
      analyzedIds: new Set(parsed.analyzedIds || []),
      collectedClueIds: new Set(parsed.collectedClueIds || []),
    }
  }
  return { analyzedIds: new Set(), collectedClueIds: new Set() }
}

// Load Phase 5 correlation state safely
function loadCorrelationState() {
  const parsed = loadUserState(BASE_KEYS.CORR)
  if (parsed) {
    return {
      connections: parsed.connections || [],
      hypothesis: parsed.hypothesis || '',
      unlockedHintLevel: parsed.unlockedHintLevel || 0,
    }
  }
  return {
    connections: [],
    hypothesis: '',
    unlockedHintLevel: 0,
  }
}

// Save correlation state safely
function saveCorrelationState(state) {
  saveUserState(BASE_KEYS.CORR, {
    connections: state.connections,
    hypothesis: state.hypothesis,
    unlockedHintLevel: state.unlockedHintLevel,
  })
}

export default function EvidenceCorrelation() {
  const navigate = useNavigate()

  // Lab progress from Phase 4
  const [labState] = useState(loadLabState)

  // Correlation state
  const [corrState, setCorrState] = useState(loadCorrelationState)

  // Interactive selection state
  const [selectedNodeA, setSelectedNodeA] = useState(null)
  const [selectedNodeB, setSelectedNodeB] = useState(null)
  const [selectedConnectionId, setSelectedConnectionId] = useState(null)

  // Modals and tabs
  const [showTheoryModal, setShowTheoryModal] = useState(false)
  const [showHintsModal, setShowHintsModal] = useState(false)
  const [activeMobileTab, setActiveMobileTab] = useState('canvas')
  const [toast, setToast] = useState(null)

  // Persist correlation state when changed
  useEffect(() => {
    saveCorrelationState(corrState)
  }, [corrState])

  // Toast helper
  function triggerToast(msg, isError = false) {
    setToast({ text: msg, isError })
    setTimeout(() => setToast(null), 2500)
  }

  // Count valid connections based on evaluation
  const validCount = useMemo(() => {
    return corrState.connections.filter((c) => c.isValid).length
  }, [corrState.connections])

  // Handle selecting a node on the canvas or clue panel
  const handleSelectNode = useCallback(
    (nodeId) => {
      setSelectedConnectionId(null)

      if (!selectedNodeA) {
        // First node selected
        setSelectedNodeA(nodeId)
        setSelectedNodeB(null)
      } else if (selectedNodeA === nodeId) {
        // Clicked same node again -> deselect
        setSelectedNodeA(null)
        setSelectedNodeB(null)
      } else {
        // Second node selected
        setSelectedNodeB(nodeId)
        // On small screens, automatically switch to inspector tab
        if (window.innerWidth < 1024) {
          setActiveMobileTab('inspector')
        }
      }
    },
    [selectedNodeA]
  )

  // Handle selecting an existing connection
  const handleSelectConnection = useCallback((connId) => {
    setSelectedNodeA(null)
    setSelectedNodeB(null)
    setSelectedConnectionId(connId)
    if (window.innerWidth < 1024) {
      setActiveMobileTab('inspector')
    }
  }, [])

  // Clear all active selections
  const handleClearSelection = useCallback(() => {
    setSelectedNodeA(null)
    setSelectedNodeB(null)
    setSelectedConnectionId(null)
  }, [])

  // Establish a new connection (or update existing between pair)
  const handleEstablishConnection = useCallback(
    ({ from, to, type, notes }) => {
      const evaluation = evaluateConnection(from, to, type)
      const connId = `conn_${from < to ? from : to}_${from < to ? to : from}`

      const newConn = {
        id: connId,
        from,
        to,
        type,
        notes,
        timestamp: new Date().toISOString(),
        isValid: evaluation.isValid,
        feedback: evaluation.feedback,
        quality: evaluation.quality,
        significance: evaluation.significance,
      }

      setCorrState((prev) => {
        // Check if updating existing or adding new
        const filtered = prev.connections.filter(
          (c) =>
            !((c.from === from && c.to === to) || (c.from === to && c.to === from))
        )
        return {
          ...prev,
          connections: [...filtered, newConn],
        }
      })

      // Set focus to the new connection
      setSelectedNodeA(null)
      setSelectedNodeB(null)
      setSelectedConnectionId(connId)

      if (evaluation.isValid) {
        triggerToast('VALID FORENSIC LINK ESTABLISHED (+45 XP)', false)
      } else {
        triggerToast('INCONCLUSIVE CORRELATION — REVIEW RELATIONSHIP', true)
      }
    },
    []
  )

  // Update notes of an existing connection
  const handleUpdateConnection = useCallback((connId, updates) => {
    setCorrState((prev) => ({
      ...prev,
      connections: prev.connections.map((c) =>
        c.id === connId ? { ...c, ...updates } : c
      ),
    }))
    triggerToast('CONNECTION UPDATED')
  }, [])

  // Remove a connection
  const handleRemoveConnection = useCallback((connId) => {
    setCorrState((prev) => ({
      ...prev,
      connections: prev.connections.filter((c) => c.id !== connId),
    }))
    setSelectedConnectionId(null)
    triggerToast('CONNECTION REMOVED')
  }, [])

  // Save hypothesis
  const handleSaveHypothesis = useCallback((text) => {
    setCorrState((prev) => ({
      ...prev,
      hypothesis: text,
    }))
    triggerToast('HYPOTHESIS RECORDED (+30 XP)')
  }, [])

  // Unlock next hint
  const handleUnlockNextHint = useCallback(() => {
    setCorrState((prev) => {
      if (prev.unlockedHintLevel >= INVESTIGATION_HINTS.length) return prev
      return {
        ...prev,
        unlockedHintLevel: prev.unlockedHintLevel + 1,
      }
    })
    triggerToast('THREAT GRAPH HINT UNLOCKED (-20 XP)', false)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-[#080A0A] overflow-hidden select-none">
      {/* 1. Header with Breadcrumbs & Mission HUD */}
      <CorrelationHeader
        onBack={() => navigate('/lab')}
        connectionCount={corrState.connections.length}
        validCount={validCount}
        onOpenTheory={() => setShowTheoryModal(true)}
        onOpenHints={() => setShowHintsModal(true)}
        unlockedHintCount={corrState.unlockedHintLevel}
        onReconstruct={() => navigate('/reconstruct')}
      />

      {/* Persistent Navigation Stepper */}
      <ProgressStepper />

      {/* 2. Three-Panel Investigation Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel: Evidence Clues Source list */}
        <div
          className={`w-full lg:w-80 h-full border-r border-[#1a2222] bg-[#060808] z-20 shrink-0 transition-transform duration-300 ${
            activeMobileTab === 'clues'
              ? 'block'
              : 'hidden lg:block'
          }`}
        >
          <AvailableCluesPanel
            collectedClueIds={labState.collectedClueIds}
            selectedNodeId={selectedNodeA || selectedNodeB}
            onSelectNode={handleSelectNode}
          />
        </div>

        {/* Center Panel: Interactive Correlation Graph Canvas */}
        <div
          className={`flex-1 h-full relative overflow-hidden flex flex-col ${
            activeMobileTab === 'canvas' ? 'block' : 'hidden lg:block'
          }`}
        >
          <CorrelationCanvas
            connections={corrState.connections}
            selectedNodeA={selectedNodeA}
            selectedNodeB={selectedNodeB}
            onSelectNode={handleSelectNode}
            onClearSelection={handleClearSelection}
            selectedConnectionId={selectedConnectionId}
            onSelectConnection={handleSelectConnection}
            collectedClueIds={labState.collectedClueIds}
            analyzedIds={labState.analyzedIds}
          />
        </div>

        {/* Right Panel: Link Inspector & Creation Workspace */}
        <div
          className={`w-full lg:w-96 h-full border-l border-[#1a2222] bg-[#060808] z-20 shrink-0 overflow-y-auto ${
            activeMobileTab === 'inspector' ? 'block' : 'hidden lg:block'
          }`}
        >
          <ConnectionInspector
            selectedNodeA={selectedNodeA}
            selectedNodeB={selectedNodeB}
            selectedConnectionId={selectedConnectionId}
            connections={corrState.connections}
            onEstablish={handleEstablishConnection}
            onUpdate={handleUpdateConnection}
            onRemove={handleRemoveConnection}
            onClear={handleClearSelection}
            collectedClueIds={labState.collectedClueIds}
          />
        </div>
      </div>

      {/* 3. Bottom Stats & Hypothesis Bar */}
      <CorrelationBottomBar
        connectionCount={corrState.connections.length}
        validCount={validCount}
        hypothesis={corrState.hypothesis}
        onOpenTheory={() => setShowTheoryModal(true)}
        activeMobileTab={activeMobileTab}
        onSelectMobileTab={setActiveMobileTab}
        onReconstruct={() => navigate('/reconstruct')}
      />

      {/* Hints Modal */}
      <AnimatePresence>
        {showHintsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg border border-[#1F2937] bg-[#0A0D0D] p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#1A2222]">
                <h3 className="text-xs font-mono font-bold tracking-widest text-[#B7FF3C]">
                  CORRELATION HINTS & ADVISORIES
                </h3>
                <button
                  onClick={() => setShowHintsModal(false)}
                  className="text-[#6B7280] hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 max-h-72 overflow-y-auto font-mono text-[11px]">
                {INVESTIGATION_HINTS.slice(0, corrState.unlockedHintLevel).map((h, i) => (
                  <div key={i} className="p-3 border border-[#1F2937] bg-[#060808] space-y-1">
                    <span className="text-[9px] text-[#22D3EE] font-bold">HINT #{i + 1}</span>
                    <p className="text-[#D1D5DB]">{h.text || h.hint || h}</p>
                  </div>
                ))}

                {corrState.unlockedHintLevel < INVESTIGATION_HINTS.length && (
                  <button
                    onClick={handleUnlockNextHint}
                    className="w-full py-2.5 text-[10px] font-mono font-bold tracking-wider text-[#080A0A] bg-[#F59E0B] hover:bg-[#fbbf24] transition-all cursor-pointer"
                  >
                    UNLOCK NEXT HINT (-20 XP PENALTY)
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Feedback */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 text-[10px] font-mono font-bold tracking-[0.2em] shadow-2xl ${
              toast.isError
                ? 'bg-[#DC2626] text-white'
                : 'bg-[#B7FF3C] text-[#080A0A]'
            }`}
          >
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
