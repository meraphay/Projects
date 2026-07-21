import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { queryAll, queryOne, execute } from '../query.js'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'bookme_secret_key_change_in_production'
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

    const existing = queryOne("SELECT id FROM users WHERE email = ?", [email.trim().toLowerCase()])
    if (existing) return res.status(409).json({ error: 'Email already registered' })

    const hash = await bcrypt.hash(password, 12)
    const userId = execute(
      "INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)",
      [name.trim(), email.trim().toLowerCase(), hash, (phone || '').trim()]
    )

    const user = queryOne("SELECT id, name, email, phone FROM users WHERE id = ?", [userId])
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES })

    res.status(201).json({ token, user })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ error: err.message || 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const user = queryOne("SELECT id, name, email, password, phone FROM users WHERE email = ?", [email.trim().toLowerCase()])
    if (!user) return res.status(401).json({ error: 'Invalid email or password' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ error: 'Invalid email or password' })

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } })
  } catch (err) {
    res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Login failed' : err.message })
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
