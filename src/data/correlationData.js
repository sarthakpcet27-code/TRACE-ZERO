/* ═══════════════════════════════════════════════════════════════
   Correlation Data & Evaluation Engine — TRACE//ZERO Case #TR-2049
   All data is FICTIONAL. No real networks or cybersecurity claims.
   ═══════════════════════════════════════════════════════════════ */

import { Mail, Key, FileText, Cpu, Wifi, Shield } from 'lucide-react'

// Relationship classifications available to the investigator
export const RELATIONSHIP_TYPES = {
  CAUSED_OR_INITIATED: {
    id: 'CAUSED_OR_INITIATED',
    label: 'CAUSED OR INITIATED',
    shortLabel: 'CAUSAL',
    color: '#EF4444', // Red/Amber
    strokeDash: 'none',
    description: 'One forensic event directly triggered, enabled, or executed the subsequent activity.',
  },
  TEMPORAL_SEQUENCE: {
    id: 'TEMPORAL_SEQUENCE',
    label: 'TEMPORAL SEQUENCE',
    shortLabel: 'TIMELINE',
    color: '#22D3EE', // Electric Cyan
    strokeDash: '4 4',
    description: 'Events occurred in immediate chronological sequence demonstrating step-by-step adversary progression.',
  },
  SAME_SOURCE_OR_ACCOUNT: {
    id: 'SAME_SOURCE_OR_ACCOUNT',
    label: 'SAME SOURCE OR ACCOUNT',
    shortLabel: 'IDENTITY',
    color: '#10B981', // Muted Emerald
    strokeDash: 'none',
    description: 'Events share identical credentials (s.mercer), workstation IP (10.4.1.22), or machine identifier.',
  },
  SUPPORTS_A_HYPOTHESIS: {
    id: 'SUPPORTS_A_HYPOTHESIS',
    label: 'SUPPORTS A HYPOTHESIS',
    shortLabel: 'HYPOTHESIS',
    color: '#B7FF3C', // Acid Green
    strokeDash: '6 3',
    description: 'Corroborating forensic evidence validating an investigator theory of the intrusion.',
  },
  SUSPICIOUS_ASSOCIATION: {
    id: 'SUSPICIOUS_ASSOCIATION',
    label: 'SUSPICIOUS ASSOCIATION',
    shortLabel: 'ANOMALY',
    color: '#F59E0B', // Amber
    strokeDash: '2 2',
    description: 'Anomalous co-occurrence or behavioral correlation indicating coordinated anti-forensics or reconnaissance.',
  },
}

// 6 Core Evidence Nodes with canvas coordinates (920 x 540 virtual space)
export const CORRELATION_NODES = [
  {
    id: 'E-01',
    title: 'Suspicious Email',
    subtitle: 'Phishing Infiltration',
    category: 'EMAIL',
    source: 'MX-NXR-01',
    time: '01:58 UTC',
    x: 150,
    y: 110,
    accentColor: '#DC2626',
    icon: 'Mail',
    summary: 'Spearphishing delivery with weaponized PDF attachment posing as an urgent IT access review.',
  },
  {
    id: 'E-02',
    title: 'Authentication Logs',
    subtitle: 'Privilege Escalation',
    category: 'AUTH LOGS',
    source: 'NX-AUTH-01',
    time: '02:13 UTC',
    x: 460,
    y: 90,
    accentColor: '#F59E0B',
    icon: 'Key',
    summary: 'Duplicate after-hours authentication on NX-WKS-07 followed by escalation to VAULT-ADMIN role.',
  },
  {
    id: 'E-04',
    title: 'Endpoint Activity',
    subtitle: 'LSASS Credential Dump',
    category: 'ENDPOINT',
    source: 'NX-WKS-07',
    time: '02:14 UTC',
    x: 270,
    y: 350,
    accentColor: '#F59E0B',
    icon: 'Cpu',
    summary: 'Memory read against LSASS.exe PID 4092, followed by invocation of log clearing tools.',
  },
  {
    id: 'E-03',
    title: 'File Access Records',
    subtitle: 'CipherVault Extraction',
    category: 'FILE ACCESS',
    source: 'NX-VAULT-03',
    time: '02:14 UTC',
    x: 640,
    y: 220,
    accentColor: '#22D3EE',
    icon: 'FileText',
    summary: 'Classified keymap accessed and 2,847 rows of CipherVault queried and staged to local disk.',
  },
  {
    id: 'E-05',
    title: 'Network Traffic',
    subtitle: '1.46 GB Exfiltration',
    category: 'NETWORK',
    source: 'NX-FW-01',
    time: '02:14:08 UTC',
    x: 770,
    y: 410,
    accentColor: '#DC2626',
    icon: 'Wifi',
    summary: 'High-volume outbound TLS 1.3 stream to anonymous staging relay 185.220.101.5.',
  },
  {
    id: 'E-06',
    title: 'Security & Audit Records',
    subtitle: 'Log Tampering & Purge',
    category: 'AUDIT',
    source: 'NX-SIEM-01',
    time: '02:14:33 UTC',
    x: 480,
    y: 440,
    accentColor: '#F59E0B',
    icon: 'Shield',
    summary: 'Correlated SIEM alert flagging 318 purged entries and hash verification failure.',
  },
]

