import React from 'react';

export interface SelectableCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  children: React.ReactNode;
}

export const SelectableCard = React.forwardRef<HTMLButtonElement, SelectableCardProps>(
  ({ selected = false, className = '', children, ...props }, ref) => {
    // Base styles using design system variables
    const baseStyles = `
      inline-flex items-center justify-center
      transition-all duration-200
      font-[family-name:Lato]
      cursor-pointer
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    // Default state
    const defaultStyles = `
      bg-[var(--neutral-surface-primary)]
      border-[var(--neutral-line-outline)]
      text-[var(--neutral-onsurface-primary)]
    `;

    // Hover state
    const hoverStyles = `
      hover:bg-[var(--neutral-surface-greylighter)]
      hover:border-[var(--neutral-line-outline)]
    `;

    // Selected state
    const selectedStyles = selected
      ? `
        bg-[var(--feature-brand-container-darker)]
        border-[var(--feature-brand-primary)]
        text-[var(--neutral-onsurface-primary)]
      `
      : '';

    // Combined styles
    const combinedStyles = `
      ${baseStyles}
      ${!selected ? defaultStyles : ''}
      ${!selected ? hoverStyles : ''}
      ${selectedStyles}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <button
        ref={ref}
        className={combinedStyles}
        {...props}
      >
        {children}
      </button>
    );
  }
);

SelectableCard.displayName = 'SelectableCard';