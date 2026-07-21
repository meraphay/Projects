import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [agree, setAgree] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  const { show } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password) { setError('All fields are required'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) { setError('Password must contain at least one special character'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (!agree) { setError('You must agree to the terms'); return }
    setLoading(true)
    const result = await register(form.name, form.email, form.password, form.phone)
    if (result.success) {
      if (result.needsVerification) {
        show('Verification code sent!', 'success')
        navigate(`/verify-email?email=${encodeURIComponent(result.email)}${result.devCode ? `&code=${result.devCode}` : ''}`)
      } else {
        show('Account created!', 'success')
        navigate('/')
      }
    } else {
      setError(result.error || 'Registration failed')
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
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 8 }}>Sign up</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32 }}>
          Create your BookMe account.
        </p>

        {error && (
          <div style={{ padding: '12px 16px', border: '1px solid #ff4757', marginBottom: 20, fontSize: 13, color: '#ff4757', fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, display: 'block' }}>Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name"
              style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 14, fontWeight: 500 }}
              onFocusCapture={e => e.target.style.borderColor = 'var(--accent)'}
              onBlurCapture={e => e.target.style.borderColor = 'var(--border)'} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, display: 'block' }}>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="your@email.com"
              style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 14, fontWeight: 500 }}
              onFocusCapture={e => e.target.style.borderColor = 'var(--accent)'}
              onBlurCapture={e => e.target.style.borderColor = 'var(--border)'} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, display: 'block' }}>Phone (optional)</label>
            <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="03XX-XXXXXXX"
              style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 14, fontWeight: 500 }}
              onFocusCapture={e => e.target.style.borderColor = 'var(--accent)'}
              onBlurCapture={e => e.target.style.borderColor = 'var(--border)'} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, display: 'block' }}>Password</label>
            <div style={{ display: 'flex', border: '1px solid var(--border)' }}>
              <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min. 8 chars, 1 special char"
                style={{ flex: 1, padding: '12px 14px', border: 'none', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 14, fontWeight: 500 }}
                onFocusCapture={e => e.target.parentElement.style.borderColor = 'var(--accent)'}
                onBlurCapture={e => e.target.parentElement.style.borderColor = 'var(--border)'} />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                style={{ padding: '0 14px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12 }}>
                {showPwd ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, display: 'block' }}>Confirm Password</label>
            <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} placeholder="Repeat your password"
              style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 14, fontWeight: 500 }}
              onFocusCapture={e => e.target.style.borderColor = 'var(--accent)'}
              onBlurCapture={e => e.target.style.borderColor = 'var(--border)'} />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)' }}>
            <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} style={{ accentColor: 'var(--accent)', width: 16, height: 16 }} />
            I agree to the Terms & Conditions
          </label>

          <button type="submit" disabled={loading}
            style={{
              width: '100%', padding: '14px', border: '1px solid var(--accent)', fontWeight: 700, fontSize: 12,
              background: loading ? 'rgba(255,77,77,0.5)' : 'var(--accent)', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '1px', textTransform: 'uppercase',
            }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--text)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
