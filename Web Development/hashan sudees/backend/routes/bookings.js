import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { queryAll, queryOne, execute } from '../query.js'
import { JWT_SECRET } from './auth.js'

const router = Router()

function auth(req, res, next) {
  try {
    const auth = req.headers.authorization
    if (!auth) return res.status(401).json({ error: 'Login required' })
    const token = auth.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Login required' })
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

router.post('/', auth, (req, res) => {
  try {
    const { bus_id, seat_ids, total_fare } = req.body

    if (!bus_id || !seat_ids || !Array.isArray(seat_ids) || seat_ids.length === 0) {
      return res.status(400).json({ error: 'Missing booking details' })
    }

    const bus = queryOne("SELECT id, fare, name FROM buses WHERE id = ?", [bus_id])
    if (!bus) return res.status(404).json({ error: 'Bus not found' })

    if (seat_ids.some(id => typeof id !== 'number' || !Number.isInteger(id) || id <= 0)) {
      return res.status(400).json({ error: 'Invalid seat IDs' })
    }

    const uniqueIds = [...new Set(seat_ids)]
    if (uniqueIds.length !== seat_ids.length) {
      return res.status(400).json({ error: 'Duplicate seat selection' })
    }

    const placeholders = seat_ids.map(() => '?').join(',')
    const seats = queryAll(`SELECT id, seat_number, is_booked, bus_id FROM seats WHERE id IN (${placeholders})`, seat_ids)
    if (seats.length !== seat_ids.length) {
      return res.status(400).json({ error: 'Some seats do not exist' })
    }

    const wrongBus = seats.find(s => s.bus_id !== Number(bus_id))
    if (wrongBus) {
      return res.status(400).json({ error: 'Seats do not belong to this bus' })
    }

    const alreadyBooked = seats.filter(s => s.is_booked === 1)
    if (alreadyBooked.length > 0) {
      return res.status(409).json({
        error: `Seats ${alreadyBooked.map(s => s.seat_number).join(', ')} are already booked`
      })
    }

    const expectedFare = seat_ids.length * bus.fare
    if (Math.abs(total_fare - expectedFare) > 0.01) {
      return res.status(400).json({ error: 'Fare mismatch' })
    }

    for (const sid of seat_ids) {
      execute("UPDATE seats SET is_booked = 1 WHERE id = ? AND is_booked = 0", [sid])
    }

    const now = new Date().toISOString()
    execute(
      "INSERT INTO bookings (user_id, bus_id, seat_ids, total_fare, booking_date, status) VALUES (?, ?, ?, ?, ?, 'confirmed')",
      [req.user.id, bus_id, JSON.stringify(seat_ids), total_fare, now]
    )

    res.json({ success: true, message: 'Booking confirmed successfully!' })
  } catch (err) {
    res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Booking failed' : err.message })
  }
})

router.get('/my', auth, (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20))
    const offset = (page - 1) * limit

    const bookings = queryAll(`
      SELECT bk.id, bk.bus_id, bk.seat_ids, bk.total_fare, bk.booking_date, bk.status,
             b.name as bus_name, b.departure_time, b.arrival_time, b.date, b.type,
             dc.name as departure_city, ac.name as arrival_city
      FROM bookings bk
      JOIN buses b ON bk.bus_id = b.id
      JOIN cities dc ON b.departure_city_id = dc.id
      JOIN cities ac ON b.arrival_city_id = ac.id
      WHERE bk.user_id = ?
      ORDER BY bk.booking_date DESC
      LIMIT ? OFFSET ?
    `, [req.user.id, limit, offset])

    const countResult = queryOne("SELECT COUNT(*) as total FROM bookings WHERE user_id = ?", [req.user.id])
    const total = countResult?.total || 0

    res.json({
      bookings: bookings.map(b => ({ ...b, seat_ids: JSON.parse(b.seat_ids || '[]') })),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (err) {
    res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Failed to fetch bookings' : err.message })
  }
})

export default router
