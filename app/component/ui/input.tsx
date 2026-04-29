import * as React from "react";
import { cn } from "./utils";
import { useVirtualInputContext } from "../../context/VirtualInputContext";
import type { VirtualInputMode } from "../../context/VirtualInputContext";

// ─── Types that trigger a virtual overlay ────────────────────────────────────
const VIRTUAL_TYPE_MAP: Partial<Record<string, VirtualInputMode>> = {
  text:   "text",
  search: "text",
  email:  "text",
  tel:    "numeric",
  number: "numeric",
};

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const ctx = useVirtualInputContext();

  // Only intercept if not already readOnly and the type has a virtual mode
  const virtualMode = !props.readOnly ? VIRTUAL_TYPE_MAP[type ?? "text"] : undefined;

  // ── Stable refs — so the overlay always calls the *latest* handlers ────────
  const onChangeRef = React.useRef(props.onChange);
  React.useEffect(() => { onChangeRef.current = props.onChange; });

  const onBlurRef = React.useRef(props.onBlur);
  React.useEffect(() => { onBlurRef.current = props.onBlur; });

  // Stable onChange wrapper — the overlay calls this with the typed string.
  // We wrap it in a synthetic ChangeEvent so parent handlers work unchanged.
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
  }, []); // stable: uses ref, no deps needed

  // ── Open handler — onPointerDown for instant tablet response ──────────────
  const handlePointerDown = (e: React.PointerEvent<HTMLInputElement>) => {
    if (virtualMode) {
      e.preventDefault(); // prevent focus / iOS zoom / scroll-start

      // Capture element ref before async (currentTarget is nulled after the event)
      const anchor = e.currentTarget;

      ctx.openFor(
        virtualMode,
        String(props.value ?? ""),
        wrappedOnChange,
        anchor,
        // onConfirm: fires onBlur substitute so validation callbacks trigger
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

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-input-background px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      style={{
        cursor:       virtualMode ? "pointer" : undefined,
        fontFamily:   "Lato, sans-serif",
        touchAction:  virtualMode ? "none" : undefined,
        ...props.style,
      }}
      {...props}
      // These must come AFTER the spread to override any prop versions
      readOnly={!!virtualMode || props.readOnly}
      onPointerDown={handlePointerDown}
    />
  );
}

export { Input };
