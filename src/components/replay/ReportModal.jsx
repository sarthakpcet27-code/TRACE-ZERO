import { motion, AnimatePresence } from 'motion/react'
import { FileText, CheckCircle2, Shield, X, ArrowRight, Database, Terminal, Award } from 'lucide-react'

export default function ReportModal({ isOpen, onClose, stats, onViewReport }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-lg bg-[#090C0C] border border-[#B7FF3C]/40 shadow-[0_0_60px_rgba(0,0,0,0.9)] p-6 relative"
        >
          {/* Tactical Corner Reticles */}
          <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#B7FF3C]" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#B7FF3C]" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#B7FF3C]" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#B7FF3C]" />

          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1a2222]">
            <div className="flex items-center gap-2">
              <FileText size={15} className="text-[#B7FF3C]" />
              <h3 className="text-xs font-mono font-bold tracking-[0.2em] text-white">
                FORENSIC DOSSIER COMPILED // CASE #TR-2049
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-[#6B7280] hover:text-white transition-colors cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4 mb-6">
            <div className="p-3 bg-[#0E1212] border border-[#1a2222] space-y-1">
              <div className="flex items-center justify-between text-[9px] font-mono">
                <span className="text-[#6B7280]">DOSSIER STATUS:</span>
                <span className="text-[#B7FF3C] font-bold">READY FOR EXECUTIVE REVIEW</span>
              </div>
              <h4 className="text-sm font-mono font-bold text-white tracking-wider">
                TRACE//ZERO FINAL FORENSIC INVESTIGATION REPORT
              </h4>
              <p className="text-[10px] font-mono text-[#9CA3AF] leading-relaxed">
                All telemetry from Phases 1 through 7 has been indexed: evidence files, correlation hypotheses,
                canonical timeline reconstruction, and defense replay evaluations.
              </p>
            </div>

            {/* Checklist */}
            <div className="border border-[#141A1A] divide-y divide-[#141A1A] text-[9px] font-mono">
              {[
                { label: 'EVIDENCE LAB RECORDS', status: 'SYNCHRONIZED', color: '#B7FF3C' },
                { label: 'EVIDENCE CORRELATION MAP', status: 'CONFIRMED', color: '#B7FF3C' },
                { label: 'INCIDENT RECONSTRUCTION', status: 'ORDERED & GRADED', color: '#22D3EE' },
                { label: 'DEFENSE REPLAY SIMULATION', status: `GRADE ${stats?.grade || 'S'} // ${stats?.effectivenessScore || 100}% EFFECTIVE`, color: stats?.gradeColor || '#B7FF3C' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 bg-[#060808]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={11} className="text-[#B7FF3C]" />
                    <span className="text-[#9CA3AF]">{item.label}</span>
                  </div>
                  <span className="font-bold" style={{ color: item.color }}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-[9px] font-mono text-[#6B7280] italic text-center">
              All investigation telemetry is ready. Click below to view and print the comprehensive Forensic Report.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-[#1a2222] text-[10px] font-mono tracking-widest text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
            >
              CLOSE
            </button>
            <button
              onClick={onViewReport || onClose}
              className="flex-1 py-2.5 bg-[#B7FF3C] text-[#080A0A] font-mono font-bold text-[10px] tracking-widest hover:bg-[#c8ff66] transition-all cursor-pointer shadow-[0_0_20px_rgba(183,255,60,0.25)] flex items-center justify-center gap-1.5"
            >
              <FileText size={12} />
              <span>VIEW FULL DOSSIER</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
