import React, { useRef, useCallback } from 'react';
import { Keyboard, Hash } from 'lucide-react';
import { useVirtualInputContext, VirtualInputMode } from '../../context/VirtualInputContext';

// ─── Props ────────────────────────────────────────────────────────────────────

interface VirtualInputFieldProps {
  /** 'text' opens the QWERTY keyboard; 'numeric' opens the numpad */
  mode?: VirtualInputMode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Optional label rendered above the field */
  label?: string;
  /** Optional helper text rendered below the field */
  hint?: string;
  disabled?: boolean;
  /** Node rendered on the left side of the field (e.g. currency prefix "Rp") */
  prefix?: React.ReactNode;
  /** Node rendered on the right side (e.g. unit "pax") */
  suffix?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VirtualInputField({
  mode = 'text',
  value,
  onChange,
  placeholder,
  label,
  hint,
  disabled,
  prefix,
  suffix,
  style,
  className,
}: VirtualInputFieldProps) {
  const ctx = useVirtualInputContext();
  const ref = useRef<HTMLDivElement>(null);

  // Derived: is this field's overlay currently open?
  const isActive = !!(ctx.activeAnchor && ref.current && ctx.activeAnchor === ref.current);

  const handleOpen = useCallback((e?: React.PointerEvent) => {
    if (disabled || !ref.current) return;
    if (isActive) return;
    if (e) e.preventDefault();
    ctx.openFor(mode, value, onChange, ref.current);
  }, [ctx, mode, value, onChange, disabled, isActive]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label
          style={{
            fontFamily: 'Lato, sans-serif',
            fontSize:   'var(--text-label)',
            fontWeight: 'var(--font-weight-semibold)',
            color:      'var(--neutral-onsurface-primary)',
            display:    'block',
          }}
        >
          {label}
        </label>
      )}

      {/* Input surface */}
      <div
        ref={ref}
        role="textbox"
        aria-readonly="true"
        aria-disabled={disabled}
        tabIndex={disabled ? undefined : 0}
        onPointerDown={(e) => handleOpen(e)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOpen(); }
        }}
        className={className}
        style={{
          display:         'flex',
          alignItems:      'center',
          gap:             '8px',
          padding:         '0 14px',
          height:          '52px',
          borderRadius:    'var(--radius-input)',
          border:          `1.5px solid ${isActive
            ? 'var(--feature-brand-primary)'
            : 'var(--neutral-line-outline)'}`,
          backgroundColor: disabled
            ? 'var(--neutral-surface-greylighter)'
            : 'var(--neutral-surface-primary)',
          cursor:       disabled ? 'not-allowed' : 'pointer',
          boxShadow:    isActive ? '0 0 0 3px rgba(0,107,255,0.12)' : 'none',
          transition:   'border-color 0.15s, box-shadow 0.15s',
          outline:      'none',
          userSelect:   'none',
          WebkitUserSelect: 'none',
          touchAction:  'none',
          ...style,
        }}
      >
        {/* Prefix */}
        {prefix && (
          <span style={{
            fontFamily: 'Lato, sans-serif',
            fontSize:   'var(--text-p)',
            color:      'var(--neutral-onsurface-tertiary)',
            flexShrink: 0,
          }}>
            {prefix}
          </span>
        )}

        {/* Value / placeholder */}
        <span style={{
          flex:          1,
          fontFamily:    'Lato, sans-serif',
          fontSize:      'var(--text-p)',
          fontWeight:    'var(--font-weight-normal)',
          color:         value
            ? disabled
              ? 'var(--neutral-onsurface-tertiary)'
              : 'var(--neutral-onsurface-primary)'
            : 'var(--neutral-onsurface-tertiary)',
          overflow:      'hidden',
          textOverflow:  'ellipsis',
          whiteSpace:    'nowrap',
        }}>
          {value !== '' ? value : (placeholder ?? '')}
        </span>

        {/* Suffix */}
        {suffix && (
          <span style={{
            fontFamily: 'Lato, sans-serif',
            fontSize:   'var(--text-p)',
            color:      'var(--neutral-onsurface-tertiary)',
            flexShrink: 0,
          }}>
            {suffix}
          </span>
        )}

        {/* Input-mode icon */}
        {!disabled && (
          <span style={{
            color:      isActive
              ? 'var(--feature-brand-primary)'
              : 'var(--neutral-onsurface-tertiary)',
            flexShrink: 0,
            display:    'flex',
            transition: 'color 0.15s',
          }}>
            {mode === 'numeric' ? <Hash size={16} /> : <Keyboard size={16} />}
          </span>
        )}
      </div>

      {/* Hint */}
      {hint && (
        <span style={{
          fontFamily: 'Lato, sans-serif',
          fontSize:   'var(--text-label)',
          color:      'var(--neutral-onsurface-tertiary)',
        }}>
          {hint}
        </span>
      )}
    </div>
  );
}