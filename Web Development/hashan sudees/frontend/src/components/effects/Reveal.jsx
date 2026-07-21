import { useRef, useEffect, Children } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'

export function TextReveal({
  children,
  as = 'h1',
  type = 'words',
  stagger = 0.04,
  delay = 0,
  once = true,
  className,
  style,
  ...props
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-40px' })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) controls.start('visible')
    else if (!once) controls.start('hidden')
  }, [inView, controls, once])

  const Tag = as

  const wrapChild = (child, i) => {
    if (typeof child === 'string') {
      const items = type === 'chars'
        ? child.split('').map((c, j) => ({ val: c, key: `c-${i}-${j}` }))
        : child.split(/(\s+)/).map((w, j) => ({ val: w, key: `w-${i}-${j}` }))

      return (
        <motion.span
          key={i}
          style={{ display: 'inline-flex', flexWrap: 'wrap' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
          }}
        >
          {items.map(({ val, key }) =>
            val.trim() === '' ? (
              <span key={key} style={{ display: 'inline-block' }}>{val}</span>
            ) : (
              <motion.span
                key={key}
                style={{ display: 'inline-block', whiteSpace: 'pre' }}
                variants={{
                  hidden: { opacity: 0, y: 60, rotateX: -40, filter: 'blur(6px)' },
                  visible: { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 180, damping: 22, mass: 0.8 } },
                }}
              >
                {val}
              </motion.span>
            )
          )}
        </motion.span>
      )
    }
    return (
      <motion.span
        key={i}
        style={{ display: 'inline-block' }}
        initial={{ opacity: 0, y: 60, rotateX: -40, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
        viewport={{ once }}
        transition={{ delay, type: 'spring', stiffness: 180, damping: 22, mass: 0.8 }}
      >
        {child}
      </motion.span>
    )
  }

  return (
    <Tag ref={ref} className={className} style={{ overflow: 'hidden', ...style }} {...props}>
      <motion.span
        initial="hidden"
        animate={controls}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
        }}
        style={{ display: 'inline-flex', flexWrap: 'wrap' }}
      >
        {Children.map(children, (child, i) => {
          if (child === null || child === undefined) return null
          if (typeof child === 'string' || typeof child === 'number') {
            return wrapChild(String(child), i)
          }
          if (child?.props?.children) {
            return (
              <motion.span
                key={i}
                style={{ display: 'inline-block' }}
                initial={{ opacity: 0, y: 60, rotateX: -40, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                viewport={{ once }}
                transition={{ delay, type: 'spring', stiffness: 180, damping: 22, mass: 0.8 }}
              >
                {child}
              </motion.span>
            )
          }
          return wrapChild('', i)
        })}
      </motion.span>
    </Tag>
  )
}

export function FadeIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  once = true,
  distance = 40,
  className,
  style,
  ...props
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-40px' })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) controls.start('visible')
    else if (!once) controls.start('hidden')
  }, [inView, controls, once])

  const dirMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
    scale: { scale: 0.85, opacity: 0 },
  }

  const hidden = { opacity: 0, ...(dirMap[direction] || dirMap.up) }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden,
        visible: { opacity: 1, y: 0, x: 0, scale: 1, transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] } },
      }}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerChildren({
  children,
  stagger = 0.06,
  delay = 0,
  once = true,
  className,
  style,
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, margin: '-40px' })
  const controls = useAnimation()

  useEffect(() => {
    if (inView) controls.start('visible')
    else if (!once) controls.start('hidden')
  }, [inView, controls, once])

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export const staggerItem = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 24 } },
}
