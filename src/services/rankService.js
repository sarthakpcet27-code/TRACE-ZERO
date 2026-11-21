/* ═══════════════════════════════════════════════════════════════
   Rank & Gamification Service — TRACE//ZERO
   Analyst XP, Rank calculations, Badges & Local Leaderboard.
   ═══════════════════════════════════════════════════════════════ */

import { getUserFullProgress } from './progressService'
import { getCurrentUser } from './authService'

export const RANKS = [
  {
    tier: 1,
    name: 'ROOKIE ANALYST',
    minXP: 0,
    color: '#9CA3AF',
    badge: 'LVL 1',
    description: 'Junior forensic operative. Familiar with triage procedures.',
  },
  {
    tier: 2,
    name: 'FORENSIC ANALYST',
    minXP: 250,
    color: '#22D3EE',
    badge: 'LVL 2',
    description: 'Skilled investigator. Capable of deep packet & disk analysis.',
  },
  {
    tier: 3,
    name: 'SENIOR INVESTIGATOR',
    minXP: 550,
    color: '#F59E0B',
    badge: 'LVL 3',
    description: 'Lead responder. Expert correlation & breach reconstruction.',
  },
  {
    tier: 4,
    name: 'ELITE HUNTER',
    minXP: 850,
    color: '#B7FF3C',
    badge: 'LVL 4',
    description: 'Master threat hunter. Flawless attack chain neutralization.',
  },
]

export function calculateUserXP(userId) {
  const prog = getUserFullProgress(userId)

  let xp = 0
  // Evidence reviewed: 25 XP each (max 150)
  xp += Math.min(prog.analyzedEvidenceCount * 25, 150)

  // Clues extracted: 15 XP each (max 180)
  xp += Math.min(prog.collectedCluesCount * 15, 180)

  // Valid correlations: 45 XP each (max 225)
  xp += Math.min(prog.connectionsCount * 45, 225)

  // Incident reconstruction
  if (prog.reconCompleted) {
    xp += Math.round((prog.reconScore || 0) * 2.2) // up to 220 XP
  }

  // Defense replay
  if (prog.replayCompleted) {
    xp += Math.min(prog.replayPrevented * 40, 240) // up to 240 XP
  }

  return xp
}

export function getRankDetails(xp) {
  let current = RANKS[0]
  let next = RANKS[1]

  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXP) {
      current = RANKS[i]
      next = RANKS[i + 1] || null
      break
    }
  }

  const progressPercent = next
    ? Math.min(100, Math.round(((xp - current.minXP) / (next.minXP - current.minXP)) * 100))
    : 100

  return {
    current,
    next,
    xp,
    progressPercent,
  }
}

// ── Local Leaderboard ──
const LEADERBOARD_KEY = 'trace-zero-leaderboard'

const SEED_LEADERBOARD = [
  { callsign: 'CIPHER_NINJA', rank: 'ELITE HUNTER', xp: 960, date: '2026-11-20', time: '14m 22s' },
  { callsign: 'GHOST_VECTOR', rank: 'ELITE HUNTER', xp: 910, date: '2026-11-20', time: '17m 45s' },
  { callsign: 'BYTE_SENTINEL', rank: 'SENIOR INVESTIGATOR', xp: 780, date: '2026-11-19', time: '21m 10s' },
  { callsign: 'HEX_VALKYRIE', rank: 'SENIOR INVESTIGATOR', xp: 690, date: '2026-11-19', time: '23m 50s' },
  { callsign: 'ZERO_TRACE', rank: 'FORENSIC ANALYST', xp: 460, date: '2026-11-18', time: '29m 12s' },
]

export function getLeaderboard() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(SEED_LEADERBOARD))
  return SEED_LEADERBOARD
}

export function recordLeaderboardScore(callsign, xp, rankName) {
  const current = getLeaderboard()
  const user = getCurrentUser()
  const finalCallsign = callsign || user?.callsign || 'ANALYST_RECON'
  
  const existingIdx = current.findIndex(e => e.callsign === finalCallsign)
  const entry = {
    callsign: finalCallsign,
    rank: rankName,
    xp,
    date: new Date().toISOString().split('T')[0],
    time: 'COMPLETED',
  }

  if (existingIdx >= 0) {
    if (xp > current[existingIdx].xp) {
      current[existingIdx] = entry
    }
  } else {
    current.push(entry)
  }

  current.sort((a, b) => b.xp - a.xp)
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(current.slice(0, 10)))
  return current
}
