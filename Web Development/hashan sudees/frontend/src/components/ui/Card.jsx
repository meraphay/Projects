import { forwardRef } from 'react';
import { motion } from 'framer-motion';

export const Card = forwardRef(({
  children,
  variant = 'default',
  padding = 'lg',
  hover = false,
  className = '',
  style = {},
  ...props
}, ref) => {
  const variants = {
    default: {
      background: 'var(--bg-card)',
      border: '1px solid var(--border-default)',
    },
    elevated: {
      background: 'var(--bg-card-elevated)',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-md)',
    },
    strong: {
      background: 'var(--bg-card-elevated)',
      border: '1px solid var(--border-default)',
      backdropFilter: 'blur(32px)',
      WebkitBackdropFilter: 'blur(32px)',
    },
    gradient: {
      background: 'linear-gradient(135deg, rgba(255,77,77,0.05), rgba(108,92,231,0.05))',
      border: '1px solid transparent',
      position: 'relative',
    },
    outline: {
      background: 'transparent',
      border: '1px solid var(--border-hover)',
    },
  };

  const paddings = {
    none: 0,
    sm: '12px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  };

  const combinedStyle = {
    borderRadius: 'var(--radius-xl)',
    padding: paddings[padding],
    ...variants[variant],
    ...style,
  };

  if (variant === 'gradient') {
    return (
      <motion.div
        ref={ref}
        style={{ ...combinedStyle, overflow: 'hidden', position: 'relative' }}
        className={className}
        whileHover={hover ? { scale: 1.02, boxShadow: 'var(--shadow-glow)' } : undefined}
        whileTap={hover ? { scale: 0.99 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        {...props}
      >
        <div style={{ position: 'absolute', inset: 0, padding: '1px', borderRadius: 'inherit', background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-secondary-500))', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude', pointerEvents: 'none' }} />
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      style={combinedStyle}
      className={className}
      whileHover={hover ? { y: -8, scale: 1.02, boxShadow: 'var(--shadow-xl)' } : undefined}
      whileTap={hover ? { scale: 0.99 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

Card.displayName = 'Card';

export const CardHeader = ({ children, className = '', style = {} }) => (
  <div className={className} style={{ marginBottom: '16px', ...style }}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', style = {} }) => (
  <h3 className={className} style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', ...style }}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '', style = {} }) => (
  <p className={className} style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginTop: '4px', lineHeight: 1.6, ...style }}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '', style = {} }) => (
  <div className={className} style={{ ...style }}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', style = {} }) => (
  <div className={className} style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '16px', marginTop: '16px', borderTop: '1px solid var(--border-subtle)', ...style }}>
    {children}
  </div>
);

export const CardGrid = ({ children, columns = 3, gap = '24px', className = '', style = {} }) => (
  <div
    className={className}
    style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap,
      '@media (max-width: 1024px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
      '@media (max-width: 640px)': { gridTemplateColumns: '1fr' },
      ...style,
    }}
  >
    {children}
  </div>
);

export const CardStack = ({ children, gap = '16px', className = '', style = {} }) => (
  <div
    className={className}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap,
      ...style,
    }}
  >
    {children}
  </div>
);

export const GlassCard = ({ children, className = '', style = {}, ...props }) => (
  <Card
    variant="strong"
    className={className}
    style={{
      background: 'var(--bg-card)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid var(--border-default)',
      ...style,
    }}
    {...props}
  >
    {children}
  </Card>
);