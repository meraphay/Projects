import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { show } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) { setError('Please fill in all fields'); return }
    setLoading(true)
    const result = await login(form.email, form.password)
    if (result.success) {
      if (result.needsVerification) {
        const msg = result.devCode ? `Dev code: ${result.devCode}` : 'Please verify your email first'
        show(msg, 'info')
        navigate(`/verify-email?email=${encodeURIComponent(result.email)}${result.devCode ? `&code=${result.devCode}` : ''}`)
      } else {
        show('Welcome back!', 'success')
        navigate('/')
      }
    } else {
      setError(result.error || 'Invalid credentials')
    }
    setLoading(false)
  }

  return (
    <div className="container page-padding" style={{ paddingTop: 100, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 400 }}
      >
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 8 }}>Log in</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32 }}>
          Welcome back to BookMe.
        </p>

        {error && (
          <div style={{ padding: '12px 16px', border: '1px solid #ff4757', marginBottom: 20, fontSize: 13, color: '#ff4757', fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, display: 'block' }}>Email</label>
            <input
              type="email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
              style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 14, fontWeight: 500, transition: 'border-color 0.2s' }}
              onFocusCapture={e => e.target.style.borderColor = 'var(--accent)'}
              onBlurCapture={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, display: 'block' }}>Password</label>
            <div style={{ display: 'flex', border: '1px solid var(--border)', transition: 'border-color 0.2s' }}>
              <input
                type={showPwd ? 'text' : 'password'} value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Enter password"
                style={{ flex: 1, padding: '12px 14px', border: 'none', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 14, fontWeight: 500 }}
                onFocusCapture={e => e.target.parentElement.style.borderColor = 'var(--accent)'}
                onBlurCapture={e => e.target.parentElement.style.borderColor = 'var(--border)'}
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                style={{ padding: '0 14px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}>
                {showPwd ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{
              width: '100%', padding: '14px', border: '1px solid var(--accent)', fontWeight: 700, fontSize: 12,
              background: loading ? 'rgba(255,77,77,0.5)' : 'var(--accent)', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '1px', textTransform: 'uppercase',
              transition: 'background 0.2s',
            }}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--text)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
