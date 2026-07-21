import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '48px 0',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: 40,
          marginBottom: 40,
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 12 }}>
              BookMe
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 280 }}>
              A bus booking experience — clean, fast, and designed around you. Travel across Pakistan with confidence.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>
              Navigation
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/search', label: 'Search Buses' },
                { to: '/my-bookings', label: 'My Bookings' },
              ].map(link => (
                <Link key={link.to} to={link.to} style={{ fontSize: 13, color: 'var(--text-secondary)', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--text)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>
              Account
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { to: '/login', label: 'Log in' },
                { to: '/register', label: 'Sign up' },
              ].map(link => (
                <Link key={link.to} to={link.to} style={{ fontSize: 13, color: 'var(--text-secondary)', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--text)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>
              Contact
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              support@bookme.pk<br />
              +92 300 1234567
            </p>
          </div>
        </div>
        <div style={{ paddingTop: 24, borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
          <span>© 2026 BookMe. All rights reserved.</span>
          <span>Islamabad, Pakistan</span>
        </div>
      </div>
    </footer>
  )
}
