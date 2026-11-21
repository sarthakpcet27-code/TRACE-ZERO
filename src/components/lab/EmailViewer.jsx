/* ═══════════════════════════════════════════════════════════════
   EmailViewer — TRACE//ZERO Evidence Lab
   Rich email forensic inspector with deep header validation (SPF/DKIM/DMARC),
   originating IP lookup, and malicious attachment quarantined inspection.
   ═══════════════════════════════════════════════════════════════ */

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Mail, Paperclip, AlertTriangle, Clock, ShieldAlert, CheckCircle2, XCircle, Info, ChevronDown, ChevronUp } from 'lucide-react'

export default function EmailViewer({ evidence }) {
  const c = evidence.content
  const [showFullHeaders, setShowFullHeaders] = useState(false)

  const headerChecks = [
    { label: 'SPF AUTHENTICATION', status: 'FAIL', detail: 'IP 185.220.101.5 not authorized for corp-payroll-support.com', ok: false },
    { label: 'DKIM SIGNATURE', status: 'FAIL', detail: 'Signature hash verification failed (header tampering detected)', ok: false },
    { label: 'DMARC POLICY', status: 'REJECT', detail: 'P=REJECT directive violated; forged sender domain', ok: false },
    { label: 'GEO / IP REPUTATION', status: 'MALICIOUS', detail: 'Origin IP 185.220.101.5 flagged as active Tor Exit Node', ok: false },
  ]

  return (
    <div className="space-y-5">
      {/* ── Security Banner ── */}
      <div className="border border-[#DC2626]/40 bg-[#DC2626]/[0.06] p-3.5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldAlert size={16} className="text-[#DC2626]" />
          <span className="text-[11px] font-mono font-bold text-[#DC2626] tracking-wider">
            HIGH SEVERITY PHISHING ARTIFACT DETECTED
          </span>
        </div>
        <span className="text-[9px] font-mono bg-[#DC2626]/20 text-[#DC2626] px-2 py-0.5 border border-[#DC2626]/40 font-bold tracking-widest">
          SCORE: 9.8 / 10 CVSS
        </span>
      </div>

      {/* ── Envelope Headers Table ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-[1px] bg-[#DC2626]" />
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#9CA3AF]">
              EMAIL ENVELOPE METADATA
            </span>
          </div>
          <button
            onClick={() => setShowFullHeaders(!showFullHeaders)}
            className="flex items-center gap-1 text-[9px] font-mono text-[#22D3EE] hover:underline cursor-pointer"
          >
            {showFullHeaders ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            <span>{showFullHeaders ? 'HIDE EXTENDED HEADERS' : 'ANALYZE RAW HEADERS'}</span>
          </button>
        </div>

        <div className="border border-[#1a2222] bg-[#060808] divide-y divide-[#111818]">
          {[
            { label: 'FROM', value: c.from, alert: true, sub: 'SPOOFED SENDER' },
            { label: 'TO', value: c.to, alert: false, sub: 'TARGET: LEAD RESEARCHER' },
            { label: 'REPLY-TO', value: c.replyTo || 'admin-drop@185.220.101.5', alert: true, sub: 'UNVERIFIED EXTERNAL INBOX' },
            { label: 'SUBJECT', value: c.subject, alert: false, sub: 'SOCIAL ENGINEERING LURE' },
            { label: 'TIMESTAMP', value: c.time, alert: false, sub: '02:08:14 UTC (6 MIN PRIOR TO EXFIL)' },
          ].map((row) => (
            <div key={row.label} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 px-4 py-2.5">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-mono tracking-[0.2em] text-[#6B7280] w-20 shrink-0 font-bold">
                  {row.label}
                </span>
                <span className={`text-xs font-mono break-all ${row.alert ? 'text-[#DC2626] font-semibold' : 'text-[#D1D5DB]'}`}>
                  {row.value}
                </span>
              </div>
              <span className={`text-[8px] font-mono tracking-widest px-2 py-0.5 border self-start sm:self-auto ${
                row.alert
                  ? 'border-[#DC2626]/40 text-[#DC2626] bg-[#DC2626]/10'
                  : 'border-[#1F2937] text-[#6B7280] bg-[#0A0D0D]'
              }`}>
                {row.sub}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Extended Raw Header Inspection Drawer ── */}
      <AnimatePresence>
        {showFullHeaders && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden space-y-3"
          >
            <div className="border border-[#1F2937] bg-[#040606] p-4 font-mono text-[10px] space-y-2">
              <p className="text-[9px] tracking-widest text-[#B7FF3C] font-bold">
                FORENSIC RFC-822 VALIDATION SUITE:
              </p>
              <div className="grid sm:grid-cols-2 gap-2 pt-1">
                {headerChecks.map((check) => (
                  <div key={check.label} className="border border-[#1F2937] bg-[#080A0A] p-2.5 flex items-start gap-2.5">
                    <XCircle size={14} className="text-[#DC2626] shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-white">{check.label}</span>
                        <span className="text-[8px] text-[#DC2626] font-bold bg-[#DC2626]/10 px-1 border border-[#DC2626]/30">
                          {check.status}
                        </span>
                      </div>
                      <p className="text-[9px] text-[#9CA3AF] mt-0.5 leading-normal">
                        {check.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border border-[#141A1A] bg-[#030404] text-[9px] text-[#6B7280]">
                Message-ID: &lt;20491120020814.99281@corp-payroll-support.com&gt; | Client: Outlook 16.0.4266
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Email Body Content ── */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-[1px] bg-[#B7FF3C]/50" />
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#9CA3AF]">
            MESSAGE BODY (SANITIZED VIEW)
          </span>
        </div>
        <div className="border border-[#1a2222] bg-[#060808] p-5">
          <p className="text-xs sm:text-sm text-[#D1D5DB] leading-relaxed whitespace-pre-line font-mono">
            {c.body}
          </p>
        </div>
      </div>

      {/* ── Malicious Attachment Card ── */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-[1px] bg-[#F59E0B]" />
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#9CA3AF]">
            EXTRACTED MALWARE PAYLOAD
          </span>
        </div>
        <div className="border border-[#F59E0B]/30 bg-[#F59E0B]/[0.04] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[#F59E0B]/50 bg-[#F59E0B]/10 flex items-center justify-center shrink-0">
              <Paperclip size={18} className="text-[#F59E0B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-white tracking-wider">
                  {c.attachment}
                </span>
                <span className="text-[8px] font-mono text-[#F59E0B] border border-[#F59E0B]/40 px-1.5 py-0.2 bg-[#F59E0B]/10 font-bold">
                  SUSPICIOUS EXTENSION (.pdf.exe)
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#9CA3AF] mt-0.5">
                SHA-256: 4a8b79e2c1409f7a932d5612bb1e8932fc40384a29a1740d993e5021db912ff4
              </p>
            </div>
          </div>
          <span className="text-[9px] font-mono text-[#DC2626] border border-[#DC2626]/40 px-2 py-1 bg-[#DC2626]/10 font-bold tracking-widest shrink-0">
            QUARANTINED BY EDR
          </span>
        </div>
      </div>
    </div>
  )
}
