import EmptyStateQuote from '../../../imports/EmptyStateQuote-2404-269';

interface EmptyStateProps {
  title: string;
  subtitle: string;
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        gap: '16px',
      }}
    >
      {/* Illustration */}
      <div style={{ width: 180, height: 180, flexShrink: 0, position: 'relative' }}>
        <EmptyStateQuote />
      </div>

      {/* Text */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: '16px',
            fontWeight: 700,
            color: 'var(--neutral-onsurface-primary)',
            fontFamily: 'Lato, sans-serif',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: 'var(--text-p)',
            fontWeight: 'var(--font-weight-regular)',
            color: 'var(--muted-foreground)',
            fontFamily: 'Lato, sans-serif',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}