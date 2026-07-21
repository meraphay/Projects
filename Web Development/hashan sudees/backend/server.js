import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { fileURLToPath } from 'url'
import path from 'path'
import { getDb, closeDb } from './db.js'
import { seed } from './seed.js'
import authRoutes from './routes/auth.js'
import citiesRoutes from './routes/cities.js'
import busesRoutes from './routes/buses.js'
import bookingsRoutes from './routes/bookings.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())

const corsOptions = {
  origin: process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map(s => s.trim())
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
}
app.use(cors(corsOptions))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
})
app.use(limiter)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many login attempts, please try again later.' }
})

app.use(express.json({ limit: '1mb' }))

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/cities', citiesRoutes)
app.use('/api/buses', busesRoutes)
app.use('/api/bookings', bookingsRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Serve frontend build for non-API routes
const publicDir = path.join(__dirname, 'public')
app.use(express.static(publicDir))
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile(path.join(publicDir, 'index.html'))
})

app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message })
})

async function start() {
  await getDb()
  await seed()
  app.listen(PORT, () => {
    console.log(`BookMe backend running on http://localhost:${PORT}`)
  })
}

start().catch(console.error)

process.on('SIGINT', () => { closeDb(); process.exit(0) })
process.on('SIGTERM', () => { closeDb(); process.exit(0) })
