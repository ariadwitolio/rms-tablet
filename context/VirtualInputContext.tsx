import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';
import { VirtualNumpad } from '../components/ui/VirtualNumpad';
import { VirtualKeyboard } from '../components/ui/VirtualKeyboard';

// ─── Types ────────────────────────────────────────────────────────────────────

export type VirtualInputMode = 'numeric' | 'text';

interface ActiveInput {
  mode:   VirtualInputMode;
  value:  string;
  anchor: HTMLElement;
}

interface VirtualInputContextValue {
  /**
   * Open the virtual input overlay anchored to `anchor`.
   * @param onConfirm  Optional callback fired when the overlay is dismissed
   *                   (Done tap / backdrop tap / Enter). Acts as an onBlur substitute.
   */
  openFor: (
    mode:      VirtualInputMode,
    value:     string,
    onChange:  (val: string) => void,
    anchor:    HTMLElement,
    onConfirm?: () => void,
  ) => void;
  /** Close the overlay — fires onConfirm if set */
  close: () => void;
  /** True while an overlay is visible */
  isOpen: boolean;
  /** The DOM element that triggered the current overlay */
  activeAnchor: HTMLElement | null;
}

const VirtualInputContext = createContext<VirtualInputContextValue>({
  openFor:      () => {},
  close:        () => {},
  isOpen:       false,
  activeAnchor: null,
});

// ─── Overlay sizing constants ──────────────────────────────────────────────────
// text keyboard is rendered at 720×320 then scaled ×1.3 → 936×416 visual px

const OVERLAY = {
  numeric: { w: 340, h: 440 },
  text:    { w: 936, h: 416 },   // 720×1.3 = 936, 320×1.3 = 416
} as const;

const GAP = 10;

// ─── Positioning helper ────────────────────────────────────────────────────────

function calcPosition(active: ActiveInput): React.CSSProperties {
  const rect        = active.anchor.getBoundingClientRect();
  const { w: ow, h: oh } = OVERLAY[active.mode];
  const w           = Math.min(ow, window.innerWidth - 32);

  // Prefer above; fall back to below
  const spaceAbove  = rect.top - GAP;
  let top           = spaceAbove >= oh
    ? rect.top - oh - GAP
    : rect.bottom + GAP;
  top               = Math.max(8, Math.min(top, window.innerHeight - oh - 8));

  // Numpad: centre on anchor; keyboard: centre on screen
  let left          = active.mode === 'numeric'
    ? rect.left + rect.width / 2 - w / 2
    : window.innerWidth / 2 - w / 2;
  left              = Math.max(16, Math.min(left, window.innerWidth - w - 16));

  return { position: 'fixed', top, left, width: w, zIndex: 9999 };
}

// ─── Slide-up animation wrapper ────────────────────────────────────────────────