// Benchmark valid canonical connections based on fictional breach logic
export const BENCHMARK_RELATIONSHIPS = [
  {
    pair: ['E-01', 'E-02'],
    acceptedTypes: ['CAUSED_OR_INITIATED', 'TEMPORAL_SEQUENCE', 'SAME_SOURCE_OR_ACCOUNT'],
    significance: 'CRITICAL',
    feedback: 'RELATIONSHIP RECORDED. Spearphishing payload delivery aligns directly with the subsequent after-hours compromise of s.mercer credentials.',
  },
  {
    pair: ['E-02', 'E-04'],
    acceptedTypes: ['CAUSED_OR_INITIATED', 'SAME_SOURCE_OR_ACCOUNT', 'TEMPORAL_SEQUENCE'],
    significance: 'CRITICAL',
    feedback: 'EVIDENCE LINK ESTABLISHED. Authenticated session on NX-WKS-07 immediately initiated credential harvesting via LSASS injection.',
  },
  {
    pair: ['E-04', 'E-03'],
    acceptedTypes: ['CAUSED_OR_INITIATED', 'SUPPORTS_A_HYPOTHESIS', 'TEMPORAL_SEQUENCE'],
    significance: 'CRITICAL',
    feedback: 'CORROBORATES ATTACK CHRONOLOGY. Harvested Tier-3 credentials enabled unauthorized bulk access to CipherVault database tables.',
  },
  {
    pair: ['E-03', 'E-05'],
    acceptedTypes: ['CAUSED_OR_INITIATED', 'TEMPORAL_SEQUENCE', 'SUPPORTS_A_HYPOTHESIS'],
    significance: 'CRITICAL',
    feedback: 'EVIDENCE LINK ESTABLISHED. 1.14 GB database export was staged and matched the 1.46 GB external transmission to 185.220.101.5.',
  },
  {
    pair: ['E-04', 'E-06'],
    acceptedTypes: ['CAUSED_OR_INITIATED', 'TEMPORAL_SEQUENCE', 'SUPPORTS_A_HYPOTHESIS'],
    significance: 'SIGNIFICANT',
    feedback: 'RELATIONSHIP ADDED TO CASE FILE. Endpoint execution of wevtutil.exe directly accounts for the 318 purged security event logs.',
  },
  {
    pair: ['E-02', 'E-06'],
    acceptedTypes: ['SAME_SOURCE_OR_ACCOUNT', 'TEMPORAL_SEQUENCE', 'SUSPICIOUS_ASSOCIATION'],
    significance: 'SIGNIFICANT',
    feedback: 'RELATIONSHIP RECORDED. The suspect session abruptly terminated immediately following log manipulation.',
  },
  {
    pair: ['E-05', 'E-06'],
    acceptedTypes: ['TEMPORAL_SEQUENCE', 'SUPPORTS_A_HYPOTHESIS', 'SUSPICIOUS_ASSOCIATION'],
    significance: 'SIGNIFICANT',
    feedback: 'CORROBORATES ATTACK CHRONOLOGY. Anti-forensic log destruction commenced within 25 seconds of exfiltration completion.',
  },
]

// Evaluation function
export function evaluateConnection(nodeAId, nodeBId, relationshipTypeId) {
  // Normalize pair key (e.g. E-01 and E-02)
  const a = nodeAId < nodeBId ? nodeAId : nodeBId
  const b = nodeAId < nodeBId ? nodeBId : nodeAId

  const match = BENCHMARK_RELATIONSHIPS.find(
    (bm) => (bm.pair[0] === a && bm.pair[1] === b) || (bm.pair[0] === b && bm.pair[1] === a)
  )

  if (match) {
    const isPreferredType = match.acceptedTypes.includes(relationshipTypeId)
    return {
      isValid: true,
      quality: isPreferredType ? 'verified' : 'plausible',
      feedback: match.feedback,
      significance: match.significance,
    }
  }

  // Not a canonical benchmark link, but plausible investigator hypothesis
  return {
    isValid: false,
    quality: 'unconfirmed',
    feedback: 'CONNECTION REQUIRES FURTHER INVESTIGATION. Correlation noted in working docket.',
    significance: 'TENTATIVE',
  }
}

// Progressive investigative hints
export const INVESTIGATION_HINTS = [
  {
    level: 1,
    title: 'Initial Access Vector',
    hint: 'Examine the timestamp difference between the arrival of the urgent Project Helios access review email (E-01) and the duplicate after-hours authentication event on NX-WKS-07 (E-02).',
  },
  {
    level: 2,
    title: 'Privilege Escalation & Memory Artifacts',
    hint: 'Look closely at what process was inspected in the endpoint logs (E-04, PID 4092) and how that credential dumping technique enabled unauthorized query access to the classified CipherVault database (E-03).',
  },
  {
    level: 3,
    title: 'Data Staging & Egress Volume',
    hint: 'Compare the size of the staged database export (E-03, 1.14 GB) with the egress burst logged by the perimeter firewall to 185.220.101.5 (E-05, 1.46 GB) occurring at 02:14:08 UTC.',
  },
  {
    level: 4,
    title: 'Anti-Forensics & Log Integrity',
    hint: 'Notice the execution of wevtutil.exe on workstation NX-WKS-07 (E-04) right after the data egress, which triggered the SIEM hash verification mismatch and the destruction of 318 security audit entries (E-06).',
  },
]
