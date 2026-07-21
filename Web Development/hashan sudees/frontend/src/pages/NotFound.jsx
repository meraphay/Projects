import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 72px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{ textAlign: 'center', maxWidth: 440 }}
      >
        <motion.div
          animate={{
            y: [0, -12, 0],
            rotate: [0, -3, 3, 0],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: 96, marginBottom: 16, lineHeight: 1 }}
        >
          🚌
        </motion.div>
        <h1 style={{
          fontSize: 96, fontWeight: 900,
          background: 'linear-gradient(135deg, #ff4d4d, #6c5ce7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1, marginBottom: 12,
        }}>
          404
        </h1>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10, letterSpacing: '-0.03em' }}>Page not found</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32, lineHeight: 1.7 }}>
          Looks like this route doesn't exist. Let's get you back on track.
        </p>
        <Link to="/" className="btn-primary" style={{ display: 'inline-flex', padding: '14px 32px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18"/><path d="m12 3 9 9-9 9"/></svg>
          Back to Home
        </Link>
      </motion.div>
    </div>
  )
}
