import { Router } from 'express'
import { queryAll } from '../query.js'

const router = Router()

router.get('/search', (req, res) => {
  try {
    let { from, to, date } = req.query

    if (!from || !to) {
      return res.status(400).json({ error: 'Please select departure and arrival cities' })
    }

    const fromId = parseInt(from)
    const toId = parseInt(to)

    if (isNaN(fromId) || isNaN(toId)) {
      return res.status(400).json({ error: 'Invalid city selection' })
    }

    if (fromId === toId) {
      return res.status(400).json({ error: 'Departure and arrival cities must be different' })
    }

    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20))
    const offset = (page - 1) * limit

    let sql = `
      SELECT b.id, b.name as operator_name, b.type as bus_type, b.departure_time, b.arrival_time, b.duration, b.date, b.fare as fare_per_seat, b.total_seats as total_seats,
             dc.name as departure_city, ac.name as arrival_city
      FROM buses b
      JOIN cities dc ON b.departure_city_id = dc.id
      JOIN cities ac ON b.arrival_city_id = ac.id
      WHERE b.departure_city_id = ? AND b.arrival_city_id = ?
    `
    let params = [fromId, toId]

    if (date && typeof date === 'string' && date.trim()) {
      sql += " AND b.date = ?"
      params.push(date.trim())
    }

    sql += " ORDER BY b.departure_time LIMIT ? OFFSET ?"
    params.push(limit, offset)

    const buses = queryAll(sql, params)

    const countSql = `SELECT COUNT(*) as total FROM buses WHERE departure_city_id = ? AND arrival_city_id = ?${date && date.trim() ? " AND date = ?" : ""}`
    const countParams = date && date.trim() ? [fromId, toId, date.trim()] : [fromId, toId]
    const countResult = queryAll(countSql, countParams)
    const total = countResult[0]?.total || 0

    res.json({
      buses,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    })
  } catch (err) {
    res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Search failed' : err.message })
  }
})

router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid bus ID' })

    const bus = queryAll(`
      SELECT b.id, b.name as operator_name, b.type as bus_type, b.departure_time, b.arrival_time, b.duration, b.date, b.fare as fare_per_seat, b.total_seats,
             dc.name as departure_city, ac.name as arrival_city
      FROM buses b
      JOIN cities dc ON b.departure_city_id = dc.id
      JOIN cities ac ON b.arrival_city_id = ac.id
      WHERE b.id = ?
    `, [id])

    if (!bus.length) return res.status(404).json({ error: 'Bus not found' })
    res.json(bus[0])
  } catch (err) {
    res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Failed to load bus' : err.message })
  }
})

router.get('/:id/seats', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid bus ID' })

    const bus = queryAll("SELECT id FROM buses WHERE id = ?", [id])
    if (bus.length === 0) return res.status(404).json({ error: 'Bus not found' })

    const seats = queryAll("SELECT id, seat_number, is_booked FROM seats WHERE bus_id = ? ORDER BY seat_number", [id])
    res.json(seats)
  } catch (err) {
    res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Failed to load seats' : err.message })
  }
})

export default router
