import { motion } from 'motion/react'
import { Wifi, AlertTriangle, Globe } from 'lucide-react'

export default function NetworkViewer({ evidence }) {
  const conn = evidence.content.connection
  const geo = evidence.content.geoInfo

  return (
    <div className="space-y-5">
      {/* Connection Diagram */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-4 h-[1px] bg-[#DC2626]/40" />
          <span className="text-[9px] font-mono tracking-[0.3em] text-[#6B7280]">CONNECTION VISUALIZATION</span>
        </div>
        <div className="border border-[#1a2222] bg-[#060808] p-6 overflow-hidden">
          <svg viewBox="0 0 400 100" className="w-full" style={{ maxHeight: '120px' }}>
            {/* Connection line */}
            <line x1="80" y1="50" x2="320" y2="50" stroke="#1F2937" strokeWidth="1" strokeDasharray="6 4" />
            <motion.line
              x1="80" y1="50" x2="320" y2="50"
              stroke="#DC2626" strokeWidth="1.5" strokeDasharray="6 4"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Travelling packet */}
            <motion.circle
              r="4" fill="#DC2626"
              animate={{ cx: [80, 320], cy: [50, 50], opacity: [1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />

            {/* Source node */}
            <circle cx="60" cy="50" r="18" fill="none" stroke="#B7FF3C" strokeWidth="0.8" opacity="0.4" />
            <circle cx="60" cy="50" r="8" fill="#B7FF3C" opacity="0.7" />
            <text x="60" y="82" textAnchor="middle" fill="#B7FF3C" fontSize="8" fontFamily="'JetBrains Mono', monospace">NX-WKS-07</text>
            <text x="60" y="92" textAnchor="middle" fill="#374151" fontSize="7" fontFamily="'JetBrains Mono', monospace">10.4.1.22</text>

            {/* Dest node */}
            <motion.circle
              cx="340" cy="50" r="18" fill="none" stroke="#DC2626" strokeWidth="0.8"
              animate={{ opacity: [0.3, 0.6, 0.3], r: [18, 22, 18] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <circle cx="340" cy="50" r="8" fill="#DC2626" opacity="0.8" />
            <text x="340" y="82" textAnchor="middle" fill="#DC2626" fontSize="8" fontFamily="'JetBrains Mono', monospace">EXTERNAL</text>
            <text x="340" y="92" textAnchor="middle" fill="#374151" fontSize="7" fontFamily="'JetBrains Mono', monospace">185.220.101.5</text>

            {/* Transfer label */}
            <rect x="160" y="30" width="80" height="18" rx="1" fill="#DC2626" opacity="0.15" stroke="#DC2626" strokeWidth="0.5" />
            <text x="200" y="43" textAnchor="middle" fill="#DC2626" fontSize="8" fontFamily="'JetBrains Mono', monospace" fontWeight="bold">1.46 GB ▸</text>

            {/* Direction arrow */}
            <polygon points="310,50 300,44 300,56" fill="#DC2626" opacity="0.6" />
          </svg>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Connection details */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Wifi size={10} className="text-[#6B7280]" />
            <span className="text-[9px] font-mono tracking-[0.3em] text-[#6B7280]">CONNECTION DETAILS</span>
          </div>
          <div className="border border-[#1a2222] divide-y divide-[#111818]">
            {[
              { label: 'SOURCE', value: conn.source, color: '#9CA3AF' },
              { label: 'DESTINATION', value: conn.destination, color: '#DC2626' },
              { label: 'PORT', value: conn.port },
              { label: 'PROTOCOL', value: conn.protocol },
              { label: 'TIME', value: conn.time },
              { label: 'DURATION', value: conn.duration },
              { label: 'TRANSFER', value: conn.transfer, color: '#DC2626' },
              { label: 'DIRECTION', value: conn.direction },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between px-3 py-2">
                <span className="text-[8px] font-mono tracking-widest text-[#374151]">{r.label}</span>
                <span className="text-[10px] font-mono" style={{ color: r.color || '#6B7280' }}>{r.value}</span>
              </div>
            ))}
            <div className="flex items-center justify-between px-3 py-2 bg-[#DC2626]/[0.04]">
              <span className="text-[8px] font-mono tracking-widest text-[#374151]">STATUS</span>
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#DC2626] border border-[#DC2626]/30 px-2 py-0.5">{conn.status}</span>
            </div>
          </div>
        </div>

        {/* Threat intelligence */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Globe size={10} className="text-[#6B7280]" />
            <span className="text-[9px] font-mono tracking-[0.3em] text-[#6B7280]">THREAT INTELLIGENCE</span>
          </div>
          <div className="border border-[#1a2222] divide-y divide-[#111818]">
            {[
              { label: 'COUNTRY', value: geo.country },
              { label: 'ASN', value: geo.asn, color: '#DC2626' },
              { label: 'REGISTRAR', value: geo.registrar },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between px-3 py-2">
                <span className="text-[8px] font-mono tracking-widest text-[#374151]">{r.label}</span>
                <span className="text-[10px] font-mono" style={{ color: r.color || '#6B7280' }}>{r.value}</span>
              </div>
            ))}
            <div className="px-3 py-3 bg-[#DC2626]/[0.03]">
              <div className="flex items-start gap-2">
                <AlertTriangle size={11} className="text-[#DC2626] shrink-0 mt-0.5" />
                <p className="text-[10px] font-mono text-[#DC2626] leading-relaxed">{geo.threatIntel}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
