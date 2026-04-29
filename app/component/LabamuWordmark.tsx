/**
 * LabamuWordmark — official Labamu logo image.
 *
 * Sizing variants:
 *   "sm"  — compact (nav-bar header)
 *   "md"  — medium  (sidebar / compact header)
 *   "lg"  — large   (login screen)
 */
import type { CSSProperties } from 'react';

interface LabamuWordmarkProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: CSSProperties;
}

const SIZE_MAP = {
  sm: { height: 28, fontSize: 18 },
  md: { height: 36, fontSize: 24 },
  lg: { height: 52, fontSize: 34 },
} as const;

export function LabamuWordmark({ size = 'sm', className, style }: LabamuWordmarkProps) {
  const { height, fontSize } = SIZE_MAP[size];

  return (
    <div
      className={className}
      style={{
        height,
        display: 'flex',
        alignItems: 'center',
        userSelect: 'none',
        flexShrink: 0,
        fontFamily: 'Lato, sans-serif',
        fontWeight: 900,
        fontSize,
        color: 'var(--feature-brand-primary, #006BFF)',
        letterSpacing: '-0.5px',
        ...style,
      }}
    >
      Labamu
    </div>
  );
}