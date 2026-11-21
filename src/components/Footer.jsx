import SectionReveal from './SectionReveal'

export default function Footer() {
  return (
    <footer className="border-t border-[#1F2937]/50 py-10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <SectionReveal>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold tracking-[0.15em] text-[#6B7280]">
                TRACE<span className="text-[#B7FF3C]">//</span>ZERO
              </span>
              <span className="text-[9px] font-mono text-[#6B7280]/60">
                v1.0.0
              </span>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-[9px] font-mono tracking-[0.15em] text-[#6B7280]/60">
                DIGITAL FORENSICS SIMULATION
              </span>
              <span className="text-[9px] font-mono tracking-[0.15em] text-[#6B7280]/60">
                ALL DATA IS FICTIONAL
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B7FF3C] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#B7FF3C]" />
              </span>
              <span className="text-[9px] font-mono tracking-[0.2em] text-[#6B7280]">
                SYSTEM ACTIVE
              </span>
            </div>
          </div>
        </SectionReveal>
      </div>
    </footer>
  )
}

