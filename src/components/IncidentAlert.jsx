import { motion } from 'motion/react'
import { AlertTriangle, Radio } from 'lucide-react'
import SectionReveal from './SectionReveal'

export default function IncidentAlert() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Alert bar accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#F59E0B]/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#F59E0B]/20 to-transparent" />

      {/* Ambient warning glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F59E0B]/[0.02] via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionReveal>
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <AlertTriangle size={16} className="text-[#F59E0B]" />
            </motion.div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#F59E0B] uppercase">
                Incoming Incident
              </span>
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex items-center gap-1"
              >
                <Radio size={10} className="text-[#F59E0B]" />
              </motion.div>
            </div>
          </div>
        </SectionReveal>

        <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-start">
          <div>
            <SectionReveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
                SOMETHING DOESN'T
                <br />
                <span className="text-[#F59E0B]">ADD UP.</span>
              </h2>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <p className="text-[#9CA3AF] text-base sm:text-lg leading-relaxed max-w-2xl mb-4">
                At 02:14 AM, NEXORA Technologies detected suspicious activity involving an
                employee account and confidential internal documents.
              </p>
              <p className="text-[#9CA3AF] text-base sm:text-lg leading-relaxed max-w-2xl">
                The investigation is incomplete.
              </p>
            </SectionReveal>
          </div>

          {/* Alert Card */}
          <SectionReveal delay={0.3} direction="right">
            <div className="border border-[#F59E0B]/20 bg-[#F59E0B]/[0.03] p-6 min-w-[260px]">
              <div className="flex items-center gap-2 mb-4">
                <motion.div
                  className="w-2 h-2 rounded-full bg-[#F59E0B]"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className="text-[10px] font-mono tracking-[0.2em] text-[#F59E0B]">
                  ALERT ACTIVE
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'SEVERITY', value: 'CRITICAL', color: 'text-[#DC2626]' },
                  { label: 'VECTOR', value: 'INSIDER THREAT', color: 'text-[#F59E0B]' },
                  { label: 'TIMESTAMP', value: '02:14:33 UTC', color: 'text-[#9CA3AF]' },
                  { label: 'ASSETS', value: '3 COMPROMISED', color: 'text-[#DC2626]' },
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center">
                    <span className="text-[9px] font-mono tracking-[0.15em] text-[#6B7280]">
                      {item.label}
                    </span>
                    <span className={`text-[10px] font-mono tracking-wider ${item.color}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>

        {/* Animated alert line */}
        <SectionReveal delay={0.4}>
          <div className="mt-10 flex items-center gap-4">
            <div className="flex-1 h-[1px] bg-[#1F2937]">
              <motion.div
                className="h-full bg-[#F59E0B]/40"
                animate={{ width: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <span className="text-[9px] font-mono tracking-[0.3em] text-[#6B7280]">
              SIGNAL INTERCEPT
            </span>
            <div className="flex-1 h-[1px] bg-[#1F2937]">
              <motion.div
                className="h-full bg-[#F59E0B]/40 ml-auto"
                animate={{ width: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              />
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}

