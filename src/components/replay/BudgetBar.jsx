import { motion, AnimatePresence } from 'motion/react'
import { AlertCircle, Shield, Sparkles, RotateCcw } from 'lucide-react'

export default function BudgetBar({
  pointsConsumed,
  pointsRemaining,
  totalBudget,
  onResetBudget,
  budgetWarning,
}) {
  return (
    <div className="border border-[#1a2222] bg-[#0A0D0D] p-3.5 sm:p-4 relative overflow-hidden">
      {/* Background grid accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#141A1A_1px,transparent_1px),linear-gradient(to_bottom,#141A1A_1px,transparent_1px)] bg-[size:24px_24px] opacity-15 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Heading & Allocation */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Shield size={13} className="text-[#B7FF3C]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-white">
              DEFENSE BUDGET
            </span>
            <span className="text-[9px] font-mono text-[#4B5563]">|</span>
            <span className="text-[10px] font-mono font-bold text-[#B7FF3C]">
              {String(pointsRemaining).padStart(2, '0')} / {String(totalBudget).padStart(2, '0')} POINTS AVAILABLE
            </span>
          </div>
          <p className="text-[8px] font-mono text-[#6B7280] tracking-wider">
            Deploy defensive controls across the attack chain. Every control changes how the simulated incident unfolds.
          </p>
        </div>

        {/* Center: Segmented Budget Bar */}
        <div className="flex items-center gap-1.5 py-1">
          {Array.from({ length: totalBudget }).map((_, idx) => {
            const isUsed = idx < pointsConsumed
            return (
              <motion.div
                key={idx}
                initial={false}
                animate={{
                  backgroundColor: isUsed ? '#B7FF3C' : '#141A1A',
                  boxShadow: isUsed ? '0 0 10px rgba(183, 255, 60, 0.4)' : 'none',
                }}
                transition={{ duration: 0.2 }}
                className="w-5 sm:w-6 h-5 border border-[#1a2222] flex items-center justify-center text-[8px] font-mono font-bold"
                style={{
                  color: isUsed ? '#080A0A' : '#4B5563',
                }}
              >
                {idx + 1}
              </motion.div>
            )
          })}

          {pointsConsumed > 0 && (
            <button
              onClick={onResetBudget}
              className="ml-2 px-2 py-1 border border-[#1a2222] bg-[#0E1212] hover:border-[#DC2626]/40 hover:text-[#DC2626] text-[#6B7280] text-[8px] font-mono tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
              title="Clear all selected controls"
            >
              <RotateCcw size={9} />
              <span className="hidden sm:inline">RESET</span>
            </button>
          )}
        </div>
      </div>

      {/* Warning Alert Banner (Animated) */}
      <AnimatePresence>
        {budgetWarning && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#F59E0B]/10 border border-[#F59E0B]/40 text-[#F59E0B] text-[9px] font-mono tracking-wider overflow-hidden"
          >
            <AlertCircle size={11} className="shrink-0" />
            <span>{budgetWarning}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
