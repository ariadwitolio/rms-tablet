import React, { useState, useEffect, useRef } from 'react';
import { Delete, ArrowUp, Check } from 'lucide-react';

type KbdMode = 'lower' | 'upper' | 'numbers';

interface VirtualKeyboardProps {
  value:       string;
  onChange:    (value: string) => void;
  onClose:     () => void;
  placeholder?: string;
}

const ROWS: Record<KbdMode, { r1: string[]; r2: string[]; r3mid: string[] }> = {
  lower:   { r1: ['q','w','e','r','t','y','u','i','o','p'], r2: ['a','s','d','f','g','h','j','k','l'], r3mid: ['z','x','c','v','b','n','m'] },
  upper:   { r1: ['Q','W','E','R','T','Y','U','I','O','P'], r2: ['A','S','D','F','G','H','J','K','L'], r3mid: ['Z','X','C','V','B','N','M'] },
  numbers: { r1: ['1','2','3','4','5','6','7','8','9','0'], r2: ['-','/',':', ';','(',')', '@','.', ','], r3mid: ['#','=','+','!','?',"'",'"'] },
};

// ── Key sizes ──────────────────────────────────────────────────────────────────
const KEY_H        = 56;
const KEY_GAP      = 5;
const ROW2_INDENT  = 32;   // px offset each side to visually centre row 2
// KEY_FONT deliberately omitted — all key text uses var(--text-h4) via keyStyle()

type KeyVariant = 'default' | 'special' | 'active' | 'pressed';

function keyStyle(variant: KeyVariant = 'default'): React.CSSProperties {
  return {
    height:           `${KEY_H}px`,
    borderRadius:     'var(--radius-small)',
    border:           `1px solid ${variant === 'active' ? 'var(--feature-brand-primary)' : 'var(--neutral-line-outline)'}`,
    backgroundColor:
      variant === 'active'  ? 'var(--feature-brand-container-light)' :
      variant === 'pressed' ? 'var(--neutral-surface-grey-darker)'   :
      variant === 'special' ? 'var(--neutral-surface-greylighter)'   :
                              'var(--neutral-surface-primary)',
    cursor:           'pointer',
    fontFamily:       'Lato, sans-serif',
    fontSize:         'var(--text-h4)',
    fontWeight:       'var(--font-weight-semibold)',
    color:            variant === 'active' ? 'var(--feature-brand-primary)' : 'var(--neutral-onsurface-primary)',
    display:          'flex',
    alignItems:       'center',
    justifyContent:   'center',
    transition:       'background-color 0.07s, transform 0.07s',
    userSelect:       'none' as const,
    WebkitUserSelect: 'none' as const,
    flexShrink:       0,
    touchAction:      'none',
    transform:        variant === 'pressed' ? 'scale(0.93)' : 'scale(1)',
  };
}