function SlideUp({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? 'translateY(0px) scale(1)' : 'translateY(10px) scale(0.97)',
        transition: 'opacity 0.12s ease, transform 0.12s ease',
        pointerEvents: 'auto',
      }}
    >
      {children}
    </div>
  );
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function VirtualInputProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive]  = useState<ActiveInput | null>(null);
  const onChangeRef           = useRef<(val: string) => void>(() => {});
  const onConfirmRef          = useRef<(() => void) | undefined>(undefined);

  // Keep a stable up-to-date ref of the current value so the physical
  // keyboard handler never closes over a stale value.
  const activeValueRef        = useRef<string>('');
  const activeModeRef         = useRef<VirtualInputMode>('text');

  useEffect(() => {
    if (active) {
      activeValueRef.current = active.value;
      activeModeRef.current  = active.mode;
    }
  });

  // ── Close ─────────────────────────────────────────────────────────────────
  const close = useCallback(() => {
    const confirm         = onConfirmRef.current;
    onConfirmRef.current  = undefined;
    setActive(null);
    if (confirm) requestAnimationFrame(() => confirm());
  }, []);

  // ── Open ──────────────────────────────────────────────────────────────────
  const openFor = useCallback((
    mode:      VirtualInputMode,
    value:     string,
    onChange:  (val: string) => void,
    anchor:    HTMLElement,
    onConfirm?: () => void,
  ) => {
    onChangeRef.current  = onChange;
    onConfirmRef.current = onConfirm;
    activeValueRef.current = value;
    activeModeRef.current  = mode;
    setActive({ mode, value, anchor });
  }, []);

  // ── Value change ──────────────────────────────────────────────────────────
  const handleChange = useCallback((newVal: string) => {
    activeValueRef.current = newVal;
    onChangeRef.current(newVal);
    setActive(prev => prev ? { ...prev, value: newVal } : null);
  }, []);

  // ── Physical keyboard passthrough ─────────────────────────────────────────
  // When the virtual overlay is open, intercept real keystrokes so a
  // connected physical keyboard or on-screen native KB also works.
  useEffect(() => {
    if (!active) return;

    const handler = (e: KeyboardEvent) => {
      const val  = activeValueRef.current;
      const mode = activeModeRef.current;

      if (mode === 'numeric') {
        if (/^\d$/.test(e.key)) {
          e.preventDefault();
          handleChange(val + e.key);
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          handleChange(val.slice(0, -1));
        } else if (e.key === '.' && !val.includes('.')) {
          e.preventDefault();
          handleChange((val || '0') + '.');
        } else if (e.key === 'Enter' || e.key === 'Escape') {
          e.preventDefault();
          close();
        }
      } else {
        // text mode
        if (e.key === 'Escape') {
          e.preventDefault();
          close();
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          handleChange(val.slice(0, -1));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          handleChange(val + '\n');
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          // Printable character — but let Ctrl/Cmd shortcuts (copy/paste etc.) fall through
          e.preventDefault();
          handleChange(val + e.key);
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, handleChange, close]);

  // ── Close on window resize ─────────────────────────────────────────────────
  useEffect(() => {
    if (!active) return;
    const handler = () => close();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [active, close]);

  return (
    <VirtualInputContext.Provider value={{
      openFor,
      close,
      isOpen:       !!active,
      activeAnchor: active?.anchor ?? null,
    }}>
      {children}

      {active && createPortal(
        <>
          {/*
           * ── Backdrop ──────────────────────────────────────────────────────
           * Full-screen transparent layer that catches any tap outside the
           * numpad/keyboard and closes the overlay.  Must sit below the overlay
           * (z-index 9998 vs 9999) so the overlay itself is always tappable.
           */}
          <div
            onPointerDown={() => close()}
            style={{
              position:    'fixed',
              inset:       0,
              zIndex:      9998,
              touchAction: 'none',
            }}
          />

          {/*
           * ── Overlay panel ─────────────────────────────────────────────────
           * stopPropagation on pointerdown prevents the backdrop from firing
           * when the user taps any key inside the overlay.
           */}
          <div
            onPointerDown={(e) => e.stopPropagation()}
            style={calcPosition(active)}
          >
            <SlideUp>
              {active.mode === 'numeric' ? (
                <VirtualNumpad
                  value={active.value}
                  onChange={handleChange}
                  onClose={close}
                />
              ) : (
                /* Scale the keyboard 1.3× from its natural 720×320 size.
                   The outer container (calcPosition) is already 936 px wide.
                   Centering the 720-px inner div and scaling from top-center
                   makes the visual edges land exactly at 0 and 936 px. */
                <div
                  style={{
                    width:           '720px',
                    margin:          '0 auto',
                    transform:       'scale(1.3)',
                    transformOrigin: 'top center',
                  }}
                >
                  <VirtualKeyboard
                    value={active.value}
                    onChange={handleChange}
                    onClose={close}
                  />
                </div>
              )}
            </SlideUp>
          </div>
        </>,
        document.body,
      )}
    </VirtualInputContext.Provider>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useVirtualInputContext() {
  return useContext(VirtualInputContext);
}

/**
 * Convenience hook — returns props to spread onto any <input> or <textarea>
 * to make it open the virtual keyboard / numpad on tap.
 */
export function useVirtualInput(
  mode:      VirtualInputMode,
  value:     string,
  onChange:  (val: string) => void,
  onConfirm?: () => void,
) {
  const ctx = useVirtualInputContext();

  const onChangeRef  = useRef(onChange);
  const onConfirmRef = useRef(onConfirm);
  useEffect(() => { onChangeRef.current  = onChange;  });
  useEffect(() => { onConfirmRef.current = onConfirm; });

  return {
    readOnly: true as const,
    style:    { cursor: 'pointer' } as React.CSSProperties,
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => {
      e.preventDefault();
      ctx.openFor(mode, value, onChangeRef.current, e.currentTarget as HTMLElement, onConfirmRef.current);
    },
  };
}