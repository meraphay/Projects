import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function BusCard({ bus, index = 0 }) {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 24 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="card card-3d"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto auto auto auto',
        alignItems: 'center',
        gap: 20,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 20,
        padding: '1.5rem 2rem',
      }}
      onClick={() => navigate(`/seats/${bus.id}`, { state: { bus } })}
    >
      <div className="card-3d-inner" style={{ display: 'contents' }}>
        {/* Left accent */}
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: '100%' }}
          transition={{ duration: 0.6, delay: index * 0.05 + 0.2 }}
          style={{
            position: 'absolute', left: 0, top: 0, width: 4,
            background: 'linear-gradient(180deg, #ff4d4d, #6c5ce7)',
            borderRadius: '0 2px 2px 0',
          }}
        />

        {/* Bus info */}
        <div>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            {bus.name}
            <span style={{
              fontSize: 11, padding: '2px 8px', borderRadius: 4,
              background: 'rgba(108,92,231,0.15)', color: '#6c5ce7',
              fontWeight: 600, letterSpacing: 0.3,
            }}>
              {bus.type}
            </span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {bus.duration}
          </div>
        </div>

        {/* Departure */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 24, color: '#fff', letterSpacing: '-0.02em' }}>{bus.departure_time}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{bus.departure_city}</div>
        </div>

        {/* Arrow */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, var(--primary), var(--secondary))', borderRadius: 1, position: 'relative' }}>
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', right: -4, top: -5,
                width: 0, height: 0,
                borderTop: '6px solid transparent',
                borderBottom: '6px solid transparent',
                borderLeft: '8px solid var(--primary)',
              }}
            />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-light)', fontWeight: 500 }}>{bus.duration}</div>
        </div>

        {/* Arrival */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 24, color: '#fff', letterSpacing: '-0.02em' }}>{bus.arrival_time}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{bus.arrival_city}</div>
        </div>

        {/* Price & action */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Starting from</div>
          <div style={{ fontWeight: 900, fontSize: 24, background: 'linear-gradient(135deg, #ff4d4d, #ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Rs. {bus.fare}
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary"
            style={{ marginTop: 8, padding: '8px 20px', fontSize: 13, borderRadius: 10 }}
            onClick={(e) => { e.stopPropagation(); navigate(`/seats/${bus.id}`, { state: { bus } }) }}
          >
            View Seats
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
