import { forwardRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOnClickOutside, useKeyboardShortcut } from '../../hooks/useAnimation';

export const Modal = ({ isOpen, onClose, children, title, size = 'md', showClose = true, closeOnOverlay = true, className = '', style = {} }) => {
  const sizes = {
    sm: '400px',
    md: '560px',
    lg: '720px',
    xl: '960px',
    full: 'calc(100vw - 48px)',
  };

  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useOnClickOutside(modalRef, (e) => {
    if (closeOnOverlay && e.target === modalRef.current) onClose?.();
  });

  useKeyboardShortcut('Escape', () => onClose?.());

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 200 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'rgba(10, 10, 18, 0.7)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
        }}
        onClick={(e) => { if (e.target === e.currentTarget && closeOnOverlay) onClose?.(); }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 10 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.6 }}
          style={{
            width: '100%',
            maxWidth: sizes[size],
            maxHeight: 'calc(100vh - 48px)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-xl)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            ...style,
          }}
          className={className}
        >
          {(title || showClose) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 24px',
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-tertiary)',
            }}>
              {title && (
                <h2 id="modal-title" style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                  {title}
                </h2>
              )}
              {showClose && (
                <button
                  onClick={onClose}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                  onMouseEnter={(e) => { e.target.style.background = 'var(--bg-card-hover)'; e.target.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'var(--bg-card)'; e.target.style.color = 'var(--text-secondary)'; }}
                  aria-label="Close"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              )}
            </div>
          )}
          <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

Modal.displayName = 'Modal';

export const AlertDialog = ({ isOpen, onClose, title, description, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm, variant = 'danger', loading = false }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    {description && <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>{description}</p>}
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
      <button
        onClick={onClose}
        disabled={loading}
        style={{
          padding: '12px 24px',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          fontSize: '14px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-primary)',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
          transition: 'all var(--transition-fast)',
        }}
      >
        {cancelText}
      </button>
      <button
        onClick={onConfirm}
        disabled={loading}
        style={{
          padding: '12px 24px',
          borderRadius: 'var(--radius-md)',
          fontWeight: 700,
          fontSize: '14px',
          background: variant === 'danger' ? 'linear-gradient(135deg, var(--color-error-500), #e63d4c)' :
                    variant === 'success' ? 'linear-gradient(135deg, var(--color-success-500), var(--color-success-600))' :
                    'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))',
          border: 'none',
          color: '#fff',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          boxShadow: variant === 'danger' ? '0 4px 16px rgba(255, 71, 87, 0.3)' :
                     variant === 'success' ? '0 4px 16px rgba(88, 204, 2, 0.3)' :
                     '0 4px 16px rgba(255, 77, 77, 0.3)',
          transition: 'all var(--transition-fast)',
        }}
      >
        {loading ? 'Processing...' : confirmText}
      </button>
    </div>
  </Modal>
);

export const Drawer = ({ isOpen, onClose, children, title, side = 'right', size = 'md', className = '', style = {} }) => {
  const sizes = {
    sm: '320px',
    md: '440px',
    lg: '560px',
    full: '100%',
  };

  const sideStyles = {
    right: { right: 0, transformOrigin: 'right' },
    left: { left: 0, transformOrigin: 'left' },
    top: { top: 0, transformOrigin: 'top' },
    bottom: { bottom: 0, transformOrigin: 'bottom' },
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 200 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: 'rgba(10, 10, 18, 0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ x: side === 'right' ? '100%' : side === 'left' ? '-100%' : 0, y: side === 'top' ? '-100%' : side === 'bottom' ? '100%' : 0 }}
        animate={{ x: 0, y: 0 }}
        exit={{ x: side === 'right' ? '100%' : side === 'left' ? '-100%' : 0, y: side === 'top' ? '-100%' : side === 'bottom' ? '100%' : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        style={{
          position: 'fixed',
          [side === 'right' || side === 'left' ? 'height' : 'width']: '100%',
          [side === 'top' || side === 'bottom' ? 'width' : 'height']: 'auto',
          maxWidth: side === 'right' || side === 'left' ? sizes[size] : '100%',
          maxHeight: side === 'top' || side === 'bottom' ? sizes[size] : '100%',
          background: 'var(--bg-secondary)',
          border: side === 'right' ? '1px solid var(--border-default)' : side === 'left' ? '1px solid var(--border-default)' : 'none',
          borderLeft: side === 'left' ? '1px solid var(--border-default)' : 'none',
          borderRight: side === 'right' ? '1px solid var(--border-default)' : 'none',
          borderTop: side === 'top' ? '1px solid var(--border-default)' : 'none',
          borderBottom: side === 'bottom' ? '1px solid var(--border-default)' : 'none',
          boxShadow: 'var(--shadow-xl)',
          display: 'flex',
          flexDirection: 'column',
          [side]: 0,
          ...sideStyles[side],
          ...style,
        }}
        className={className}
        onClick={(e) => e.stopPropagation()}
      >
        {(title) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-tertiary)',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' }}>{title}</h2>
            <button onClick={onClose} style={{ width: 36, height: 36, borderRadius: 'var(--radius-full)', background: 'var(--bg-card)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        )}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

import { useRef } from 'react';