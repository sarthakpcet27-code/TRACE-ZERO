/* ═══════════════════════════════════════════════════════════════
   MITRE ATT&CK Learning Cards — TRACE//ZERO
   Provides real-world DFIR context, technique IDs, and detection guidance.
   ═══════════════════════════════════════════════════════════════ */

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ShieldAlert, BookOpen, ChevronDown, ChevronUp, ExternalLink, Lightbulb } from 'lucide-react'

export const MITRE_TECHNIQUES = [
  {
    id: 'T1566.001',
    name: 'Spearphishing Attachment',
    tactic: 'Initial Access',
    severity: 'HIGH',
    summary: 'Adversaries send targeted emails with malicious attachments to gain entry.',
    whyItMatters:
      'In Case #TR-2049, the threat actor targeted engineer S. Mercer with a crafted executive PDF invoice. Opening the attachment triggered an obfuscated dropper payload.',
    detection:
      'Inspect email headers for SPF/DKIM/DMARC failures, scan attachments in a sandbox, and audit child processes spawned by PDF/Word readers (e.g. powershell.exe).',
  },
  {
    id: 'T1003.001',
    name: 'OS Credential Dumping: LSASS Memory',
    tactic: 'Credential Access',
    severity: 'CRITICAL',
    summary: 'Extracting credentials and Kerberos tickets stored in Local Security Authority Subsystem Service.',
    whyItMatters:
      'The adversary dumped plaintext passwords and NTLM hashes from memory on host 10.4.1.22 using a modified Mimikatz variant, escalating to domain admin privileges.',
    detection:
      'Enable LSA Protection (RunAsPPL), monitor for PROCESS_VM_READ access rights targeting lsass.exe, and alert on non-system accounts querying security subsystem memory.',
  },
  {
    id: 'T1021.004',
    name: 'Remote Services: SSH',
    tactic: 'Lateral Movement',
    severity: 'HIGH',
    summary: 'Moving across network segments using legitimate remote management protocols.',
    whyItMatters:
      'With dumped administrative credentials, the attacker pivoted from the compromised workstation into the isolated Project Helios cipher vault server via internal SSH.',
    detection:
      'Enforce strict Jump Host bastions, monitor for SSH logins originating from abnormal workstation subnets, and mandate hardware FIDO2 MFA on all internal shells.',
  },
  {
    id: 'T1041',
    name: 'Exfiltration Over C2 Channel',
    tactic: 'Exfiltration',
    severity: 'CRITICAL',
    summary: 'Stealing sensitive data by routing it through established command-and-control tunnels.',
    whyItMatters:
      '1.46 GB of Project Helios architecture binaries and encryption keys were egressed over an encrypted TLS 1.3 socket to external IP 185.220.101.5.',
    detection:
      'Deploy Network Traffic Analysis (NTA) for anomalous egress volume spikes, TLS certificate inspection, and automated DNS threat intelligence feeds.',
  },
  {
    id: 'T1070.001',
    name: 'Indicator Removal on Host: Clear Event Logs',
    tactic: 'Defense Evasion',
    severity: 'HIGH',
    summary: 'Clearing system logs to hinder digital forensic analysis and incident reconstruction.',
    whyItMatters:
      'Before terminating the session, the attacker executed wevtutil.exe cl Security, purging 318 log entries in an attempt to hide their lateral traversal path.',
    detection:
      'Stream event logs in real time to an off-host SIEM/WORM repository, alert immediately on Event ID 1102 (The audit log was cleared), and restrict wevtutil permissions.',
  },
]

export default function MitreAttackCard({ activeTechniqueId = null }) {
  const [expandedId, setExpandedId] = useState(activeTechniqueId || MITRE_TECHNIQUES[0].id)
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="border border-[#1F2937] bg-[#0A0D0D] overflow-hidden my-4">
      {/* Header bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#060808] border-b border-[#141A1A] cursor-pointer hover:bg-[#080B0B] transition-colors"
      >
        <div className="flex items-center gap-2">
          <ShieldAlert size={14} className="text-[#F59E0B]" />
          <span className="text-[11px] font-mono font-bold tracking-[0.2em] text-white">
            MITRE ATT&CK® FORENSIC LEARNING MATRIX
          </span>
          <span className="text-[9px] font-mono text-[#F59E0B] border border-[#F59E0B]/30 px-1.5 py-0.5 bg-[#F59E0B]/5 ml-2">
            WHY THIS MATTERS
          </span>
        </div>
        <div className="flex items-center gap-2 text-[#6B7280]">
          <span className="text-[9px] font-mono hidden sm:inline">
            {isOpen ? 'COLLAPSE' : 'EXPAND'}
          </span>
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="p-4 space-y-3"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {MITRE_TECHNIQUES.map((tech) => {
                const isSelected = expandedId === tech.id
                return (
                  <button
                    key={tech.id}
                    onClick={() => setExpandedId(tech.id)}
                    className={`text-left p-2.5 border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#B7FF3C] bg-[#B7FF3C]/10 text-white'
                        : 'border-[#1A2222] bg-[#060808] text-[#9CA3AF] hover:border-[#22D3EE]/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono font-bold text-[#B7FF3C]">
                        {tech.id}
                      </span>
                      <span
                        className="text-[8px] font-mono font-bold px-1"
                        style={{
                          color: tech.severity === 'CRITICAL' ? '#DC2626' : '#F59E0B',
                        }}
                      >
                        {tech.severity}
                      </span>
                    </div>
                    <p className="text-[11px] font-mono font-semibold truncate leading-tight">
                      {tech.name}
                    </p>
                    <p className="text-[8px] font-mono text-[#6B7280] mt-0.5">{tech.tactic}</p>
                  </button>
                )
              })}
            </div>

            {/* Selected technique deep-dive */}
            {expandedId && (
              <div className="border border-[#1A2222] bg-[#060808] p-4 mt-3 space-y-3">
                {(() => {
                  const current = MITRE_TECHNIQUES.find((t) => t.id === expandedId)
                  if (!current) return null
                  return (
                    <>
                      <div className="flex items-center justify-between border-b border-[#141A1A] pb-2">
                        <div>
                          <span className="text-[10px] font-mono text-[#22D3EE] tracking-widest">
                            {current.tactic.toUpperCase()} · TACTIC
                          </span>
                          <h4 className="text-sm font-mono font-bold text-white mt-0.5">
                            {current.id}: {current.name}
                          </h4>
                        </div>
                        <span className="text-[9px] font-mono text-[#9CA3AF] bg-[#141A1A] px-2 py-1">
                          REAL-WORLD IMPACT
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 pt-1">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[#B7FF3C] text-[10px] font-mono font-bold tracking-wider">
                            <Lightbulb size={12} />
                            <span>INCIDENT APPLICATION (CASE #TR-2049)</span>
                          </div>
                          <p className="text-xs text-[#D1D5DB] font-sans leading-relaxed">
                            {current.whyItMatters}
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-[#22D3EE] text-[10px] font-mono font-bold tracking-wider">
                            <BookOpen size={12} />
                            <span>DFIR DETECTION STRATEGY</span>
                          </div>
                          <p className="text-xs text-[#9CA3AF] font-sans leading-relaxed">
                            {current.detection}
                          </p>
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
