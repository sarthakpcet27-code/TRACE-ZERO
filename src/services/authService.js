/* ═══════════════════════════════════════════════════════════════
   Auth Service — TRACE//ZERO
   localStorage-based authentication with SHA-256 hashing.
   All data is fictional. No real backend.
   ═══════════════════════════════════════════════════════════════ */

const USERS_KEY = 'trace-zero-users'
const SESSION_KEY = 'trace-zero-session'

// ── Helpers ──

function generateId() {
  return 'tz-' + crypto.randomUUID().slice(0, 12)
}

async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + '_TRACE//ZERO_SALT')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// ── Seed Demo User (runs once) ──

async function seedDemoUser() {
  const users = getUsers()
  const demoEmail = 'analyst@nexora.dev'
  if (users.some(u => u.email === demoEmail)) return
  const hash = await hashPassword('Trace@2849')
  users.push({
    id: 'tz-demo-analyst',
    callsign: 'SHADOW_ANALYST',
    email: demoEmail,
    passwordHash: hash,
    createdAt: new Date().toISOString(),
    isDemo: true,
  })
  saveUsers(users)
}

// Auto-seed on module load
seedDemoUser()

// ── Public API ──

export async function register(callsign, email, password) {
  const users = getUsers()
  const normalizedEmail = email.toLowerCase().trim()

  if (users.some(u => u.email === normalizedEmail)) {
    return { success: false, error: 'EMAIL ALREADY REGISTERED' }
  }

  if (!callsign || callsign.trim().length < 2) {
    return { success: false, error: 'CALLSIGN MUST BE AT LEAST 2 CHARACTERS' }
  }

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { success: false, error: 'INVALID EMAIL FORMAT' }
  }

  if (password.length < 6) {
    return { success: false, error: 'PASSWORD MUST BE AT LEAST 6 CHARACTERS' }
  }

  const hash = await hashPassword(password)
  const user = {
    id: generateId(),
    callsign: callsign.trim().toUpperCase().replace(/\s+/g, '_'),
    email: normalizedEmail,
    passwordHash: hash,
    createdAt: new Date().toISOString(),
  }

  users.push(user)
  saveUsers(users)

  // Auto-login after registration
  const session = { id: user.id, callsign: user.callsign, email: user.email, isGuest: false }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))

  return { success: true, user: session }
}

export async function login(email, password) {
  const users = getUsers()
  const normalizedEmail = email.toLowerCase().trim()
  const hash = await hashPassword(password)

  const user = users.find(u => u.email === normalizedEmail && u.passwordHash === hash)
  if (!user) {
    return { success: false, error: 'ACCESS DENIED: INVALID CREDENTIALS' }
  }

  const session = { id: user.id, callsign: user.callsign, email: user.email, isGuest: false }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return { success: true, user: session }
}

export function guestLogin() {
  const session = {
    id: 'tz-guest-' + Date.now().toString(36),
    callsign: 'GUEST_ANALYST',
    email: null,
    isGuest: true,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function isAuthenticated() {
  return getCurrentUser() !== null
}

export function getPasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: '#4B5563' }
  let score = 0
  if (password.length >= 6) score++
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const levels = [
    { label: 'CRITICAL', color: '#DC2626' },
    { label: 'WEAK', color: '#F59E0B' },
    { label: 'MODERATE', color: '#F59E0B' },
    { label: 'STRONG', color: '#22D3EE' },
    { label: 'MAXIMUM', color: '#B7FF3C' },
  ]
  const idx = Math.min(score, levels.length) - 1
  return { score, label: levels[Math.max(0, idx)].label, color: levels[Math.max(0, idx)].color }
}
