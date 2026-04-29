import * as React from "react";
import { useVirtualInputContext } from "../../context/VirtualInputContext";

export interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const TextAreaField = React.forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  ({ className = "", error = false, ...props }, ref) => {
    const ctx = useVirtualInputContext();
    const virtualMode = !props.readOnly ? ("text" as const) : undefined;

    // ── Stable refs ────────────────────────────────────────────────────────
    const onChangeRef = React.useRef(props.onChange);
    React.useEffect(() => { onChangeRef.current = props.onChange; });

    const onBlurRef = React.useRef(props.onBlur);
    React.useEffect(() => { onBlurRef.current = props.onBlur; });

    const wrappedOnChange = React.useCallback((val: string) => {
      if (!onChangeRef.current) return;
      const syntheticEvent = {
        target:         { value: val },
        currentTarget:  { value: val },
        bubbles:        true,
        cancelable:     false,
        defaultPrevented: false,
        eventPhase:     0,
        isTrusted:      true,
        preventDefault:  () => {},
        stopPropagation: () => {},
      } as unknown as React.ChangeEvent<HTMLTextAreaElement>;
      onChangeRef.current(syntheticEvent);
    }, []);

    const handlePointerDown = (e: React.PointerEvent<HTMLTextAreaElement>) => {
      if (virtualMode) {
        e.preventDefault();
        const anchor = e.currentTarget;
        ctx.openFor(
          virtualMode,
          String(props.value ?? ""),
          wrappedOnChange,
          anchor,
          () => {
            if (onBlurRef.current) {
              const blurEvent = {
                target: anchor,
                currentTarget: anchor,
                relatedTarget: null,
              } as unknown as React.FocusEvent<HTMLTextAreaElement>;
              onBlurRef.current(blurEvent);
            }
          },
        );
      }
      props.onPointerDown?.(e);
    };

    const baseStyles = `
      flex w-full min-w-0
      px-3 py-2
      bg-[var(--neutral-surface-primary)]
      border border-[var(--neutral-line-outline)]
      text-[var(--neutral-onsurface-primary)]
      placeholder:text-[var(--neutral-onsurface-tertiary)]
      font-[family-name:Lato]
      transition-all duration-200
      outline-none
      resize-none
      disabled:cursor-not-allowed disabled:bg-[var(--neutral-surface-greylighter)]
    `;

    const focusStyles = `
      focus:border-[var(--feature-brand-primary)]
      focus:ring-2
      focus:ring-[var(--feature-brand-primary)]/20
    `;

    const errorStyles = error
      ? `
        border-[var(--status-red-primary)]
        focus:border-[var(--status-red-primary)]
        focus:ring-[var(--status-red-primary)]/20
      `
      : '';

    const combinedStyles = `
      ${baseStyles}
      ${focusStyles}
      ${errorStyles}
      ${virtualMode ? 'cursor-pointer' : ''}
      ${className}
    `.trim().replace(/\s+/g, ' ');

    return (
      <textarea
        ref={ref}
        className={combinedStyles}
        style={{
          borderRadius: 'var(--radius-input)',
          fontSize: 'var(--text-p)',
          fontFamily: 'Lato, sans-serif',
          fontWeight: 'var(--font-weight-regular)',
          minHeight: '120px',
          touchAction: virtualMode ? 'none' : undefined,
          ...props.style,
        }}
        {...props}
        readOnly={!!virtualMode || props.readOnly}
        onPointerDown={handlePointerDown}
      />
    );
  }
);

TextAreaField.displayName = "TextAreaField";

export { TextAreaField };
