import { useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

export default function Tilt3D({ children, className, style, maxTilt = 10, perspective = 1000, scale = 1.02, glare = true }) {
  const ref = useRef(null)

  const handleMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -maxTilt
    const rotateY = ((x - centerX) / centerX) * maxTilt

    el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`

    if (glare) {
      const glareEl = el.querySelector('[data-glare]')
      if (glareEl) {
        const glareX = (x / rect.width) * 100
        const glareY = (y / rect.height) * 100
        glareEl.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.08), transparent 60%)`
      }
    }
  }, [maxTilt, perspective, scale, glare])

  const handleLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    if (glare) {
      const glareEl = el.querySelector('[data-glare]')
      if (glareEl) {
        glareEl.style.background = 'transparent'
      }
    }
  }, [perspective, glare])

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ perspective, transformStyle: 'preserve-3d', transition: 'transform 0.15s ease-out', position: 'relative', ...style }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
      {glare && <div data-glare style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', transition: 'background 0.15s ease' }} />}
    </motion.div>
  )
}
