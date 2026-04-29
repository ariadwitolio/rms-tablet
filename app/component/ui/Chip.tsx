import React from 'react';

interface ChipProps {
  label: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function Chip({ label, active = false, onClick, icon, className = '' }: ChipProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 border transition-colors ${className}`}
      style={{
        height:          56,
        padding:         '0 24px',
        borderRadius:    'var(--radius-pill, 9999px)',
        fontFamily:      'Lato, sans-serif',
        fontSize:        'var(--text-h3)', /* 18px — large enough for standing staff */
        fontWeight:      'var(--font-weight-bold)',
        cursor:          'pointer',
        backgroundColor: active ? 'var(--feature-brand-container-light)' : 'var(--neutral-surface-primary)',
        color:           active ? 'var(--feature-brand-primary)' : 'var(--neutral-onsurface-secondary)',
        borderColor:     active ? 'var(--feature-brand-primary)' : 'var(--neutral-line-outline)',
        outline:         'none',
        whiteSpace:      'nowrap',
      }}
      onMouseEnter={e => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'var(--neutral-surface-greylighter)';
          e.currentTarget.style.borderColor     = 'var(--neutral-onsurface-secondary)';
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'var(--neutral-surface-primary)';
          e.currentTarget.style.borderColor     = 'var(--neutral-line-outline)';
        }
      }}
    >
      {icon && <span className="flex items-center">{icon}</span>}
      {label}
    </button>
  );
}