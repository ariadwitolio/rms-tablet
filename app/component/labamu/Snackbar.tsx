import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type SnackbarType = 'success' | 'error' | 'warning' | 'info';

interface SnackbarMessage {
  id: string;
  message: string;
  type: SnackbarType;
}

interface SnackbarContextType {
  showSnackbar: (message: string, type: SnackbarType) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return context;
}

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackbars, setSnackbars] = useState<SnackbarMessage[]>([]);

  const showSnackbar = useCallback((message: string, type: SnackbarType) => {
    const id = `${Date.now()}-${Math.random()}`;
    setSnackbars(prev => [...prev, { id, message, type }]);

    // Auto-dismiss after 3.5 s (animation starts at 3 s)
    setTimeout(() => {
      setSnackbars(prev => prev.filter(s => s.id !== id));
    }, 3500);
  }, []);

  const success = useCallback((message: string) => showSnackbar(message, 'success'), [showSnackbar]);
  const error   = useCallback((message: string) => showSnackbar(message, 'error'),   [showSnackbar]);
  const warning = useCallback((message: string) => showSnackbar(message, 'warning'), [showSnackbar]);
  const info    = useCallback((message: string) => showSnackbar(message, 'info'),    [showSnackbar]);

  const dismissSnackbar = useCallback((id: string) => {
    setSnackbars(prev => prev.filter(s => s.id !== id));
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, success, error, warning, info }}>
      {children}

      {/* Snackbar stack — bottom-center, stacks upward */}
      <div
        style={{
          position:       'fixed',
          bottom:         '24px',
          left:           '50%',
          transform:      'translateX(-50%)',
          display:        'flex',
          flexDirection:  'column-reverse',
          gap:            '8px',
          zIndex:         9999,
          alignItems:     'center',
          pointerEvents:  'none',
        }}
      >
        {snackbars.map(snackbar => (
          <SnackbarItem
            key={snackbar.id}
            message={snackbar.message}
            type={snackbar.type}
            onDismiss={() => dismissSnackbar(snackbar.id)}
          />
        ))}
      </div>
    </SnackbarContext.Provider>
  );
}

interface SnackbarItemProps {
  message: string;
  type: SnackbarType;
  onDismiss: () => void;
}

function SnackbarItem({ message, type, onDismiss }: SnackbarItemProps) {
  const [visible, setVisible]   = useState(false);
  const [exiting, setExiting]   = useState(false);

  useEffect(() => {
    // Slide up on mount
    const enterRaf = requestAnimationFrame(() => setVisible(true));
    // Begin exit slide-down 300 ms before auto-dismiss
    const exitTimer = setTimeout(() => setExiting(true), 3000);
    return () => {
      cancelAnimationFrame(enterRaf);
      clearTimeout(exitTimer);
    };
  }, []);

  // Map type → background colour (uses CSS variable with Figma fallback)
  const getBg = (): string => {
    switch (type) {
      case 'success': return 'var(--status-success-primary, #54a73f)';
      case 'error':   return 'var(--status-red-primary, #d0021b)';
      default:        return '#282828'; // dark neutral for info / warning
    }
  };

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(onDismiss, 280);
  };

  const translateY = !visible ? '24px' : exiting ? '16px' : '0px';
  const opacity    = visible && !exiting ? 1 : 0;

  return (
    <div
      style={{
        width:           '335px',
        minHeight:       '51px',
        backgroundColor: getBg(),
        borderRadius:    '8px',
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'space-between',
        padding:         '13px 20px',
        gap:             '16px',
        pointerEvents:   'auto',
        transform:       `translateY(${translateY})`,
        opacity,
        transition:      'transform 260ms ease, opacity 260ms ease',
        boxSizing:       'border-box',
      }}
    >
      {/* Message */}
      <p
        style={{
          fontFamily:    'Lato, sans-serif',
          fontWeight:    400,
          fontSize:      '16px',
          lineHeight:    '22px',
          letterSpacing: '0.11px',
          color:         '#fff',
          flex:          '1 0 0',
          minWidth:      0,
          margin:        0,
          overflow:      'hidden',
          textOverflow:  'ellipsis',
          whiteSpace:    'nowrap',
        }}
      >
        {message}
      </p>

      {/* Dismiss — "Okay" */}
      <button
        onClick={handleDismiss}
        style={{
          fontFamily:    'Lato, sans-serif',
          fontWeight:    700,
          fontSize:      '14px',
          lineHeight:    '20px',
          letterSpacing: '0.0962px',
          color:         '#fff',
          background:    'none',
          border:        'none',
          cursor:        'pointer',
          padding:       0,
          flexShrink:    0,
          whiteSpace:    'nowrap',
        }}
      >
        Okay
      </button>
    </div>
  );
}

// Legacy stub — use useSnackbar() hook inside React components
export const toast = {
  success: (message: string) => console.warn('[Snackbar] Use useSnackbar hook:', message),
  error:   (message: string) => console.warn('[Snackbar] Use useSnackbar hook:', message),
  warning: (message: string) => console.warn('[Snackbar] Use useSnackbar hook:', message),
  info:    (message: string) => console.warn('[Snackbar] Use useSnackbar hook:', message),
};
