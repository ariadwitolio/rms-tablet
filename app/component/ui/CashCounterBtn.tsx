import { Banknote } from 'lucide-react';
import { Button } from './button';

interface CashCounterBtnProps {
  onClick: () => void;
  className?: string;
  variant?: 'outline' | 'primary';
}

export function CashCounterBtn({ onClick, className, variant = 'outline' }: CashCounterBtnProps) {
  const primaryStyles =
    'bg-[var(--feature-brand-primary)] border-[var(--feature-brand-primary)] text-white ' +
    'hover:bg-[#0056CC] hover:border-[#0056CC] hover:text-white';

  const outlineStyles =
    'hover:bg-[var(--feature-brand-container-light)] hover:text-[var(--neutral-onsurface-primary)]';

  return (
    <Button
      variant="outline"
      size="icon"
      className={`h-[48px] w-[48px] ${variant === 'primary' ? primaryStyles : outlineStyles} ${className ?? ''}`}
      onClick={onClick}
      title="Count denominations"
    >
      <Banknote className="w-5 h-5" />
    </Button>
  );
}