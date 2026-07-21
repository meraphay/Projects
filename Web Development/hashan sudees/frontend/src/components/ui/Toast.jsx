import { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

const toastIcons = {
  success: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  ),
  error: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>
  ),
  warning: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  ),
  info: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  ),
  loading: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"></path>
    </svg>
  ),
};

const toastStyles = {
  success: { background: 'linear-gradient(135deg, var(--color-success-500), var(--color-success-600))', color: '#fff', iconColor: '#fff' },
  error: { background: 'linear-gradient(135deg, var(--color-error-500), #e63d4c)', color: '#fff', iconColor: '#fff' },
  warning: { background: 'linear-gradient(135deg, var(--color-warning-500), #e69302)', color: '#fff', iconColor: '#fff' },
  info: { background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))', color: '#fff', iconColor: '#fff' },
  loading: { background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))', color: '#fff', iconColor: '#fff' },
};

export const Toast = ({ toast, onClose }) => {
  const style = toastStyles[toast.type] || toastStyles.info;
  const Icon = toastIcons[toast.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 350, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 350, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 35, mass: 0.5 }}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        padding: '18px 20px',
        borderRadius: 'var(--radius-xl)',
        background: style.background,
        color: style.color,
        boxShadow: 'var(--shadow-xl)',
        minWidth: 320,
        maxWidth: 420,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.1)', opacity: 0 }} />
      <span style={{ display: 'flex', flexShrink: 0, color: style.iconColor }}>{Icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {toast.title && (
          <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: toast.message ? 4 : 0 }}>{toast.title}</div>
        )}
        {toast.message && (
          <div style={{ fontSize: '14px', lineHeight: 1.5, opacity: 0.95 }}>{toast.message}</div>
        )}
      </div>
      <button
        onClick={onClose}
        style={{
          width: 28, height: 28, borderRadius: 'var(--radius-md)', flexShrink: 0,
          background: 'rgba(255,255,255,0.15)', border: 'none', color: style.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          transition: 'background var(--transition-fast)',
        }}
        onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.25)'}
        onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
        aria-label="Dismiss"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
      {toast.duration && (
        <motion.div
          initial={{ scaleX: 1 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: toast.duration / 1000, ease: 'linear' }}
          style={{
            position: 'absolute', bottom: 0, left: 0, height: 3,
            background: 'rgba(255,255,255,0.3)', borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
            transformOrigin: 'left center',
          }}
        />
      )}
    </motion.div>
  );
};

export const Toaster = ({ position = 'top-right', maxToasts = 5, gap = 12, className = '' }) => {
  const { toasts } = useContext(ToastContext);

  const positions = {
    'top-right': { top: 24, right: 24, bottom: 'auto', left: 'auto', flexDirection: 'column-reverse' },
    'top-left': { top: 24, left: 24, bottom: 'auto', right: 'auto', flexDirection: 'column-reverse' },
    'bottom-right': { bottom: 24, right: 24, top: 'auto', left: 'auto', flexDirection: 'column' },
    'bottom-left': { bottom: 24, left: 24, top: 'auto', right: 'auto', flexDirection: 'column' },
    'top-center': { top: 24, left: '50%', transform: 'translateX(-50%)', bottom: 'auto', right: 'auto', flexDirection: 'column-reverse' },
    'bottom-center': { bottom: 24, left: '50%', transform: 'translateX(-50%)', top: 'auto', right: 'auto', flexDirection: 'column' },
  };

  const pos = positions[position];
  const visibleToasts = toasts.slice(-maxToasts);

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          zIndex: 800,
          display: 'flex',
          flexDirection: pos.flexDirection,
          gap,
          pointerEvents: 'none',
          ...pos,
        }}
        className={className}
        role="region"
        aria-live="polite"
        aria-label="Notifications"
      >
        {visibleToasts.map(toast => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </AnimatePresence>
  );
};

export const ToastProvider = ({ children, position = 'top-right', maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast,
    };
    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const toast = useCallback((options) => {
    if (typeof options === 'string') {
      return addToast({ message: options });
    }
    return addToast(options);
  }, [addToast]);

  const api = {
    success: (title, message, options = {}) => toast({ type: 'success', title, message, ...options }),
    error: (title, message, options = {}) => toast({ type: 'error', title, message, ...options }),
    warning: (title, message, options = {}) => toast({ type: 'warning', title, message, ...options }),
    info: (title, message, options = {}) => toast({ type: 'info', title, message, ...options }),
    loading: (title, message, options = {}) => toast({ type: 'loading', title, message, duration: 0, ...options }),
    dismiss: removeToast,
    clear: clearToasts,
    promise: (promise, messages) => {
      const loadingId = toast.loading(messages.loading?.title, messages.loading?.message);
      return promise
        .then(result => {
          removeToast(loadingId);
          toast.success(messages.success?.title || 'Success', messages.success?.message);
          return result;
        })
        .catch(error => {
          removeToast(loadingId);
          toast.error(messages.error?.title || 'Error', messages.error?.message || error.message);
          throw error;
        });
    },
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <Toaster position={position} maxToasts={maxToasts} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const useNotification = () => {
  const { success, error, warning, info, loading, dismiss, clear, promise } = useToast();
  return { success, error, warning, info, loading, dismiss, clear, promise };
};