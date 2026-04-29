import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';

export interface ModalProps {
  /** Controlled open state */
  open: boolean;
  /** Called when the modal requests close (overlay click, Escape key) */
  onOpenChange: (open: boolean) => void;
  /** Modal heading */
  title: React.ReactNode;
  /** Optional sub-heading / body copy below the title */
  description?: React.ReactNode;
  /**
   * Footer slot — typically one or two MainBtn components.
   * Rendered in a vertical stack so each button can be full-width.
   */
  footer?: React.ReactNode;
  /** Extra body content rendered between description and footer */
  children?: React.ReactNode;
  /** Override the max-width of the panel (default: 425px) */
  maxWidth?: number | string;
}

/**
 * Labamu Modal — confirmation / action dialog built on Radix Dialog primitives.
 *
 * Usage:
 * ```tsx
 * <Modal
 *   open={open}
 *   onOpenChange={setOpen}
 *   title="Confirm Action"
 *   description="Are you sure you want to proceed?"
 *   footer={
 *     <>
 *       <MainBtn variant="secondary" className="w-full" onClick={() => setOpen(false)}>Cancel</MainBtn>
 *       <MainBtn variant="primary"   className="w-full" onClick={handleConfirm}>Confirm</MainBtn>
 *     </>
 *   }
 * />
 * ```
 */
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  footer,
  children,
  maxWidth = 425,
}: ModalProps) {
  const maxW = typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* ── Overlay ──────────────────────────────────────────────────── */}
        <DialogPrimitive.Overlay
          style={{
            position:        'fixed',
            inset:           0,
            zIndex:          50,
            backgroundColor: 'rgba(0, 0, 0, 0.50)',
          }}
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />

        {/* ── Panel ────────────────────────────────────────────────────── */}
        <DialogPrimitive.Content
          aria-describedby={description ? 'labamu-modal-desc' : undefined}
          style={{
            position:        'fixed',
            top:             '50%',
            left:            '50%',
            transform:       'translate(-50%, -50%)',
            zIndex:          51,
            width:           `calc(100% - 2rem)`,
            maxWidth:        maxW,
            backgroundColor: 'var(--neutral-surface-primary, #FFFFFF)',
            borderRadius:    'var(--radius-card, 12px)',
            boxShadow:       '0px 8px 32px rgba(0,0,0,0.18)',
            padding:         '24px',
            display:         'flex',
            flexDirection:   'column',
            gap:             '8px',
          }}
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200 origin-center"
        >
          {/* ── Header ─────────────────────────────────────────────────── */}
          <DialogPrimitive.Title
            style={{
              fontFamily:  'Lato, sans-serif',
              fontSize:    'var(--text-h3)',
              fontWeight:  'var(--font-weight-bold)',
              color:       'var(--neutral-onsurface-primary)',
              margin:      0,
              lineHeight:  1.3,
            }}
          >
            {title}
          </DialogPrimitive.Title>

          {description && (
            <DialogPrimitive.Description
              id="labamu-modal-desc"
              style={{
                fontFamily: 'Lato, sans-serif',
                fontSize:   'var(--text-p)',
                fontWeight: 'var(--font-weight-regular)',
                color:      'var(--neutral-onsurface-secondary)',
                margin:     0,
                lineHeight: 1.5,
              }}
            >
              {description}
            </DialogPrimitive.Description>
          )}

          {/* ── Optional extra body content ────────────────────────────── */}
          {children && (
            <div style={{ marginTop: 4 }}>
              {children}
            </div>
          )}

          {/* ── Footer ─────────────────────────────────────────────────── */}
          {footer && (
            <div
              style={{
                display:       'flex',
                flexDirection: 'column-reverse',
                gap:           '8px',
                marginTop:     '8px',
              }}
            >
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

Modal.displayName = 'Modal';