import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const API = import.meta.env.VITE_API_URL || '/api'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('bookme_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => { if (d.id) setUser(d); else { setToken(null); localStorage.removeItem('bookme_token') } })
        .catch(() => { setToken(null); localStorage.removeItem('bookme_token') })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  async function fetchWithTimeout(path, opts, timeout = 15000) {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    try {
      const r = await fetch(`${API}${path}`, { ...opts, signal: controller.signal })
      clearTimeout(id)
      return await r.json()
    } catch (err) {
      clearTimeout(id)
      if (err.name === 'AbortError') return { error: 'Request timed out' }
      return { error: 'Network error' }
    }
  }

  const login = async (email, password) => {
    const d = await fetchWithTimeout('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    if (d.token) { setToken(d.token); setUser(d.user); localStorage.setItem('bookme_token', d.token); return { success: true } }
    if (d.needsVerification) return { success: true, needsVerification: true, email: d.email, devCode: d.devCode }
    return { success: false, error: d.error }
  }

  const register = async (name, email, password, phone) => {
    const d = await fetchWithTimeout('/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password, phone }) })
    if (d.token) { setToken(d.token); setUser(d.user); localStorage.setItem('bookme_token', d.token); return { success: true } }
    if (d.needsVerification) return { success: true, needsVerification: true, email: d.email, devCode: d.devCode }
    return { success: false, error: d.error }
  }

  const logout = () => { setUser(null); setToken(null); localStorage.removeItem('bookme_token') }

  return <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
export { API }
