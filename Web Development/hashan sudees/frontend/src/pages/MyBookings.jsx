import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { API, useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import { Button } from '../components/ui'

function BookingCard({ booking, onCancel }) {
  const [flipped, setFlipped] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const { show } = useToast()
  const { token } = useAuth()

  const statusColors = {
    confirmed: { bg: 'rgba(88,204,2,0.1)', color: '#58cc02' },
    cancelled: { bg: 'rgba(255,71,87,0.1)', color: '#ff4757' },
    completed: { bg: 'rgba(108,92,231,0.1)', color: '#6c5ce7' },
    pending: { bg: 'rgba(255,165,2,0.1)', color: '#ffa502' },
  }
  const sc = statusColors[booking.status] || statusColors.pending

  const handleCancel = async () => {
    setCancelling(true)
    try {
      const r = await fetch(`${API}/bookings/${booking.id}/cancel`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const d = await r.json()
      if (d.success) {
        show('Booking cancelled', 'info')
        onCancel?.(booking.id)
      } else {
        show(d.error || 'Failed to cancel', 'error')
      }
    } catch {
      show('Failed to cancel', 'error')
    }
    setCancelling(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        border: '1px solid var(--border)',
        transition: 'border-color 0.2s',
      }}
      whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
    >
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 36, height: 36,
              border: '1px solid currentColor', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>
              🚌
            </div>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: 15 }}>{booking.bus_name || 'Bus Booking'}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Booking #{booking.id}</p>
            </div>
          </div>
          <span style={{
            padding: '4px 12px', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px',
            background: sc.bg, color: sc.color, border: `1px solid ${sc.color}20`,
          }}>
            {booking.status}
          </span>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
          padding: '14px', background: 'var(--bg-surface)', marginBottom: 16, fontSize: 13,
        }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: 11, display: 'block', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Route</span>
            <span style={{ fontWeight: 600 }}>{booking.departure_city} → {booking.arrival_city}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: 11, display: 'block', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</span>
            <span style={{ fontWeight: 600 }}>{booking.date} · {booking.departure_time}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: 11, display: 'block', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Seats</span>
            <span style={{ fontWeight: 600, color: 'var(--accent)' }}>{booking.seats?.map(s => s.seat_number).join(', ') || booking.seat_numbers || '-'}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: 11, display: 'block', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total</span>
            <span style={{ fontWeight: 900, fontSize: 18, letterSpacing: '-0.02em' }}>Rs. {booking.total_fare?.toLocaleString() || booking.total_fare}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          {booking.status === 'confirmed' && (
            <button onClick={handleCancel} disabled={cancelling}
              style={{ padding: '8px 16px', border: '1px solid rgba(255,71,87,0.3)', background: 'transparent', color: '#ff4757', cursor: 'pointer', fontWeight: 600, fontSize: 12, letterSpacing: '0.3px' }}>
              {cancelling ? '...' : 'Cancel'}
            </button>
          )}
          <button onClick={() => setFlipped(!flipped)}
            style={{ padding: '8px 16px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: 12, letterSpacing: '0.3px' }}>
            {flipped ? 'Hide' : 'Details'}
          </button>
        </div>

        <AnimatePresence>
          {flipped && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
                <div><span style={{ color: 'var(--text-muted)' }}>Passenger:</span> {booking.passenger_name}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Phone:</span> {booking.phone}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Email:</span> {booking.email}</div>
                <div><span style={{ color: 'var(--text-muted)' }}>Booked:</span> {booking.created_at}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function MyBookings() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    if (!user) return
    setLoading(true)
    fetch(`${API}/bookings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error)
        else setBookings(Array.isArray(d) ? d : d.bookings || [])
        setLoading(false)
      })
      .catch(() => { setError('Failed to load bookings'); setLoading(false) })
  }, [user, token])

  const filteredBookings = activeTab === 'all'
    ? bookings
    : bookings.filter(b => b.status === activeTab)

  if (!user) {
    return (
      <div className="container page-padding" style={{ paddingTop: 100, textAlign: 'center' }}>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Please log in to view your bookings.</p>
        <button onClick={() => navigate('/login')}
          style={{ padding: '12px 24px', border: '1px solid var(--accent)', background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Log in
        </button>
      </div>
    )
  }

  return (
    <div className="container page-padding" style={{ paddingTop: 80 }}>
      <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>
        My Bookings
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 24 }}>
        {bookings.length} booking{bookings.length !== 1 ? 's' : ''}
      </p>

      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
        {['all', 'confirmed', 'completed', 'cancelled'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px',
              background: 'none', border: 'none', color: activeTab === tab ? 'var(--text)' : 'var(--text-muted)',
              borderBottom: activeTab === tab ? '2px solid var(--accent)' : '2px solid transparent',
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[0, 1, 2].map(i => <div key={i} className="skeleton" style={{ height: 180 }} />)}
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: '#ff4757', fontWeight: 600, marginBottom: 12 }}>{error}</p>
          <button onClick={() => window.location.reload()}
            style={{ padding: '12px 24px', border: '1px solid var(--text)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Try Again
          </button>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 8 }}>No bookings found.</p>
          <button onClick={() => navigate('/')}
            style={{ padding: '12px 24px', border: '1px solid var(--text)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 16 }}>
            Search Buses
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AnimatePresence mode="popLayout">
            {filteredBookings.map(booking => (
              <BookingCard key={booking.id} booking={booking} onCancel={(id) => setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b))} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
