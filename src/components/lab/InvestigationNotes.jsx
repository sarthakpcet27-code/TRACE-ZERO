import { motion, AnimatePresence } from 'motion/react'
import { Edit3, X } from 'lucide-react'

export default function InvestigationNotes({ notes, onUpdateNotes, isOpen, onToggle }) {
  return (
    <div className="fixed bottom-4 right-4 z-30">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[calc(100vw-2rem)] sm:w-80 max-h-80 border border-[#1a2222] bg-[#060808] shadow-[0_0_40px_rgba(0,0,0,0.6)] mb-2 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#1a2222] bg-[#0A0D0D] shrink-0">
              <div className="flex items-center gap-2">
                <Edit3 size={10} className="text-[#B7FF3C]" />
                <span className="text-[9px] font-mono tracking-[0.2em] text-[#6B7280]">INVESTIGATION NOTES</span>
              </div>
              <button
                onClick={onToggle}
                className="text-[#4B5563] hover:text-white transition-colors cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>

            {/* Textarea */}
            <div className="flex-1 p-2">
              <textarea
                value={notes}
                onChange={(e) => onUpdateNotes(e.target.value)}
                placeholder="Record your observations and theories here..."
                className="w-full h-48 bg-[#080A0A] border border-[#1a2222] text-[11px] font-mono text-[#9CA3AF] placeholder:text-[#2D3748] p-3 resize-none focus:outline-none focus:border-[#B7FF3C]/30 transition-colors"
                spellCheck={false}
              />
            </div>

            {/* Footer */}
            <div className="px-3 py-1.5 border-t border-[#1a2222] flex items-center justify-between shrink-0">
              <span className="text-[8px] font-mono text-[#2D3748]">{notes.length} CHARS</span>
              <span className="text-[8px] font-mono text-[#2D3748]">AUTO-SAVED</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      {!isOpen && (
        <motion.button
          onClick={onToggle}
          className="flex items-center gap-2 px-3 py-2 bg-[#060808] border border-[#1a2222] text-[9px] font-mono tracking-[0.2em] text-[#6B7280] hover:text-[#B7FF3C] hover:border-[#B7FF3C]/30 transition-colors cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Edit3 size={10} />
          NOTES
        </motion.button>
      )}
    </div>
  )
}
