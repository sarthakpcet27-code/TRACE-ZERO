/* ═══════════════════════════════════════════════════════════════
   Defense Replay — TRACE//ZERO Phase 7
   Interactive cybersecurity defense simulation.
   Per-user progress saving, pipeline visualization, side-by-side
   comparison, and case reset capability.
   ═══════════════════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import {
  Shield,
  Play,
  RotateCcw,
  AlertTriangle,
  Layers,
  Sparkles,
  Cpu,
  ChevronRight,
  Activity,
  CheckCircle2,
  XCircle,
  TrendingDown,
  Lock,
} from 'lucide-react'
import ReplayHeader from '../components/replay/ReplayHeader'
import BudgetBar from '../components/replay/BudgetBar'
import ControlCard from '../components/replay/ControlCard'
import AttackChainMap from '../components/replay/AttackChainMap'
import ReplayTerminal from '../components/replay/ReplayTerminal'
import ReplayResults from '../components/replay/ReplayResults'
import ReportModal from '../components/replay/ReportModal'
import ProgressStepper from '../components/ProgressStepper'
import MitreAttackCard from '../components/MitreAttackCard'
import {
  TOTAL_BUDGET,
  DEFENSIVE_CONTROLS,
  runDefenseSimulation,
} from '../data/defenseData'
import { BASE_KEYS, loadUserState, saveUserState, resetAllUserProgress } from '../services/progressService'

export default function DefenseReplay() {
  const navigate = useNavigate()

  // Saved state
  const saved = useMemo(() => loadUserState(BASE_KEYS.REPLAY), [])

  // Defensive control selection state
  const [selectedControlIds, setSelectedControlIds] = useState(() => {
    return saved?.selectedControlIds || ['CTRL-01', 'CTRL-04']
  })

  // Simulation lifecycle state: 'CONFIGURING' | 'SIMULATING' | 'COMPLETED'
  const [simState, setSimState] = useState(() => {
    return saved?.simState === 'COMPLETED' ? 'COMPLETED' : 'CONFIGURING'
  })

  // Interactive UI state
  const [hoveredControlId, setHoveredControlId] = useState(null)
  const [selectedStageId, setSelectedStageId] = useState(null)
  const [budgetWarning, setBudgetWarning] = useState(null)
  const [activeSimStageIndex, setActiveSimStageIndex] = useState(-1)
  const [streamedLogs, setStreamedLogs] = useState([])
  const [showReportModal, setShowReportModal] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [mobileTab, setMobileTab] = useState('controls') // 'controls' | 'topology' | 'console'

  // Computed budget
  const pointsConsumed = useMemo(() => {
    return selectedControlIds.reduce((sum, id) => {
      const ctrl = DEFENSIVE_CONTROLS.find((c) => c.id === id)
      return sum + (ctrl ? ctrl.cost : 0)
    }, 0)
  }, [selectedControlIds])

  const pointsRemaining = TOTAL_BUDGET - pointsConsumed

  // Run simulation engine deterministically
  const simResult = useMemo(() => {
    return runDefenseSimulation(selectedControlIds)
  }, [selectedControlIds])

  // Save state whenever selections or results change
  useEffect(() => {
    saveUserState(BASE_KEYS.REPLAY, {
      selectedControlIds,
      simState,
    })
  }, [selectedControlIds, simState])

  // Clear warning helper
  const triggerWarning = (msg) => {
    setBudgetWarning(msg)
    setTimeout(() => setBudgetWarning(null), 3000)
  }

  // Handle toggling a defensive control
  const handleToggleControl = useCallback(
    (controlId) => {
      if (simState === 'SIMULATING') return

      const isCurrentlySelected = selectedControlIds.includes(controlId)
      const ctrl = DEFENSIVE_CONTROLS.find((c) => c.id === controlId)
      if (!ctrl) return

      if (isCurrentlySelected) {
        setSelectedControlIds((prev) => prev.filter((id) => id !== controlId))
        setBudgetWarning(null)
      } else {
        if (pointsRemaining < ctrl.cost) {
          triggerWarning(
            `INSUFFICIENT DEPLOYMENT BUDGET — Requires ${ctrl.cost} points, but only ${pointsRemaining} available. Disable another control first.`
          )
          return
        }
        setSelectedControlIds((prev) => [...prev, controlId])
        setBudgetWarning(null)
      }
    },
    [selectedControlIds, pointsRemaining, simState]
  )

  // Clear all controls
  const handleResetBudget = useCallback(() => {
    if (simState === 'SIMULATING') return
    setSelectedControlIds([])
    setBudgetWarning(null)
  }, [simState])

  // Start the animated replay simulation
  const handleInitiateReplay = useCallback(() => {
    if (selectedControlIds.length === 0) {
      triggerWarning('DEPLOY AT LEAST ONE DEFENSIVE CONTROL BEFORE INITIATING REPLAY.')
      return
    }

    setSimState('SIMULATING')
    setActiveSimStageIndex(0)
    setStreamedLogs([])

    const fullResult = runDefenseSimulation(selectedControlIds)
    const stages = fullResult.stages
    const allLogs = fullResult.terminalLogs

    let currentStep = 0
    const stepInterval = setInterval(() => {
      currentStep++
      if (currentStep < stages.length) {
        setActiveSimStageIndex(currentStep)
        if (allLogs[currentStep]) {
          setStreamedLogs((prev) => [...prev, allLogs[currentStep]])
        }
      } else {
        clearInterval(stepInterval)
        setTimeout(() => {
          setSimState('COMPLETED')
          setStreamedLogs(allLogs)
        }, 600)
      }
    }, 700)

    if (allLogs[0]) {
      setStreamedLogs([allLogs[0]])
    }
  }, [selectedControlIds])

  // Reset simulation to reconfiguration mode
  const handleReconfigure = useCallback(() => {
    setSimState('CONFIGURING')
    setActiveSimStageIndex(-1)
  }, [])

  // Restart Case entirely
  const handleConfirmResetCase = useCallback(() => {
    resetAllUserProgress()
    setShowResetModal(false)
    navigate('/investigate', { replace: true })
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#080A0A] text-white flex flex-col selection:bg-[#B7FF3C] selection:text-black">
      {/* ─── Top Header ─── */}
      <ReplayHeader
        onBack={() => navigate('/reconstruct')}
        simState={simState}
        pointsRemaining={pointsRemaining}
        totalBudget={TOTAL_BUDGET}
      />

      {/* ─── Persistent Progress Stepper ─── */}
      <ProgressStepper />

      {/* ─── Mobile Tab Strip (< lg) ─── */}
      <div className="flex lg:hidden items-center justify-around border-b border-[#141A1A] bg-[#060808] text-[9px] font-mono tracking-widest shrink-0">
        {[
          { id: 'controls', label: 'CONTROLS' },
          { id: 'topology', label: 'ATTACK MAP' },
          { id: 'console', label: 'CONSOLE' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setMobileTab(tab.id)}
            className={`flex-1 py-2 text-center transition-colors border-b-2 cursor-pointer ${
              mobileTab === tab.id
                ? 'border-[#B7FF3C] text-[#B7FF3C] bg-[#B7FF3C]/[0.04]'
                : 'border-transparent text-[#6B7280] hover:text-[#9CA3AF]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Main Content Area ─── */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Case Mission Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-2 border-[#B7FF3C] pl-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#B7FF3C] font-bold">
                DEFENSE REPLAY // CASE #TR-2049
              </span>
              <span className="text-[10px] font-mono text-[#4B5563]">|</span>
              <span className="text-[10px] font-mono text-[#CBD5E1]">NEXORA TECHNOLOGIES</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-mono font-black tracking-tight text-white">
              YOU KNOW HOW THE BREACH HAPPENED. NOW DECIDE HOW IT SHOULD HAVE BEEN STOPPED.
            </h1>
            <p className="text-xs text-[#9CA3AF] max-w-3xl leading-relaxed font-sans">
              Deploy defensive controls within your security resource cap. Simulate the attack execution to assess whether controls intercept initial access, lateral movement, or data exfiltration.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 border border-[#DC2626]/40 text-[#DC2626] bg-[#DC2626]/5 text-[10px] font-mono hover:bg-[#DC2626]/15 transition-colors cursor-pointer"
            >
              <RotateCcw size={12} />
              RESTART CASE
            </button>
          </div>
        </div>

        {/* Budget Allocation HUD */}
        <BudgetBar
          pointsConsumed={pointsConsumed}
          pointsRemaining={pointsRemaining}
          totalBudget={TOTAL_BUDGET}
          onReset={handleResetBudget}
          simState={simState}
        />

        {/* Budget Warning Banner */}
        <AnimatePresence>
          {budgetWarning && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border border-[#F59E0B] bg-[#F59E0B]/10 p-3.5 flex items-center gap-3 text-xs font-mono text-[#F59E0B]"
            >
              <AlertTriangle size={16} className="shrink-0 text-[#F59E0B]" />
              <span className="flex-1 tracking-wide">{budgetWarning}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Attack Chain Topology Visualizer */}
        <div className={mobileTab === 'topology' || mobileTab === 'controls' ? 'block' : 'hidden lg:block'}>
          <AttackChainMap
            selectedControlIds={selectedControlIds}
            hoveredControlId={hoveredControlId}
            simState={simState}
            activeSimStageIndex={activeSimStageIndex}
            simulatedStages={simResult?.stages}
            onSelectStage={(id) => setSelectedStageId(id)}
            selectedStageId={selectedStageId}
          />
        </div>

        {/* ═══ SIDE-BY-SIDE DEFENSIVE COMPARISON ═══ */}
        <div className="grid md:grid-cols-2 gap-4 border border-[#1F2937] bg-[#0A0D0D] p-5">
          {/* Left: Without Defense */}
          <div className="border border-[#DC2626]/30 bg-[#060808] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1A2222] pb-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#DC2626] flex items-center gap-1.5">
                <XCircle size={14} /> WITHOUT CONTROLS (UNMITIGATED)
              </span>
              <span className="text-[8px] font-mono text-[#DC2626] bg-[#DC2626]/10 px-2 py-0.5 border border-[#DC2626]/30 font-bold">
                100% BREACH
              </span>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono text-[#9CA3AF]">
              <div className="flex justify-between">
                <span>Stages Breached:</span>
                <span className="text-[#DC2626] font-bold">7 / 7 STAGES</span>
              </div>
              <div className="flex justify-between">
                <span>Data Exfiltrated:</span>
                <span className="text-[#DC2626] font-bold">1.46 GB (100% VAULT)</span>
              </div>
              <div className="flex justify-between">
                <span>Adversary Persistence:</span>
                <span className="text-[#DC2626] font-bold">UNCHECKED SSH PIVOT</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Incident Cost:</span>
                <span className="text-[#DC2626] font-bold">$2,400,000 + AUDIT PENALTY</span>
              </div>
            </div>
          </div>

          {/* Right: With Defense */}
          <div className="border border-[#B7FF3C]/30 bg-[#060808] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1A2222] pb-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#B7FF3C] flex items-center gap-1.5">
                <CheckCircle2 size={14} /> WITH ACTIVE CONTROLS ({selectedControlIds.length} DEPLOYED)
              </span>
              <span className="text-[8px] font-mono text-[#B7FF3C] bg-[#B7FF3C]/10 px-2 py-0.5 border border-[#B7FF3C]/30 font-bold">
                {simResult.status === 'PREVENTED' ? 'CONTAINED' : 'PARTIAL MITIGATION'}
              </span>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono text-[#CBD5E1]">
              <div className="flex justify-between">
                <span>Interception Status:</span>
                <span className="text-[#B7FF3C] font-bold">
                  {simResult.status === 'PREVENTED' ? 'BREACH NEUTRALIZED' : 'ATTACK PROGRESSED'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Stages Prevented:</span>
                <span className="text-[#22D3EE] font-bold">
                  {simResult.stages.filter((s) => s.simulatedState === 'BLOCKED').length} OF 7 STAGES
                </span>
              </div>
              <div className="flex justify-between">
                <span>Budget Efficiency:</span>
                <span className="text-white font-bold">{pointsConsumed} / 100 PTS UTILIZED</span>
              </div>
              <div className="flex justify-between">
                <span>Data Loss Prevention:</span>
                <span className="text-[#B7FF3C] font-bold">
                  {simResult.status === 'PREVENTED' ? '0 BYTES EXFILTRATED' : 'PARTIAL LOSS'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MITRE ATT&CK Learning Matrix */}
        <MitreAttackCard />

        {/* Two-Column Simulation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Defensive Controls Arsenal */}
          <div
            className={`lg:col-span-7 space-y-4 ${
              mobileTab === 'controls' ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#1a2222]">
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-[#B7FF3C]" />
                <h3 className="text-xs font-mono font-bold tracking-[0.2em] text-white">
                  DEFENSIVE CONTROLS ARSENAL
                </h3>
              </div>
              <span className="text-[9px] font-mono text-[#6B7280]">
                {selectedControlIds.length} ACTIVE / {DEFENSIVE_CONTROLS.length} AVAILABLE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEFENSIVE_CONTROLS.map((control) => (
                <ControlCard
                  key={control.id}
                  control={control}
                  isSelected={selectedControlIds.includes(control.id)}
                  onToggle={() => handleToggleControl(control.id)}
                  disabled={
                    simState === 'SIMULATING' ||
                    (!selectedControlIds.includes(control.id) && pointsRemaining < control.cost)
                  }
                  onHover={(id) => setHoveredControlId(id)}
                  simState={simState}
                />
              ))}
            </div>

            {/* Run / Reconfigure Action Toolbar */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {simState === 'CONFIGURING' && (
                <motion.button
                  onClick={handleInitiateReplay}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={selectedControlIds.length === 0}
                  className="flex-1 flex items-center justify-center gap-2.5 bg-[#B7FF3C] text-[#080A0A] font-mono font-bold text-xs tracking-[0.2em] py-3.5 px-6 hover:bg-[#c8ff66] transition-all cursor-pointer shadow-[0_0_25px_rgba(183,255,60,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Play size={14} className="fill-[#080A0A]" />
                  RUN DEFENSE SIMULATION
                </motion.button>
              )}

              {simState === 'SIMULATING' && (
                <div className="flex-1 flex items-center justify-center gap-3 bg-[#0E1414] border border-[#22D3EE] text-[#22D3EE] font-mono text-xs tracking-[0.2em] py-3.5 px-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                  >
                    <Activity size={14} />
                  </motion.div>
                  SIMULATING BREACH TRAVERSAL...
                </div>
              )}

              {simState === 'COMPLETED' && (
                <div className="flex-1 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleReconfigure}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#0E1414] border border-[#1F2937] hover:border-[#B7FF3C] text-white font-mono text-xs tracking-wider py-3.5 px-4 cursor-pointer transition-colors"
                  >
                    <RotateCcw size={14} />
                    RECONFIGURE CONTROLS
                  </button>
                  <button
                    onClick={() => navigate('/report')}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#B7FF3C] text-[#080A0A] font-mono font-bold text-xs tracking-wider py-3.5 px-4 cursor-pointer hover:bg-[#c8ff66] shadow-[0_0_20px_rgba(183,255,60,0.3)] transition-all"
                  >
                    GENERATE FORENSIC REPORT
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Simulation Execution Terminal & Results */}
          <div
            className={`lg:col-span-5 space-y-4 ${
              mobileTab === 'console' || mobileTab === 'topology' ? 'block' : 'hidden lg:block'
            }`}
          >
            <ReplayTerminal
              logs={streamedLogs}
              simState={simState}
              activeStage={simResult.stages[activeSimStageIndex]}
            />

            {simState === 'COMPLETED' && (
              <ReplayResults
                simResult={simResult}
                onViewReport={() => navigate('/report')}
              />
            )}
          </div>
        </div>
      </main>

      {/* ─── Case Reset Confirmation Modal ─── */}
      <AnimatePresence>
        {showResetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="relative w-full max-w-md border border-[#DC2626]/50 bg-[#0A0D0D] p-6 shadow-[0_0_50px_rgba(220,38,38,0.25)] space-y-4"
            >
              <div className="flex items-center gap-2 text-[#DC2626]">
                <AlertTriangle size={18} />
                <h3 className="text-sm font-mono font-bold tracking-widest">
                  CONFIRM INVESTIGATION RESTART
                </h3>
              </div>
              <p className="text-xs text-[#CBD5E1] font-sans leading-relaxed">
                This will clear all collected evidence, correlation links, reconstruction sequence, and defense replay settings for your current analyst profile. You can start Case #TR-2049 fresh.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2 border border-[#1F2937] text-[10px] font-mono text-[#9CA3AF] hover:text-white cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleConfirmResetCase}
                  className="px-4 py-2 bg-[#DC2626] text-white text-[10px] font-mono font-bold tracking-wider hover:bg-[#ef4444] cursor-pointer"
                >
                  CONFIRM RESTART
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Forensic Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        simResult={simResult}
        pointsConsumed={pointsConsumed}
        onViewReport={() => navigate('/report')}
      />
    </div>
  )
}
