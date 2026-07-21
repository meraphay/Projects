import { useState, useEffect } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 20 })

  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 10000,
        height: 2.5,
        background: 'linear-gradient(90deg, #ff4d4d, #ff6b6b, #ffa502, #6c5ce7)',
        backgroundSize: '200% 100%',
        transformOrigin: '0%',
        scaleX,
      }}
    />
  )
}
