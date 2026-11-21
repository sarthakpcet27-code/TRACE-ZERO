/* ═══════════════════════════════════════════════════════════════
   Leaderboard Modal — TRACE//ZERO
   Shows top cyber investigators, local rankings, and scores.
   ═══════════════════════════════════════════════════════════════ */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Trophy, Award, X, Zap, Shield, User } from 'lucide-react'
import { getLeaderboard, calculateUserXP, getRankDetails } from '../services/rankService'
import { getCurrentUser } from '../services/authService'

export default function LeaderboardModal({ isOpen, onClose }) {
  const [board, setBoard] = useState([])
  const user = getCurrentUser()
  const userXP = calculateUserXP(user?.id)
  const rankInfo = getRankDetails(userXP)

  useEffect(() => {
    if (isOpen) {
      setBoard(getLeaderboard())
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl border border-[#1F2937] bg-[#0A0D0D] shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A2222] bg-[#060808]">
            <div className="flex items-center gap-2">
              <Trophy size={16} className="text-[#F59E0B]" />
              <span className="text-xs font-mono font-bold tracking-[0.2em] text-white">
                FORENSIC OPERATIVE LEADERBOARD
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-[#6B7280] hover:text-white transition-colors p-1"
              aria-label="Close leaderboard"
            >
              <X size={18} />
            </button>
          </div>

          {/* Current User Snapshot */}
          <div className="px-6 py-4 bg-[#080B0B] border-b border-[#1A2222] flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#B7FF3C]/40 bg-[#B7FF3C]/10 flex items-center justify-center">
                <User size={18} className="text-[#B7FF3C]" />
              </div>
              <div>
                <p className="text-[10px] font-mono tracking-widest text-[#6B7280]">ACTIVE ANALYST</p>
                <p className="text-xs font-mono font-bold text-white tracking-wider">
                  {user?.callsign || 'ANONYMOUS'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[9px] font-mono tracking-widest text-[#6B7280]">RANK STATUS</p>
                <p className="text-xs font-mono font-bold tracking-wider" style={{ color: rankInfo.current.color }}>
                  {rankInfo.current.name}
                </p>
              </div>
              <div className="text-right border-l border-[#1F2937] pl-4">
                <p className="text-[9px] font-mono tracking-widest text-[#6B7280]">TOTAL XP</p>
                <p className="text-sm font-mono font-bold text-[#B7FF3C]">
                  {userXP} <span className="text-[9px] text-[#6B7280]">XP</span>
                </p>
              </div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className="p-6 max-h-[360px] overflow-y-auto">
            <div className="space-y-2">
              {board.map((entry, idx) => {
                const isTop3 = idx < 3
                const isUser = entry.callsign === user?.callsign

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 border transition-all ${
                      isUser
                        ? 'border-[#B7FF3C]/50 bg-[#B7FF3C]/[0.05]'
                        : isTop3
                          ? 'border-[#1F2937] bg-[#060808]'
                          : 'border-[#141A1A] bg-[#050606] opacity-75'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-6 text-center font-mono font-bold text-xs ${
                        idx === 0 ? 'text-[#F59E0B]' : idx === 1 ? 'text-[#D1D5DB]' : idx === 2 ? 'text-[#B45309]' : 'text-[#4B5563]'
                      }`}>
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-mono font-bold text-white tracking-wider">
                            {entry.callsign}
                          </p>
                          {isUser && (
                            <span className="text-[8px] font-mono tracking-widest px-1.5 py-0.5 bg-[#B7FF3C] text-black font-bold">
                              YOU
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] font-mono text-[#6B7280] tracking-widest mt-0.5">
                          {entry.rank}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-[#B7FF3C] tracking-wide">
                          {entry.xp} XP
                        </span>
                        <p className="text-[8px] font-mono text-[#4B5563]">
                          {entry.time || 'COMPLETED'}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer note */}
          <div className="px-6 py-3 border-t border-[#1A2222] bg-[#060808] flex items-center justify-between text-[10px] font-mono text-[#4B5563]">
            <span>CASE #TR-2049 COMPETITIVE AUDIT</span>
            <span>SCORES UPDATED UPON CASE RECONSTRUCTION</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
