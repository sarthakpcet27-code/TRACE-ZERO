/* ═══════════════════════════════════════════════════════════════
   Auth Context — TRACE//ZERO
   Provides auth state to the entire application.
   ═══════════════════════════════════════════════════════════════ */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  getCurrentUser,
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  guestLogin as authGuestLogin,
} from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser())
  const [loading, setLoading] = useState(false)

  // Sync state if localStorage changes (e.g. another tab)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'trace-zero-session') {
        setUser(getCurrentUser())
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      const result = await authLogin(email, password)
      if (result.success) setUser(result.user)
      return result
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (callsign, email, password) => {
    setLoading(true)
    try {
      const result = await authRegister(callsign, email, password)
      if (result.success) setUser(result.user)
      return result
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    authLogout()
    setUser(null)
  }, [])

  const loginAsGuest = useCallback(() => {
    const session = authGuestLogin()
    setUser(session)
    return session
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginAsGuest, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
