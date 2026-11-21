import { motion } from 'motion/react'
import {
  KeyRound,
  ShieldAlert,
  UserCheck,
  Cpu,
  Wifi,
  Database,
  Check,
  Lock,
  Layers,
  ArrowRight,
} from 'lucide-react'

const ICON_MAP = {
  KeyRound,
  ShieldAlert,
  UserCheck,
  Cpu,
  Wifi,
  Database,
}

export default function ControlCard({
  control,
  isSelected,
  onToggle,
  canAfford,
  onHover,
  onLeave,
}) {
  const Icon = ICON_MAP[control.iconName] || KeyRound
  const isDisabled = !isSelected && !canAfford

  return (
    <motion.div
      layout
      whileHover={!isDisabled ? { y: -2 } : {}}
      transition={{ duration: 0.15 }}
      onMouseEnter={() => onHover && onHover(control.id)}
      onMouseLeave={() => onLeave && onLeave()}
      onClick={() => {
        if (!isDisabled) onToggle(control.id)
      }}
      className={`relative p-4 border transition-all duration-200 select-none ${
        isSelected
          ? 'border-[#B7FF3C] bg-[#B7FF3C]/[0.05] shadow-[0_0_25px_rgba(183,255,60,0.12)] cursor-pointer'
          : isDisabled
            ? 'border-[#1a2222] bg-[#080B0B]/60 opacity-50 cursor-not-allowed'
            : 'border-[#1a2222] bg-[#0A0D0D] hover:border-[#2A3A2A] hover:bg-[#0E1212] cursor-pointer'
      }`}
    >
      {/* Corner indicators for selected state */}
      {isSelected && (
        <>
          <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-[#B7FF3C]" />
          <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-[#B7FF3C]" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-[#B7FF3C]" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-[#B7FF3C]" />
        </>
      )}

      {/* Top Header: Category & Cost & Toggle */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <span
            className="text-[8px] font-mono tracking-widest px-1.5 py-0.5 border"
            style={{
              color: control.accentColor,
              borderColor: `${control.accentColor}30`,
              backgroundColor: `${control.accentColor}08`,
            }}
          >
            {control.category}
          </span>
          <span className="text-[8px] font-mono text-[#4B5563] hidden xs:inline">
            {control.code}
          </span>
        </div>

        {/* Cost & Toggle Switch */}
        <div className="flex items-center gap-2">
          <span
            className={`text-[9px] font-mono font-bold px-2 py-0.5 border ${
              isSelected
                ? 'border-[#B7FF3C]/50 text-[#B7FF3C] bg-[#B7FF3C]/10'
                : 'border-[#1a2222] text-[#9CA3AF] bg-[#060808]'
            }`}
          >
            {control.cost} {control.cost === 1 ? 'PT' : 'PTS'}
          </span>

          {/* Toggle pill */}
          <div
            className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center ${
              isSelected ? 'bg-[#B7FF3C]' : 'bg-[#1a2222]'
            }`}
          >
            <motion.div
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                isSelected
                  ? 'translate-x-4 bg-[#080A0A]'
                  : 'translate-x-0 bg-[#6B7280]'
              }`}
            >
              {isSelected ? (
                <Check size={10} className="text-[#B7FF3C] stroke-[3]" />
              ) : isDisabled ? (
                <Lock size={8} className="text-[#1a2222]" />
              ) : null}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Control Name & Icon */}
      <div className="flex items-start gap-2.5 mb-2">
        <div
          className={`w-8 h-8 shrink-0 border flex items-center justify-center transition-colors ${
            isSelected
              ? 'border-[#B7FF3C]/50 bg-[#B7FF3C]/10'
              : 'border-[#1a2222] bg-[#060808]'
          }`}
        >
          <Icon
            size={16}
            style={{ color: isSelected ? '#B7FF3C' : control.accentColor }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-mono font-bold tracking-wider text-white">
            {control.name}
          </h4>
          <span className="text-[8px] font-mono text-[#6B7280] tracking-widest">
            {control.id} // {control.cost} POINT DEPLOYMENT
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-[10px] font-mono text-[#9CA3AF] leading-relaxed mb-3">
        {control.description}
      </p>

      {/* Simulation Impact Banner */}
      <div
        className={`p-2 border text-[9px] font-mono leading-relaxed transition-colors ${
          isSelected
            ? 'border-[#B7FF3C]/30 bg-[#B7FF3C]/[0.06] text-[#D1D5DB]'
            : 'border-[#141A1A] bg-[#060808] text-[#6B7280]'
        }`}
      >
        <span
          className="font-bold tracking-wider mr-1"
          style={{ color: isSelected ? '#B7FF3C' : control.accentColor }}
        >
          IMPACT:
        </span>
        {control.simulationImpact}
      </div>

      {/* Affected Stages tags */}
      <div className="mt-2.5 pt-2 border-t border-[#141A1A] flex flex-wrap items-center gap-1.5 text-[8px] font-mono">
        <span className="text-[#4B5563]">AFFECTS:</span>
        {control.affectedStageIds.map((stageId) => (
          <span
            key={stageId}
            className={`px-1.5 py-0.2 border ${
              isSelected
                ? 'border-[#B7FF3C]/40 text-[#B7FF3C] bg-[#B7FF3C]/10'
                : 'border-[#1a2222] text-[#9CA3AF]'
            }`}
          >
            {stageId}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
