interface SelectionIndicatorProps {
  height?: string;
}

export function SelectionIndicator({ height = '100%' }: SelectionIndicatorProps) {
  return (
    <div 
      className="absolute left-0 top-0"
      style={{
        backgroundColor: 'var(--feature-brand-primary)',
        width: '6px',
        height: height,
      }}
    />
  );
}
