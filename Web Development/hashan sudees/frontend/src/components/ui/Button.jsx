import { forwardRef, useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  style = {},
  ...props
}, ref) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    fontWeight: 700,
    fontFamily: 'inherit',
    borderRadius: 'var(--radius-md)',
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all var(--transition-base)',
    position: 'relative',
    overflow: 'hidden',
    textDecoration: 'none',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled || loading ? 0.6 : 1,
    pointerEvents: disabled || loading ? 'none' : 'auto',
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
      color: '#fff',
      boxShadow: '0 4px 16px rgba(255, 77, 77, 0.3)',
    },
    secondary: {
      background: 'var(--bg-card-elevated)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-sm)',
    },
    outline: {
      background: 'transparent',
      color: 'var(--color-primary-400)',
      border: '1.5px solid var(--color-primary-500)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
    },
    danger: {
      background: 'linear-gradient(135deg, var(--color-error-500), #e63d4c)',
      color: '#fff',
      boxShadow: '0 4px 16px rgba(255, 71, 87, 0.3)',
    },
    success: {
      background: 'linear-gradient(135deg, var(--color-success-500), var(--color-success-600))',
      color: '#fff',
      boxShadow: '0 4px 16px rgba(88, 204, 2, 0.3)',
    },
  };

  const sizes = {
    sm: { padding: '10px 20px', fontSize: '13px', gap: 6, minHeight: 36 },
    md: { padding: '14px 32px', fontSize: '15px', gap: 10, minHeight: 44 },
    lg: { padding: '18px 40px', fontSize: '16px', gap: 12, minHeight: 52 },
    xl: { padding: '22px 48px', fontSize: '17px', gap: 14, minHeight: 60 },
    icon: { padding: '12px', fontSize: '15px', minWidth: 44, minHeight: 44 },
  };

  const combinedStyle = {
    ...baseStyles,
    ...variants[variant],
    ...sizes[size],
    ...style,
  };

  const hoverAnimation = variant === 'ghost' 
    ? { background: 'var(--bg-card-hover)' }
    : variant === 'outline'
      ? { background: 'rgba(255, 77, 77, 0.1)', transform: 'translateY(-1px)' }
      : { transform: 'translateY(-2px)', boxShadow: variants[variant].boxShadow?.replace('0.3', '0.45') || '0 8px 24px rgba(0,0,0,0.3)' };

  return (
    <motion.button
      ref={ref}
      style={combinedStyle}
      className={className}
      whileHover={!disabled && !loading ? hoverAnimation : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
      {...props}
    >
      {loading && (
        <motion.svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          style={{ position: 'absolute' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="31.4 31.4"
            style={{ opacity: 0.3 }}
          />
          <path
            d="M12 2C6.48 2 2 6.48 2 12"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </motion.svg>
      )}
      {!loading && leftIcon && <span style={{ display: 'flex' }}>{leftIcon}</span>}
      <span style={{ position: loading ? 'absolute' : 'relative', whiteSpace: 'nowrap' }}>{children}</span>
      {!loading && rightIcon && <span style={{ display: 'flex' }}>{rightIcon}</span>}
    </motion.button>
  );
});

Button.displayName = 'Button';

export const IconButton = forwardRef(({
  children,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  loading = false,
  'aria-label': ariaLabel,
  className = '',
  style = {},
  ...props
}, ref) => {
  const sizes = {
    sm: 36,
    md: 44,
    lg: 52,
  };

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      disabled={disabled}
      loading={loading}
      aria-label={ariaLabel}
      className={className}
      style={{ ...style, width: sizes[size], height: sizes[size], padding: 0, minWidth: sizes[size], borderRadius: 'var(--radius-full)' }}
      {...props}
    >
      {children}
    </Button>
  );
});

IconButton.displayName = 'IconButton';

export const ButtonGroup = ({ children, className = '', ...props }) => (
  <div className={`flex gap-2 ${className}`} role="group" {...props}>
    {children}
  </div>
);

export const ToggleButton = forwardRef(({
  children,
  pressed,
  onChange,
  variant = 'outline',
  size = 'md',
  disabled = false,
  className = '',
  style = {},
  ...props
}, ref) => {
  const [isPressed, setIsPressed] = useState(pressed ?? false);

  const handleClick = () => {
    if (disabled) return;
    const newPressed = !isPressed;
    setIsPressed(newPressed);
    onChange?.(newPressed);
  };

  return (
    <Button
      ref={ref}
      variant={isPressed ? 'primary' : variant}
      size={size}
      disabled={disabled}
      onClick={handleClick}
      className={className}
      style={style}
      {...props}
    >
      {children}
    </Button>
  );
});

ToggleButton.displayName = 'ToggleButton';

export const DropdownButton = forwardRef(({
  children,
  trigger,
  items,
  variant = 'secondary',
  size = 'md',
  align = 'right',
  className = '',
  ...props
}, ref) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOnClickOutside(dropdownRef, () => setOpen(false));

  return (
    <div ref={dropdownRef} className="relative inline-block" {...props}>
      <Button
        ref={ref}
        variant={variant}
        size={size}
        rightIcon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>}
        onClick={() => setOpen(!open)}
        className={className}
      >
        {trigger ?? children}
      </Button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            [align]: 0,
            zIndex: 500,
            minWidth: 200,
            background: 'var(--bg-card-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            padding: '8px',
            overflow: 'hidden',
          }}
        >
          {items.map((item, index) => (
            <motion.button
              key={item.key || index}
              onClick={() => { item.onClick?.(); setOpen(false); }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                border: 'none',
                color: item.danger ? 'var(--color-error-500)' : 'var(--text-primary)',
                fontSize: 14,
                fontWeight: 500,
                textAlign: 'left',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.5 : 1,
              }}
              whileHover={!item.disabled ? { background: 'var(--bg-card-hover)' } : undefined}
              whileTap={!item.disabled ? { scale: 0.98 } : undefined}
              disabled={item.disabled}
            >
              {item.icon && <span style={{ display: 'flex' }}>{item.icon}</span>}
              {item.label}
              {item.shortcut && <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 12 }}>{item.shortcut}</span>}
            </motion.button>
          ))}
        </motion.div>
      )}
    </div>
  );
});

DropdownButton.displayName = 'DropdownButton';

export const LoadingButton = ({ children, ...props }) => (
  <Button loading {...props}>{children}</Button>
);
