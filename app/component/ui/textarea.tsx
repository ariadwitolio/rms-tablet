import * as React from "react";
import { cn } from "./utils";
import { useVirtualInputContext } from "../../context/VirtualInputContext";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  const ctx = useVirtualInputContext();

  // Only intercept if not already readOnly
  const virtualMode = !props.readOnly ? ("text" as const) : undefined;

  // ── Stable refs ────────────────────────────────────────────────────────────
  const onChangeRef = React.useRef(props.onChange);
  React.useEffect(() => { onChangeRef.current = props.onChange; });

  const onBlurRef = React.useRef(props.onBlur);
  React.useEffect(() => { onBlurRef.current = props.onBlur; });

  // Stable onChange wrapper — fires a synthetic ChangeEvent<HTMLTextAreaElement>
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

  // ── Open handler ────────────────────────────────────────────────────────────
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

  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:bg-[var(--neutral-surface-greylighter)] md:text-sm",
        virtualMode ? "cursor-pointer" : "",
        className,
      )}
      style={{
        fontFamily:  "Lato, sans-serif",
        touchAction: virtualMode ? "none" : undefined,
        ...props.style,
      }}
      {...props}
      readOnly={!!virtualMode || props.readOnly}
      onPointerDown={handlePointerDown}
    />
  );
}

export { Textarea };
