import React from 'react';

interface TabItem {
  key: string;
  label: string;
  icon?: React.ElementType;
  count?: number;
  disabled?: boolean;
}

interface DesktopTabProps {
  tabs: TabItem[];
  activeKey: string;
  onTabChange: (key: string) => void;
  /** Height of the tab bar container in px — defaults to 56 */
  height?: number;
  /** Padding left of the first tab — defaults to 20. Ignored when equalWidth is true */
  paddingLeft?: number;
  /** When true every tab stretches to an equal share of the container width and centers its content */
  equalWidth?: boolean;
  /** When true the grey hover background is suppressed on inactive tabs */
  disableHoverBg?: boolean;
  /**
   * Fixed pixel width for each tab button.
   * When set the tab group uses width:auto so a flex parent can centre it.
   * Takes precedence over equalWidth.
   */
  tabWidth?: number;
  /**
   * 'underline' — 2 px bottom-border active indicator; inactive tabs show a
   *               grey 2 px bottom border so the full row is always visible.
   * 'filled'    — active tab has a solid brand-container background fill;
   *               inactive tabs have left + right border separators.
   */
  variant?: 'underline' | 'filled';
}

export function DesktopTab({
  tabs,
  activeKey,
  onTabChange,
  height = 56,
  paddingLeft = 20,
  equalWidth = false,
  disableHoverBg = false,
  tabWidth,
  variant = 'underline',
}: DesktopTabProps) {
  const isFilled = variant === 'filled';
  // Fixed-width buttons: used for both variants when tabWidth is specified
  const useFixedWidth = tabWidth != null;

  return (
    <div
      className="flex items-stretch overflow-x-auto"
      style={{
        height,
        gap:            0,
        paddingLeft:    (isFilled || equalWidth) ? 0 : paddingLeft,
        scrollbarWidth: 'none',
        // Auto-width when tabWidth is given so a centering flex-parent works
        width:          useFixedWidth ? 'auto' : '100%',
        justifyContent: 'flex-start',
        // Filled: full outer border, square corners, no clipping.
        // Underline: no container border — individual tabs carry their own 2px indicator.
        border:         isFilled ? '1px solid var(--neutral-line-outline)' : 'none',
        borderRadius:   0,
        overflow:       'visible',
      }}
    >
      {tabs.map((tab, idx) => {
        const isActive = tab.key === activeKey;
        const isDisabled = tab.disabled || false;
        const Icon = tab.icon;

        return (
          <button
            key={tab.key}
            onClick={() => !isDisabled && onTabChange(tab.key)}
            disabled={isDisabled}
            className="relative inline-flex items-center gap-2"
            style={{
              flex:           useFixedWidth ? `0 0 ${tabWidth}px`
                              : equalWidth  ? '1 1 0'
                              : '0 0 auto',
              justifyContent: 'center',
              height:         '100%',
              padding:        isFilled ? '0 24px' : equalWidth ? '0 12px' : '0 20px',
              // No border properties at all — keeps all 4 border-color sides
              // uniform (currentColor) so the computed border-color shorthand
              // is always a single parseable value, never a space-separated
              // quadruple that breaks CSS color parsers.
              border: 'none',
              // Use inset box-shadow for visual indicators instead of border
              // properties, avoiding any border-color shorthand conflicts:
              //   underline  → 2 px bottom line (active = brand, inactive = none)
              //   filled     → 1 px left divider between tabs (skip first tab)
              boxShadow: !isFilled
                ? isActive
                  ? 'inset 0 -2px 0 0 var(--feature-brand-primary)'
                  : 'none'
                : isFilled && idx > 0
                  ? 'inset 1px 0 0 0 var(--neutral-line-outline)'
                  : 'none',
              background: 'transparent',
              cursor:     isDisabled ? 'not-allowed' : 'pointer',
              fontFamily: 'Lato, sans-serif',
              fontSize:   'var(--text-h3)',
              fontWeight: isActive
                ? 'var(--font-weight-bold)'
                : 'var(--font-weight-bold)',
              color: isDisabled
                ? 'var(--neutral-onsurface-disabled, #CCCCCC)'
                : isFilled
                  ? isActive
                    ? 'var(--feature-brand-primary)'
                    : 'var(--neutral-onsurface-primary)'
                  : isActive
                    ? 'var(--feature-brand-primary)'
                    : 'var(--neutral-onsurface-secondary)',
              whiteSpace:  'nowrap',
              opacity:     isDisabled ? 0.5 : 1,
              transition:  'color 0.15s ease',
            }}
            onMouseEnter={e => {
              if (!isActive && !isDisabled) {
                if (isFilled) {
                  // no background change on hover
                } else if (!disableHoverBg) {
                  e.currentTarget.style.color = 'var(--neutral-onsurface-primary)';
                } else {
                  e.currentTarget.style.color = 'var(--neutral-onsurface-primary)';
                }
              }
            }}
            onMouseLeave={e => {
              if (!isActive && !isDisabled) {
                e.currentTarget.style.color = isFilled
                  ? 'var(--neutral-onsurface-primary)'
                  : 'var(--neutral-onsurface-secondary)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            {Icon && (
              <Icon style={{ width: 18, height: 18, flexShrink: 0 }} />
            )}

            <span>{tab.label}</span>

            {tab.count !== undefined && (
              <span
                style={{
                  display:         'inline-flex',
                  alignItems:      'center',
                  justifyContent:  'center',
                  minWidth:        20,
                  height:          20,
                  padding:         '0 6px',
                  borderRadius:    'var(--radius-pill)',
                  fontSize:        'var(--text-label)',
                  fontWeight:      'var(--font-weight-bold)',
                  fontFamily:      'Lato, sans-serif',
                  backgroundColor: isActive
                    ? 'var(--feature-brand-containerlighter)'
                    : 'var(--neutral-surface-secondary)',
                  color: isActive
                    ? 'var(--feature-brand-primary)'
                    : 'var(--neutral-onsurface-tertiary)',
                  lineHeight: 1,
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}