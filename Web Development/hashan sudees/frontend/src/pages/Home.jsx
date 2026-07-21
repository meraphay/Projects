import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Sialkot', 'Hyderabad', 'Gujranwala', 'Sukkur']

function RevealText({ children, as = 'h1', delay = 0, className, style }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const Tag = as

  return (
    <Tag ref={ref} className={className} style={{ overflow: 'hidden', ...style }}>
      <motion.span
        initial={{ y: '100%', rotate: 3 }}
        animate={inView ? { y: 0, rotate: 0 } : { y: '100%', rotate: 3 }}
        transition={{ delay, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ display: 'block' }}
      >
        {children}
      </motion.span>
    </Tag>
  )
}

function FadeUp({ children, delay = 0, className, style }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

function StaggerGrid({ children }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div ref={ref}>
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1 }}
      >
        {children}
      </motion.div>
    </div>
  )
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
}

function HeroSection() {
  const navigate = useNavigate()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [date, setDate] = useState('')
  const [fromOpen, setFromOpen] = useState(false)
  const [toOpen, setToOpen] = useState(false)
  const [filteredFrom, setFilteredFrom] = useState(cities)
  const [filteredTo, setFilteredTo] = useState(cities)
  const fromRef = useRef(null)
  const toRef = useRef(null)

  useEffect(() => {
    const handle = (e) => {
      if (fromRef.current && !fromRef.current.contains(e.target)) setFromOpen(false)
      if (toRef.current && !toRef.current.contains(e.target)) setToOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const handleSearch = () => {
    if (!from || !to || !date) return
    navigate(`/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`)
  }

  const minDate = new Date().toISOString().split('T')[0]

  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex', flexDirection: 'column', justifyContent: 'center',
      padding: '120px 0 60px',
      position: 'relative',
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <RevealText as="h1" delay={0.3} style={{
          fontSize: 'clamp(4rem, 12vw, 9rem)',
          fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.95,
          marginBottom: 8,
        }}>
          BookMe
        </RevealText>

        <RevealText as="p" delay={0.5} style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'var(--text-secondary)', fontWeight: 400,
          maxWidth: 480, marginBottom: 48, lineHeight: 1.5,
        }}>
          A bus booking experience — clean, fast, and designed around you. Travel across Pakistan with confidence.
        </RevealText>

        <FadeUp delay={0.7}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            style={{
              border: '1px solid var(--border)',
              padding: '24px',
              maxWidth: 640,
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div ref={fromRef} style={{ position: 'relative' }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, display: 'block' }}>From</label>
                <input
                  placeholder="Departure city"
                  value={from}
                  onChange={(e) => { setFrom(e.target.value); setFilteredFrom(cities.filter(c => c.toLowerCase().includes(e.target.value.toLowerCase()))); setFromOpen(true) }}
                  onFocus={() => setFromOpen(true)}
                  style={{
                    width: '100%', padding: '12px 14px', border: '1px solid var(--border)',
                    background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 14, fontWeight: 500,
                    transition: 'border-color 0.2s',
                  }}
                  onFocusCapture={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlurCapture={(e) => e.target.style.borderColor = 'var(--border)'}
                />
                <AnimatePresence>
                  {fromOpen && from && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, marginTop: 2,
                        background: '#121212', border: '1px solid var(--border)',
                        maxHeight: 200, overflowY: 'auto',
                      }}
                    >
                      {filteredFrom.length === 0 ? (
                        <div style={{ padding: 10, fontSize: 13, color: 'var(--text-muted)' }}>No cities found</div>
                      ) : filteredFrom.map(city => (
                        <div key={city} onClick={() => { setFrom(city); setFromOpen(false) }}
                          style={{ padding: '10px 14px', fontSize: 13, cursor: 'pointer', color: city === from ? 'var(--accent)' : 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}
                          onMouseEnter={e => e.target.style.background = 'var(--bg-surface)'}
                          onMouseLeave={e => e.target.style.background = 'transparent'}
                        >
                          {city}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div ref={toRef} style={{ position: 'relative' }}>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, display: 'block' }}>To</label>
                <input
                  placeholder="Arrival city"
                  value={to}
                  onChange={(e) => { setTo(e.target.value); setFilteredTo(cities.filter(c => c.toLowerCase().includes(e.target.value.toLowerCase()))); setToOpen(true) }}
                  onFocus={() => setToOpen(true)}
                  style={{
                    width: '100%', padding: '12px 14px', border: '1px solid var(--border)',
                    background: 'rgba(0,0,0,0.3)', color: '#fff', fontSize: 14, fontWeight: 500,
                    transition: 'border-color 0.2s',
                  }}
                  onFocusCapture={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlurCapture={(e) => e.target.style.borderColor = 'var(--border)'}
                />
                <AnimatePresence>
                  {toOpen && to && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50, marginTop: 2,
                        background: '#121212', border: '1px solid var(--border)',
                        maxHeight: 200, overflowY: 'auto',
                      }}
                    >
                      {filteredTo.length === 0 ? (
                        <div style={{ padding: 10, fontSize: 13, color: 'var(--text-muted)' }}>No cities found</div>
                      ) : filteredTo.map(city => (
                        <div key={city} onClick={() => { setTo(city); setToOpen(false) }}
                          style={{ padding: '10px 14px', fontSize: 13, cursor: 'pointer', color: city === to ? 'var(--accent)' : 'var(--text-secondary)', borderBottom: '1px solid var(--border-subtle)' }}
                          onMouseEnter={e => e.target.style.background = 'var(--bg-surface)'}
                          onMouseLeave={e => e.target.style.background = 'transparent'}
                        >
                          {city}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6, display: 'block' }}>Travel Date</label>
                <input
                  type="date" value={date} min={minDate}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px', border: '1px solid var(--border)',
                    background: 'rgba(0,0,0,0.3)', colorScheme: 'dark', color: '#fff', fontSize: 14, fontWeight: 500,
                    transition: 'border-color 0.2s',
                  }}
                  onFocusCapture={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlurCapture={(e) => e.target.style.borderColor = 'var(--border)'}
                />
              </div>
              <button
                onClick={handleSearch}
                style={{
                  padding: '12px 32px', border: 'none', fontWeight: 700, fontSize: 13,
                  background: 'var(--accent)', color: '#fff', cursor: 'pointer',
                  letterSpacing: '0.5px', textTransform: 'uppercase',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.target.style.background = '#ff3333'}
                onMouseLeave={e => e.target.style.background = 'var(--accent)'}
              >
                Search Buses
              </button>
            </div>
          </motion.div>
        </FadeUp>
      </div>
    </section>
  )
}

function StatsSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const [counts, setCounts] = useState({ routes: 0, cities: 0, seats: 0, trips: 0 })
  const targets = { routes: 150, cities: 24, seats: 50000, trips: 10000 }

  useEffect(() => {
    if (!inView) return
    const dur = 2000
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / dur, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCounts({
        routes: Math.round(ease * targets.routes),
        cities: Math.round(ease * targets.cities),
        seats: Math.round(ease * targets.seats),
        trips: Math.round(ease * targets.trips),
      })
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView])

  const stats = [
    { value: counts.routes, suffix: '+', label: 'Routes' },
    { value: counts.cities, suffix: '', label: 'Cities' },
    { value: counts.seats.toLocaleString(), suffix: '+', label: 'Seats Booked' },
    { value: counts.trips.toLocaleString(), suffix: '+', label: 'Trips' },
  ]

  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
          style={{ padding: '48px 24px', textAlign: 'center', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}
        >
          <div style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 4 }}>
            {s.value}{s.suffix}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: 600 }}>{s.label}</div>
        </motion.div>
      ))}
    </div>
  )
}

