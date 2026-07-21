import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { API, useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

const busTypes = ['All', 'Air-Conditioned', 'Non-AC', 'Luxury', 'Standard']
const departureTimes = [
  { label: 'All', value: 'all' },
  { label: 'Early Morning (4-8AM)', value: 'early' },
  { label: 'Morning (8AM-12PM)', value: 'morning' },
  { label: 'Afternoon (12-4PM)', value: 'afternoon' },
  { label: 'Evening (4-8PM)', value: 'evening' },
  { label: 'Night (8PM-12AM)', value: 'night' },
]

function formatTime(timeStr) {
  if (!timeStr) return '--:--'
  try {
    const [h, m] = timeStr.split(':')
    const hour = parseInt(h)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const h12 = hour % 12 || 12
    return `${h12}:${m} ${ampm}`
  } catch { return timeStr }
}

function BusCard({ bus }) {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        border: '1px solid var(--border)',
        padding: '24px',
        transition: 'border-color 0.2s',
      }}
      whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 20 }}>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
            {bus.operator_name || bus.bus_name || 'Bus Service'}
          </h3>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.3px' }}>
            {bus.bus_type || 'Standard'}
          </span>
        </div>
        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em' }}>
          Rs. {parseInt(bus.fare_per_seat || bus.price || 0).toLocaleString()}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, padding: '16px', background: 'var(--bg-surface)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{formatTime(bus.departure_time)}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{bus.departure_city}</div>
        </div>
        <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '50%', top: '-3px', width: 6, height: 6, background: 'var(--accent)', transform: 'translateX(-50%)' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 800 }}>{formatTime(bus.arrival_time)}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{bus.arrival_city}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', border: '1px solid var(--border)', padding: '4px 10px' }}>
          {bus.available_seats || bus.seats_available || 0} seats
        </span>
        {bus.duration && (
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', border: '1px solid var(--border)', padding: '4px 10px' }}>
            {bus.duration}h
          </span>
        )}
      </div>

      <button
        onClick={() => { if (!user) { navigate('/login'); return }; navigate(`/seats/${bus.id}`) }}
        style={{
          width: '100%', padding: '14px', border: '1px solid var(--text)', fontWeight: 700, fontSize: 12,
          background: 'transparent', color: 'var(--text)', cursor: 'pointer',
          letterSpacing: '0.5px', textTransform: 'uppercase',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.target.style.background = 'var(--text)'; e.target.style.color = 'var(--bg)' }}
        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text)' }}
      >
        {user ? 'Select Seats' : 'Log in to Book'}
      </button>
    </motion.div>
  )
}

export default function Search() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [buses, setBuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busType, setBusType] = useState('All')
  const [sortBy, setSortBy] = useState('price')
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [deptFilter, setDeptFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(true)

  const from = searchParams.get('from') || ''
  const to = searchParams.get('to') || ''
  const date = searchParams.get('date') || ''

  useEffect(() => {
    if (!from && !to) { setLoading(false); return }
    setLoading(true)
    const params = new URLSearchParams({ from, to })
    if (date) params.set('date', date)
    fetch(`${API}/buses/search?${params}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error)
        else setBuses(Array.isArray(d) ? d : d.buses || [])
        setLoading(false)
      })
      .catch(() => { setError('Failed to load buses'); setLoading(false) })
  }, [from, to, date])

  const filteredBuses = useMemo(() => {
    let result = [...buses]
    if (busType !== 'All') result = result.filter(b => (b.bus_type || '').toLowerCase().includes(busType.toLowerCase()))
    result = result.filter(b => {
      const price = parseInt(b.fare_per_seat || b.price || 0)
      return price >= priceRange[0] && price <= priceRange[1]
    })
    if (deptFilter !== 'all') {
      result = result.filter(b => {
        if (!b.departure_time) return true
        const h = parseInt(b.departure_time.split(':')[0])
        const ranges = { early: [4, 8], morning: [8, 12], afternoon: [12, 16], evening: [16, 20], night: [20, 24] }
        const r = ranges[deptFilter]
        return r && h >= r[0] && h < r[1]
      })
    }
    if (sortBy === 'price') result.sort((a, b) => (a.fare_per_seat || a.price || 0) - (b.fare_per_seat || b.price || 0))
    else if (sortBy === 'seats') result.sort((a, b) => (b.available_seats || 0) - (a.available_seats || 0))
    return result
  }, [buses, busType, priceRange, deptFilter, sortBy])

  return (
    <div className="container page-padding" style={{ paddingTop: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)', marginBottom: 32 }}>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
        <span>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>Search</span>
      </div>

      {from && to && (
        <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 32 }}>
          {from} → {to}
          {date && <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-muted)', marginLeft: 12 }}>{date}</span>}
        </h1>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 32, alignItems: 'start' }}>
        <div style={{ position: 'sticky', top: 64 }}>
          <div style={{ border: '1px solid var(--border)', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Filters</h3>
              <button onClick={() => { setBusType('All'); setPriceRange([0, 5000]); setDeptFilter('all') }}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', padding: 0 }}
                onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
                Clear
              </button>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: 10 }}>Bus Type</h4>
              {busTypes.map(type => (
                <label key={type} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: busType === type ? 'var(--accent)' : 'var(--text-secondary)' }}>
                  <input type="radio" name="busType" checked={busType === type} onChange={() => setBusType(type)} style={{ accentColor: 'var(--accent)' }} />
                  {type}
                </label>
              ))}
            </div>

            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: 10 }}>Price Range</h4>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="number" value={priceRange[0]} onChange={e => setPriceRange([+e.target.value || 0, priceRange[1]])}
                  style={{ width: '50%', padding: '8px 10px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 13, fontWeight: 600 }} />
                <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>—</span>
                <input type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value || 0])}
                  style={{ width: '50%', padding: '8px 10px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 13, fontWeight: 600 }} />
              </div>
            </div>

            <div>
              <h4 style={{ fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: 10 }}>Departure</h4>
              {departureTimes.map(dt => (
                <label key={dt.value} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', cursor: 'pointer', fontSize: 13, fontWeight: 500, color: deptFilter === dt.value ? 'var(--accent)' : 'var(--text-secondary)' }}>
                  <input type="radio" name="deptTime" checked={deptFilter === dt.value} onChange={() => setDeptFilter(dt.value)} style={{ accentColor: 'var(--accent)' }} />
                  {dt.label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
              <strong style={{ color: 'var(--text)' }}>{filteredBuses.length}</strong> buses found
            </p>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{
                padding: '8px 14px', border: '1px solid var(--border)',
                background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 12, fontWeight: 600,
                cursor: 'pointer',
              }}>
              <option value="price">Sort by Price</option>
              <option value="seats">Sort by Seats</option>
            </select>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[0, 1, 2].map(i => <div key={i} className="skeleton" style={{ height: 200 }} />)}
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ color: '#ff4757', fontWeight: 600, marginBottom: 12 }}>{error}</p>
              <button onClick={() => window.location.reload()}
                style={{ padding: '12px 24px', border: '1px solid var(--text)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Try Again
              </button>
            </div>
          ) : !from && !to ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Search for buses above.</p>
            </div>
          ) : filteredBuses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 8 }}>No buses found for this route.</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Try different cities or dates.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <AnimatePresence mode="popLayout">
                {filteredBuses.map(bus => (
                  <BusCard key={bus.id} bus={bus} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
