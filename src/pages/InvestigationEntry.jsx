import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, Radio, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function InvestigationEntry() {
  const navigate = useNavigate()
  const [initProgress, setInitProgress] = useState(0)
  const [phase, setPhase] = useState('booting')

  useEffect(() => {
    const interval = setInterval(() => {
      setInitProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setPhase('ready')
          return 100
        }
        return prev + 0.8
      })
    }, 30)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (initProgress > 30 && phase === 'booting') setPhase('connecting')
    if (initProgress > 60 && phase === 'connecting') setPhase('loading')
    if (initProgress >= 100) setPhase('ready')
  }, [initProgress, phase])

  const statusMessages = {
    booting: 'BOOTING SECURE ENVIRONMENT...',
    connecting: 'CONNECTING TO FORENSIC DATABASE...',
    loading: 'LOADING EVIDENCE MODULES...',
    ready: 'INVESTIGATION WORKSPACE INITIALIZED',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#080A0A] grid-bg flex items-center justify-center p-6"
    >
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-[11px] font-mono tracking-[0.15em] text-[#6B7280] hover:text-white transition-colors mb-10 cursor-pointer"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          RETURN TO OVERVIEW
        </motion.button>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="border border-[#1F2937] bg-[#0F1212] relative"
        >
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-[#B7FF3C]/30" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-[#B7FF3C]/30" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-[#B7FF3C]/30" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-[#B7FF3C]/30" />

          {/* Header */}
          <div className="border-b border-[#1F2937] px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={16} className="text-[#B7FF3C]" />
              <span className="text-[11px] font-mono tracking-[0.2em] text-[#9CA3AF]">
                CASE #TR-2049
              </span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Radio size={12} className="text-[#B7FF3C]" />
              </motion.div>
              <span className="text-[9px] font-mono tracking-[0.2em] text-[#6B7280]">
                SECURE CHANNEL
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-12 text-center">
            {/* Lock Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 border border-[#B7FF3C]/20 bg-[#B7FF3C]/5 mb-8"
            >
              <Lock size={24} className="text-[#B7FF3C]" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-3">
                INVESTIGATION PROTOCOL
                <br />
                <span className="text-[#B7FF3C]">INITIALIZATION</span>
              </h1>

              <p className="text-[#6B7280] text-sm font-mono tracking-wide mb-10">
                NEXORA TECHNOLOGIES — INCIDENT RESPONSE UNIT
              </p>
            </motion.div>

            {/* Progress */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="max-w-sm mx-auto mb-10"
            >
              <div className="h-[2px] bg-[#1F2937] mb-3 overflow-hidden">
                <motion.div
                  className="h-full bg-[#B7FF3C]"
                  style={{ width: `${initProgress}%` }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-[9px] font-mono tracking-wider text-[#6B7280]">
                  {statusMessages[phase]}
                </span>
                <span className="text-[9px] font-mono text-[#B7FF3C]">
                  {Math.round(initProgress)}%
                </span>
              </div>
            </motion.div>

            {/* Ready State */}
            {phase === 'ready' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="border border-[#B7FF3C]/20 bg-[#B7FF3C]/[0.03] p-6 max-w-md mx-auto mb-8">
                  <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4">
                    The full investigation workspace is under development and will be available
                    in the next phase.
                  </p>
                  <p className="text-[#6B7280] text-xs font-mono">
                    This simulation is part of a digital forensics experience.
                    All data is fictional.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => navigate('/')}
                    className="group flex items-center gap-2 text-[11px] font-mono tracking-[0.15em] text-[#080A0A] bg-[#B7FF3C] px-6 py-3 hover:bg-[#c8ff66] transition-all duration-300 cursor-pointer hover:shadow-[0_0_20px_rgba(183,255,60,0.3)]"
                  >
                    <ArrowLeft size={14} />
                    RETURN HOME
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[#1F2937] px-8 py-4 flex items-center justify-between">
            <span className="text-[9px] font-mono tracking-[0.2em] text-[#6B7280]">
              ENCRYPTED SESSION
            </span>
            <span className="text-[9px] font-mono tracking-[0.2em] text-[#6B7280]">
              CLEARANCE: LEVEL 4
            </span>
          </div>
        </motion.div>

        {/* Bottom metadata */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex justify-center"
        >
          <span className="text-[9px] font-mono tracking-[0.2em] text-[#6B7280]/50">
            TRACE//ZERO — DIGITAL FORENSICS SIMULATION
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}

