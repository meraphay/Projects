import { Router } from 'express'
import { queryAll } from '../query.js'

const router = Router()

router.get('/', (req, res) => {
  try {
    const cities = queryAll("SELECT id, name FROM cities ORDER BY name")
    res.json(cities)
  } catch (err) {
    res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Failed to load cities' : err.message })
  }
})

export default router
