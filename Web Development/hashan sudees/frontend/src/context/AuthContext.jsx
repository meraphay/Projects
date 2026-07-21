import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

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

  const login = async (email, password) => {
    const r = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    const d = await r.json()
    if (d.token) { setToken(d.token); setUser(d.user); localStorage.setItem('bookme_token', d.token); return { success: true } }
    return { success: false, error: d.error }
  }

  const register = async (name, email, password, phone) => {
    const r = await fetch(`${API}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password, phone }) })
    const d = await r.json()
    if (d.token) { setToken(d.token); setUser(d.user); localStorage.setItem('bookme_token', d.token); return { success: true } }
    return { success: false, error: d.error }
  }

  const logout = () => { setUser(null); setToken(null); localStorage.removeItem('bookme_token') }

  return <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
export { API }
