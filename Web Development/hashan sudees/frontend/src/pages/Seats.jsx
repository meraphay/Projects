import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { API, useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'

function SeatButton({ seat, selected, onToggle, disabled }) {
  const isBooked = seat.status === 'booked'
  const isSelected = selected
  const isAvailable = !isBooked && !disabled

  return (
    <motion.button
      onClick={() => isAvailable && onToggle(seat)}
      disabled={isBooked || disabled}
      whileHover={isAvailable ? { y: -2 } : {}}
      whileTap={isAvailable ? { scale: 0.95 } : {}}
      style={{
        width: 36, height: 36,
        border: isBooked ? '1px solid rgba(255,71,87,0.3)' : isSelected ? '1px solid var(--accent)' : '1px solid var(--border)',
        fontWeight: 600, fontSize: 11,
        cursor: isAvailable ? 'pointer' : isBooked ? 'not-allowed' : 'default',
        background: isBooked ? 'rgba(255,71,87,0.1)' : isSelected ? 'rgba(255,77,77,0.15)' : 'transparent',
        color: isBooked ? '#ff4757' : isSelected ? 'var(--accent)' : 'var(--text-secondary)',
        transition: 'all 0.2s',
      }}
    >
      {seat.seat_number || seat.seatNumber || seat.number || seat.id}
    </motion.button>
  )
}

function SeatMap({ seats, selectedSeats, onToggle, loading }) {
  const rows = useMemo(() => {
    if (!seats || seats.length === 0) return []
    const map = {}
    for (const seat of seats) {
      const rowNum = seat.row || seat.row_number || Math.ceil(parseInt(seat.seat_number || seat.id) / 4) || 1
      if (!map[rowNum]) map[rowNum] = []
      map[rowNum].push(seat)
    }
    return Object.values(map)
  }, [seats])

  if (loading) return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', padding: '2rem 0' }}>
      {Array.from({ length: 32 }).map((_, i) => <div key={i} className="skeleton" style={{ width: 36, height: 36 }} />)}
    </div>
  )

  if (seats.length === 0) return (
    <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)', fontSize: 14 }}>
      No seats available
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
      <div style={{ width: 240, height: 4, background: 'var(--border-subtle)', marginBottom: 16 }} />
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', width: 16, textAlign: 'right' }}>{ri + 1}</span>
          <div style={{ display: 'flex', gap: 5 }}>
            {row.slice(0, 2).map(seat => (
              <SeatButton key={seat.id || seat.seat_number} seat={seat}
                selected={selectedSeats.some(s => s.id === seat.id || s.seat_number === seat.seat_number)}
                onToggle={onToggle} />
            ))}
          </div>
          <div style={{ width: 20 }} />
          <div style={{ display: 'flex', gap: 5 }}>
            {row.slice(2).map(seat => (
              <SeatButton key={seat.id || seat.seat_number} seat={seat}
                selected={selectedSeats.some(s => s.id === seat.id || s.seat_number === seat.seat_number)}
                onToggle={onToggle} />
            ))}
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 20, marginTop: 16, fontSize: 11, fontWeight: 500, color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 14, height: 14, border: '1px solid var(--border)' }} /> Available
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 14, height: 14, border: '1px solid rgba(255,71,87,0.3)', background: 'rgba(255,71,87,0.1)' }} /> Booked
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 14, height: 14, border: '1px solid var(--accent)', background: 'rgba(255,77,77,0.15)' }} /> Selected
        </span>
      </div>
    </div>
  )
}

