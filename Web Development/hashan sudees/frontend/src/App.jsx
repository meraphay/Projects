import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Lenis from 'lenis'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import Toast from './components/Toast'
import Home from './pages/Home'
import Search from './pages/Search'
import Seats from './pages/Seats'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import MyBookings from './pages/MyBookings'
import NotFound from './pages/NotFound'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -12 },
}

const pageTransition = {
  duration: 0.35,
  ease: [0.25, 0.1, 0.25, 1],
}

export default function App() {
  const location = useLocation()

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), wheelMultiplier: 1, touchMultiplier: 1.5 })
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  return (
    <ErrorBoundary>
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrap><Home /></PageWrap>} />
          <Route path="/search" element={<PageWrap><Search /></PageWrap>} />
          <Route path="/seats/:id" element={<PageWrap><Seats /></PageWrap>} />
          <Route path="/login" element={<PageWrap><Login /></PageWrap>} />
          <Route path="/register" element={<PageWrap><Register /></PageWrap>} />
          <Route path="/verify-email" element={<PageWrap><VerifyEmail /></PageWrap>} />
          <Route path="/my-bookings" element={<PageWrap><MyBookings /></PageWrap>} />
          <Route path="*" element={<PageWrap><NotFound /></PageWrap>} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <Toast />
    </ErrorBoundary>
  )
}

function PageWrap({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      {children}
    </motion.div>
  )
}
