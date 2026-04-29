import React from 'react';

interface NominalStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export function NominalStepper({ 
  value, 
  min = 1, 
  max = Infinity, 
  onChange,
  disabled = false,
  className = ''
}: NominalStepperProps) {
  const isMinDisabled = disabled || value <= min;
  const isMaxDisabled = disabled || value >= max;

  const handleDecrement = () => {
    if (!isMinDisabled) onChange(Math.max(min, value - 1));
  };

  const handleIncrement = () => {
    if (!isMaxDisabled) onChange(Math.min(max, value + 1));
  };

  // ── Shared button style ────────────────────────────────────────────────────
  const btnStyle = (isDisabled: boolean): React.CSSProperties => ({
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    width:           44,
    height:          44,
    borderRadius:    'var(--radius-small)',
    border:          'none',
    backgroundColor: isDisabled
      ? 'var(--neutral-surface-greylighter)'
      : 'var(--feature-brand-primary)',
    cursor:          isDisabled ? 'not-allowed' : 'pointer',
    opacity:         isDisabled ? 0.5 : 1,
    flexShrink:      0,
    transition:      'background-color 0.15s ease',
  });

  const iconColor = (isDisabled: boolean) =>
    isDisabled ? 'var(--neutral-onsurface-tertiary)' : 'var(--primary-foreground)';

  return (
    <div
      className={`inline-flex items-end gap-1 ${className}`}
      data-name="Nominal Stepper"
    >
      {/* Minus Button */}
      <button
        type="button"
        onClick={handleDecrement}
        disabled={isMinDisabled}
        style={btnStyle(isMinDisabled)}
        data-name="Reduce Container"
      >
        <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
          <path
            d="M1 1H13"
            stroke={iconColor(isMinDisabled)}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Value Display */}
      <div
        style={{
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'flex-end',
          width:          80,
          height:         44,
          gap:            4,
        }}
        data-name="Amount Container"
      >
        <p
          style={{
            fontFamily:  'Lato, sans-serif',
            fontSize:    'var(--text-h3)',
            fontWeight:  'var(--font-weight-bold)',
            color:       'var(--neutral-onsurface-primary)',
            lineHeight:  1,
            margin:      0,
          }}
        >
          {value}
        </p>
        {/* Underline */}
        <div
          style={{
            width:           '100%',
            height:          1,
            backgroundColor: 'var(--neutral-line-outline)',
            borderRadius:    1,
          }}
        />
      </div>

      {/* Plus Button */}
      <button
        type="button"
        onClick={handleIncrement}
        disabled={isMaxDisabled}
        style={btnStyle(isMaxDisabled)}
        data-name="Add Container"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 1V13M1 7H13"
            stroke={iconColor(isMaxDisabled)}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
