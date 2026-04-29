import React, { useState } from 'react';
import { Delete, X, Check } from 'lucide-react';

interface VirtualNumpadProps {
  value:         string;
  onChange:      (value: string) => void;
  onClose:       () => void;
  allowDecimal?: boolean;
}

const NUM_ROWS = [
  ['7', '8', '9'],
  ['4', '5', '6'],
  ['1', '2', '3'],
  ['.', '0', '⌫'],
] as const;

// ── Size tokens ────────────────────────────────────────────────────────────────
const PAD_W       = 380;    // increased from 340 for easier tap
const KEY_H       = 80;     // increased from 72 for easier tap
const KEY_GAP     = 12;     // increased from 10 for better spacing
const BOTTOM_H    = 68;     // increased from 60
const DISPLAY_H   = 72;     // increased from 64

export function VirtualNumpad({ value, onChange, onClose, allowDecimal = true }: VirtualNumpadProps) {
  const [pressed, setPressed] = useState<string | null>(null);

  const handle = (key: string) => {
    if (key === '⌫') {
      onChange(value.slice(0, -1));
    } else if (key === '.') {
      if (!allowDecimal || value.includes('.')) return;
      onChange((value || '0') + '.');
    } else {
      onChange(value + key);
    }
  };

  const press = (key: string) => {
    setPressed(key);
    handle(key);
    setTimeout(() => setPressed(null), 120);
  };

  return (
    <div
      style={{
        backgroundColor:  'var(--neutral-surface-primary)',
        borderRadius:     'var(--radius-card)',
        boxShadow:        '0 12px 40px rgba(0,0,0,0.28), 0 4px 12px rgba(0,0,0,0.12)',
        border:           '1px solid var(--neutral-line-outline)',
        padding:          '14px',
        width:            `${PAD_W}px`,
        display:          'flex',
        flexDirection:    'column',
        gap:              `${KEY_GAP}px`,
        userSelect:       'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* ── Value display with inline cursor ───────────────────────────────────── */}
      <div
        style={{
          backgroundColor: 'var(--neutral-surface-greylighter)',
          borderRadius:    'var(--radius-input)',
          padding:         '0 18px',
          minHeight:       `${DISPLAY_H}px`,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'flex-end',
          marginBottom:    '2px',
          border:          '1.5px solid var(--feature-brand-primary)',
          overflow:        'hidden',
        }}
      >
        {/* Text + cursor sit together so cursor is always right after the digit */}
        <span
          style={{
            display:     'inline-flex',
            alignItems:  'center',
            gap:         2,
            maxWidth:    '100%',
            overflow:    'hidden',
          }}
        >
          <span
            style={{
              fontFamily:   'Lato, sans-serif',
              fontSize:     'var(--text-h1)',
              fontWeight:   'var(--font-weight-bold)',
              color:        value ? 'var(--neutral-onsurface-primary)' : 'var(--neutral-onsurface-tertiary)',
              letterSpacing:'0.02em',
              whiteSpace:   'nowrap',
              overflow:     'hidden',
              textOverflow: 'ellipsis',
              direction:    'rtl',   // show rightmost chars when value is long
              textAlign:    'left',
            }}
          >
            {value || '0'}
          </span>

          {/* Blinking cursor — inline right after digits */}
          <span
            style={{
              display:         'inline-block',
              width:           3,
              height:          '0.85em',
              backgroundColor: 'var(--feature-brand-primary)',
              borderRadius:    2,
              flexShrink:      0,
              animation:       'virtualCursorBlink 1s step-end infinite',
            }}
          />
        </span>
      </div>

      {/* ── Number key rows ────────────────────────────────────────────────────── */}
      {NUM_ROWS.map((row, ri) => (
        <div key={ri} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: `${KEY_GAP}px` }}>
          {row.map((key) => {
            const isBack   = key === '⌫';
            const isDot    = key === '.';
            const off      = isDot && !allowDecimal;
            const isActive = pressed === key;

            return (
              <button
                key={key}
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!off) press(key);
                }}
                style={{
                  height:          `${KEY_H}px`,
                  borderRadius:    'var(--radius-small)',
                  border:          '1.5px solid var(--neutral-line-outline)',
                  backgroundColor: isActive
                    ? 'var(--neutral-surface-grey-darker)'
                    : isBack
                      ? 'var(--neutral-surface-greylighter)'
                      : 'var(--neutral-surface-primary)',
                  cursor:          off ? 'default' : 'pointer',
                  fontFamily:      'Lato, sans-serif',
                  fontSize:        'var(--text-h2)',
                  fontWeight:      'var(--font-weight-semibold)',
                  color:           off
                    ? 'var(--neutral-onsurface-tertiary)'
                    : 'var(--neutral-onsurface-primary)',
                  display:         'flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  opacity:         off ? 0.4 : 1,
                  transform:       isActive ? 'scale(0.94)' : 'scale(1)',
                  transition:      'background-color 0.08s, transform 0.08s',
                  touchAction:     'none',
                }}
              >
                {isBack ? <Delete size={22} /> : key}
              </button>
            );
          })}
        </div>
      ))}

      {/* ── Clear + Done ───────────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${KEY_GAP}px`, marginTop: '2px' }}>
        <button
          type="button"
          onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onChange(''); }}
          style={{
            height:          `${BOTTOM_H}px`,
            borderRadius:    'var(--radius-button)',
            border:          '1.5px solid var(--neutral-line-outline)',
            backgroundColor: 'var(--neutral-surface-greylighter)',
            cursor:          'pointer',
            fontFamily:      'Lato, sans-serif',
            fontSize:        'var(--text-p)',
            fontWeight:      'var(--font-weight-semibold)',
            color:           'var(--neutral-onsurface-primary)',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            gap:             '7px',
            touchAction:     'none',
          }}
        >
          <X size={16} />
          Clear
        </button>

        <button
          type="button"
          onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
          style={{
            height:          `${BOTTOM_H}px`,
            borderRadius:    'var(--radius-button)',
            border:          'none',
            backgroundColor: 'var(--feature-brand-primary)',
            cursor:          'pointer',
            fontFamily:      'Lato, sans-serif',
            fontSize:        'var(--text-p)',
            fontWeight:      'var(--font-weight-semibold)',
            color:           'var(--primary-foreground)',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            gap:             '7px',
            touchAction:     'none',
          }}
        >
          <Check size={16} />
          Done
        </button>
      </div>
    </div>
  );
}