/* ═══════════════════════════════════════════════════════════════
   Reconstruction Data — TRACE//ZERO Case #TR-2049
   Canonical incident event sequence for timeline reconstruction.
   All data is FICTIONAL. No real networks, accounts or incidents.
   ═══════════════════════════════════════════════════════════════ */

// The 8 canonical incident events the player must reorder.
// They are defined in the CORRECT chronological order here.
// The player receives them SHUFFLED and must reconstruct the order.
export const RECONSTRUCTION_EVENTS = [
  {
    id: 'RE-01',
    orderIndex: 0,
    time: '01:58 UTC',
    timeSort: 158,
    title: 'SPEARPHISHING DELIVERY',
    subtitle: 'Initial Contact',
    description: 'An access-review email impersonating Nexora IT Operations was delivered to s.mercer@nexora.example with a weaponized PDF attachment referencing Project Helios credentials.',
    evidenceSource: 'E-01',
    evidenceTitle: 'Suspicious Email',
    category: 'INFILTRATION',
    accentColor: '#DC2626',
    icon: 'Mail',
    detail: 'Sender domain nexora-support.example does not match the legitimate nexora.example. Reply-to address routes to external handler. Sent outside business hours at 01:58 AM.',
  },
  {
    id: 'RE-02',
    orderIndex: 1,
    time: '02:13:44 UTC',
    timeSort: 21344,
    title: 'CREDENTIAL COMPROMISE',
    subtitle: 'Account Session',
    description: 'A second authentication was recorded on NX-WKS-07 using s.mercer credentials. Session was flagged for after-hours access and concurrent login policy violation.',
    evidenceSource: 'E-02',
    evidenceTitle: 'Authentication Logs',
    category: 'ACCESS',
    accentColor: '#F59E0B',
    icon: 'Key',
    detail: 'Duplicate login at 02:13:44 while a session was already active. Privilege escalation to VAULT-ADMIN role — not in standard access profile. Session duration: 1 min 18 sec.',
  },
  {
    id: 'RE-03',
    orderIndex: 2,
    time: '02:13:51 UTC',
    timeSort: 21351,
    title: 'CLASSIFIED FILE ACCESS',
    subtitle: 'Vault Intrusion',
    description: 'Using elevated VAULT-ADMIN privileges, classified Project Helios design documents and the encryption keymap file were accessed from NX-VAULT-03.',
    evidenceSource: 'E-03',
    evidenceTitle: 'File Access Records',
    category: 'EXFILTRATION',
    accentColor: '#22D3EE',
    icon: 'FileText',
    detail: 'specs_v9.pdf (24.3 MB) accessed. keymap_final.bin (8.1 MB) accessed without required dual authorization. Full database export query on CIPHER_VAULT returned 2,847 classified rows.',
  },
  {
    id: 'RE-04',
    orderIndex: 3,
    time: '02:14:03 UTC',
    timeSort: 21403,
    title: 'CREDENTIAL HARVESTING',
    subtitle: 'Endpoint Anomaly',
    description: 'LSASS process memory was read on the endpoint workstation, indicating credential dumping. Archive utility staged vault contents to temp directory.',
    evidenceSource: 'E-04',
    evidenceTitle: 'Endpoint Activity',
    category: 'LATERAL MOVEMENT',
    accentColor: '#F59E0B',
    icon: 'Cpu',
    detail: 'LSASS memory read on PID 4092. Outbound TLS tunnel initiated via svchost.exe PID 2188. cmd.exe PID 5544 invoked archive utility to compress vault contents.',
  },
  {
    id: 'RE-05',
    orderIndex: 4,
    time: '02:14:08 UTC',
    timeSort: 21408,
    title: 'DATA EXFILTRATION',
    subtitle: 'Outbound Transfer',
    description: '1.46 GB of data was transferred outbound from NX-WKS-07 to external IP 185.220.101.5 over an encrypted TLS 1.3 tunnel in 47 seconds.',
    evidenceSource: 'E-05',
    evidenceTitle: 'Network Traffic',
    category: 'EXFILTRATION',
    accentColor: '#DC2626',
    icon: 'Wifi',
    detail: 'Destination linked to known data staging relay and TOR exit node association. TLS 1.3 encryption used to evade deep packet inspection. Transfer flagged by perimeter firewall NX-FW-01.',
  },
  {
    id: 'RE-06',
    orderIndex: 5,
    time: '02:14:33 UTC',
    timeSort: 21433,
    title: 'LOG DESTRUCTION',
    subtitle: 'Anti-Forensics',
    description: 'wevtutil.exe was executed to clear Windows Security and Application logs. 318 event log entries were purged to destroy forensic evidence.',
    evidenceSource: 'E-04',
    evidenceTitle: 'Endpoint Activity',
    category: 'ANTI-FORENSICS',
    accentColor: '#F59E0B',
    icon: 'Cpu',
    detail: 'Event log clearing utility wevtutil.exe executed by PID 6012. Windows Security and Application logs targeted. Directly accounts for the 318 purged entries detected by SIEM.',
  },
  {
    id: 'RE-07',
    orderIndex: 6,
    time: '02:14:33 UTC',
    timeSort: 21433,
    title: 'SIEM CORRELATION ALERT',
    subtitle: 'Detection Triggered',
    description: 'Automated SIEM correlation engine detected multi-stage attack pattern: credential access + vault export + egress anomaly. Automated incident case created.',
    evidenceSource: 'E-06',
    evidenceTitle: 'Security & Audit Records',
    category: 'DETECTION',
    accentColor: '#F59E0B',
    icon: 'Shield',
    detail: 'Log integrity hash mismatch confirmed tampering. Vault access policy violation — no change ticket. Compliance flag raised. 318 entries removed from chain of custody.',
  },
  {
    id: 'RE-08',
    orderIndex: 7,
    time: '02:15:02 UTC',
    timeSort: 21502,
    title: 'SESSION TERMINATION',
    subtitle: 'Suspect Disconnect',
    description: 'The suspect session on NX-WKS-07 was terminated. All forensic artifacts were preserved for investigation by the Session Manager.',
    evidenceSource: 'E-06',
    evidenceTitle: 'Security & Audit Records',
    category: 'CONTAINMENT',
    accentColor: '#B7FF3C',
    icon: 'Shield',
    detail: 'Session terminated after 1 min 18 sec total duration. Forensic preservation initiated. Analyst assignment pending. Total incident window: approximately 17 minutes.',
  },
]

