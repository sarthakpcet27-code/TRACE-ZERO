/* ═══════════════════════════════════════════════════════════════
   Defense Replay Data & Simulation Engine — TRACE//ZERO
   Case: #TR-2049 — THE MIDNIGHT BREACH
   Company: NEXORA TECHNOLOGIES
   Purely fictional frontend simulation. No real network operations.
   ═══════════════════════════════════════════════════════════════ */

export const TOTAL_BUDGET = 7

// 6 Defensive Control Modules as specified
export const DEFENSIVE_CONTROLS = [
  {
    id: 'CTRL-01',
    name: 'PHISHING-RESISTANT MFA',
    code: 'FIDO2-WEBAUTHN',
    cost: 2,
    category: 'AUTHENTICATION',
    accentColor: '#B7FF3C',
    iconName: 'KeyRound',
    description: 'Strengthen authentication against the credential compromise scenario modeled in this simulation.',
    simulationImpact: 'When enabled, the simulated account acquisition stage becomes blocked under the scenario\'s assumptions.',
    affectedStageIds: ['STAGE-02'],
    rationale: 'Enforces hardware token authentication, neutralizing spearphished credential re-use.',
  },
  {
    id: 'CTRL-02',
    name: 'CONDITIONAL ACCESS',
    code: 'ZERO-TRUST-POLICY',
    cost: 2,
    category: 'ACCESS POLICY',
    accentColor: '#22D3EE',
    iconName: 'ShieldAlert',
    description: 'Restrict access based on session and device trust conditions.',
    simulationImpact: 'When enabled, the simulated unauthorized session or access attempt is restricted according to the modeled policy.',
    affectedStageIds: ['STAGE-02', 'STAGE-03'],
    rationale: 'Evaluates endpoint compliance and geographic/time context before granting token elevation.',
  },
  {
    id: 'CTRL-03',
    name: 'LEAST PRIVILEGE',
    code: 'RBAC-SEPARATION',
    cost: 2,
    category: 'AUTHORIZATION',
    accentColor: '#38BDF8',
    iconName: 'UserCheck',
    description: 'Limit access to sensitive project resources to only the permissions required.',
    simulationImpact: 'When enabled, sensitive file access is restricted in the simulation.',
    affectedStageIds: ['STAGE-03'],
    rationale: 'Denies blanket VAULT-ADMIN escalation; isolates CIPHER_VAULT and Project Helios specs.',
  },
  {
    id: 'CTRL-04',
    name: 'ENDPOINT DETECTION',
    code: 'EDR-BEHAVIORAL',
    cost: 2,
    category: 'ENDPOINT SECURITY',
    accentColor: '#F59E0B',
    iconName: 'Cpu',
    description: 'Monitor simulated workstation behavior for suspicious activity.',
    simulationImpact: 'When enabled, the endpoint anomaly stage becomes detected earlier in the modeled incident.',
    affectedStageIds: ['STAGE-04', 'STAGE-06'],
    rationale: 'Detects LSASS memory-scraping and unauthorized svchost subprocess spawning in real time.',
  },
  {
    id: 'CTRL-05',
    name: 'DATA EXFILTRATION MONITORING',
    code: 'DLP-EGRESS-INSPECT',
    cost: 2,
    category: 'NETWORK & DLP',
    accentColor: '#EC4899',
    iconName: 'Wifi',
    description: 'Monitor unusual outbound data movement in the fictional scenario.',
    simulationImpact: 'When enabled, the modeled outbound transfer is detected and its simulated impact is reduced.',
    affectedStageIds: ['STAGE-05'],
    rationale: 'Intercepts anomalous volume bursts over TLS 1.3 to unverified external staging relays.',
  },
  {
    id: 'CTRL-06',
    name: 'CENTRALIZED IMMUTABLE LOGGING',
    code: 'WORM-AUDIT-VAULT',
    cost: 1,
    category: 'AUDIT & INTEGRITY',
    accentColor: '#A78BFA',
    iconName: 'Database',
    description: 'Maintain protected audit records and make modeled log alteration detectable.',
    simulationImpact: 'When enabled, the simulated log alteration stage is detected or preserved for investigation.',
    affectedStageIds: ['STAGE-06', 'STAGE-07'],
    rationale: 'Streams event logs off-host in real time to write-once-read-many storage, thwarting wevtutil purges.',
  },
]

