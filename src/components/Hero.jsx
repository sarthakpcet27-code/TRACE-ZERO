import { motion } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronRight, ShieldAlert } from 'lucide-react'
import ForensicRadar from './ForensicRadar'
import FloatingAlert from './FloatingAlert'
import SystemHUD from './SystemHUD'

/* ═══════════════════════════════════════════════════════════════
   Hero — Cinematic full-viewport intro section
   ═══════════════════════════════════════════════════════════════ */

// Staggered headline word with blur-to-sharp + vertical slide
function HeroWord({ children, delay, className = '' }) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ opacity: 0, y: 14, filter: 'blur(5px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  )
}

export default function Hero() {
  const navigate = useNavigate()

  const metadata = [
    { label: 'CASE ID', value: 'TR-2049' },
    { label: 'TARGET', value: 'NEXORA TECHNOLOGIES' },
    { label: 'BREACH TIME', value: '02:14 UTC' },
    { label: 'STATUS', value: 'UNRESOLVED', highlight: true },
  ]

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        paddingTop: 'clamp(5.5rem, 10vh, 7.5rem)',
        paddingBottom: 'clamp(3rem, 6vh, 5rem)',
      }}
    >
      {/* ── Cinematic multi-layered background ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Animated subtle grid */}
        <div className="absolute inset-0 grid-bg-animated" />

        {/* Ambient radial lighting (acid green core glow) */}
        <div className="absolute top-1/2 left-[58%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#B7FF3C]/[0.02] rounded-full blur-[140px]" />

        {/* Secondary ambient glow (electric cyan accent) */}
        <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-[#22D3EE]/[0.015] rounded-full blur-[120px]" />

        {/* Deep background vignetting */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#080A0A] via-[#080A0A]/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#080A0A] via-[#080A0A]/80 to-transparent" />

        {/* Horizontal security radar scan effect */}
        <div className="hero-scan-line" />
      </div>

      {/* ── Main content container (strictly aligned with max-w-7xl) ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-8 items-center">

          {/* ═══ LEFT COLUMN: Text Content ═══ */}
          <div className="w-full max-w-[580px] mx-auto lg:mx-0">
            {/* Tagline & Technical Header */}
            <motion.div
              className="flex items-center gap-2.5 mb-5 sm:mb-6 flex-wrap"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#B7FF3C]/10 border border-[#B7FF3C]/30 text-[9px] sm:text-[10px] font-mono tracking-[0.25em] text-[#B7FF3C] font-semibold">
                <ShieldAlert size={11} />
                CASE #TR-2049 DIRECTIVE
              </span>
              <div className="w-6 h-[1px] bg-[#1F2937] hidden sm:block" />
              <span className="text-[10px] font-mono tracking-[0.2em] text-[#9CA3AF] uppercase">
                EVERY BREACH LEAVES A TRACE.
              </span>
            </motion.div>

            {/* ── Headline with staggered reveal ── */}
            <h1 className="mb-5 sm:mb-7 leading-[0.95] tracking-tight font-sans">
              <span className="block text-[clamp(2.2rem,5vw,4.5rem)] font-black text-white">
                <HeroWord delay={0.2}>THE </HeroWord>
                <HeroWord delay={0.35} className="text-[#B7FF3C] text-glow-green">TRUTH </HeroWord>
                <HeroWord delay={0.45}>IS </HeroWord>
              </span>
              <span className="block text-[clamp(2.2rem,5vw,4.5rem)] font-black text-white">
                <HeroWord delay={0.55}>HIDDEN IN </HeroWord>
                <HeroWord delay={0.7} className="text-[#B7FF3C] text-glow-green">DATA.</HeroWord>
              </span>
            </h1>

            {/* Engaging Description */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 }}
            >
              <p className="text-[#CBD5E1] text-sm sm:text-base leading-relaxed mb-3 max-w-lg font-sans">
                A catastrophic digital infiltration has compromised NEXORA Technologies' classified Project Helios.
                Evidence is fragmented across encrypted networks, memory dumps, and corrupted event logs.
              </p>
              <p className="text-[#9CA3AF] text-xs sm:text-sm leading-relaxed mb-8 sm:mb-9 max-w-lg font-mono">
                Investigate artifacts, correlate clues, reconstruct the timeline, and simulate active defense.
              </p>
            </motion.div>

            {/* ── Action Buttons ── */}
            <motion.div
              className="flex flex-col xs:flex-row flex-wrap items-stretch xs:items-center gap-3 sm:gap-4 mb-8 sm:mb-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              {/* Primary CTA — INITIALIZE INVESTIGATION */}
              <motion.button
                onClick={() => navigate('/investigate')}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ y: 0, scale: 0.98 }}
                className="group relative flex items-center justify-center gap-3 text-[12px] sm:text-[13px] font-mono tracking-[0.18em] font-bold text-[#080A0A] bg-[#B7FF3C] px-7 sm:px-9 py-4 cursor-pointer transition-all duration-300 hover:bg-[#c8ff66] shadow-[0_0_30px_rgba(183,255,60,0.3)] hover:shadow-[0_0_50px_rgba(183,255,60,0.5)]"
              >
                INITIALIZE INVESTIGATION
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              </motion.button>

              {/* Secondary CTA — OPEN EVIDENCE LAB */}
              <motion.button
                onClick={() => navigate('/lab')}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ y: 0, scale: 0.98 }}
                className="group flex items-center justify-center gap-3 text-[12px] sm:text-[13px] font-mono tracking-[0.18em] font-semibold text-white border-2 border-[#B7FF3C]/50 bg-[#B7FF3C]/[0.06] px-7 sm:px-9 py-4 cursor-pointer transition-all duration-300 hover:text-[#B7FF3C] hover:border-[#B7FF3C] hover:bg-[#B7FF3C]/[0.12] hover:shadow-[0_0_30px_rgba(183,255,60,0.2)]"
              >
                OPEN EVIDENCE LAB
                <ChevronRight size={16} className="text-[#B7FF3C]/60 transition-all duration-300 group-hover:text-[#B7FF3C] group-hover:translate-x-1" />
              </motion.button>
            </motion.div>

            {/* ── Technical Metadata Strip ── */}
            <motion.div
              className="flex flex-wrap gap-x-5 sm:gap-x-6 gap-y-2 border-t border-[#1F2937]/70 pt-5 sm:pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.15 }}
            >
              {metadata.map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-[9px] font-mono tracking-[0.2em] text-[#6B7280]">
                    {item.label}:
                  </span>
                  <span className={`text-[10px] font-mono tracking-wider font-semibold ${
                    item.highlight ? 'text-[#F59E0B]' : 'text-[#CBD5E1]'
                  }`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ═══ RIGHT COLUMN: Large Interactive Forensic Radar ═══ */}
          <motion.div
            className="relative flex justify-center lg:justify-end w-full"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[560px] xl:max-w-[620px]">
              {/* Radar centerpiece */}
              <ForensicRadar />

              {/* Floating incident alert panel */}
              <FloatingAlert />

              {/* Live technical system HUD */}
              <SystemHUD />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
