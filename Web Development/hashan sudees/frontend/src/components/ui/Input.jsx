import { forwardRef, useState } from 'react';
import { motion } from 'framer-motion';

export const Input = forwardRef(({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  style = {},
  id,
  autoComplete,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`floating-label ${className}`} style={style}>
      {leftIcon && (
        <div style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          pointerEvents: 'none',
          zIndex: 1,
        }}>
          {leftIcon}
        </div>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        onFocus={() => setFocused(true)}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
        placeholder=" "
        className="input-field"
        style={{
          paddingLeft: leftIcon ? '48px' : '18px',
          paddingRight: rightIcon ? '48px' : '18px',
          ...props.style,
        }}
        {...props}
      />
      <label
        htmlFor={inputId}
        style={{
          color: error ? 'var(--color-error-500)' : (focused || value ? 'var(--color-primary-500)' : 'var(--text-muted)'),
          top: focused || value ? '6px' : '16px',
          fontSize: focused || value ? '11px' : '15px',
          fontWeight: focused || value ? '700' : '500',
          textTransform: focused || value ? 'uppercase' : 'none',
          letterSpacing: focused || value ? '0.5px' : '0',
          left: leftIcon ? '52px' : '18px',
        }}
      >
        {label} {required && <span style={{ color: 'var(--color-error-500)' }}>*</span>}
      </label>
      {rightIcon && (
        <div style={{
          position: 'absolute',
          right: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          pointerEvents: 'none',
        }}>
          {rightIcon}
        </div>
      )}
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '8px',
            fontSize: '13px',
            color: 'var(--color-error-500)',
            fontWeight: 500,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </motion.span>
      )}
      {helperText && !error && (
        <span style={{ display: 'block', marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>{helperText}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const Textarea = forwardRef(({
  label,
  placeholder = '',
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  helperText,
  rows = 4,
  className = '',
  style = {},
  id,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`floating-label ${className}`} style={style}>
      <textarea
        ref={ref}
        id={textareaId}
        value={value}
        onChange={onChange}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        onFocus={() => setFocused(true)}
        disabled={disabled}
        required={required}
        placeholder=" "
        rows={rows}
        className="input-field"
        style={{
          resize: 'vertical',
          minHeight: `${rows * 28}px`,
          paddingTop: '24px',
          paddingBottom: '10px',
          ...props.style,
        }}
        {...props}
      />
      <label
        htmlFor={textareaId}
        style={{
          top: focused || value ? '6px' : '16px',
          fontSize: focused || value ? '11px' : '15px',
          fontWeight: focused || value ? '700' : '500',
          textTransform: focused || value ? 'uppercase' : 'none',
          letterSpacing: focused || value ? '0.5px' : '0',
          color: error ? 'var(--color-error-500)' : (focused || value ? 'var(--color-primary-500)' : 'var(--text-muted)'),
        }}
      >
        {label} {required && <span style={{ color: 'var(--color-error-500)' }}>*</span>}
      </label>
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px',
            fontSize: '13px', color: 'var(--color-error-500)', fontWeight: 500,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </motion.span>
      )}
      {helperText && !error && (
        <span style={{ display: 'block', marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>{helperText}</span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export const Select = forwardRef(({
  label,
  placeholder = '',
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  helperText,
  options = [],
  className = '',
  style = {},
  id,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`floating-label ${className}`} style={style}>
      <select
        ref={ref}
        id={selectId}
        value={value}
        onChange={onChange}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        onFocus={() => setFocused(true)}
        disabled={disabled}
        required={required}
        className="select-field"
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <label
        htmlFor={selectId}
        style={{
          color: error ? 'var(--color-error-500)' : (focused || value ? 'var(--color-primary-500)' : 'var(--text-muted)'),
          top: focused || value ? '6px' : '16px',
          fontSize: focused || value ? '11px' : '15px',
          fontWeight: focused || value ? '700' : '500',
          textTransform: focused || value ? 'uppercase' : 'none',
          letterSpacing: focused || value ? '0.5px' : '0',
        }}
      >
        {label} {required && <span style={{ color: 'var(--color-error-500)' }}>*</span>}
      </label>
      {error && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px',
            fontSize: '13px', color: 'var(--color-error-500)', fontWeight: 500,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </motion.span>
      )}
      {helperText && !error && (
        <span style={{ display: 'block', marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>{helperText}</span>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export const Checkbox = forwardRef(({
  label,
  checked,
  onChange,
  disabled = false,
  error,
  id,
  className = '',
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: disabled ? 'not-allowed' : 'pointer', ...props }} className={className}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          style={{
            position: 'absolute',
            opacity: 0,
            width: '100%',
            height: '100%',
            cursor: disabled ? 'not-allowed' : 'pointer',
            zIndex: 1,
          }}
        />
        <motion.div
          style={{
            width: 22,
            height: 22,
            borderRadius: 'var(--radius-sm)',
            border: checked ? 'none' : '2px solid var(--border-default)',
            background: checked ? 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all var(--transition-fast)',
            opacity: disabled ? 0.5 : 1,
          }}
          whileHover={!disabled ? { scale: 1.05 } : undefined}
          whileTap={!disabled ? { scale: 0.95 } : undefined}
        >
          {checked && (
            <motion.svg
              initial={{ scale: 0, pathLength: 0 }}
              animate={{ scale: 1, pathLength: 1 }}
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </motion.svg>
          )}
        </motion.div>
      </div>
      <div style={{ flex: 1 }}>
        <span style={{ fontSize: '15px', fontWeight: 500, color: disabled ? 'var(--text-muted)' : 'var(--text-primary)', userSelect: 'none' }}>{label}</span>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'block', marginTop: '4px', fontSize: '12px', color: 'var(--color-error-500)' }}
          >
            {error}
          </motion.span>
        )}
      </div>
    </label>
  );
});

Checkbox.displayName = 'Checkbox';

export const RadioGroup = ({ label, options, value, onChange, error, disabled = false, className = '', ...props }) => (
  <div className={className} {...props}>
    {label && <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px' }}>{label}</label>}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {options.map(opt => (
        <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1 }}>
          <input
            type="radio"
            name={label?.toLowerCase().replace(/\s+/g, '-')}
            value={opt.value}
            checked={value === opt.value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            style={{
              position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: disabled ? 'not-allowed' : 'pointer', zIndex: 1,
            }}
          />
          <motion.div
            style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              border: value === opt.value ? 'none' : '2px solid var(--border-default)',
              background: value === opt.value ? 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all var(--transition-fast)',
            }}
            whileHover={!disabled ? { scale: 1.05 } : undefined}
            whileTap={!disabled ? { scale: 0.95 } : undefined}
          >
            {value === opt.value && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff' }} />}
          </motion.div>
          <span style={{ fontSize: '15px', fontWeight: 500, color: disabled ? 'var(--text-muted)' : 'var(--text-primary)', userSelect: 'none' }}>{opt.label}</span>
        </label>
      ))}
    </div>
    {error && <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'block', marginTop: '8px', fontSize: '13px', color: 'var(--color-error-500)' }}>{error}</motion.span>}
  </div>
);

export const Switch = forwardRef(({
  checked,
  onChange,
  disabled = false,
  label,
  description,
  id,
  className = '',
  ...props
}, ref) => {
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: disabled ? 'not-allowed' : 'pointer', ...props }} className={className}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          ref={ref}
          type="checkbox"
          id={switchId}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: disabled ? 'not-allowed' : 'pointer', zIndex: 1 }}
        />
        <motion.div
          style={{
            width: 48, height: 28, borderRadius: 'var(--radius-full)', flexShrink: 0,
            background: checked ? 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-700))' : 'var(--border-default)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            padding: 3,
            transition: 'all var(--transition-fast)',
            opacity: disabled ? 0.5 : 1,
          }}
          whileHover={!disabled ? { scale: 1.03 } : undefined}
          whileTap={!disabled ? { scale: 0.98 } : undefined}
        >
          <motion.div
            layout
            style={{
              width: 22, height: 22, borderRadius: '50%', background: '#fff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </motion.div>
      </div>
      {(label || description) && (
        <div style={{ userSelect: 'none' }}>
          {label && <span style={{ fontSize: '15px', fontWeight: 500, color: disabled ? 'var(--text-muted)' : 'var(--text-primary)', display: 'block' }}>{label}</span>}
          {description && <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>{description}</span>}
        </div>
      )}
    </label>
  );
});

Switch.displayName = 'Switch';