import { Minus, Plus } from 'lucide-react';
import { Button } from './button';

interface QuantityStepperProps {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  min?: number;
  /** Stop click events bubbling up to parent cards/rows */
  stopPropagation?: boolean;
  size?: 'md' | 'lg' | 'xl';
}

// Shared classes for every stepper button
const BASE_CLASSES =
  '!bg-[var(--feature-brand-container-light)] !border-[var(--feature-brand-container-light)] !text-[var(--feature-brand-primary)] ' +
  'hover:!bg-[var(--feature-brand-container)] hover:!border-[var(--feature-brand-container)] ' +
  // Disabled state: grey background + grey border + grey icon
  'disabled:!bg-[var(--neutral-surface-greylighter)] disabled:!border-[var(--neutral-line-outline)] disabled:!text-[var(--neutral-onsurface-tertiary)] disabled:!cursor-not-allowed';

export function QuantityStepper({
  value,
  onDecrement,
  onIncrement,
  min = 1,
  stopPropagation = false,
  size = 'lg',
}: QuantityStepperProps) {
  const btnSize =
    size === 'xl' ? 'h-14 w-14' :
    size === 'lg' ? 'h-12 w-12' :
                   'h-11 w-11';
  const iconSize = size === 'xl' ? 'w-5 h-5' : 'w-4 h-4';

  const wrap = (fn: () => void) =>
    stopPropagation
      ? (e: React.MouseEvent) => { e.stopPropagation(); fn(); }
      : fn;

  return (
    <div
      className="inline-flex items-center gap-2"
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
    >
      <Button
        variant="outline"
        size="icon"
        className={`${btnSize} shrink-0 ${BASE_CLASSES}`}
        onClick={wrap(onDecrement)}
        disabled={value <= min}
      >
        <Minus className={iconSize} />
      </Button>

      <span
        className="w-10 text-center"
        style={{
          fontSize:   size === 'xl' ? 'var(--text-h3)' : 'var(--text-p)',
          fontWeight: 'var(--font-weight-semibold)',
          fontFamily: 'Lato, sans-serif',
        }}
      >
        {value}
      </span>

      <Button
        variant="outline"
        size="icon"
        className={`${btnSize} shrink-0 ${BASE_CLASSES}`}
        onClick={wrap(onIncrement)}
      >
        <Plus className={iconSize} />
      </Button>
    </div>
  );
}