import { motion, AnimatePresence } from 'motion/react'
import { Mail, Key, FileText, Cpu, Wifi, Shield, Check, X } from 'lucide-react'

const ICON_MAP = { Mail, Key, FileText, Cpu, Wifi, Shield }

function getStatusLabel(evidence, analyzedIds) {
  if (analyzedIds.has(evidence.id)) return { text: 'ANALYZED', color: '#B7FF3C' }
  if (evidence._opened) return { text: 'UNDER REVIEW', color: '#F59E0B' }
  return { text: 'UNOPENED', color: '#4B5563' }
}

function SidebarContent({ items, activeId, onSelect, analyzedIds }) {
  return (
    <>
      <div className="px-4 py-4 border-b border-[#1a2222]">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-[1px] bg-[#B7FF3C]/40" />
          <span className="text-[9px] font-mono tracking-[0.3em] text-[#6B7280]">CASE TR-2049</span>
        </div>
        <h3 className="text-xs font-bold tracking-[0.2em] text-white">EVIDENCE ARCHIVE</h3>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {items.map((item) => {
          const isActive = activeId === item.id
          const status = getStatusLabel(item, analyzedIds)
          const Icon = ICON_MAP[item.icon] || FileText

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors duration-150 cursor-pointer group ${
                isActive ? 'bg-[#0E1212]' : 'hover:bg-[#0A0D0D]'
              }`}
              style={{ borderLeft: isActive ? `2px solid ${item.accentColor}` : '2px solid transparent' }}
            >
              <div
                className="w-7 h-7 flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  backgroundColor: `${item.accentColor}08`,
                  border: `1px solid ${item.accentColor}20`,
                }}
              >
                <Icon size={12} style={{ color: item.accentColor }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[8px] font-mono text-[#374151]">{item.id}</span>
                  <span className="text-[8px] font-mono tracking-widest" style={{ color: status.color }}>
                    {status.text}
                  </span>
                  {analyzedIds.has(item.id) && <Check size={8} className="text-[#B7FF3C]" />}
                </div>
                <p className={`text-[11px] font-mono truncate transition-colors ${isActive ? 'text-white' : 'text-[#6B7280] group-hover:text-[#9CA3AF]'}`}>
                  {item.title}
                </p>
                <p className="text-[8px] font-mono text-[#2D3748] mt-0.5">{item.category}</p>
              </div>
            </button>
          )
        })}
      </div>
      <div className="px-4 py-3 border-t border-[#1a2222]">
        <span className="text-[8px] font-mono tracking-[0.2em] text-[#2D3748]">
          {analyzedIds.size} / {items.length} ANALYZED
        </span>
      </div>
    </>
  )
}

export default function EvidenceSidebar({ items, activeId, onSelect, analyzedIds, onToggleMobile, mobileOpen }) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] shrink-0 bg-[#060808] border-r border-[#1a2222] h-full overflow-hidden">
        <SidebarContent items={items} activeId={activeId} onSelect={onSelect} analyzedIds={analyzedIds} />
      </aside>

      {/* Mobile drawer overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/70 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggleMobile}
            />
            <motion.aside
              className="fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-[#060808] border-r border-[#1a2222] flex flex-col lg:hidden"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center justify-end p-3 border-b border-[#1a2222]">
                <button onClick={onToggleMobile} className="text-[#4B5563] hover:text-white transition-colors cursor-pointer">
                  <X size={16} />
                </button>
              </div>
              <SidebarContent
                items={items}
                activeId={activeId}
                onSelect={(id) => { onSelect(id); onToggleMobile() }}
                analyzedIds={analyzedIds}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
