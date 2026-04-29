/**
 * LogoIcon — replaces the original figma:asset/… raster import.
 * Renders the brand icon square only (no wordmark text).
 */

interface LogoIconProps {
  size?: number;
}

export function LogoIcon({ size = 32 }: LogoIconProps) {
  const r = Math.round(size * 0.27);
  const innerGap = Math.round(size * 0.12);
  const tineW = Math.max(2, Math.round(size * 0.1));

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: r,
        background: 'var(--feature-brand-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: innerGap, height: '64%' }}>
        <div style={{ width: tineW, height: '100%', background: 'var(--primary-foreground)', borderRadius: 99 }} />
        <div style={{ width: tineW, height: '80%', background: 'var(--primary-foreground)', borderRadius: 99 }} />
        <div style={{ width: tineW, height: '100%', background: 'var(--primary-foreground)', borderRadius: 99 }} />
      </div>
    </div>
  );
}
