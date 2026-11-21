import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  FileText,
  HelpCircle,
  CheckCircle2,
  Lock,
  ChevronRight,
  X,
  Save,
  Activity,
  Sparkles,
  Clock,
} from 'lucide-react'
import { INVESTIGATION_HINTS } from '../../data/correlationData'

export default function CorrelationBottomBar({
  cluesCount,
  totalClues,
  connectionsCount,
  validCount,
  hypothesis,
  onSaveHypothesis,
  unlockedHintLevel,
  onUnlockNextHint,
  showTheoryModal,
  setShowTheoryModal,
  showHintsModal,
  setShowHintsModal,
  onGoToReconstruct,
}) {
  const [localHypothesis, setLocalHypothesis] = useState(hypothesis || '')
  const [saveToast, setSaveToast] = useState(false)

  // Status calculation
  const getStatusLabel = () => {
    if (connectionsCount === 0) return { text: 'INITIALIZING', color: '#6B7280' }
    if (connectionsCount < 3) return { text: 'MAPPING EVIDENCE', color: '#F59E0B' }
    if (validCount < 4) return { text: 'HYPOTHESIS FORMING', color: '#22D3EE' }
    return { text: 'SYNTHESIS VERIFIED', color: '#B7FF3C' }
  }

  const status = getStatusLabel()

  function handleSave() {
    onSaveHypothesis(localHypothesis)
    setSaveToast(true)
    setTimeout(() => setSaveToast(false), 2000)
  }

  return (
    <>
      {/* ════ BOTTOM BAR ════ */}
      <footer className="h-14 bg-[#060808]/95 backdrop-blur-md border-t border-[#1a2222] px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        {/* Progress Metrics */}
        <div className="flex items-center gap-3 sm:gap-6 text-[9px] font-mono">
          <div className="flex items-center gap-2">
            <span className="text-[#4B5563]">CLUES:</span>
            <span className="text-[#B7FF3C] font-bold">
              {cluesCount} / {totalClues}
            </span>
          </div>

          <div className="w-[1px] h-3 bg-[#1a2222] hidden xs:block" />

          <div className="flex items-center gap-2">
            <span className="text-[#4B5563]">CONNECTIONS:</span>
            <span className="text-white font-bold">{connectionsCount}</span>
          </div>

          <div className="w-[1px] h-3 bg-[#1a2222] hidden sm:block" />

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[#4B5563]">VALID LINKS:</span>
            <span className="text-[#22D3EE] font-bold">{validCount}</span>
          </div>

          <div className="w-[1px] h-3 bg-[#1a2222] hidden md:block" />

          <div className="hidden md:flex items-center gap-2">
            <span className="text-[#4B5563]">STATUS:</span>
            <span className="font-bold tracking-wider" style={{ color: status.color }}>
              {status.text}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowTheoryModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0E1212] border border-[#1a2222] hover:border-[#B7FF3C]/40 text-[9px] font-mono tracking-widest text-[#9CA3AF] hover:text-[#B7FF3C] transition-all cursor-pointer"
          >
            <FileText size={11} className="text-[#B7FF3C]" />
            <span>INVESTIGATOR'S THEORY</span>
            {hypothesis && <span className="w-1.5 h-1.5 rounded-full bg-[#B7FF3C]" />}
          </button>

          <button
            onClick={() => setShowHintsModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0E1212] border border-[#1a2222] hover:border-[#F59E0B]/40 text-[9px] font-mono tracking-widest text-[#F59E0B] transition-all cursor-pointer"
          >
            <HelpCircle size={11} />
            <span className="hidden sm:inline">REQUEST</span> HINT
            {unlockedHintLevel > 0 && (
              <span className="text-[8px] bg-[#F59E0B]/20 text-[#F59E0B] px-1 py-0.2 rounded-xs">
                {unlockedHintLevel}
              </span>
            )}
          </button>

          {onGoToReconstruct && (
            <button
              onClick={onGoToReconstruct}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#22D3EE]/15 border border-[#22D3EE]/50 hover:bg-[#22D3EE] hover:text-[#080A0A] text-[9px] font-mono font-bold tracking-widest text-[#22D3EE] transition-all cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.15)]"
            >
              <Clock size={11} />
              <span className="hidden xs:inline">RECONSTRUCT TIMELINE</span>
              <span className="xs:hidden">RECONSTRUCT</span>
              <ChevronRight size={11} />
            </button>
          )}
        </div>
      </footer>

      {/* ════ INVESTIGATOR'S THEORY MODAL / DRAWER ════ */}
      <AnimatePresence>
        {showTheoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl bg-[#090C0C] border border-[#B7FF3C]/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] p-5 sm:p-6 relative"
            >
              {/* Corner reticles */}
              <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#B7FF3C]" />
              <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#B7FF3C]" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#B7FF3C]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#B7FF3C]" />

              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1a2222]">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-[#B7FF3C]" />
                  <h3 className="text-xs font-mono font-bold tracking-[0.2em] text-white">
                    INVESTIGATOR'S THEORY — INCIDENT HYPOTHESIS
                  </h3>
                </div>
                <button
                  onClick={() => setShowTheoryModal(false)}
                  className="text-[#4B5563] hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="space-y-3 mb-5">
                <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
                  Synthesize your findings from the correlated evidence. What was the attacker's entry point, how did they escalate privileges, and what occurred prior to the log purge?
                </p>

                <textarea
                  value={localHypothesis}
                  onChange={(e) => setLocalHypothesis(e.target.value)}
                  placeholder="Record your formal forensic hypothesis here:
e.g. Attacker delivered spearphishing email (E-01) targeting Mercer, logged in after hours (E-02), harvested credentials via LSASS (E-04), exfiltrated 1.46 GB database records (E-03 & E-05), and purged event logs with wevtutil (E-06)..."
                  className="w-full h-44 bg-[#060808] border border-[#1a2222] p-3 text-xs font-mono text-[#D1D5DB] placeholder:text-[#2D3748] resize-none focus:outline-none focus:border-[#B7FF3C]/40 transition-colors leading-relaxed"
                  spellCheck={false}
                />

                <div className="flex items-center justify-between text-[9px] font-mono text-[#4B5563]">
                  <span>{localHypothesis.length} CHARACTERS</span>
                  <span>LOCAL ENCRYPTION PERSISTED</span>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#1a2222]">
                <span className="text-[9px] font-mono text-[#B7FF3C]">
                  {saveToast ? '✓ HYPOTHESIS SAVED TO CASE FILE' : ''}
                </span>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowTheoryModal(false)}
                    className="px-4 py-2 border border-[#1a2222] text-[10px] font-mono tracking-wider text-[#9CA3AF] hover:text-white cursor-pointer"
                  >
                    CLOSE
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-1.5 px-5 py-2 bg-[#B7FF3C] text-[#080A0A] font-mono font-bold text-[10px] tracking-wider hover:bg-[#c8ff66] transition-all cursor-pointer shadow-[0_0_20px_rgba(183,255,60,0.2)]"
                  >
                    <Save size={11} />
                    SAVE HYPOTHESIS
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ════ INVESTIGATION HINTS MODAL ════ */}
      <AnimatePresence>
        {showHintsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-[#090C0C] border border-[#F59E0B]/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] p-5 sm:p-6 relative"
            >
              {/* Corner reticles */}
              <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#F59E0B]" />
              <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#F59E0B]" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#F59E0B]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#F59E0B]" />

              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1a2222]">
                <div className="flex items-center gap-2">
                  <HelpCircle size={14} className="text-[#F59E0B]" />
                  <h3 className="text-xs font-mono font-bold tracking-[0.2em] text-white">
                    INVESTIGATION HINTS ({unlockedHintLevel} / {INVESTIGATION_HINTS.length} UNLOCKED)
                  </h3>
                </div>
                <button
                  onClick={() => setShowHintsModal(false)}
                  className="text-[#4B5563] hover:text-white transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Hints List */}
              <div className="space-y-3 mb-6 max-h-72 overflow-y-auto">
                {INVESTIGATION_HINTS.map((hintObj) => {
                  const isUnlocked = hintObj.level <= unlockedHintLevel

                  return (
                    <div
                      key={hintObj.level}
                      className={`p-3.5 border transition-all ${
                        isUnlocked
                          ? 'border-[#F59E0B]/30 bg-[#F59E0B]/[0.04]'
                          : 'border-[#141A1A] bg-[#060808] opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-mono font-bold tracking-widest text-[#F59E0B]">
                          HINT LEVEL {hintObj.level} — {hintObj.title}
                        </span>
                        {isUnlocked ? (
                          <CheckCircle2 size={12} className="text-[#B7FF3C]" />
                        ) : (
                          <div className="flex items-center gap-1 text-[8px] font-mono text-[#4B5563]">
                            <Lock size={10} /> LOCKED
                          </div>
                        )}
                      </div>

                      {isUnlocked ? (
                        <p className="text-xs font-mono text-[#D1D5DB] leading-relaxed">
                          {hintObj.hint}
                        </p>
                      ) : (
                        <p className="text-[10px] font-mono text-[#374151] italic">
                          Click 'Unlock Next Hint' below to request guidance from senior forensics.
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-[#1a2222]">
                <button
                  onClick={() => setShowHintsModal(false)}
                  className="px-4 py-2 border border-[#1a2222] text-[10px] font-mono tracking-wider text-[#9CA3AF] hover:text-white cursor-pointer"
                >
                  CLOSE
                </button>

                {unlockedHintLevel < INVESTIGATION_HINTS.length ? (
                  <button
                    onClick={onUnlockNextHint}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#F59E0B] text-[#080A0A] font-mono font-bold text-[10px] tracking-wider hover:bg-[#fbbf24] transition-all cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                  >
                    <Sparkles size={11} />
                    UNLOCK NEXT HINT ({unlockedHintLevel + 1}/{INVESTIGATION_HINTS.length})
                  </button>
                ) : (
                  <span className="text-[9px] font-mono text-[#B7FF3C]">
                    ALL HINTS UNLOCKED
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
