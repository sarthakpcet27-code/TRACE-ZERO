import { motion } from 'motion/react'
import {
  Award,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  FileText,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react'
import { DEFENSIVE_CONTROLS, ATTACK_CHAIN_STAGES, STATE_CONFIG } from '../../data/defenseData'

export default function ReplayResults({
  simResult,
  selectedControlIds,
  onResetSimulation,
  onGenerateReport,
}) {
  if (!simResult) return null

  const { stats, insights, comparisons } = simResult

  return (
    <div className="space-y-6">
      {/* ─── Hero Results Header & Score ─── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="border border-[#1a2222] bg-[#090C0C] p-5 sm:p-6 relative overflow-hidden"
        style={{ borderColor: `${stats.gradeColor}40` }}
      >
        {/* Tactical Corner Reticles */}
        <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2" style={{ borderColor: stats.gradeColor }} />
        <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2" style={{ borderColor: stats.gradeColor }} />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2" style={{ borderColor: stats.gradeColor }} />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2" style={{ borderColor: stats.gradeColor }} />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Summary Title & Subtitle */}
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Award size={16} style={{ color: stats.gradeColor }} />
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-white">
                REPLAY ANALYSIS COMPLETE // CASE #TR-2049
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-white">
              SIMULATED DEFENSIVE EVALUATION
            </h2>
            <p className="text-xs font-mono text-[#9CA3AF] leading-relaxed">
              Your defensive configuration altered the modeled attack progression across 7 attack chain stages.
              Deterministic simulation verified against scenario constraints.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[9px] font-mono">
              <span className="text-[#6B7280]">DEPLOYED CONTROLS:</span>
              {selectedControlIds.map((id) => {
                const ctrl = DEFENSIVE_CONTROLS.find((c) => c.id === id)
                return (
                  <span
                    key={id}
                    className="px-2 py-0.5 border text-white font-bold"
                    style={{ borderColor: `${ctrl?.accentColor}40`, backgroundColor: `${ctrl?.accentColor}10` }}
                  >
                    {ctrl?.name}
                  </span>
                )
              })}
            </div>
          </div>

          {/* Right: Grade & Score Card */}
          <div className="flex items-center gap-5 sm:gap-8 bg-[#060808] border border-[#1a2222] p-4 sm:p-5 shrink-0 justify-around sm:justify-start">
            {/* Letter Grade */}
            <div className="text-center">
              <span className="text-[8px] font-mono tracking-widest text-[#6B7280] block mb-1">
                DEFENSE GRADE
              </span>
              <div
                className="text-5xl sm:text-6xl font-black tracking-tight"
                style={{ color: stats.gradeColor }}
              >
                {stats.grade}
              </div>
              <span
                className="text-[9px] font-mono font-bold tracking-widest block mt-1"
                style={{ color: stats.gradeColor }}
              >
                {stats.gradeLabel}
              </span>
            </div>

            <div className="w-[1px] h-16 bg-[#1a2222]" />

            {/* Score Percentage */}
            <div className="text-center">
              <span className="text-[8px] font-mono tracking-widest text-[#6B7280] block mb-1">
                EFFECTIVENESS
              </span>
              <div
                className="text-4xl sm:text-5xl font-mono font-bold"
                style={{ color: stats.gradeColor }}
              >
                {stats.effectivenessScore}%
              </div>
              <span className="text-[8px] font-mono text-[#4B5563] block mt-1">
                {stats.pointsConsumed} / {stats.totalBudget} BUDGET USED
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Metrics Grid ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: 'STAGES PREVENTED',
            val: `${stats.stagesPrevented} / ${stats.totalStages}`,
            sub: 'BLOCKED AT PERIMETER',
            color: '#B7FF3C',
          },
          {
            label: 'STAGES DETECTED',
            val: `${stats.stagesDetected} / ${stats.totalStages}`,
            sub: 'TELEMETRY ALARMED',
            color: '#F59E0B',
          },
          {
            label: 'STAGES MITIGATED',
            val: `${stats.stagesMitigated} / ${stats.totalStages}`,
            sub: 'CONTAINED / LOGGED',
            color: '#22D3EE',
          },
          {
            label: 'REMAINING GAPS',
            val: `${stats.stagesBreached} / ${stats.totalStages}`,
            sub: 'UNMITIGATED PATHWAYS',
            color: stats.stagesBreached > 0 ? '#DC2626' : '#B7FF3C',
          },
        ].map((m, idx) => (
          <div key={idx} className="border border-[#1a2222] bg-[#0A0D0D] p-3.5 text-center">
            <span className="text-[8px] font-mono tracking-widest text-[#6B7280] block mb-1">
              {m.label}
            </span>
            <div className="text-xl sm:text-2xl font-mono font-bold" style={{ color: m.color }}>
              {m.val}
            </div>
            <span className="text-[8px] font-mono text-[#4B5563] block mt-1">
              {m.sub}
            </span>
          </div>
        ))}
      </div>

      {/* ─── Side-by-Side Incident Comparison ─── */}
      <div className="border border-[#1a2222] bg-[#0A0D0D] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#141A1A] gap-2">
          <div>
            <h3 className="text-xs font-mono font-bold tracking-[0.2em] text-white">
              INCIDENT PROGRESSION COMPARISON // ORIGINAL VS DEFENSE REPLAY
            </h3>
            <p className="text-[9px] font-mono text-[#6B7280]">
              Comparing canonical breach progression against your active defensive controls.
            </p>
          </div>
          <span className="text-[8px] font-mono px-2 py-0.5 border border-[#22D3EE]/30 text-[#22D3EE] bg-[#22D3EE]/05 w-fit">
            DETERMINISTIC REPLAY
          </span>
        </div>

        <div className="space-y-2">
          {comparisons.map((c) => {
            const stateCfg = STATE_CONFIG[c.simulatedStatus] || STATE_CONFIG['BREACH SIMULATED']

            return (
              <div
                key={c.stageId}
                className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-3 border border-[#141A1A] bg-[#080B0B] hover:border-[#1F2937] transition-colors"
              >
                {/* Left: Original Incident */}
                <div className="space-y-1.5 border-b lg:border-b-0 lg:border-r border-[#141A1A] pb-2 lg:pb-0 lg:pr-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold text-[#6B7280]">
                      {c.number} {c.name}
                    </span>
                    <span className="text-[8px] font-mono px-1.5 py-0.2 border border-[#DC2626]/40 text-[#DC2626] bg-[#DC2626]/10">
                      ORIGINAL: {c.originalStatus}
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-[#9CA3AF] leading-relaxed">
                    {c.originalDesc}
                  </p>
                </div>

                {/* Right: Your Defense Replay */}
                <div className="space-y-1.5 lg:pl-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] font-mono text-[#22D3EE]">REPLAY SIM:</span>
                      <span
                        className="text-[8px] font-mono font-bold px-1.5 py-0.2 border"
                        style={{
                          color: stateCfg.color,
                          borderColor: stateCfg.border,
                          backgroundColor: stateCfg.bg,
                        }}
                      >
                        {c.simulatedStatus}
                      </span>
                    </div>
                    {c.improved ? (
                      <span className="text-[8px] font-mono text-[#B7FF3C] font-bold flex items-center gap-1">
                        <CheckCircle size={9} /> INTERCEPTED
                      </span>
                    ) : (
                      <span className="text-[8px] font-mono text-[#DC2626] flex items-center gap-1">
                        <XCircle size={9} /> UNCHECKED
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-mono text-white leading-relaxed">
                    {c.simulatedDesc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── WHAT YOUR DEFENSE CHANGED ─── */}
      <div className="border border-[#1a2222] bg-[#0A0D0D] p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#141A1A]">
          <TrendingUp size={14} className="text-[#B7FF3C]" />
          <h3 className="text-xs font-mono font-bold tracking-[0.2em] text-white">
            WHAT YOUR DEFENSE CHANGED
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.map((insight, idx) => {
            const isNegative = insight.includes('lacked') || insight.includes('Unrestricted') || insight.includes('Absence') || insight.includes('No egress') || insight.includes('Without')
            return (
              <div
                key={idx}
                className={`p-3 border flex items-start gap-2.5 ${
                  isNegative
                    ? 'border-[#DC2626]/30 bg-[#DC2626]/[0.03]'
                    : 'border-[#B7FF3C]/30 bg-[#B7FF3C]/[0.03]'
                }`}
              >
                {isNegative ? (
                  <AlertTriangle size={13} className="text-[#DC2626] shrink-0 mt-0.5" />
                ) : (
                  <ShieldCheck size={13} className="text-[#B7FF3C] shrink-0 mt-0.5" />
                )}
                <p className="text-[10px] font-mono text-[#D1D5DB] leading-relaxed">
                  {insight}
                </p>
              </div>
            )
          })}
        </div>

        <div className="p-3 bg-[#060808] border border-[#141A1A] text-[8px] font-mono text-[#6B7280]">
          SCORING METHODOLOGY: Score reflects weighted interception effectiveness across initial access, sensitive data access, endpoint execution, and egress phases within the scenario rules. Fictional simulation model for forensic analysis training.
        </div>
      </div>

      {/* ─── Bottom Actions ─── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={onResetSimulation}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 border border-[#1a2222] bg-[#0A0D0D] hover:border-[#374151] hover:bg-[#141A1A] text-[#9CA3AF] hover:text-white text-[10px] font-mono tracking-widest transition-all cursor-pointer"
        >
          <RotateCcw size={12} />
          <span>RECONFIGURE DEFENSE</span>
        </button>

        <button
          onClick={onGenerateReport}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#B7FF3C] text-[#080A0A] font-mono font-bold text-[10px] tracking-[0.2em] hover:bg-[#c8ff66] transition-all cursor-pointer shadow-[0_0_25px_rgba(183,255,60,0.3)] active:scale-[0.98]"
        >
          <FileText size={13} />
          <span>GENERATE FORENSIC REPORT</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  )
}
