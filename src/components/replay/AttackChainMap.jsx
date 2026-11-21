import { motion } from 'motion/react'
import {
  Mail,
  Key,
  FileText,
  Cpu,
  Wifi,
  AlertTriangle,
  Shield,
  CheckCircle,
  XCircle,
  Activity,
  Zap,
} from 'lucide-react'
import { ATTACK_CHAIN_STAGES, STATE_CONFIG, DEFENSIVE_CONTROLS } from '../../data/defenseData'

const STAGE_ICON_MAP = {
  Mail,
  Key,
  FileText,
  Cpu,
  Wifi,
  AlertTriangle,
  Shield,
}

export default function AttackChainMap({
  selectedControlIds = [],
  hoveredControlId = null,
  simState = 'CONFIGURING', // 'CONFIGURING' | 'SIMULATING' | 'COMPLETED'
  activeSimStageIndex = -1,
  simulatedStages = null,
  onSelectStage,
  selectedStageId,
}) {
  // Determine which stages are affected by selected controls
  const activeControlIds = hoveredControlId ? [hoveredControlId] : selectedControlIds
  const affectedStagesSet = new Set()
  const stageControlLabels = {}

  activeControlIds.forEach((ctrlId) => {
    const ctrl = DEFENSIVE_CONTROLS.find((c) => c.id === ctrlId)
    if (ctrl) {
      ctrl.affectedStageIds.forEach((stageId) => {
        affectedStagesSet.add(stageId)
        if (!stageControlLabels[stageId]) stageControlLabels[stageId] = []
        stageControlLabels[stageId].push(ctrl.name)
      })
    }
  })

  return (
    <div className="border border-[#1a2222] bg-[#080B0B] p-4 sm:p-5 relative overflow-hidden">
      {/* Background Reticle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141A1A_1px,transparent_1px),linear-gradient(to_bottom,#141A1A_1px,transparent_1px)] bg-[size:32px_32px] opacity-10 pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-[#141A1A] gap-2 relative z-10">
        <div className="flex items-center gap-2">
          <Activity size={13} className="text-[#22D3EE]" />
          <h3 className="text-xs font-mono font-bold tracking-[0.2em] text-white">
            ATTACK CHAIN TOPOLOGY // DEFENSIVE INTERCEPTION MAP
          </h3>
        </div>
        <div className="flex items-center gap-3 text-[9px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
            <span className="text-[#9CA3AF]">ORIGINAL VECTOR</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B7FF3C]" />
            <span className="text-[#9CA3AF]">DEFENSE ACTIVE</span>
          </div>
        </div>
      </div>

      {/* ── Desktop & Tablet Connected Stages Flow ── */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {ATTACK_CHAIN_STAGES.map((stage, idx) => {
          const Icon = STAGE_ICON_MAP[stage.icon] || Shield
          const isAffected = affectedStagesSet.has(stage.id)
          const isSimulatingThis = simState === 'SIMULATING' && activeSimStageIndex === idx
          const isSimulatedPassed = (simState === 'SIMULATING' && idx < activeSimStageIndex) || simState === 'COMPLETED'
          
          // Resulting state from simulation if available
          const simResult = simulatedStages && simulatedStages[idx]
          const stageState = simResult
            ? (isSimulatedPassed || simState === 'COMPLETED' ? simResult.simulatedState : 'PENDING')
            : (isAffected ? 'DEFENDED' : stage.originalStatus)

          const stateConfig = simResult && (isSimulatedPassed || simState === 'COMPLETED')
            ? STATE_CONFIG[simResult.simulatedState] || STATE_CONFIG['BREACH SIMULATED']
            : null

          const isSelected = selectedStageId === stage.id

          return (
            <div key={stage.id} className="relative flex flex-col">
              {/* Connector line for horizontal layout (> lg) */}
              {idx < ATTACK_CHAIN_STAGES.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-7 w-3 h-[2px] z-0 overflow-hidden bg-[#1a2222]">
                  {isAffected && (
                    <motion.div
                      className="w-full h-full bg-[#B7FF3C]"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    />
                  )}
                </div>
              )}

              {/* Stage Card */}
              <motion.div
                layout
                onClick={() => onSelectStage && onSelectStage(stage.id)}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
                className={`relative p-3 border transition-all h-full flex flex-col justify-between ${
                  isSimulatingThis
                    ? 'border-[#22D3EE] bg-[#22D3EE]/10 shadow-[0_0_30px_rgba(34,211,238,0.25)] ring-1 ring-[#22D3EE]'
                    : isSelected
                      ? 'border-white bg-[#141A1A]'
                      : isAffected && simState === 'CONFIGURING'
                        ? 'border-[#B7FF3C]/80 bg-[#B7FF3C]/[0.06] shadow-[0_0_20px_rgba(183,255,60,0.15)]'
                        : simResult && (isSimulatedPassed || simState === 'COMPLETED')
                          ? `border-[${stateConfig?.border}] bg-[#0A0D0D]`
                          : 'border-[#1a2222] bg-[#0A0D0D] hover:border-[#2A3A2A]'
                } cursor-pointer`}
                style={
                  simResult && (isSimulatedPassed || simState === 'COMPLETED')
                    ? { borderColor: stateConfig?.border, backgroundColor: stateConfig?.bg }
                    : {}
                }
              >
                {/* Active simulation scanning bar */}
                {isSimulatingThis && (
                  <motion.div
                    className="absolute inset-x-0 top-0 h-0.5 bg-[#22D3EE]"
                    animate={{ scaleX: [0, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}

                {/* Node Top: Number & Time */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold text-[#6B7280]">
                      {stage.number}
                    </span>
                    <span className="text-[8px] font-mono text-[#4B5563]">
                      {stage.time}
                    </span>
                  </div>

                  {/* Icon */}
                  <div
                    className="w-6 h-6 rounded-xs border flex items-center justify-center"
                    style={{
                      borderColor: isSimulatingThis
                        ? '#22D3EE'
                        : isAffected && simState === 'CONFIGURING'
                          ? '#B7FF3C'
                          : stateConfig?.color || '#1a2222',
                      backgroundColor: '#060808',
                    }}
                  >
                    <Icon
                      size={12}
                      style={{
                        color: isSimulatingThis
                          ? '#22D3EE'
                          : isAffected && simState === 'CONFIGURING'
                            ? '#B7FF3C'
                            : stateConfig?.color || '#6B7280',
                      }}
                    />
                  </div>
                </div>

                {/* Stage Title */}
                <div className="mb-2">
                  <h4 className="text-[10px] font-mono font-bold tracking-wider text-white line-clamp-1">
                    {stage.name}
                  </h4>
                  <p className="text-[8px] font-mono text-[#6B7280] line-clamp-2 mt-0.5 leading-tight">
                    {simResult && (isSimulatedPassed || simState === 'COMPLETED')
                      ? simResult.headline
                      : stage.originalDescription}
                  </p>
                </div>

                {/* Status Indicator Pill */}
                <div className="pt-2 border-t border-[#141A1A] mt-auto">
                  {simState === 'SIMULATING' && !isSimulatedPassed && !isSimulatingThis ? (
                    <span className="text-[8px] font-mono tracking-widest text-[#4B5563]">
                      QUEUED
                    </span>
                  ) : isSimulatingThis ? (
                    <div className="flex items-center gap-1 text-[8px] font-mono text-[#22D3EE] font-bold animate-pulse">
                      <Zap size={9} />
                      <span>EVALUATING...</span>
                    </div>
                  ) : simResult && (isSimulatedPassed || simState === 'COMPLETED') ? (
                    <div className="flex items-center gap-1">
                      <span
                        className="text-[8px] font-mono font-bold tracking-widest px-1.5 py-0.5 border"
                        style={{
                          color: stateConfig?.color,
                          borderColor: stateConfig?.border,
                          backgroundColor: '#080A0A',
                        }}
                      >
                        {simResult.simulatedState}
                      </span>
                    </div>
                  ) : isAffected ? (
                    <div className="flex items-center gap-1 text-[8px] font-mono text-[#B7FF3C] font-bold">
                      <Shield size={9} />
                      <span className="truncate">INTERCEPTED</span>
                    </div>
                  ) : (
                    <span className="text-[8px] font-mono tracking-widest text-[#DC2626]">
                      UNPROTECTED
                    </span>
                  )}
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>

      {/* Dynamic Sub-bar: Explanation of affected stage */}
      {affectedStagesSet.size > 0 && simState === 'CONFIGURING' && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-3 border-t border-[#141A1A] flex flex-wrap items-center gap-3 text-[9px] font-mono"
        >
          <span className="text-[#6B7280] font-bold">ACTIVE INTERCEPTIONS:</span>
          {Array.from(affectedStagesSet).map((stageId) => {
            const st = ATTACK_CHAIN_STAGES.find((s) => s.id === stageId)
            const ctrls = stageControlLabels[stageId] || []
            return (
              <div
                key={stageId}
                className="flex items-center gap-1 px-2 py-0.5 bg-[#B7FF3C]/10 border border-[#B7FF3C]/30 text-[#B7FF3C]"
              >
                <span className="font-bold">{st?.number} {st?.name}</span>
                <span className="text-[#4B5563]">via</span>
                <span className="text-white">{ctrls.join(', ')}</span>
              </div>
            )
          })}
        </motion.div>
      )}
    </div>
  )
}