// The 7 connected attack chain stages
export const ATTACK_CHAIN_STAGES = [
  {
    id: 'STAGE-01',
    number: '01',
    time: '01:58 AM',
    name: 'INITIAL CONTACT',
    icon: 'Mail',
    originalDescription: 'Suspicious email impersonating IT Operations reaches s.mercer@nexora.example with a weaponized PDF.',
    originalStatus: 'BREACH SIMULATED',
    originalStatusColor: '#DC2626',
  },
  {
    id: 'STAGE-02',
    number: '02',
    time: '02:13:44 AM',
    name: 'ACCOUNT ACCESS',
    icon: 'Key',
    originalDescription: 'Rogue authentication recorded on NX-WKS-07 using compromised credentials; session escalates to VAULT-ADMIN.',
    originalStatus: 'BREACH SIMULATED',
    originalStatusColor: '#DC2626',
  },
  {
    id: 'STAGE-03',
    number: '03',
    time: '02:13:51 AM',
    name: 'CONFIDENTIAL FILE ACCESS',
    icon: 'FileText',
    originalDescription: 'Vault intrusion on NX-VAULT-03; specs_v9.pdf and keymap_final.bin downloaded without dual authorization.',
    originalStatus: 'BREACH SIMULATED',
    originalStatusColor: '#DC2626',
  },
  {
    id: 'STAGE-04',
    number: '04',
    time: '02:14:03 AM',
    name: 'ENDPOINT ANOMALY',
    icon: 'Cpu',
    originalDescription: 'LSASS process memory dumped on NX-WKS-07; staging archive compiled in temp directory.',
    originalStatus: 'BREACH SIMULATED',
    originalStatusColor: '#DC2626',
  },
  {
    id: 'STAGE-05',
    number: '05',
    time: '02:14:08 AM',
    name: 'OUTBOUND DATA MOVEMENT',
    icon: 'Wifi',
    originalDescription: '1.46 GB exfiltrated outbound to external relay IP 185.220.101.5 over encrypted TLS 1.3 tunnel in 47 seconds.',
    originalStatus: 'BREACH SIMULATED',
    originalStatusColor: '#DC2626',
  },
  {
    id: 'STAGE-06',
    number: '06',
    time: '02:14:33 AM',
    name: 'SECURITY ALERT',
    icon: 'AlertTriangle',
    originalDescription: 'wevtutil.exe purges 318 Windows Event logs; delayed SIEM anomaly trigger with fragmented evidence.',
    originalStatus: 'BREACH SIMULATED',
    originalStatusColor: '#DC2626',
  },
  {
    id: 'STAGE-07',
    number: '07',
    time: '02:15:02 AM',
    name: 'SESSION TERMINATION',
    icon: 'Shield',
    originalDescription: 'Attacker disconnects after completing exfiltration; SOC initiated delayed reactive containment at 02:16 UTC.',
    originalStatus: 'BREACH SIMULATED',
    originalStatusColor: '#DC2626',
  },
]

// Stage state appearance map
export const STATE_CONFIG = {
  'BLOCKED': { color: '#B7FF3C', label: 'BLOCKED', bg: 'rgba(183, 255, 60, 0.1)', border: 'rgba(183, 255, 60, 0.4)' },
  'RESTRICTED': { color: '#22D3EE', label: 'RESTRICTED', bg: 'rgba(34, 211, 238, 0.1)', border: 'rgba(34, 211, 238, 0.4)' },
  'DETECTED': { color: '#F59E0B', label: 'DETECTED', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.4)' },
  'MITIGATED': { color: '#38BDF8', label: 'MITIGATED', bg: 'rgba(56, 189, 248, 0.1)', border: 'rgba(56, 189, 248, 0.4)' },
  'LOGGED': { color: '#A78BFA', label: 'LOGGED', bg: 'rgba(167, 139, 250, 0.1)', border: 'rgba(167, 139, 250, 0.4)' },
  'CONTAINED': { color: '#B7FF3C', label: 'CONTAINED', bg: 'rgba(183, 255, 60, 0.1)', border: 'rgba(183, 255, 60, 0.4)' },
  'BREACH SIMULATED': { color: '#DC2626', label: 'BREACH SIMULATED', bg: 'rgba(220, 38, 38, 0.1)', border: 'rgba(220, 38, 38, 0.35)' },
}

/* ═══════════════════════════════════════════════════════════════
   DETERMINISTIC SIMULATION ENGINE
   Evaluates selected controls against the modeled attack chain.
   Produces repeatable, consistent results with causal propagation.
   ═══════════════════════════════════════════════════════════════ */
