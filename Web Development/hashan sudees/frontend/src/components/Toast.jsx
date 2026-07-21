import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ToastContext = createContext(null)

let toastId = 0

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) {
    return { show: (message, type = 'success') => console.log(`[${type}] ${message}`) }
  }
  return ctx
}

export default function Toast() {
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
    return id
  }, [])

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ show, remove }}>
      <div style={{
        position: 'fixed', top: 88, right: 24, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 10, pointerEvents: 'none',
      }}>
        <AnimatePresence>
          {toasts.map(t => {
            const colors = {
              success: { bg: 'rgba(88,204,2,0.12)', border: 'rgba(88,204,2,0.3)', text: '#58cc02' },
              error: { bg: 'rgba(255,71,87,0.12)', border: 'rgba(255,71,87,0.3)', text: '#ff4757' },
              info: { bg: 'rgba(108,92,231,0.12)', border: 'rgba(108,92,231,0.3)', text: '#6c5ce7' },
            }
            const c = colors[t.type] || colors.info
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 80, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 80, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                onClick={() => remove(t.id)}
                style={{
                  pointerEvents: 'auto', cursor: 'pointer',
                  padding: '14px 20px', borderRadius: 14,
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  color: c.text,
                  fontWeight: 600, fontSize: 14,
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  maxWidth: 380, minWidth: 280,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                {t.type === 'success' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                )}
                {t.type === 'error' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>
                )}
                {t.type === 'info' && (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
                )}
                {t.message}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export { ToastContext }