export function VirtualKeyboard({ value, onChange, onClose, placeholder }: VirtualKeyboardProps) {
  const [mode, setMode]       = useState<KbdMode>('lower');
  const [pressed, setPressed] = useState<string | null>(null);
  const displayRef            = useRef<HTMLDivElement>(null);

  // Auto-scroll the value display so the cursor stays visible
  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [value]);

  const handle = (key: string) => {
    if (key === '⌫')   { onChange(value.slice(0, -1)); return; }
    if (key === '⇧')   { setMode(m => m === 'lower' ? 'upper' : 'lower'); return; }
    if (key === '123')  { setMode('numbers'); return; }
    if (key === 'ABC')  { setMode('lower');   return; }
    if (key === ' ')   { onChange(value + ' '); return; }
    if (key === '↵')   { onChange(value + '\n'); return; }
    onChange(value + key);
    if (mode === 'upper') setMode('lower');
  };

  const press = (key: string) => {
    setPressed(key);
    handle(key);
    setTimeout(() => setPressed(null), 100);
  };

  const btn = (key: string, variant: KeyVariant = 'default', extraStyle?: React.CSSProperties) => (
    <button
      key={key}
      type="button"
      onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); press(key); }}
      style={{ ...keyStyle(pressed === key ? 'pressed' : variant), ...extraStyle }}
    >
      {key === '⌫'  ? <Delete size={18} />  :
       key === '⇧'  ? <ArrowUp size={18} /> :
       key === '↵'  ? <span style={{ fontSize: '18px' }}>↵</span> :
       key}
    </button>
  );

  const { r1, r2, r3mid } = ROWS[mode];

  const isEmpty = value === '' || value === undefined || value === null;

  return (
    <div
      style={{
        backgroundColor:  'var(--neutral-surface-greylighter)',
        borderRadius:     'var(--radius-card)',
        boxShadow:        '0 12px 40px rgba(0,0,0,0.28), 0 4px 12px rgba(0,0,0,0.12)',
        border:           '1px solid var(--neutral-line-outline)',
        padding:          '12px',
        display:          'flex',
        flexDirection:    'column',
        gap:              `${KEY_GAP + 1}px`,
        userSelect:       'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* ── Value display with inline cursor ──────────────────────────────────── */}
      <div
        ref={displayRef}
        style={{
          backgroundColor: 'var(--neutral-surface-primary)',
          border:          '1.5px solid var(--feature-brand-primary)',
          borderRadius:    'var(--radius-input)',
          padding:         '9px 14px',
          minHeight:       '46px',
          display:         'flex',
          alignItems:      'center',
          overflowX:       'auto',
          overflowY:       'hidden',
          whiteSpace:      'nowrap',
          scrollbarWidth:  'none',
          msOverflowStyle: 'none' as unknown as undefined,
        }}
      >
        {isEmpty ? (
          // Placeholder + cursor at start position
          <span
            style={{
              fontFamily: 'Lato, sans-serif',
              fontSize:   'var(--text-p)',
              color:      'var(--neutral-onsurface-tertiary)',
              display:    'inline-flex',
              alignItems: 'center',
              gap:        1,
            }}
          >
            {placeholder || 'Start typing…'}
            <BlinkCursor />
          </span>
        ) : (
          // Actual value + cursor inline right after last char
          <span
            style={{
              fontFamily:  'Lato, sans-serif',
              fontSize:    'var(--text-p)',
              color:       'var(--neutral-onsurface-primary)',
              display:     'inline-flex',
              alignItems:  'center',
              whiteSpace:  'pre',
              lineHeight:  1.5,
            }}
          >
            {value}
            <BlinkCursor />
          </span>
        )}
      </div>

      {/* ── Row 1 — 10 keys ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: `${KEY_GAP}px` }}>
        {r1.map(k => (
          <button
            key={k}
            type="button"
            onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); press(k); }}
            style={{ ...keyStyle(pressed === k ? 'pressed' : 'default'), flex: 1 }}
          >
            {k}
          </button>
        ))}
      </div>

      {/* ── Row 2 — 9 keys, centred ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: `${KEY_GAP}px`, paddingLeft: ROW2_INDENT, paddingRight: ROW2_INDENT }}>
        {r2.map(k => (
          <button
            key={k}
            type="button"
            onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); press(k); }}
            style={{ ...keyStyle(pressed === k ? 'pressed' : 'default'), flex: 1 }}
          >
            {k}
          </button>
        ))}
      </div>

      {/* ── Row 3 — shift / letters / backspace ────────��─────────────────────────── */}
      <div style={{ display: 'flex', gap: `${KEY_GAP}px` }}>
        {mode !== 'numbers'
          ? btn('⇧', mode === 'upper' ? 'active' : 'special', { width: '60px' })
          : <div style={{ width: '60px', flexShrink: 0 }} />
        }

        {r3mid.map(k => (
          <button
            key={k}
            type="button"
            onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); press(k); }}
            style={{ ...keyStyle(pressed === k ? 'pressed' : 'default'), flex: 1 }}
          >
            {k}
          </button>
        ))}

        {btn('⌫', 'special', { width: '60px' })}
      </div>

      {/* ── Row 4 — mode / space / return / done ──────────────────────────────── */}
      <div style={{ display: 'flex', gap: `${KEY_GAP}px` }}>

        {/* Mode toggle: ABC ↔ 123 */}
        <button
          type="button"
          onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); press(mode === 'numbers' ? 'ABC' : '123'); }}
          style={{ ...keyStyle(pressed === (mode === 'numbers' ? 'ABC' : '123') ? 'pressed' : 'special'), width: '72px' }}
        >
          <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 'var(--text-p)', fontWeight: 600 }}>
            {mode === 'numbers' ? 'ABC' : '123'}
          </span>
        </button>

        {/* Space */}
        <button
          type="button"
          onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); press(' '); }}
          style={{ ...keyStyle(pressed === ' ' ? 'pressed' : 'default'), flex: 1 }}
        >
          <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 'var(--text-label)', color: 'var(--neutral-onsurface-tertiary)', letterSpacing: '0.06em' }}>
            space
          </span>
        </button>

        {/* Return / newline */}
        {btn('↵', 'special', { width: '52px' })}

        {/* Done */}
        <button
          type="button"
          onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onClose(); }}
          style={{
            height:           `${KEY_H}px`,
            width:            '80px',
            borderRadius:     'var(--radius-small)',
            border:           'none',
            backgroundColor:  'var(--feature-brand-primary)',
            cursor:           'pointer',
            fontFamily:       'Lato, sans-serif',
            fontSize:         'var(--text-p)',
            fontWeight:       'var(--font-weight-semibold)',
            color:            'var(--primary-foreground)',
            display:          'flex',
            alignItems:       'center',
            justifyContent:   'center',
            gap:              '5px',
            flexShrink:       0,
            touchAction:      'none',
          }}
        >
          <Check size={15} />
          Done
        </button>
      </div>
    </div>
  );
}

// ── Blinking cursor ────────────────────────────────────────────────────────────

function BlinkCursor() {
  return (
    <span
      style={{
        display:         'inline-block',
        width:           2,
        height:          '1.15em',
        backgroundColor: 'var(--feature-brand-primary)',
        borderRadius:    1,
        verticalAlign:   'middle',
        marginLeft:      1,
        flexShrink:      0,
        animation:       'virtualCursorBlink 1s step-end infinite',
      }}
    />
  );
}