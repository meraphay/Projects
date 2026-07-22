import { useState, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { API } from '../context/AuthContext'
import { useToast } from '../components/Toast'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { show } = useToast()
  const email = searchParams.get('email') || ''

  const urlCode = (searchParams.get('code') || '').replace(/\D/g, '').slice(0, 6)
  const initDigits = urlCode.length === 6 ? urlCode.split('') : ['', '', '', '', '', '']
  const [digits, setDigits] = useState(initDigits)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resending, setResending] = useState(false)
  const inputRefs = useRef([])

  const handleDigit = (index, value) => {
    if (value && !/^\d$/.test(value)) return
    const next = [...digits]
    next[index] = value
    setDigits(next)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const text = (e.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6)
    const next = [...digits]
    for (let i = 0; i < text.length; i++) next[i] = text[i]
    setDigits(next)
    if (text.length === 6) inputRefs.current[5]?.focus()
    else if (text.length > 0) inputRefs.current[text.length]?.focus()
  }

  const code = digits.join('')

  const handleVerify = async () => {
    if (code.length !== 6) return
    setLoading(true)
    setError('')
    try {
      const r = await fetch(`${API}/auth/verify-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const d = await r.json()
      if (d.token) {
        localStorage.setItem('bookme_token', d.token)
        show('Email verified!', 'success')
        navigate('/')
      } else {
        setError(d.error || 'Invalid code')
      }
    } catch {
      setError('Verification failed')
    }
    setLoading(false)
  }

  const handleResend = async () => {
    setResending(true)
    setError('')
    try {
      const r = await fetch(`${API}/auth/send-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const d = await r.json()
      if (d.message) show('Code sent!', 'success')
      else setError(d.error || 'Failed to send')
    } catch {
      setError('Failed to send')
    }
    setResending(false)
  }

  if (!email) {
    return (
      <div className="container page-padding" style={{ paddingTop: 100, textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No email provided.</p>
      </div>
    )
  }

  return (
    <div className="container page-padding" style={{ paddingTop: 100, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}
      >
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 8 }}>
          Verify your email
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32 }}>
          Enter the 6-digit code sent to<br />
          <strong style={{ color: 'var(--text-secondary)' }}>{email}</strong>
        </p>

        {error && (
          <div style={{ padding: '12px 16px', border: '1px solid #ff4757', marginBottom: 20, fontSize: 13, color: '#ff4757', fontWeight: 500 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32 }} onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={(e) => e.target.select()}
              style={{
                width: 48, height: 56,
                border: '1px solid var(--border)',
                background: 'rgba(0,0,0,0.3)',
                color: '#fff',
                fontSize: 24, fontWeight: 700,
                textAlign: 'center',
                transition: 'border-color 0.2s',
              }}
              onFocusCapture={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlurCapture={(e) => e.target.style.borderColor = 'var(--border)'}
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={code.length !== 6 || loading}
          style={{
            width: '100%', padding: '14px', border: '1px solid var(--accent)',
            fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '1px',
            background: code.length === 6 && !loading ? 'var(--accent)' : 'transparent',
            color: code.length === 6 && !loading ? '#fff' : 'var(--text-muted)',
            cursor: code.length === 6 && !loading ? 'pointer' : 'not-allowed',
            marginBottom: 16,
          }}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>

        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Didn't receive the code?{' '}
          <button onClick={handleResend} disabled={resending}
            style={{ background: 'none', border: 'none', color: 'var(--text)', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: 13, textDecoration: 'underline', textUnderlineOffset: 3 }}>
            {resending ? 'Sending...' : 'Resend'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}
