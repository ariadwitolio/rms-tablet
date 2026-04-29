interface StatusTagProps {
  text: string;
  bgColor: string;
  textColor: string;
}

export function StatusTag({ text, bgColor, textColor }: StatusTagProps) {
  return (
    <div 
      className="flex h-8 items-center justify-center px-3 relative"
      style={{
        backgroundColor: bgColor,
        borderRadius: 'var(--radius-small)'
      }}
    >
      <p 
        className="whitespace-nowrap"
        style={{ 
          color: textColor,
          fontSize: 'var(--text-p)',
          fontWeight: 'var(--font-weight-semibold)',
          fontFamily: 'Lato, sans-serif',
          lineHeight: '20px'
        }}
      >
        {text}
      </p>
    </div>
  );
}