export function runDefenseSimulation(selectedControlIds = []) {
  const selectedSet = new Set(selectedControlIds)
  const hasMFA = selectedSet.has('CTRL-01')
  const hasCondAccess = selectedSet.has('CTRL-02')
  const hasLeastPriv = selectedSet.has('CTRL-03')
  const hasEndpoint = selectedSet.has('CTRL-04')
  const hasExfilMon = selectedSet.has('CTRL-05')
  const hasLogging = selectedSet.has('CTRL-06')

  const totalPointsSpent = selectedControlIds.reduce((sum, id) => {
    const ctrl = DEFENSIVE_CONTROLS.find((c) => c.id === id)
    return sum + (ctrl ? ctrl.cost : 0)
  }, 0)

  const simulatedStages = []
  const terminalLogs = []
  const insights = []

  // ── STAGE 01: INITIAL CONTACT (01:58 AM)
  // Email reaches mailbox perimeter. Defensive controls do not prevent delivery, but baseline telemetry logged.
  simulatedStages.push({
    id: 'STAGE-01',
    number: '01',
    time: '01:58 AM',
    name: 'INITIAL CONTACT',
    icon: 'Mail',
    originalDescription: ATTACK_CHAIN_STAGES[0].originalDescription,
    simulatedState: hasLogging ? 'LOGGED' : 'BREACH SIMULATED',
    statusColor: hasLogging ? STATE_CONFIG['LOGGED'].color : STATE_CONFIG['BREACH SIMULATED'].color,
    headline: hasLogging ? 'INBOUND EMAIL LOGGED' : 'PHISHING EMAIL DELIVERED',
    narrative: hasLogging
      ? 'Inbound spearphishing email delivered to inbox; external origin flagged and message headers preserved in centralized audit archive.'
      : 'Suspicious email impersonating IT Operations reaches s.mercer@nexora.example with weaponized attachment. Initial perimeter penetrated.',
    effectiveControls: hasLogging ? ['CTRL-06'] : [],
  })

  terminalLogs.push({
    time: '01:58:12 UTC',
    level: hasLogging ? '[AUDIT]' : '[WARN]',
    source: 'MAIL-GW-01',
    message: hasLogging
      ? 'Inbound delivery from nexora-support.example archived to WORM storage. Header SHA256 hashed.'
      : 'Weaponized attachment passed through standard perimeter filter without quarantine.',
  })

  // ── STAGE 02: ACCOUNT ACCESS (02:13:44 AM)
  let accountBlocked = false
  let accountRestricted = false

  if (hasMFA) {
    accountBlocked = true
    simulatedStages.push({
      id: 'STAGE-02',
      number: '02',
      time: '02:13:44 AM',
      name: 'ACCOUNT ACCESS',
      icon: 'Key',
      originalDescription: ATTACK_CHAIN_STAGES[1].originalDescription,
      simulatedState: 'BLOCKED',
      statusColor: STATE_CONFIG['BLOCKED'].color,
      headline: 'AUTHENTICATION CHALLENGE FAILED',
      narrative: 'Phishing-resistant MFA intercepted authentication attempt on NX-WKS-07. Missing FIDO2 cryptographic token rejected attacker session immediately.',
      effectiveControls: ['CTRL-01'],
    })
    terminalLogs.push({
      time: '02:13:44 UTC',
      level: '[BLOCK]',
      source: 'AUTH-GATEWAY',
      message: 'FIDO2 challenge unsatisfied for s.mercer. Stolen password credentials insufficient. Session DENIED.',
    })
    insights.push('Phishing-Resistant MFA successfully neutralized credential re-use at authentication boundary, blocking unauthorized session creation.')
  } else if (hasCondAccess) {
    accountRestricted = true
    simulatedStages.push({
      id: 'STAGE-02',
      number: '02',
      time: '02:13:44 AM',
      name: 'ACCOUNT ACCESS',
      icon: 'Key',
      originalDescription: ATTACK_CHAIN_STAGES[1].originalDescription,
      simulatedState: 'RESTRICTED',
      statusColor: STATE_CONFIG['RESTRICTED'].color,
      headline: 'SESSION QUARANTINED BY POLICY',
      narrative: 'Conditional Access policy flagged anomalous after-hours login from unmanaged hardware. Session confined to zero-privilege quarantine sandbox.',
      effectiveControls: ['CTRL-02'],
    })
    terminalLogs.push({
      time: '02:13:45 UTC',
      level: '[RESTRICT]',
      source: 'CONDITIONAL-ACCESS',
      message: 'Untrusted device fingerprint on NX-WKS-07. Privileged elevation disallowed; quarantined session enforced.',
    })
    insights.push('Conditional Access identified untrusted device and after-hours login anomaly, restricting account privileges to a sandboxed scope.')
  } else {
    simulatedStages.push({
      id: 'STAGE-02',
      number: '02',
      time: '02:13:44 AM',
      name: 'ACCOUNT ACCESS',
      icon: 'Key',
      originalDescription: ATTACK_CHAIN_STAGES[1].originalDescription,
      simulatedState: 'BREACH SIMULATED',
      statusColor: STATE_CONFIG['BREACH SIMULATED'].color,
      headline: 'UNAUTHORIZED SESSION ESTABLISHED',
      narrative: 'Compromised credentials authenticated without secondary cryptographic verification. Attacker gained interactive control of NX-WKS-07.',
      effectiveControls: [],
    })
    terminalLogs.push({
      time: '02:13:44 UTC',
      level: '[ALERT]',
      source: 'NX-WKS-07',
      message: 'Interactive logon s.mercer. No secondary hardware token prompted. Attacker session established.',
    })
  }

  // ── STAGE 03: CONFIDENTIAL FILE ACCESS (02:13:51 AM)
  let filesBlocked = false
  let filesRestricted = false

  if (accountBlocked) {
    filesBlocked = true
    simulatedStages.push({
      id: 'STAGE-03',
      number: '03',
      time: '02:13:51 AM',
      name: 'CONFIDENTIAL FILE ACCESS',
      icon: 'FileText',
      originalDescription: ATTACK_CHAIN_STAGES[2].originalDescription,
      simulatedState: 'BLOCKED',
      statusColor: STATE_CONFIG['BLOCKED'].color,
      headline: 'ACCESS PREVENTED (UPSTREAM BLOCK)',
      narrative: 'Vault intrusion completely prevented. Because upstream account acquisition was blocked at the perimeter, zero queries reached NX-VAULT-03.',
      effectiveControls: ['CTRL-01'],
    })
    terminalLogs.push({
      time: '02:13:51 UTC',
      level: '[INFO]',
      source: 'NX-VAULT-03',
      message: 'Zero query activity on CIPHER_VAULT. Upstream session prevention preserved vault data integrity.',
    })
  } else if (hasLeastPriv && hasCondAccess) {
    filesBlocked = true
    simulatedStages.push({
      id: 'STAGE-03',
      number: '03',
      time: '02:13:51 AM',
      name: 'CONFIDENTIAL FILE ACCESS',
      icon: 'FileText',
      originalDescription: ATTACK_CHAIN_STAGES[2].originalDescription,
      simulatedState: 'BLOCKED',
      statusColor: STATE_CONFIG['BLOCKED'].color,
      headline: 'VAULT ACCESS STRICTLY DENIED',
      narrative: 'Combined Least Privilege RBAC and Conditional Access rules rejected VAULT-ADMIN role assumption. Project Helios specs and keymap remained encrypted.',
      effectiveControls: ['CTRL-02', 'CTRL-03'],
    })
    terminalLogs.push({
      time: '02:13:51 UTC',
      level: '[BLOCK]',
      source: 'RBAC-ENFORCER',
      message: 'Elevation to VAULT-ADMIN denied by dual policy. Project Helios specs_v9.pdf locked. Access denied.',
    })
    insights.push('Least Privilege coupled with Conditional Access completely denied access to CIPHER_VAULT and Project Helios blueprints.')
  } else if (hasLeastPriv) {
    filesRestricted = true
    simulatedStages.push({
      id: 'STAGE-03',
      number: '03',
      time: '02:13:51 AM',
      name: 'CONFIDENTIAL FILE ACCESS',
      icon: 'FileText',
      originalDescription: ATTACK_CHAIN_STAGES[2].originalDescription,
      simulatedState: 'RESTRICTED',
      statusColor: STATE_CONFIG['RESTRICTED'].color,
      headline: 'BULK EXPORT RESTRICTED',
      narrative: 'Least Privilege enforcement prevented database export on CIPHER_VAULT. Stolen credentials only accessed low-level metadata without encryption keymaps.',
      effectiveControls: ['CTRL-03'],
    })
    terminalLogs.push({
      time: '02:13:51 UTC',
      level: '[RESTRICT]',
      source: 'NX-VAULT-03',
      message: 'Bulk database export rejected: requires dual authorization. Keymap download denied. Exposure limited.',
    })
    insights.push('Least Privilege restricted vault access, preventing bulk extraction of classified encryption keymaps.')
  } else if (accountRestricted) {
    filesRestricted = true
    simulatedStages.push({
      id: 'STAGE-03',
      number: '03',
      time: '02:13:51 AM',
      name: 'CONFIDENTIAL FILE ACCESS',
      icon: 'FileText',
      originalDescription: ATTACK_CHAIN_STAGES[2].originalDescription,
      simulatedState: 'RESTRICTED',
      statusColor: STATE_CONFIG['RESTRICTED'].color,
      headline: 'STEP-UP CHALLENGE HALTED ACCESS',
      narrative: 'Conditional Access triggered step-up challenge upon attempting to reach NX-VAULT-03 from untrusted endpoint context. Access paused.',
      effectiveControls: ['CTRL-02'],
    })
    terminalLogs.push({
      time: '02:13:52 UTC',
      level: '[WARN]',
      source: 'NX-VAULT-03',
      message: 'Step-up authentication required for Project Helios documents. Attacker unable to fulfill challenge.',
    })
  } else {
    simulatedStages.push({
      id: 'STAGE-03',
      number: '03',
      time: '02:13:51 AM',
      name: 'CONFIDENTIAL FILE ACCESS',
      icon: 'FileText',
      originalDescription: ATTACK_CHAIN_STAGES[2].originalDescription,
      simulatedState: 'BREACH SIMULATED',
      statusColor: STATE_CONFIG['BREACH SIMULATED'].color,
      headline: 'PROJECT HELIOS VAULT EXPOSED',
      narrative: 'Attacker accessed specs_v9.pdf (24.3 MB) and keymap_final.bin (8.1 MB). 2,847 classified rows exported from CIPHER_VAULT without resistance.',
      effectiveControls: [],
    })
    terminalLogs.push({
      time: '02:13:51 UTC',
      level: '[CRITICAL]',
      source: 'NX-VAULT-03',
      message: 'Full query execution on CIPHER_VAULT by s.mercer. 2,847 rows exported without dual approval.',
    })
  }

  // ── STAGE 04: ENDPOINT ANOMALY (02:14:03 AM)
  let endpointPrevented = false

  if (accountBlocked) {
    endpointPrevented = true
    simulatedStages.push({
      id: 'STAGE-04',
      number: '04',
      time: '02:14:03 AM',
      name: 'ENDPOINT ANOMALY',
      icon: 'Cpu',
      originalDescription: ATTACK_CHAIN_STAGES[3].originalDescription,
      simulatedState: 'BLOCKED',
      statusColor: STATE_CONFIG['BLOCKED'].color,
      headline: 'NO ENDPOINT EXECUTION OCCURRED',
      narrative: 'Workstation remained untouched. Because the initial account takeover was blocked, malicious LSASS dumping and archive staging never executed.',
      effectiveControls: ['CTRL-01'],
    })
    terminalLogs.push({
      time: '02:14:03 UTC',
      level: '[INFO]',
      source: 'NX-WKS-07',
      message: 'Endpoint process tree clean. No LSASS memory access or anomalous svchost processes detected.',
    })
  } else if (hasEndpoint) {
    simulatedStages.push({
      id: 'STAGE-04',
      number: '04',
      time: '02:14:03 AM',
      name: 'ENDPOINT ANOMALY',
      icon: 'Cpu',
      originalDescription: ATTACK_CHAIN_STAGES[3].originalDescription,
      simulatedState: 'DETECTED',
      statusColor: STATE_CONFIG['DETECTED'].color,
      headline: 'BEHAVIORAL EDR DETECTION TRIGGERED',
      narrative: 'Endpoint Detection flagged LSASS memory read (PID 4092) and suspended suspicious cmd.exe staging process before compression finished.',
      effectiveControls: ['CTRL-04'],
    })
    terminalLogs.push({
      time: '02:14:03 UTC',
      level: '[DETECT]',
      source: 'EDR-AGENT',
      message: 'Process PID 4092 attempted OpenProcess on lsass.exe. Process killed; automated host containment initiated.',
    })
    insights.push('Endpoint Detection (EDR) identified credential-dumping behavior on LSASS in real time, triggering rapid containment.')
  } else {
    simulatedStages.push({
      id: 'STAGE-04',
      number: '04',
      time: '02:14:03 AM',
      name: 'ENDPOINT ANOMALY',
      icon: 'Cpu',
      originalDescription: ATTACK_CHAIN_STAGES[3].originalDescription,
      simulatedState: 'BREACH SIMULATED',
      statusColor: STATE_CONFIG['BREACH SIMULATED'].color,
      headline: 'LSASS DUMPING UNCHECKED',
      narrative: 'Attacker dumped LSASS memory, staged archive files in temporary folders, and established persistence without endpoint telemetry alarms.',
      effectiveControls: [],
    })
    terminalLogs.push({
      time: '02:14:03 UTC',
      level: '[ALERT]',
      source: 'NX-WKS-07',
      message: 'LSASS memory accessed by unverified child process. Staging zip created in AppData\\Local\\Temp.',
    })
  }

  // ── STAGE 05: OUTBOUND DATA MOVEMENT (02:14:08 AM)
  if (accountBlocked || filesBlocked) {
    simulatedStages.push({
      id: 'STAGE-05',
      number: '05',
      time: '02:14:08 AM',
      name: 'OUTBOUND DATA MOVEMENT',
      icon: 'Wifi',
      originalDescription: ATTACK_CHAIN_STAGES[4].originalDescription,
      simulatedState: 'BLOCKED',
      statusColor: STATE_CONFIG['BLOCKED'].color,
      headline: 'EXFILTRATION AVOIDED (ZERO DATA TO SEND)',
      narrative: 'No data exfiltration occurred. Upstream defenses stopped vault access and staging, leaving the attacker with no sensitive files to transmit.',
      effectiveControls: hasMFA ? ['CTRL-01'] : ['CTRL-02', 'CTRL-03'],
    })
    terminalLogs.push({
      time: '02:14:08 UTC',
      level: '[INFO]',
      source: 'NX-FW-01',
      message: 'Egress monitoring idle. No outbound tunnels to unverified external staging relays observed.',
    })
    insights.push('Upstream defenses prevented sensitive data staging, completely eliminating outbound exfiltration.')
  } else if (hasExfilMon) {
    simulatedStages.push({
      id: 'STAGE-05',
      number: '05',
      time: '02:14:08 AM',
      name: 'OUTBOUND DATA MOVEMENT',
      icon: 'Wifi',
      originalDescription: ATTACK_CHAIN_STAGES[4].originalDescription,
      simulatedState: 'MITIGATED',
      statusColor: STATE_CONFIG['MITIGATED'].color,
      headline: 'EGRESS SEVERED BY DLP MONITORING',
      narrative: 'Data Exfiltration Monitoring detected anomalous 1.46 GB burst over TLS 1.3 to IP 185.220.101.5. Firewall severed connection at 14 MB (99% data preserved).',
      effectiveControls: ['CTRL-05'],
    })
    terminalLogs.push({
      time: '02:14:09 UTC',
      level: '[MITIGATE]',
      source: 'DLP-GATEWAY',
      message: 'TCP RST sent to IP 185.220.101.5. Outbound exfiltration severed after 14 MB. 99% data preserved.',
    })
    insights.push('Data Exfiltration Monitoring detected the anomalous outbound TLS stream, severing the connection and preserving 99% of data.')
  } else {
    simulatedStages.push({
      id: 'STAGE-05',
      number: '05',
      time: '02:14:08 AM',
      name: 'OUTBOUND DATA MOVEMENT',
      icon: 'Wifi',
      originalDescription: ATTACK_CHAIN_STAGES[4].originalDescription,
      simulatedState: 'BREACH SIMULATED',
      statusColor: STATE_CONFIG['BREACH SIMULATED'].color,
      headline: '1.46 GB EXFILTRATED UNHINDERED',
      narrative: 'Complete 1.46 GB classified package transmitted outbound to staging server IP 185.220.101.5 via encrypted TLS 1.3 tunnel in 47 seconds.',
      effectiveControls: [],
    })
    terminalLogs.push({
      time: '02:14:10 UTC',
      level: '[CRITICAL]',
      source: 'NX-FW-01',
      message: '1.46 GB egress completed to 185.220.101.5:443. Full transmission payload delivered.',
    })
  }

  // ── STAGE 06: SECURITY ALERT & ANTI-FORENSICS (02:14:33 AM)
  if (hasLogging) {
    simulatedStages.push({
      id: 'STAGE-06',
      number: '06',
      time: '02:14:33 AM',
      name: 'SECURITY ALERT',
      icon: 'AlertTriangle',
      originalDescription: ATTACK_CHAIN_STAGES[5].originalDescription,
      simulatedState: 'LOGGED',
      statusColor: STATE_CONFIG['LOGGED'].color,
      headline: 'WORM AUDIT PROTECTED / TAMPER DETECTED',
      narrative: 'Centralized Immutable Logging streamed logs off-host in real time. wevtutil command detected as anti-forensics attempt; all 318 purged records preserved.',
      effectiveControls: ['CTRL-06'],
    })
    terminalLogs.push({
      time: '02:14:33 UTC',
      level: '[AUDIT]',
      source: 'WORM-AUDIT',
      message: 'Local event clearing detected (wevtutil.exe). Remote mirror untouched. 318 security records preserved.',
    })
    insights.push('Centralized Immutable Logging neutralized log destruction by streaming events off-host to write-once-read-many storage.')
  } else if (hasEndpoint) {
    simulatedStages.push({
      id: 'STAGE-06',
      number: '06',
      time: '02:14:33 AM',
      name: 'SECURITY ALERT',
      icon: 'AlertTriangle',
      originalDescription: ATTACK_CHAIN_STAGES[5].originalDescription,
      simulatedState: 'DETECTED',
      statusColor: STATE_CONFIG['DETECTED'].color,
      headline: 'LOG PURGE TRIGGERED INSTANT ALARM',
      narrative: 'Endpoint Detection raised high-severity alert for wevtutil execution. Security Operations Center notified within 3 seconds of command invocation.',
      effectiveControls: ['CTRL-04'],
    })
    terminalLogs.push({
      time: '02:14:34 UTC',
      level: '[ALERT]',
      source: 'SIEM-ENGINE',
      message: 'High-severity alert: wevtutil log clearing utility invoked by PID 6012. SOC paging triggered.',
    })
    insights.push('Endpoint telemetry detected the anti-forensics log purging attempt and expedited SOC response.')
  } else {
    simulatedStages.push({
      id: 'STAGE-06',
      number: '06',
      time: '02:14:33 AM',
      name: 'SECURITY ALERT',
      icon: 'AlertTriangle',
      originalDescription: ATTACK_CHAIN_STAGES[5].originalDescription,
      simulatedState: 'BREACH SIMULATED',
      statusColor: STATE_CONFIG['BREACH SIMULATED'].color,
      headline: '318 AUDIT RECORDS WIPED',
      narrative: 'Attacker executed wevtutil.exe to delete Windows Security and Application logs. Critical forensic evidence erased before incident response noticed.',
      effectiveControls: [],
    })
    terminalLogs.push({
      time: '02:14:33 UTC',
      level: '[WARN]',
      source: 'SIEM-ENGINE',
      message: 'Discontinuity in event sequence. 318 event logs missing from NX-WKS-07.',
    })
  }

  // ── STAGE 07: SESSION TERMINATION (02:15:02 AM)
  const isEarlyContained = accountBlocked || (hasEndpoint && (hasCondAccess || hasLeastPriv))
  const isMitigated = hasExfilMon || hasLogging || hasCondAccess

  if (accountBlocked) {
    simulatedStages.push({
      id: 'STAGE-07',
      number: '07',
      time: '02:15:02 AM',
      name: 'SESSION TERMINATION',
      icon: 'Shield',
      originalDescription: ATTACK_CHAIN_STAGES[6].originalDescription,
      simulatedState: 'CONTAINED',
      statusColor: STATE_CONFIG['CONTAINED'].color,
      headline: 'PERIMETER CONTAINMENT COMPLETE',
      narrative: 'Zero confidential data compromised. Attack fully thwarted at authentication boundary. SOC verified zero lateral movement across enterprise network.',
      effectiveControls: ['CTRL-01'],
    })
    terminalLogs.push({
      time: '02:15:02 UTC',
      level: '[SUCCESS]',
      source: 'SOC-CONSOLE',
      message: 'Case #TR-2049 simulation: Perimeter intact. Attack contained at 02:13:44. Zero data breach.',
    })
    insights.push('Overall incident contained early with zero data compromise, preserving business continuity.')
  } else if (hasEndpoint && (hasExfilMon || hasLeastPriv)) {
    simulatedStages.push({
      id: 'STAGE-07',
      number: '07',
      time: '02:15:02 AM',
      name: 'SESSION TERMINATION',
      icon: 'Shield',
      originalDescription: ATTACK_CHAIN_STAGES[6].originalDescription,
      simulatedState: 'CONTAINED',
      statusColor: STATE_CONFIG['CONTAINED'].color,
      headline: 'RAPID AUTOMATED ISOLATION',
      narrative: 'Automated EDR containment isolated NX-WKS-07 network adapter within 60 seconds of anomaly detection. Attacker session forcibly severed.',
      effectiveControls: ['CTRL-04', ...(hasExfilMon ? ['CTRL-05'] : ['CTRL-03'])],
    })
    terminalLogs.push({
      time: '02:14:45 UTC',
      level: '[CONTAIN]',
      source: 'EDR-ISOLATION',
      message: 'Automated host isolation executed on NX-WKS-07. All active TCP sockets revoked.',
    })
    insights.push('Automated host isolation forcibly terminated the session before attacker could complete objective.')
  } else if (isMitigated) {
    simulatedStages.push({
      id: 'STAGE-07',
      number: '07',
      time: '02:15:02 AM',
      name: 'SESSION TERMINATION',
      icon: 'Shield',
      originalDescription: ATTACK_CHAIN_STAGES[6].originalDescription,
      simulatedState: 'MITIGATED',
      statusColor: STATE_CONFIG['MITIGATED'].color,
      headline: 'INCIDENT DAMAGE SIGNIFICANTLY CURBED',
      narrative: 'Attacker disconnected, but defensive controls drastically minimized impact and preserved forensic evidence for criminal referral.',
      effectiveControls: selectedControlIds.filter((id) => ['CTRL-02', 'CTRL-03', 'CTRL-05', 'CTRL-06'].includes(id)),
    })
    terminalLogs.push({
      time: '02:15:02 UTC',
      level: '[INFO]',
      source: 'SOC-CONSOLE',
      message: 'Attacker disconnected. Mitigation controls reduced business exposure and secured evidence.',
    })
  } else {
    simulatedStages.push({
      id: 'STAGE-07',
      number: '07',
      time: '02:15:02 AM',
      name: 'SESSION TERMINATION',
      icon: 'Shield',
      originalDescription: ATTACK_CHAIN_STAGES[6].originalDescription,
      simulatedState: 'BREACH SIMULATED',
      statusColor: STATE_CONFIG['BREACH SIMULATED'].color,
      headline: 'UNMITIGATED ADVERSARY DEPARTURE',
      narrative: 'Attacker disconnected at will after successfully exfiltrating Project Helios vault data and purging system event logs. Complete mission success for adversary.',
      effectiveControls: [],
    })
    terminalLogs.push({
      time: '02:15:02 UTC',
      level: '[CRITICAL]',
      source: 'SOC-CONSOLE',
      message: 'Attacker gracefully closed session after complete exfiltration. Significant data loss recorded.',
    })
  }

  // Any remaining gaps identified for insights
  if (!hasMFA && !hasCondAccess) {
    insights.push('Configuration lacked identity perimeter controls, allowing unauthorized session establishment on the internal network.')
  }
  if (!hasLeastPriv && !hasMFA) {
    insights.push('Unrestricted file permissions allowed unmitigated access to classified Project Helios design documentation.')
  }
  if (!hasEndpoint && !hasMFA) {
    insights.push('Absence of behavioral endpoint monitoring allowed LSASS memory dumping to proceed unnoticed.')
  }
  if (!hasExfilMon && !hasMFA && !filesBlocked) {
    insights.push('No egress inspection left the encrypted outbound exfiltration channel undetected.')
  }
  if (!hasLogging) {
    insights.push('Without centralized immutable logging, adversary log purging caused irreversible evidence loss.')
  }

  // ── STATS CALCULATION
  const stagesPrevented = simulatedStages.filter((s) => s.simulatedState === 'BLOCKED').length
  const stagesDetected = simulatedStages.filter((s) => s.simulatedState === 'DETECTED').length
  const stagesMitigated = simulatedStages.filter((s) => ['RESTRICTED', 'MITIGATED', 'LOGGED', 'CONTAINED'].includes(s.simulatedState)).length
  const stagesBreached = simulatedStages.filter((s) => s.simulatedState === 'BREACH SIMULATED').length

  // Deterministic effectiveness score formula (0 - 100)
  // Prevented: 18 pts each (max 5*18 = 90)
  // Contained/Mitigated: 14 pts each
  // Detected/Logged: 10 pts each
  // Breached: 0 pts
  // Bonus: early containment = +10 pts
  let rawScore = 0
  simulatedStages.forEach((s) => {
    if (s.simulatedState === 'BLOCKED') rawScore += 18
    else if (s.simulatedState === 'CONTAINED') rawScore += 16
    else if (s.simulatedState === 'RESTRICTED') rawScore += 14
    else if (s.simulatedState === 'MITIGATED') rawScore += 14
    else if (s.simulatedState === 'DETECTED') rawScore += 11
    else if (s.simulatedState === 'LOGGED') rawScore += 9
  })
  if (accountBlocked) rawScore += 10

  const effectivenessScore = Math.min(100, Math.max(0, Math.round(rawScore)))

  let grade = 'D'
  let gradeLabel = 'INSUFFICIENT DEFENSE'
  let gradeColor = '#DC2626'

  if (effectivenessScore >= 90) {
    grade = 'S'
    gradeLabel = 'OPTIMAL RESILIENCE'
    gradeColor = '#B7FF3C'
  } else if (effectivenessScore >= 75) {
    grade = 'A'
    gradeLabel = 'STRONG MITIGATION'
    gradeColor = '#22D3EE'
  } else if (effectivenessScore >= 55) {
    grade = 'B'
    gradeLabel = 'PARTIAL DEFENSE'
    gradeColor = '#F59E0B'
  } else if (effectivenessScore >= 35) {
    grade = 'C'
    gradeLabel = 'VULNERABLE POSTURE'
    gradeColor = '#FB923C'
  }

  // Stage-by-stage side-by-side comparison data
  const comparisons = ATTACK_CHAIN_STAGES.map((original, idx) => {
    const sim = simulatedStages[idx]
    return {
      stageId: original.id,
      number: original.number,
      name: original.name,
      time: original.time,
      originalStatus: original.originalStatus,
      originalDesc: original.originalDescription,
      simulatedStatus: sim.simulatedState,
      simulatedDesc: sim.narrative,
      simulatedColor: sim.statusColor,
      effectiveControls: sim.effectiveControls,
      improved: sim.simulatedState !== 'BREACH SIMULATED',
    }
  })

  return {
    stages: simulatedStages,
    terminalLogs,
    insights,
    comparisons,
    stats: {
      pointsConsumed: totalPointsSpent,
      pointsRemaining: TOTAL_BUDGET - totalPointsSpent,
      totalBudget: TOTAL_BUDGET,
      controlsDeployedCount: selectedControlIds.length,
      stagesPrevented,
      stagesDetected,
      stagesMitigated,
      stagesBreached,
      totalStages: ATTACK_CHAIN_STAGES.length,
      effectivenessScore,
      grade,
      gradeLabel,
      gradeColor,
      isOptimal: grade === 'S' || grade === 'A',
    },
  }
}
