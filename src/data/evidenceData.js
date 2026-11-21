/* ═══════════════════════════════════════════════════════════════
   Evidence Data — TRACE//ZERO Case #TR-2049
   All data is FICTIONAL. No real networks or accounts.
   ═══════════════════════════════════════════════════════════════ */

export const TOTAL_CLUES = 19

export const EVIDENCE_ITEMS = [
  {
    id: 'E-01',
    title: 'Suspicious Email',
    category: 'EMAIL',
    source: 'Mail Server — MX-NXR-01',
    timestamp: '2049-11-20 01:58:12 UTC',
    icon: 'Mail',
    accentColor: '#DC2626',
    content: {
      type: 'email',
      from: 'operations-update@nexora-support.example',
      to: 's.mercer@nexora.example',
      subject: 'Urgent — Project Helios Access Review',
      time: '01:58 AM',
      body: 'Your Project Helios permissions require immediate validation.\n\nPlease review the attached access verification document before the review window closes.\n\nFailure to confirm access may result in temporary access restrictions.\n\n— Nexora IT Operations',
      attachment: 'Helios_Access_Review.pdf',
      senderDomain: 'nexora-support.example (NOT nexora.example)',
      replyTo: 'ext-handler-3891@fwd.example',
    },
    clues: [
      { id: 'C01', text: 'Sender domain "nexora-support.example" does not match official "nexora.example"', importance: 'critical' },
      { id: 'C02', text: 'Email uses urgent language to pressure immediate action', importance: 'significant' },
      { id: 'C03', text: 'Attachment name references sensitive project access credentials', importance: 'significant' },
      { id: 'C04', text: 'Email was sent at 01:58 AM, outside standard business hours', importance: 'contextual' },
    ],
  },
  {
    id: 'E-02',
    title: 'Authentication Logs',
    category: 'AUTH LOGS',
    source: 'Identity Server — NX-AUTH-01',
    timestamp: '2049-11-20 01:42:00 — 02:15:02 UTC',
    icon: 'Key',
    accentColor: '#F59E0B',
    content: {
      type: 'logs',
      records: [
        { time: '01:42:11', event: 'LOGIN SUCCESS', account: 's.mercer@nexora.example', device: 'NX-WKS-07', status: 'normal', detail: 'Standard authentication via SSO portal.' },
        { time: '01:47:03', event: 'SESSION TOKEN CREATED', account: 's.mercer@nexora.example', device: 'NX-WKS-07', status: 'normal', detail: 'Session token issued. Expiry: 8h.' },
        { time: '02:13:44', event: 'LOGIN SUCCESS', account: 's.mercer@nexora.example', device: 'NX-WKS-07', status: 'suspicious', detail: 'Second authentication at 02:13 — after hours. Previous session still active.' },
        { time: '02:13:44', event: 'SESSION ACTIVITY FLAGGED', account: 's.mercer@nexora.example', device: 'NX-WKS-07', status: 'alert', detail: 'Concurrent session from same device. Triggered after-hours policy flag.' },
        { time: '02:14:52', event: 'PRIVILEGE ESCALATION', account: 's.mercer@nexora.example', device: 'NX-WKS-07', status: 'alert', detail: 'Elevated to VAULT-ADMIN role. Not in standard access profile.' },
        { time: '02:15:02', event: 'SESSION CLOSED', account: 's.mercer@nexora.example', device: 'NX-WKS-07', status: 'normal', detail: 'Session terminated. Duration: 1m 18s.' },
      ],
    },
    clues: [
      { id: 'C05', text: 'Duplicate login at 02:13:44 while a session was already active', importance: 'critical' },
      { id: 'C06', text: 'Privilege escalation to VAULT-ADMIN — not in standard access profile', importance: 'critical' },
      { id: 'C07', text: 'Extremely short session duration (1 min 18 sec) suggests automated activity', importance: 'significant' },
    ],
  },
  {
    id: 'E-03',
    title: 'File Access Records',
    category: 'FILE ACCESS',
    source: 'Vault Server — NX-VAULT-03',
    timestamp: '2049-11-20 02:13:51 — 02:14:41 UTC',
    icon: 'FileText',
    accentColor: '#22D3EE',
    content: {
      type: 'logs',
      records: [
        { time: '02:13:51', event: 'FILE ACCESS', path: '/vault/project-helios/specs_v9.pdf', size: '24.3 MB', status: 'suspicious', detail: 'Classified design document. Accessed outside review schedule.' },
        { time: '02:13:59', event: 'FILE ACCESS', path: '/vault/project-helios/keymap_final.bin', size: '8.1 MB', status: 'alert', detail: 'Encryption key mapping file. Highly restricted. Access requires dual authorization.' },
        { time: '02:14:11', event: 'DATABASE QUERY', path: 'CIPHER_VAULT (SELECT *)', size: '—', status: 'alert', detail: 'Full table export query on classified database. Returned 2,847 rows.' },
        { time: '02:14:11', event: 'RECORD COUNT', path: 'CIPHER_VAULT', size: '1.14 GB', status: 'alert', detail: 'Total export size: 1.14 GB. Transferred to staging directory.' },
        { time: '02:14:41', event: 'LOG MODIFICATION', path: 'event_log.db', size: '—', status: 'alert', detail: '318 event log entries purged. Anti-forensic behavior detected.' },
      ],
    },
    clues: [
      { id: 'C08', text: 'Encryption key file accessed without required dual authorization', importance: 'critical' },
      { id: 'C09', text: 'Full database export of CIPHER_VAULT — 2,847 classified rows', importance: 'critical' },
      { id: 'C10', text: '318 event log entries were deliberately purged — anti-forensic behavior', importance: 'critical' },
    ],
  },
  {
    id: 'E-04',
    title: 'Endpoint Activity',
    category: 'ENDPOINT',
    source: 'EDR Agent — NX-WKS-07',
    timestamp: '2049-11-20 02:14:03 — 02:14:33 UTC',
    icon: 'Cpu',
    accentColor: '#F59E0B',
    content: {
      type: 'logs',
      records: [
        { time: '02:14:03', event: 'PROCESS EVENT', process: 'lsass.exe', detail: 'Unusual memory read on LSASS process (PID 4092). Credential harvesting pattern detected.', status: 'alert', pid: '4092' },
        { time: '02:14:08', event: 'NETWORK EVENT', process: 'svchost.exe', detail: 'Outbound connection initiated to 185.220.101.5:443. Encrypted TLS tunnel established.', status: 'alert', pid: '2188' },
        { time: '02:14:11', event: 'FILE EVENT', process: 'cmd.exe', detail: 'Archive utility invoked: compress and stage vault contents to %TEMP% directory.', status: 'suspicious', pid: '5544' },
        { time: '02:14:33', event: 'SYSTEM ALERT', process: 'wevtutil.exe', detail: 'Event log clearing utility executed. Windows Security and Application logs targeted.', status: 'alert', pid: '6012' },
      ],
    },
    clues: [
      { id: 'C11', text: 'LSASS memory read indicates credential dumping technique (PID 4092)', importance: 'critical' },
      { id: 'C12', text: 'Encrypted outbound tunnel to external IP 185.220.101.5 established', importance: 'critical' },
      { id: 'C13', text: 'Windows event log clearing utility executed to destroy evidence', importance: 'significant' },
    ],
  },
  {
    id: 'E-05',
    title: 'Network Traffic',
    category: 'NETWORK',
    source: 'Firewall — NX-FW-01',
    timestamp: '2049-11-20 02:14:08 UTC',
    icon: 'Wifi',
    accentColor: '#DC2626',
    content: {
      type: 'network',
      connection: {
        source: 'NX-WKS-07 (10.4.1.22)',
        destination: '185.220.101.5',
        port: '443',
        protocol: 'TLS 1.3',
        time: '02:14:08',
        duration: '47 seconds',
        transfer: '1.46 GB',
        status: 'FLAGGED',
        direction: 'OUTBOUND',
      },
      geoInfo: {
        country: 'Unknown',
        asn: 'AS-DARKNET-RELAY',
        registrar: 'Anonymized',
        threatIntel: 'Known data staging relay — TOR exit node association',
      },
    },
    clues: [
      { id: 'C14', text: '1.46 GB transferred outbound in 47 seconds — abnormal egress volume', importance: 'critical' },
      { id: 'C15', text: 'Destination IP linked to known data staging relay and TOR exit node', importance: 'critical' },
      { id: 'C16', text: 'TLS 1.3 encryption used to evade deep packet inspection', importance: 'significant' },
    ],
  },
  {
    id: 'E-06',
    title: 'Security & Audit Records',
    category: 'AUDIT',
    source: 'SIEM — NX-SIEM-01',
    timestamp: '2049-11-20 02:14:33 — 02:15:02 UTC',
    icon: 'Shield',
    accentColor: '#F59E0B',
    content: {
      type: 'logs',
      records: [
        { time: '02:14:33', event: 'SECURITY ALERT', severity: 'CRITICAL', detail: 'Correlated alert: credential access + vault export + egress anomaly. Automated incident created.', source: 'Correlation Engine' },
        { time: '02:14:41', event: 'AUDIT EVENT', severity: 'HIGH', detail: 'Vault access policy violation: bulk export without change ticket. Compliance flag raised.', source: 'Compliance Module' },
        { time: '02:14:53', event: 'LOG INTEGRITY', severity: 'CRITICAL', detail: 'Event log hash mismatch detected. 318 entries removed. Chain of custody compromised.', source: 'Log Monitor' },
        { time: '02:15:02', event: 'SESSION EVENT', severity: 'MEDIUM', detail: 'Suspect session terminated. All forensic artifacts preserved for investigation.', source: 'Session Manager' },
      ],
    },
    clues: [
      { id: 'C17', text: 'Automated correlation confirmed multi-stage attack pattern', importance: 'critical' },
      { id: 'C18', text: 'Log integrity check failed — hash mismatch confirms tampering', importance: 'critical' },
      { id: 'C19', text: 'Vault access policy violation flagged — no change ticket exists', importance: 'significant' },
    ],
  },
]

export function getClueById(id) {
  for (const item of EVIDENCE_ITEMS) {
    const clue = item.clues.find(c => c.id === id)
    if (clue) return { ...clue, evidenceId: item.id, evidenceTitle: item.title }
  }
  return null
}
