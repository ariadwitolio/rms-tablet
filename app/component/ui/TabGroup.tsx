import React from 'react';

interface TabOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface TabGroupProps<T extends string> {
  options: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md' | 'lg';
  tabWidth?: number; // Optional fixed width for each tab (in px)
}

/**
 * TabGroup - Reusable tab component following TabMobile design from Figma
 * - Uses CSS variables from theme.css
 * - Supports 3 sizes: sm (40px), md (50px), lg (56px)
 * - Active tab has shadow and brand colors
 * - Inactive tabs have muted background
 * - Optional icon support
 * - Optional fixed width per tab
 */
export function TabGroup<T extends string>({ options, value, onChange, size = 'lg', tabWidth }: TabGroupProps<T>) {
  // Size configurations
  const sizeConfig = {
    sm: {
      height: 40,
      fontSize: 14,
      lineHeight: '20px',
      letterSpacing: '0.0962px',
    },
    md: {
      height: 50,
      fontSize: 16,
      lineHeight: '22px',
      letterSpacing: '0.11px',
    },
    lg: {
      height: 56,
      fontSize: 18,
      lineHeight: '26px',
      letterSpacing: '0.1238px',
    },
  };

  const config = sizeConfig[size];

  return (
    <div
      className="relative flex items-start gap-1 p-1 rounded-lg"
      style={{
        backgroundColor: 'var(--border)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Inset border overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-[-0.5px] pointer-events-none rounded-lg"
        style={{
          border: '1px solid var(--border)',
        }}
      />

      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className="flex items-center justify-center gap-2 px-2.5 rounded-md transition-all"
            style={{
              width: tabWidth ? `${tabWidth}px` : undefined,
              flex: tabWidth ? 'none' : '1',
              height: config.height,
              backgroundColor: isActive
                ? 'var(--neutral-surface-primary)'
                : 'var(--neutral-surface-greylighter)',
              boxShadow: isActive ? 'var(--elevation-sm)' : 'none',
              border: 'none',
              cursor: 'pointer',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {option.icon && (
              <span
                className="shrink-0"
                style={{
                  color: isActive
                    ? 'var(--feature-brand-primary)'
                    : 'var(--neutral-onsurface-primary)',
                }}
              >
                {option.icon}
              </span>
            )}
            <span
              style={{
                fontFamily: 'Lato, sans-serif',
                fontWeight: 'var(--font-weight-bold)',
                fontSize: config.fontSize,
                lineHeight: config.lineHeight,
                letterSpacing: config.letterSpacing,
                color: isActive
                  ? 'var(--feature-brand-primary)'
                  : 'var(--neutral-onsurface-primary)',
                whiteSpace: 'nowrap',
              }}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}