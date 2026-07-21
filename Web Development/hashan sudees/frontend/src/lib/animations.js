export const easings = {
  spring: [0.34, 1.56, 0.64, 1],
  springGentle: [0.25, 1, 0.5, 1],
  springBouncy: [0.175, 0.885, 0.32, 1.275],
  easeOut: [0.25, 0.1, 0.25, 1],
  easeOutExpo: [0.19, 1, 0.22, 1],
  easeOutCirc: [0.08, 0.82, 0.17, 1],
  easeOutQuart: [0.165, 0.84, 0.44, 1],
  easeInOut: [0.42, 0, 0.58, 1],
  easeInOutCubic: [0.65, 0, 0.35, 1],
  easeInOutQuart: [0.76, 0, 0.24, 1],
  sharp: [0.4, 0, 0.6, 1],
  standard: [0.4, 0, 0.2, 1],
  decelerate: [0, 0, 0.2, 1],
  accelerate: [0.4, 0, 1, 1],
};

export const durations = {
  instant: 0,
  fast: 100,
  fast2: 150,
  normal: 200,
  normal2: 250,
  moderate: 300,
  moderate2: 350,
  slow: 400,
  slow2: 500,
  slower: 600,
  slowest: 800,
};

export const transitions = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  fadeFast: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: durations.fast, ease: easings.easeOut },
  },
  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: durations.moderate, ease: easings.easeOut },
  },
  slideUpFast: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  slideDown: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
    transition: { duration: durations.moderate, ease: easings.easeOut },
  },
  slideLeft: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: durations.moderate, ease: easings.easeOut },
  },
  slideRight: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: durations.moderate, ease: easings.easeOut },
  },
  scale: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.92 },
    transition: { duration: durations.moderate, ease: easings.spring },
  },
  scaleFast: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: durations.normal, ease: easings.spring },
  },
  scaleSpring: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { type: 'spring', stiffness: 300, damping: 24, mass: 0.8 },
  },
  flip: {
    initial: { opacity: 0, rotateY: 90 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: -90 },
    transition: { duration: durations.slow, ease: easings.easeOut },
  },
  page: {
    initial: { opacity: 0, y: 24, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -24, scale: 0.98 },
    transition: { type: 'spring', stiffness: 220, damping: 28, mass: 0.5 },
  },
  pageSlide: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
    transition: { duration: durations.moderate2, ease: easings.easeOut },
  },
  modal: {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 10 },
    transition: { type: 'spring', stiffness: 400, damping: 30, mass: 0.6 },
  },
  modalFull: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.97 },
    transition: { duration: durations.normal, ease: easings.easeOut },
  },
  dropdown: {
    initial: { opacity: 0, y: -10, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -6, scale: 0.98 },
    transition: { duration: durations.fast2, ease: easings.easeOut },
  },
  toast: {
    initial: { opacity: 0, x: 300, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 300, scale: 0.9 },
    transition: { type: 'spring', stiffness: 500, damping: 35, mass: 0.5 },
  },
  stagger: {
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
      exit: { opacity: 0, transition: { staggerChildren: 0.03, staggerDirection: -1 } },
    },
    item: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -15 },
      transition: { duration: durations.moderate, ease: easings.easeOut },
    },
  },
  staggerFast: {
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
      exit: { opacity: 0, transition: { staggerChildren: 0.02, staggerDirection: -1 } },
    },
    item: {
      initial: { opacity: 0, y: 15 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
      transition: { duration: durations.normal, ease: easings.easeOut },
    },
  },
  list: {
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { staggerChildren: 0.05 } },
      exit: { opacity: 0, transition: { staggerChildren: 0.02, staggerDirection: -1 } },
    },
    item: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
      transition: { duration: durations.moderate, ease: easings.easeOut },
    },
  },
  cardHover: {
    whileHover: {
      y: -8,
      scale: 1.02,
      transition: { type: 'spring', stiffness: 400, damping: 25 },
    },
    whileTap: { scale: 0.98 },
  },
  buttonPress: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.97 },
  },
  buttonPressSubtle: {
    whileHover: { scale: 1.01 },
    whileTap: { scale: 0.99 },
  },
  linkHover: {
    whileHover: { x: 4 },
    whileTap: { x: 2 },
  },
  iconRotate: {
    whileHover: { rotate: 180, transition: { type: 'spring', stiffness: 400, damping: 20 } },
    whileTap: { scale: 0.9 },
  },
  iconPulse: {
    animate: { scale: [1, 1.05, 1] },
    transition: { duration: 2, repeat: Infinity, ease: easings.easeInOut },
  },
  iconBounce: {
    animate: { y: [0, -8, 0] },
    transition: { duration: 1.5, repeat: Infinity, ease: easings.easeInOut },
  },
  shimmer: {
    animate: { backgroundPosition: ['200% 0', '-200% 0'] },
    transition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
  },
  pulseGlow: {
    animate: { boxShadow: ['0 0 20px rgba(255,77,77,0.3)', '0 0 40px rgba(255,77,77,0.5)', '0 0 20px rgba(255,77,77,0.3)'] },
    transition: { duration: 2, repeat: Infinity, ease: easings.easeInOut },
  },
  float: {
    animate: { y: [0, -12, 0] },
    transition: { duration: 3, repeat: Infinity, ease: easings.easeInOut },
  },
  drift: {
    animate: { x: [0, 20, -15, 0], y: [0, -15, 20, 0], rotate: [0, 90, 270, 360] },
    transition: { duration: 20, repeat: Infinity, ease: 'linear' },
  },
};

export const getStaggerDelay = (index, baseDelay = 0.06, startDelay = 0.1) => ({
  transition: { delay: startDelay + index * baseDelay },
});

export const createStaggerVariants = (itemVariants, stagger = 0.06, startDelay = 0.1) => ({
  container: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: stagger, delayChildren: startDelay } },
    exit: { opacity: 0, transition: { staggerChildren: stagger * 0.5, staggerDirection: -1 } },
  },
  item: itemVariants,
});

export const reducedMotionVariants = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.01 } },
  slideUp: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.01 } },
  scale: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.01 } },
};

export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const getMotionConfig = () => {
  const reduced = prefersReducedMotion();
  return {
    reduced,
    durations: reduced ? { ...durations, instant: 0, fast: 0, normal: 0, moderate: 0, slow: 0 } : durations,
    easings: reduced ? { ...easings, spring: [0, 0, 1, 1] } : easings,
  };
};