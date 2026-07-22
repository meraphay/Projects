import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { queryAll, queryOne, execute } from '../query.js'
import { sendVerificationEmail } from '../mail.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'bookme_secret_key_change_in_production'
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SPECIAL_CHAR_RE = /[!@#$%^&*(),.?":{}|<>]/
const EMAIL_CONFIGURED = !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
console.log(`Email configured: ${EMAIL_CONFIGURED ? 'yes' : 'no — set EMAIL_USER and EMAIL_PASS on Railway'}`)

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' })
    }
    if (typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
      return res.status(400).json({ error: 'Name must be between 2 and 100 characters' })
    }
    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }
    if (!SPECIAL_CHAR_RE.test(password)) {
      return res.status(400).json({ error: 'Password must contain at least one special character' })
    }

    const emailClean = email.trim().toLowerCase()
    const existing = queryOne("SELECT id, verified FROM users WHERE email = ?", [emailClean])
    if (existing) return res.status(409).json({ error: 'Email already registered' })

    const hash = await bcrypt.hash(password, 8)
    execute(
      "INSERT INTO users (name, email, password, phone, verified) VALUES (?, ?, ?, ?, 0)",
      [name.trim(), emailClean, hash, (phone || '').trim()]
    )

    const user = queryOne("SELECT id, name, email, phone FROM users WHERE email = ?", [emailClean])
    if (!user) throw new Error('Failed to create user')

    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    execute("INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, ?)", [emailClean, code, expiresAt])
    const sent = await sendVerificationEmail(emailClean, code)

    if (!sent && EMAIL_CONFIGURED) {
      return res.status(500).json({ error: 'Failed to send verification email. Check EMAIL_USER/EMAIL_PASS on Railway.' })
    }
    if (!EMAIL_CONFIGURED) {
      return res.status(201).json({ needsVerification: true, email: emailClean, devCode: code })
    }
    res.status(201).json({ needsVerification: true, email: emailClean })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: err.message || 'Registration failed' })
  }
})

router.post('/send-verification', async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })

    const emailClean = email.trim().toLowerCase()
    const user = queryOne("SELECT id, verified FROM users WHERE email = ?", [emailClean])
    if (!user) return res.status(404).json({ error: 'User not found' })
    if (user.verified) return res.status(400).json({ error: 'Email already verified' })

    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    execute("INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, ?)", [emailClean, code, expiresAt])
    const sent = await sendVerificationEmail(emailClean, code)

    if (!sent && EMAIL_CONFIGURED) {
      return res.status(500).json({ error: 'Failed to send verification email' })
    }
    res.json({ message: 'Verification code sent' })
  } catch (err) {
    console.error('Send verification error:', err)
    res.status(500).json({ error: err.message || 'Failed to send code' })
  }
})

router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' })

    const emailClean = email.trim().toLowerCase()
    const user = queryOne("SELECT id, verified FROM users WHERE email = ?", [emailClean])
    if (!user) return res.status(404).json({ error: 'User not found' })
    if (user.verified) {
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
      return res.json({ token, user, alreadyVerified: true })
    }

    const valid = queryOne(
      "SELECT id FROM verification_codes WHERE email = ? AND code = ? AND used = 0 AND expires_at > datetime('now') ORDER BY created_at DESC LIMIT 1",
      [emailClean, code]
    )
    if (!valid) return res.status(400).json({ error: 'Invalid or expired code' })

    execute("UPDATE verification_codes SET used = 1 WHERE id = ?", [valid.id])
    execute("UPDATE users SET verified = 1 WHERE id = ?", [user.id])

    const updated = queryOne("SELECT id, name, email, phone FROM users WHERE id = ?", [user.id])
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
    res.json({ token, user: updated })
  } catch (err) {
    console.error('Verify email error:', err)
    res.status(500).json({ error: err.message || 'Verification failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const emailClean = email.trim().toLowerCase()
    const user = queryOne("SELECT id, name, email, password, phone, verified FROM users WHERE email = ?", [emailClean])
    if (!user) return res.status(401).json({ error: 'Invalid email or password' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: 'Invalid email or password' })

    if (!user.verified) {
      const code = generateCode()
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
      execute("INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, ?)", [emailClean, code, expiresAt])
      const sent = await sendVerificationEmail(emailClean, code)
      if (!sent && EMAIL_CONFIGURED) {
        return res.status(500).json({ error: 'Failed to send verification email' })
      }
      const response = { needsVerification: true, email: emailClean, message: 'Please verify your email first. A new code has been sent.' }
      return res.status(403).json(response)
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: err.message || 'Login failed' })
  }
})

router.get('/me', async (req, res) => {
  try {
    const auth = req.headers.authorization
    if (!auth) return res.status(401).json({ error: 'No token provided' })
    const token = auth.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token provided' })

    const decoded = jwt.verify(token, JWT_SECRET)
    const user = queryOne("SELECT id, name, email, phone FROM users WHERE id = ?", [decoded.id])
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
})

export default router
export { JWT_SECRET }
