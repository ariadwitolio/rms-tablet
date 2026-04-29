import React from 'react';

export type MainBtnVariant = 'primary' | 'secondary' | 'destructive' | 'disabled';
export type MainBtnSize = 'sm' | 'md' | 'lg';

export interface MainBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: MainBtnVariant;
  size?: MainBtnSize;
  selected?: boolean;
  children: React.ReactNode;
}

export const MainBtn = React.forwardRef<HTMLButtonElement, MainBtnProps>(
  ({ variant = 'primary', size = 'md', selected = false, className = '', disabled = false, children, ...props }, ref) => {
    // Base styles using design system variables
    const baseStyles = `
      inline-flex items-center justify-center gap-[4px] 
      transition-all duration-200
      font-[family-name:Lato] 
      cursor-pointer
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    // Size styles using design system spacing
    const sizeStyles = {
      sm: 'h-[56px] px-[12px] py-[8px]',
      md: 'h-[56px] px-[16px] py-[12px]',
      lg: 'h-[56px] px-[20px] py-[14px]',
    };

    // Variant styles using design system colors
    const variantStyles = {
      primary: {
        default: 'bg-primary text-primary-foreground border-2 border-primary',
        hover: 'hover:bg-[#0056CC] hover:border-[#0056CC]',
        selected: 'bg-[#0056CC] border-[#0056CC]',
      },
      secondary: {
        default: 'bg-secondary text-secondary-foreground border-[1px] border-primary',
        hover: 'hover:bg-[var(--neutral-surface-greylighter)]',
        selected: 'bg-primary/10',
      },
      destructive: {
        default: 'bg-secondary text-destructive border-[1px] border-destructive',
        hover: 'hover:bg-destructive/5',
        selected: 'bg-destructive/10',
      },
      disabled: {
        default: 'bg-[var(--neutral-surface-greylighter)] text-[var(--neutral-onsurface-tertiary)] border border-[var(--neutral-line-outline)] cursor-not-allowed',
        hover: '',
        selected: '',
      },
    };

    // Border radius using design system variable
    const radiusStyle = 'rounded-[var(--radius-button)]';

    // Font size based on size
    const fontSizeStyles = {
      sm: 'text-[var(--text-h3)]',
      md: 'text-[var(--text-h3)]',
      lg: 'text-[var(--text-h3)]',
    };

    // Font weight using design system variable
    const fontWeightStyle = 'font-[var(--font-weight-bold)]';

    // Use 'disabled' variant when button is disabled, otherwise use the provided variant
    // Ensure the variant is always valid by falling back to 'primary'
    const effectiveVariant = disabled ? 'disabled' : (variant || 'primary');
    const currentVariant = variantStyles[effectiveVariant as keyof typeof variantStyles] || variantStyles.primary;
    
    const combinedStyles = `
      ${baseStyles}
      ${sizeStyles[size] || sizeStyles.md}
      ${fontSizeStyles[size] || fontSizeStyles.md}
      ${radiusStyle}
      ${currentVariant.default}
      ${!disabled && !selected ? currentVariant.hover : ''}
      ${selected && currentVariant.selected ? currentVariant.selected : ''}
      ${fontWeightStyle}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <button
        ref={ref}
        className={combinedStyles}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

MainBtn.displayName = 'MainBtn';