export default function Seats() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const { show } = useToast()
  const [bus, setBus] = useState(null)
  const [seats, setSeats] = useState([])
  const [selectedSeats, setSelectedSeats] = useState([])
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [booked, setBooked] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch(`${API}/buses/${id}`)
      .then(r => r.json())
      .then(d => { setBus(d.bus || d); setLoading(false) })
      .catch(() => { show('Failed to load bus details', 'error'); setLoading(false) })
    fetch(`${API}/buses/${id}/seats`)
      .then(r => r.json())
      .then(d => setSeats(Array.isArray(d) ? d : d.seats || []))
      .catch(() => {})
  }, [id, show])

  const toggleSeat = (seat) => {
    setSelectedSeats(prev => {
      const exists = prev.find(s => s.id === seat.id || s.seat_number === seat.seat_number)
      if (exists) return prev.filter(s => s.id !== seat.id && s.seat_number !== seat.seat_number)
      return [...prev, seat]
    })
  }

  const totalFare = useMemo(() => {
    const price = parseInt(bus?.fare_per_seat || bus?.price || 0)
    return selectedSeats.length * price
  }, [selectedSeats, bus])

  const handleBook = async () => {
    if (!user) { navigate('/login'); return }
    if (!selectedSeats.length) return
    setBooking(true)
    try {
      const res = await fetch(`${API}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          bus_id: id,
          seat_ids: selectedSeats.map(s => s.id),
          total_fare: totalFare,
        }),
      })
      const data = await res.json()
      if (data.success || data.booking) {
        setBooked(true)
        show('Booking confirmed!', 'success')
      } else {
        show(data.error || 'Booking failed', 'error')
      }
    } catch {
      show('Failed to process booking', 'error')
    }
    setBooking(false)
  }

  const unitPrice = parseInt(bus?.fare_per_seat || bus?.price || 0)
  const selectedCount = selectedSeats.length

  if (booked) return (
    <div className="container page-padding" style={{ paddingTop: 100, textAlign: 'center' }}>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        style={{
          width: 64, height: 64, border: '2px solid var(--green)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: 28,
        }}>
        ✓
      </motion.div>
      <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: 8 }}>Booking Confirmed</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32 }}>Your seats have been reserved.</p>
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
        <button onClick={() => navigate('/my-bookings')}
          style={{ padding: '12px 24px', border: '1px solid var(--text)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          View Bookings
        </button>
        <button onClick={() => navigate('/')}
          style={{ padding: '12px 24px', border: '1px solid var(--accent)', background: 'var(--accent)', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Book Another
        </button>
      </div>
    </div>
  )

  return (
    <div className="container page-padding" style={{ paddingTop: 80 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)', marginBottom: 32 }}>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
        <span>/</span>
        <span onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>Search</span>
        <span>/</span>
        <span style={{ color: 'var(--text-secondary)' }}>Seats</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>
        <div>
          {loading ? (
            <div className="skeleton" style={{ height: 80, marginBottom: 24 }} />
          ) : bus && (
            <div style={{ border: '1px solid var(--border)', padding: '20px', marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{bus.operator_name || bus.bus_name || 'Bus Service'}</h2>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{bus.departure_city} → {bus.arrival_city}</p>
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em' }}>
                  Rs. {unitPrice.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          <h3 style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, textAlign: 'center', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Select Your Seats
          </h3>
          <SeatMap seats={seats} selectedSeats={selectedSeats} onToggle={toggleSeat} loading={loading} />
        </div>

        <div style={{ position: 'sticky', top: 64 }}>
          <div style={{ border: '1px solid var(--border)', padding: '20px' }}>
            <h3 style={{ fontWeight: 700, fontSize: 13, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 16 }}>
              Booking Summary
            </h3>

            {selectedCount === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No seats selected yet.</p>
            ) : (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {selectedSeats.map(seat => (
                    <span key={seat.seat_number || seat.id} style={{
                      padding: '4px 12px', border: '1px solid var(--accent)', fontSize: 12, fontWeight: 600, color: 'var(--accent)',
                    }}>
                      Seat {seat.seat_number || seat.id}
                    </span>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                    <span>Seats × {selectedCount}</span>
                    <span>Rs. {unitPrice.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Total</span>
                    <span style={{ fontWeight: 900, fontSize: 20, letterSpacing: '-0.02em' }}>Rs. {totalFare.toLocaleString()}</span>
                  </div>
                </div>
              </>
            )}

            <button
              onClick={handleBook}
              disabled={selectedCount === 0 || booking}
              style={{
                width: '100%', padding: '14px', marginTop: 20,
                border: selectedCount > 0 ? '1px solid var(--accent)' : '1px solid var(--border)',
                fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px',
                background: selectedCount > 0 ? 'var(--accent)' : 'transparent',
                color: selectedCount > 0 ? '#fff' : 'var(--text-muted)',
                cursor: selectedCount > 0 && !booking ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}
            >
              {booking ? 'Booking...' : selectedCount === 0 ? 'Select Seats' : !user ? 'Log in to Book' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
