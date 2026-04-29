import * as React from "react";
import { useVirtualInputContext } from "../../context/VirtualInputContext";
import type { VirtualInputMode } from "../../context/VirtualInputContext";

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

// ─── Types that trigger a virtual overlay ────────────────────────────────────
const VIRTUAL_TYPE_MAP: Partial<Record<string, VirtualInputMode>> = {
  text:   "text",
  search: "text",
  email:  "text",
  tel:    "numeric",
  number: "numeric",
};

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ className = "", error = false, type = "text", ...props }, ref) => {
    const ctx = useVirtualInputContext();

    // Only intercept if not already readOnly and the type has a virtual mode
    const virtualMode = !props.readOnly ? VIRTUAL_TYPE_MAP[type] : undefined;

    // ── Stable refs ─────────────────────────────────────────────────────────
    const onChangeRef = React.useRef(props.onChange);
    React.useEffect(() => { onChangeRef.current = props.onChange; });

    const onBlurRef = React.useRef(props.onBlur);
    React.useEffect(() => { onBlurRef.current = props.onBlur; });

    // Stable onChange wrapper
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
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onChangeRef.current(syntheticEvent);
    }, []);

    // ── Open handler ────────────────────────────────────────────────────────
    const handlePointerDown = (e: React.PointerEvent<HTMLInputElement>) => {
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
              } as unknown as React.FocusEvent<HTMLInputElement>;
              onBlurRef.current(blurEvent);
            }
          },
        );
      }
      props.onPointerDown?.(e);
    };

    const baseClass = [
      "flex h-9 w-full min-w-0",
      "px-3 py-1",
      "bg-[var(--neutral-surface-primary)]",
      "border border-[var(--neutral-line-outline)]",
      "text-[var(--neutral-onsurface-primary)]",
      "placeholder:text-[var(--neutral-onsurface-tertiary)]",
      "transition-all duration-200",
      "outline-none",
      "disabled:cursor-not-allowed disabled:bg-[var(--neutral-surface-greylighter)]",
      "focus:border-[var(--feature-brand-primary)] focus:ring-2 focus:ring-[var(--feature-brand-primary)]/20",
      error ? "border-[var(--status-red-primary)] focus:border-[var(--status-red-primary)] focus:ring-[var(--status-red-primary)]/20" : "",
      className,
    ].join(" ");

    return (
      <input
        type={type}
        ref={ref}
        className={baseClass}
        style={{
          borderRadius: "var(--radius-input)",
          fontSize:     "var(--text-p)",
          fontWeight:   "var(--font-weight-regular)",
          fontFamily:   "Lato, sans-serif",
          cursor:       virtualMode ? "pointer" : undefined,
          touchAction:  virtualMode ? "none" : undefined,
          ...props.style,
        }}
        {...props}
        readOnly={!!virtualMode || props.readOnly}
        onPointerDown={handlePointerDown}
      />
    );
  },
);

TextField.displayName = "TextField";

export { TextField };
