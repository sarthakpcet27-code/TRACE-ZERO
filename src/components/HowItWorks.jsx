/* ═══════════════════════════════════════════════════════════════
   How It Works Strip — TRACE//ZERO
   3-Step forensic methodology timeline for the landing page.
   1. Investigate Evidence -> 2. Correlate Clues -> 3. Reconstruct & Defend
   ═══════════════════════════════════════════════════════════════ */

import { motion } from 'motion/react'
import { FileSearch, Network, ShieldCheck, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const STAGES = [
  {
    step: '01',
    name: 'INVESTIGATE EVIDENCE',
    tag: 'EVIDENCE ARCHIVE',
    desc: 'Examine disk memory, Wireshark packet captures, auth logs, and malicious email headers. Extract concealed IOCs and verify file hashes.',
    icon: FileSearch,
    path: '/lab',
    accent: '#B7FF3C',
  },
  {
    step: '02',
    name: 'CORRELATE CLUES',
    tag: 'THREAT GRAPH',
    desc: 'Map relationships across disparate attack artifacts. Formulate breach hypotheses and identify attacker movement across internal nodes.',
    icon: Network,
    path: '/correlate',
    accent: '#22D3EE',
  },
  {
    step: '03',
    name: 'RECONSTRUCT & DEFEND',
    tag: 'ACTIVE SIMULATION',
    desc: 'Order the chronological incident timeline against MITRE ATT&CK techniques, then reallocate security controls to neutralize the adversary.',
    icon: ShieldCheck,
    path: '/reconstruct',
    accent: '#F59E0B',
  },
]

export default function HowItWorks() {
  const navigate = useNavigate()

  return (
    <section className="relative py-16 bg-[#080A0A] border-y border-[#1F2937]/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B7FF3C]/5 border border-[#B7FF3C]/20 text-[10px] font-mono tracking-[0.25em] text-[#B7FF3C] mb-3">
            INVESTIGATION METHODOLOGY
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
            HOW <span className="text-[#B7FF3C]">TRACE//ZERO</span> WORKS
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#9CA3AF] font-mono">
            A three-phase forensic simulation modeled after tier-3 DFIR incident response workflows.
          </p>
        </div>

        {/* 3-Step Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 relative">
          {STAGES.map((s, idx) => {
            const Icon = s.icon

            return (
              <motion.div
                key={s.step}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                onClick={() => navigate(s.path)}
                className="group relative border border-[#1A2222] bg-[#0A0D0D] p-6 hover:border-[#B7FF3C]/40 hover:bg-[#0D1212] transition-all cursor-pointer flex flex-col justify-between"
              >
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 border flex items-center justify-center transition-colors"
                    style={{ borderColor: `${s.accent}40`, backgroundColor: `${s.accent}10` }}
                  >
                    <Icon size={18} style={{ color: s.accent }} />
                  </div>
                  <span className="text-2xl font-mono font-black text-[#1F2937] group-hover:text-[#374151] transition-colors">
                    {s.step}
                  </span>
                </div>

                <div>
                  <span className="text-[9px] font-mono tracking-[0.2em] text-[#6B7280] block mb-1">
                    {s.tag}
                  </span>
                  <h3 className="text-base font-mono font-bold text-white tracking-wide mb-2 group-hover:text-[#B7FF3C] transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-xs text-[#D1D5DB] leading-relaxed font-sans mb-6">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#141A1A] flex items-center justify-between text-[10px] font-mono tracking-widest text-[#6B7280] group-hover:text-[#B7FF3C] transition-colors">
                  <span>LAUNCH PHASE {s.step}</span>
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