// Generate a deterministic shuffle for the player
// Uses Fisher-Yates with a seed so it's the same each session until reset
export function getShuffledEvents() {
  const arr = RECONSTRUCTION_EVENTS.map((e, i) => ({ ...e, _originalIdx: i }))
  // Simple deterministic shuffle (consistent per session via indices)
  const order = [4, 7, 1, 5, 0, 3, 6, 2]
  return order.map((idx) => arr[idx])
}

// Evaluate the player's submitted order
export function evaluateReconstruction(orderedEventIds) {
  const correctOrder = RECONSTRUCTION_EVENTS.map((e) => e.id)
  let correctCount = 0
  let adjacencyScore = 0

  for (let i = 0; i < orderedEventIds.length; i++) {
    if (orderedEventIds[i] === correctOrder[i]) {
      correctCount++
    }
    // Check adjacent pair correctness
    if (i < orderedEventIds.length - 1) {
      const aIdx = correctOrder.indexOf(orderedEventIds[i])
      const bIdx = correctOrder.indexOf(orderedEventIds[i + 1])
      if (aIdx < bIdx) adjacencyScore++
    }
  }

  const totalEvents = RECONSTRUCTION_EVENTS.length
  const totalPairs = totalEvents - 1
  const positionAccuracy = Math.round((correctCount / totalEvents) * 100)
  const sequenceAccuracy = Math.round((adjacencyScore / totalPairs) * 100)
  const isComplete = correctCount === totalEvents
  const isPerfect = isComplete && adjacencyScore === totalPairs

  let grade, gradeLabel, gradeColor
  if (isPerfect) {
    grade = 'S'
    gradeLabel = 'PERFECT RECONSTRUCTION'
    gradeColor = '#B7FF3C'
  } else if (positionAccuracy >= 75) {
    grade = 'A'
    gradeLabel = 'EXCELLENT ANALYSIS'
    gradeColor = '#B7FF3C'
  } else if (positionAccuracy >= 50) {
    grade = 'B'
    gradeLabel = 'SOLID DEDUCTION'
    gradeColor = '#22D3EE'
  } else if (sequenceAccuracy >= 50) {
    grade = 'C'
    gradeLabel = 'PARTIAL RECONSTRUCTION'
    gradeColor = '#F59E0B'
  } else {
    grade = 'D'
    gradeLabel = 'NEEDS FURTHER INVESTIGATION'
    gradeColor = '#DC2626'
  }

  // Per-event feedback
  const eventFeedback = orderedEventIds.map((id, idx) => {
    const isCorrectPosition = id === correctOrder[idx]
    const correctPosition = correctOrder.indexOf(id)
    return {
      id,
      placedAt: idx,
      correctPosition,
      isCorrect: isCorrectPosition,
      drift: Math.abs(idx - correctPosition),
    }
  })

  return {
    correctCount,
    totalEvents,
    adjacencyScore,
    totalPairs,
    positionAccuracy,
    sequenceAccuracy,
    isComplete,
    isPerfect,
    grade,
    gradeLabel,
    gradeColor,
    eventFeedback,
  }
}
