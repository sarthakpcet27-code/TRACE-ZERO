/* ═══════════════════════════════════════════════════════════════
   Progress Service — TRACE//ZERO
   Per-user storage management for forensic state.
   Ensures different analysts have independent case files.
   ═══════════════════════════════════════════════════════════════ */

import { getCurrentUser } from './authService'

export const BASE_KEYS = {
  LAB: 'trace-zero-lab-state',
  CORR: 'trace-zero-correlation-state',
  RECON: 'trace-zero-recon-state',
  REPLAY: 'trace-zero-replay-state',
  TUTORIAL: 'trace-zero-tutorial-seen',
  HINTS: 'trace-zero-hints-used',
}

export function getUserScopedKey(baseKey, userId) {
  const uid = userId || getCurrentUser()?.id || 'anonymous'
  return `${baseKey}_${uid}`
}

export function loadUserState(baseKey, fallback = null) {
  try {
    const user = getCurrentUser()
    const scopedKey = getUserScopedKey(baseKey, user?.id)
    const rawScoped = localStorage.getItem(scopedKey)
    if (rawScoped) return JSON.parse(rawScoped)

    // Fallback to unscoped legacy key if available (migrating existing progress)
    const legacyRaw = localStorage.getItem(baseKey)
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw)
      // Save it scoped for current user
      if (user?.id) {
        localStorage.setItem(scopedKey, legacyRaw)
      }
      return parsed
    }
    return fallback
  } catch (err) {
    console.error('Error loading state for key:', baseKey, err)
    return fallback
  }
}

export function saveUserState(baseKey, data) {
  try {
    const user = getCurrentUser()
    const scopedKey = getUserScopedKey(baseKey, user?.id)
    const serialized = JSON.stringify(data)
    localStorage.setItem(scopedKey, serialized)

    // Also mirror to baseKey for backwards compatibility or single-session access
    localStorage.setItem(baseKey, serialized)
    
    // Dispatch custom event for reactive updates (e.g. Nav rank badge)
    window.dispatchEvent(new CustomEvent('trace-zero-progress-updated', { detail: { baseKey } }))
  } catch (err) {
    console.error('Error saving state for key:', baseKey, err)
  }
}

export function resetAllUserProgress(userId) {
  const uid = userId || getCurrentUser()?.id || 'anonymous'
  Object.values(BASE_KEYS).forEach(base => {
    localStorage.removeItem(getUserScopedKey(base, uid))
  })
  window.dispatchEvent(new CustomEvent('trace-zero-progress-updated', { detail: { reset: true } }))
}

export function getUserFullProgress(userId) {
  const uid = userId || getCurrentUser()?.id || 'anonymous'
  const lab = loadUserState(BASE_KEYS.LAB) || {}
  const corr = loadUserState(BASE_KEYS.CORR) || {}
  const recon = loadUserState(BASE_KEYS.RECON) || {}
  const replay = loadUserState(BASE_KEYS.REPLAY) || {}

  return {
    analyzedEvidenceCount: (lab.analyzedIds || []).length,
    collectedCluesCount: (lab.collectedClueIds || []).length,
    connectionsCount: (corr.connections || []).length,
    reconCompleted: !!recon.submitted,
    reconScore: recon.result?.score || 0,
    replayCompleted: !!replay.simState?.completed,
    replayPrevented: replay.simState?.preventedCount || 0,
  }
}
