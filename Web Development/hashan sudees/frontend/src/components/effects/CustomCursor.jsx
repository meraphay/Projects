import { useEffect, useRef, useCallback } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const ringSpringX = useSpring(cursorX, { stiffness: 200, damping: 18, mass: 0.3 })
  const ringSpringY = useSpring(cursorY, { stiffness: 200, damping: 18, mass: 0.3 })
  const dotSpringX = useSpring(cursorX, { stiffness: 500, damping: 28 })
  const dotSpringY = useSpring(cursorY, { stiffness: 500, damping: 28 })

  const ringRef = useRef(null)

  const handleMove = useCallback((e) => {
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)
  }, [cursorX, cursorY])

  useEffect(() => {
    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [handleMove])

  useEffect(() => {
    const handleEnter = (e) => {
      const el = e.currentTarget
      const rect = el.getBoundingClientRect()
      cursorX.set(rect.left + rect.width / 2)
      cursorY.set(rect.top + rect.height / 2)

      if (ringRef.current) {
        const size = Math.max(rect.width, rect.height) + 20
        ringRef.current.style.width = `${size}px`
        ringRef.current.style.height = `${size}px`
        ringRef.current.style.borderRadius = '14px'
        ringRef.current.style.borderColor = 'rgba(255,77,77,0.5)'
        ringRef.current.style.background = 'rgba(255,77,77,0.06)'
        ringRef.current.style.backdropFilter = 'blur(6px)'
      }
    }

    const handleLeave = () => {
      if (ringRef.current) {
        ringRef.current.style.width = '32px'
        ringRef.current.style.height = '32px'
        ringRef.current.style.borderRadius = '50%'
        ringRef.current.style.borderColor = 'rgba(255,77,77,0.3)'
        ringRef.current.style.background = 'transparent'
        ringRef.current.style.backdropFilter = 'blur(0px)'
      }
    }

    const addListeners = () => {
      document.querySelectorAll('a, button, [data-cursor], input, select, textarea').forEach(el => {
        el.removeEventListener('mouseenter', handleEnter)
        el.removeEventListener('mouseleave', handleLeave)
        el.addEventListener('mouseenter', handleEnter)
        el.addEventListener('mouseleave', handleLeave)
      })
    }
    addListeners()
    const observer = new MutationObserver(addListeners)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [cursorX, cursorY])

  return (
    <>
      <div
        ref={ringRef}
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 99998,
          pointerEvents: 'none', width: 32, height: 32,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,77,77,0.3)',
          background: 'transparent',
          transition: 'width 0.35s ease, height 0.35s ease, border-radius 0.35s ease, background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease',
          backdropFilter: 'blur(0px)',
        }}
      />
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 99999,
          pointerEvents: 'none', width: 6, height: 6,
          borderRadius: '50%',
          background: '#ff4d4d',
          boxShadow: '0 0 12px rgba(255,77,77,0.6)',
          x: dotSpringX, y: dotSpringY,
          translateX: '-50%', translateY: '-50%',
        }}
      />
      <motion.div
        style={{
          position: 'fixed', top: 0, left: 0, zIndex: 99998,
          pointerEvents: 'none', width: 32, height: 32,
          borderRadius: '50%',
          border: '1.5px solid rgba(255,255,255,0.1)',
          x: ringSpringX, y: ringSpringY,
          translateX: '-50%', translateY: '-50%',
        }}
      />
      <style>{`
        body:not(.touch-device) * { cursor: none !important; }
        @media (hover: none) and (pointer: coarse) {
          body * { cursor: auto !important; }
        }
      `}</style>
    </>
  )
}
