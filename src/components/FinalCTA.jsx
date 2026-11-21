import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SectionReveal from './SectionReveal'

export default function FinalCTA() {
  const navigate = useNavigate()

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#B7FF3C]/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
        <SectionReveal>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-[1px] bg-[#B7FF3C]/30" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-[#6B7280]">
              CASE #TR-2049
            </span>
            <div className="w-12 h-[1px] bg-[#B7FF3C]/30" />
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
            EVERY BREACH
            <br />
            LEAVES A <span className="text-[#B7FF3C] text-glow-green">TRACE.</span>
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <p className="text-[#9CA3AF] text-lg sm:text-xl mb-12 max-w-lg mx-auto">
            The evidence is waiting. Can you uncover the truth?
          </p>
        </SectionReveal>

        <SectionReveal delay={0.3}>
          <motion.button
            onClick={() => navigate('/investigate')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-3 text-[13px] font-mono tracking-[0.2em] text-[#080A0A] bg-[#B7FF3C] px-10 py-4 hover:bg-[#c8ff66] transition-all duration-300 cursor-pointer hover:shadow-[0_0_40px_rgba(183,255,60,0.25)]"
          >
            ENTER THE INVESTIGATION
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </motion.button>
        </SectionReveal>

        <SectionReveal delay={0.4}>
          <div className="mt-16 flex items-center justify-center gap-6">
            {['INVESTIGATE', 'CONNECT THE EVIDENCE', 'RECONSTRUCT THE BREACH'].map((text, i) => (
              <span key={text} className="hidden sm:inline-flex items-center gap-3">
                {i > 0 && <div className="w-1 h-1 rounded-full bg-[#B7FF3C]/30" />}
                <span className="text-[9px] font-mono tracking-[0.2em] text-[#6B7280]">
                  {text}
                </span>
              </span>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

