import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Format: 3 – 4 – 3  (10 chars total)
const CODE_GROUPS = [3, 4, 3];
const TOTAL_LEN = CODE_GROUPS.reduce((a, b) => a + b, 0);

const QWERTY_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

const STEPS = [
  { label: 'Open backoffice',    sub: '',                             done: true  },
  { label: 'Click Add Device',   sub: 'System generates unique code', done: true  },
  { label: 'Enter the code here',sub: 'On this boarding screen',      active: true },
  { label: 'Device connected',   sub: 'Sync begins automatically',    pending: true },
];

export default function PairingScreen() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [code, setCode]           = useState('');
  const [kbMode, setKbMode]       = useState<'123' | 'ABC'>('123');

  useEffect(() => {
    if (sessionStorage.getItem('rms_paired') === 'true') {
      navigate(isAuthenticated ? '/dine-in' : '/login', { replace: true });
    }
  }, []);

  const push = (ch: string) => {
    if (code.length < TOTAL_LEN) setCode(p => p + ch);
  };

  const pop = () => setCode(p => p.slice(0, -1));

  const handleOK = () => {
    if (code.length < TOTAL_LEN) return;
    sessionStorage.setItem('rms_paired', 'true');
    navigate('/login', { replace: true });
  };

  // Build display groups
  let cursor = 0;
  const groups = CODE_GROUPS.map(size => {
    const start = cursor;
    cursor += size;
    return { start, size };
  });

  const numBtnStyle: React.CSSProperties = {
    height: 72,
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: 600,
    fontFamily: 'Lato, sans-serif',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.15s',
  };

  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', backgroundColor: '#f0f2f8', fontFamily: 'Lato, sans-serif' }}>

      {/* ── Left panel ──────────────────────────────────────────────────── */}
      <div style={{ width: 420, flexShrink: 0, backgroundColor: '#eef1fb', padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        {/* Logo */}
        <span style={{ fontSize: 32, fontWeight: 800, color: '#2563EB', letterSpacing: '-0.5px' }}>RMS</span>

        {/* Heading */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: 0 }}>Connect This Device</h1>
          <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
            Enter the pairing code from your backoffice to link this device to your restaurant.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              {/* Circle */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                backgroundColor: step.done ? '#22C55E' : step.active ? '#2563EB' : '#D1D5DB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 13,
              }}>
                {step.done ? <Check size={14} strokeWidth={3} /> : i + 1}
              </div>
              {/* Text */}
              <div style={{ paddingTop: 2 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: step.active ? '#2563EB' : '#111827' }}>
                  {step.label}
                </p>
                {step.sub && (
                  <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9CA3AF' }}>{step.sub}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div style={{ height: 1, backgroundColor: '#D1D5DB' }} />

        {/* Footnote */}
        <p style={{ margin: 0, fontSize: 12, color: '#9CA3AF', lineHeight: 1.6 }}>
          Only devices added from backoffice can connect. Each device uses a unique code.
        </p>
      </div>

      {/* Vertical divider */}
      <div style={{ width: 1, backgroundColor: '#D1D5DB', flexShrink: 0 }} />

      {/* ── Right panel ─────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, backgroundColor: '#f8f9fc', gap: 20 }}>

        {/* PAIRING CODE label */}
        <p style={{ margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: '#9CA3AF', textTransform: 'uppercase' }}>
          Pairing Code
        </p>

        {/* Code boxes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {groups.map(({ start, size }, gi) => (
            <div key={gi} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {gi > 0 && (
                <span style={{ color: '#9CA3AF', fontSize: 20, fontWeight: 300, marginRight: 2 }}>–</span>
              )}
              {Array.from({ length: size }).map((_, bi) => {
                const ci = start + bi;
                const ch = code[ci] || '';
                const isFocused = ci === code.length && code.length < TOTAL_LEN;
                return (
                  <div
                    key={bi}
                    style={{
                      width: 46, height: 54, borderRadius: 10,
                      border: `2px solid ${isFocused ? '#2563EB' : ch ? '#9CA3AF' : '#D1D5DB'}`,
                      backgroundColor: ch ? '#ffffff' : '#F3F4F6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20, fontWeight: 700, color: '#111827',
                      transition: 'border-color 0.15s',
                    }}
                  >
                    {ch}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Keyboard mode toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, alignSelf: 'stretch', justifyContent: 'flex-end', maxWidth: 360, width: '100%', marginBottom: -8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#9CA3AF', textTransform: 'uppercase' }}>
            Keyboard
          </span>
          {(['123', 'ABC'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setKbMode(mode)}
              style={{
                padding: '5px 14px', borderRadius: 8,
                backgroundColor: kbMode === mode ? '#2563EB' : '#E5E7EB',
                color: kbMode === mode ? '#fff' : '#6B7280',
                fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
                fontFamily: 'Lato, sans-serif',
                transition: 'background-color 0.15s',
              }}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* ── Numeric keyboard ── */}
        {kbMode === '123' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, width: 360 }}>
            {[1,2,3,4,5,6,7,8,9].map(n => (
              <button key={n} onClick={() => push(String(n))} style={numBtnStyle}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                {n}
              </button>
            ))}
            {/* Bottom row: OK | 0 | ← */}
            <button
              onClick={handleOK}
              disabled={code.length < TOTAL_LEN}
              style={{
                ...numBtnStyle,
                backgroundColor: code.length === TOTAL_LEN ? '#2563EB' : '#E5E7EB',
                color: code.length === TOTAL_LEN ? '#ffffff' : '#9CA3AF',
                fontSize: 16,
                cursor: code.length === TOTAL_LEN ? 'pointer' : 'default',
                border: 'none',
              }}
            >
              OK
            </button>
            <button onClick={() => push('0')} style={numBtnStyle}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              0
            </button>
            <button onClick={pop} style={{ ...numBtnStyle, fontSize: 20 }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
            >
              ←
            </button>
          </div>
        )}

        {/* ── Alpha keyboard (QWERTY) ── */}
        {kbMode === 'ABC' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 360 }}>
            {QWERTY_ROWS.map((row, ri) => (
              <div key={ri} style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
                {row.split('').map(ch => (
                  <button
                    key={ch}
                    onClick={() => push(ch)}
                    style={{
                      flex: 1, height: 48, minWidth: 0,
                      backgroundColor: '#ffffff', border: '1px solid #e5e7eb',
                      borderRadius: 8, fontSize: 15, fontWeight: 600,
                      fontFamily: 'Lato, sans-serif', cursor: 'pointer',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
                  >
                    {ch}
                  </button>
                ))}
                {/* Last row: also show backspace */}
                {ri === QWERTY_ROWS.length - 1 && (
                  <button
                    onClick={pop}
                    style={{
                      flex: 1.5, height: 48, minWidth: 0,
                      backgroundColor: '#ffffff', border: '1px solid #e5e7eb',
                      borderRadius: 8, fontSize: 18,
                      fontFamily: 'Lato, sans-serif', cursor: 'pointer',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f3f4f6')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ffffff')}
                  >
                    ←
                  </button>
                )}
              </div>
            ))}
            {/* Space + OK row */}
            <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
              <button
                onClick={() => push(' ')}
                style={{
                  flex: 3, height: 48, backgroundColor: '#ffffff', border: '1px solid #e5e7eb',
                  borderRadius: 8, fontSize: 13, fontFamily: 'Lato, sans-serif', cursor: 'pointer',
                  color: '#6B7280', fontWeight: 500,
                }}
              >
                space
              </button>
              <button
                onClick={handleOK}
                disabled={code.length < TOTAL_LEN}
                style={{
                  flex: 1, height: 48,
                  backgroundColor: code.length === TOTAL_LEN ? '#2563EB' : '#E5E7EB',
                  color: code.length === TOTAL_LEN ? '#fff' : '#9CA3AF',
                  border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700,
                  fontFamily: 'Lato, sans-serif',
                  cursor: code.length === TOTAL_LEN ? 'pointer' : 'default',
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Status hint */}
        <p style={{ margin: 0, fontSize: 13, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#D1D5DB', display: 'inline-block' }} />
          {code.length === TOTAL_LEN ? 'Press OK to connect' : 'Enter pairing code'}
        </p>
      </div>
    </div>
  );
}
