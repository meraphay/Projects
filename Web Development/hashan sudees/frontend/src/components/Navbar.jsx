import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  useEffect(() => {
    const handle = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false) }

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        height: 48,
        display: 'flex',
        alignItems: 'center',
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        background: scrolled ? 'rgba(10,10,15,0.95)' : 'transparent',
        borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.06)' : 'transparent'}`,
        transition: 'all 0.4s ease',
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.3px' }}>
            Islamabad, PK
          </span>
        </div>

        <Link to="/" style={{
          fontSize: 13, fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase',
          color: 'var(--text)',
        }}>
          BookMe
        </Link>

        <div ref={menuRef} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                style={{
                  fontSize: 12, fontWeight: 500, color: 'var(--text-muted)',
                  letterSpacing: '0.3px', background: 'none', border: 'none',
                  cursor: 'pointer', padding: '4px 8px',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
              >
                {user.name}
                <motion.svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  animate={{ rotate: menuOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <polyline points="6 9 12 15 18 9"/>
                </motion.svg>
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute', right: 0, top: '100%', marginTop: 4,
                      minWidth: 180, background: '#121212',
                      border: '1px solid rgba(255,255,255,0.08)',
                      zIndex: 500,
                    }}
                  >
                    <Link to="/my-bookings" onClick={() => setMenuOpen(false)}
                      style={{ display: 'block', padding: '10px 16px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      My Bookings
                    </Link>
                    <Link to="/search" onClick={() => setMenuOpen(false)}
                      style={{ display: 'block', padding: '10px 16px', fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      Book a Ride
                    </Link>
                    <button onClick={handleLogout}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: 13, fontWeight: 500, color: '#ff4757', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.3px' }}>
                Log in
              </Link>
              <Link to="/register" style={{
                fontSize: 12, fontWeight: 600, letterSpacing: '0.3px',
                color: '#fff', background: 'var(--accent)',
                padding: '6px 14px',
              }}>
                Sign up
              </Link>
            </>
          )}
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-muted)', letterSpacing: '0.3px' }}>
            2026
          </span>
        </div>
      </div>
    </motion.nav>
  )
}