function FeatureCard({ icon, title, description, index }) {
  return (
    <motion.div variants={staggerItem} style={{
      padding: '32px 24px',
      borderRight: index % 3 < 2 ? '1px solid var(--border-subtle)' : 'none',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ fontSize: 28, marginBottom: 16, color: 'var(--text-secondary)' }}>
        {icon}
      </div>
      <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, letterSpacing: '-0.01em' }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{description}</p>
    </motion.div>
  )
}

function TestimonialBlock({ name, text, role, index }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="statement-block"
    >
      <div className="square-marker" style={{ marginTop: 6 }} />
      <div>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: 12, fontStyle: 'italic' }}>
          "{text}"
        </p>
        <div style={{ fontSize: 13, fontWeight: 600 }}>
          {name} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>— {role}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const features = [
    { icon: '⏱', title: 'Real-Time Tracking', description: 'Track your bus with live GPS updates. Know exactly when to arrive at the boarding point.' },
    { icon: '🔒', title: 'Secure Booking', description: 'Enterprise-grade encryption for all transactions. Your data and payments are always protected.' },
    { icon: '🗺', title: '24+ Cities', description: 'Connect to cities across Pakistan with frequent departures and multiple operators.' },
    { icon: '💺', title: 'Smart Seating', description: 'Interactive seat maps with real-time availability. Pick your perfect spot.' },
    { icon: '💰', title: 'Best Prices', description: 'Price comparison across operators. Transparent pricing with no hidden fees.' },
    { icon: '🎧', title: '24/7 Support', description: 'Round-the-clock customer support. We\'re here at every step of your journey.' },
  ]

  return (
    <div style={{ flex: 1 }}>
      <HeroSection />

      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <FadeUp>
            <p className="section-subtitle">Network</p>
          </FadeUp>
          <StatsSection />
        </div>
      </section>

      <section style={{ padding: '80px 0', background: 'var(--bg-surface)' }}>
        <div className="container">
          <FadeUp>
            <p className="section-subtitle">Features</p>
          </FadeUp>
          <RevealText as="h2" delay={0.1} style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 800, letterSpacing: '-0.03em',
            marginBottom: 40,
          }}>
            Why BookMe?
          </RevealText>

          <StaggerGrid>
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} index={i} />
            ))}
          </StaggerGrid>
        </div>
      </section>

      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <FadeUp>
            <p className="section-subtitle">Testimonials</p>
          </FadeUp>
          <RevealText as="h2" delay={0.1} style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 800, letterSpacing: '-0.03em',
            marginBottom: 40,
          }}>
            What Travelers Say
          </RevealText>

          <div style={{ maxWidth: 640 }}>
            <TestimonialBlock name="Ahmed Khan" role="Regular Traveler" text="BookMe made my journey from Lahore to Karachi seamless. The seat selection was incredible!" index={0} />
            <TestimonialBlock name="Fatima Ali" role="Business Executive" text="I travel weekly for work and BookMe has been a game-changer. Reliable and easy to use." index={1} />
            <TestimonialBlock name="Usman Raza" role="Student" text="The best bus booking experience. Great interface and the cancellation policy is very flexible." index={2} />
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <FadeUp>
            <RevealText as="h2" delay={0.1} style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 16,
            }}>
              Ready to Go?
            </RevealText>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
              Book your bus seat in under 60 seconds. Join thousands of happy travelers.
            </p>
            <button
              onClick={() => navigate(user ? '/search' : '/register')}
              style={{
                padding: '16px 48px', border: '1px solid var(--text)', fontWeight: 700, fontSize: 13,
                background: 'transparent', color: 'var(--text)', cursor: 'pointer',
                letterSpacing: '1px', textTransform: 'uppercase',
                transition: 'all 0.3s',
              }}
              onMouseEnter={e => { e.target.style.background = 'var(--text)'; e.target.style.color = 'var(--bg)' }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text)' }}
            >
              {user ? 'Book a Bus' : 'Get Started'}
            </button>
          </FadeUp>
        </div>
      </section>
    </div>
  )
}
