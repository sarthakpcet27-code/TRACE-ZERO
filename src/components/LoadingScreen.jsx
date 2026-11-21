import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('INITIALIZING SYSTEM...')

  useEffect(() => {
    const messages = [
      { at: 0, text: 'INITIALIZING SYSTEM...' },
      { at: 20, text: 'LOADING FORENSIC MODULES...' },
      { at: 45, text: 'CONNECTING TO SECURE NETWORK...' },
      { at: 70, text: 'DECRYPTING CASE FILES...' },
      { at: 90, text: 'SYSTEM READY.' },
    ]

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 1.2
        const msg = [...messages].reverse().find(m => m.at <= next)
        if (msg) setStatusText(msg.text)
        return next >= 100 ? 100 : next
      })
    }, 25)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="loading-screen"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <svg width="80" height="80" viewBox="0 0 80 80" className="drop-shadow-[0_0_20px_rgba(183,255,60,0.3)]">
            <motion.circle
              cx="40" cy="40" r="30"
              fill="none" stroke="#B7FF3C" strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5 }}
            />
            <motion.circle
              cx="40" cy="40" r="20"
              fill="none" stroke="#B7FF3C" strokeWidth="0.5" opacity="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            />
            <motion.circle
              cx="40" cy="40" r="4"
              fill="#B7FF3C"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ duration: 1, delay: 0.8 }}
            />
            <motion.line
              x1="40" y1="10" x2="40" y2="25"
              stroke="#B7FF3C" strokeWidth="1" opacity="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
            <motion.line
              x1="40" y1="55" x2="40" y2="70"
              stroke="#B7FF3C" strokeWidth="1" opacity="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
            <motion.line
              x1="10" y1="40" x2="25" y2="40"
              stroke="#B7FF3C" strokeWidth="1" opacity="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            />
            <motion.line
              x1="55" y1="40" x2="70" y2="40"
              stroke="#B7FF3C" strokeWidth="1" opacity="0.6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            />
          </svg>
        </motion.div>

        {/* Title */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold tracking-[0.3em] text-white">
            TRACE<span className="text-[#B7FF3C]">//</span>ZERO
          </h1>
          <p className="text-xs tracking-[0.4em] text-[#6B7280] mt-2 font-mono">
            THE MIDNIGHT BREACH
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          className="w-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="h-[2px] bg-[#1F2937] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#B7FF3C] rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-3 items-center">
            <p className="text-[10px] font-mono text-[#6B7280] tracking-wider">
              {statusText}
            </p>
            <p className="text-[10px] font-mono text-[#B7FF3C]">
              {Math.round(progress)}%
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

