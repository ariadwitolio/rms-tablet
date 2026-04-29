import { useState, useEffect } from 'react';
import { X, CreditCard, Banknote, Smartphone, Wallet } from 'lucide-react';
import { useSnackbar } from '../labamu/Snackbar';
import { formatCurrency } from '../../utils/formatters';
import { TextField } from '../ui/TextField';
import { Separator } from '../ui/separator';
import { MainBtn } from '../ui/MainBtn';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { useVirtualInputContext } from '../../context/VirtualInputContext';
import { TabGroup } from '../ui/TabGroup';

interface SplitPaymentModalProps {
  open: boolean;
  splitName: string;
  totalAmount: number;
  onConfirm: (payments: PaymentMethod[]) => void;
  onClose: () => void;
}

interface PaymentMethod {
  type: 'CASH' | 'DEBIT' | 'CREDIT' | 'QRIS' | 'EWALLET';
  amount: number;
  percentage: number;
}

const PAYMENT_TYPES = [
  { type: 'CASH'    as const, label: 'Cash',        icon: Banknote,   color: 'bg-green-600'  },
  { type: 'DEBIT'   as const, label: 'Debit Card',  icon: CreditCard, color: 'bg-blue-600'   },
  { type: 'CREDIT'  as const, label: 'Credit Card', icon: CreditCard, color: 'bg-purple-600' },
  { type: 'QRIS'    as const, label: 'QRIS',        icon: Smartphone, color: 'bg-orange-600' },
  { type: 'EWALLET' as const, label: 'E-Wallet',    icon: Wallet,     color: 'bg-pink-600'   },
];

export default function SplitPaymentModal({
  open, splitName, totalAmount, onConfirm, onClose,
}: SplitPaymentModalProps) {
  const snackbar = useSnackbar();
  const ctx = useVirtualInputContext();
  const [selectedMethods, setSelectedMethods] = useState<Set<string>>(new Set());
  const [amounts, setAmounts]                 = useState<Record<string, string>>({});
  const [percentages, setPercentages]         = useState<Record<string, string>>({});
  const [inputMode, setInputMode]             = useState<'amount' | 'percentage'>('amount');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // ─── Reset all state whenever the modal opens so each split starts fresh ───
  useEffect(() => {
    if (open) {
      setSelectedMethods(new Set());
      setAmounts({});
      setPercentages({});
      setInputMode('amount');
      setShowConfirmDialog(false);
    }
  }, [open]);

  // ─── Helpers ───────────────────────────────────────────────────────────────

  /** Derive percentage string from an amount value */
  const toPct = (amt: number) =>
    totalAmount > 0 ? ((amt / totalAmount) * 100).toFixed(2) : '0.00';

  /** Derive amount string from a percentage value */
  const toAmt = (pct: number) =>
    ((totalAmount * pct) / 100).toFixed(0);

  // ─── Toggle a payment method on/off ────────────────────────────────────────

  const toggleMethod = (type: string) => {
    const next = new Set(selectedMethods);

    if (next.has(type)) {
      // Remove — clear its allocation and rebalance remaining to the first other method
      next.delete(type);
      const newAmounts = { ...amounts };
      const newPcts    = { ...percentages };
      delete newAmounts[type];
      delete newPcts[type];

      // Auto-fill remaining balance into the first still-selected method
      if (next.size === 1) {
        const only = Array.from(next)[0];
        const allocatedByOthers = Array.from(next)
          .filter(m => m !== only)
          .reduce((s, m) => s + (parseFloat(newAmounts[m]) || 0), 0);
        const rem = totalAmount - allocatedByOthers;
        newAmounts[only] = rem.toFixed(0);
        newPcts[only]    = toPct(rem);
      }

      setAmounts(newAmounts);
      setPercentages(newPcts);
    } else {
      next.add(type);
      // Single method: auto-fill the full amount immediately — no need to tap Fill Rest
      if (next.size === 1) {
        const newAmounts = { ...amounts, [type]: totalAmount.toFixed(0) };
        const newPcts    = { ...percentages, [type]: '100.00' };
        setAmounts(newAmounts);
        setPercentages(newPcts);
      } else {
        // Multiple methods: start empty so staff allocates manually
        const newAmounts = { ...amounts, [type]: '' };
        const newPcts    = { ...percentages, [type]: '' };
        setAmounts(newAmounts);
        setPercentages(newPcts);
      }
    }

    setSelectedMethods(next);
  };

  // ─── Input change handlers ──────────────────────────────────────────────────

  const handleAmountChange = (type: string, value: string) => {
    const num = parseFloat(value) || 0;
    setAmounts(prev      => ({ ...prev, [type]: value }));
    setPercentages(prev  => ({ ...prev, [type]: toPct(num) }));
  };

  const handlePercentageChange = (type: string, value: string) => {
    const num = parseFloat(value) || 0;
    setPercentages(prev => ({ ...prev, [type]: value }));
    setAmounts(prev     => ({ ...prev, [type]: toAmt(num) }));
  };

  // ─── Mode switch: re-derive all values so nothing needs manual re-entry ────

  const handleModeSwitch = (mode: 'amount' | 'percentage') => {
    if (mode === inputMode) return;
    // Values are always kept in sync by handleAmountChange / handlePercentageChange,
    // so a simple mode flip is enough — no re-derivation needed.
    setInputMode(mode);
  };

  // ─── Fill remaining into a specific method ──────────────────────────────────

  const fillRemaining = (type: string) => {
    if (remaining > 0) {
      const cur = parseFloat(amounts[type]) || 0;
      handleAmountChange(type, (cur + remaining).toFixed(0));
    }
  };

  // ─── Derived totals ─────────────────────────────────────────────────────────

  const totalAllocated = Array.from(selectedMethods).reduce(
    (s, t) => s + (parseFloat(amounts[t]) || 0),
    0,
  );
  const remaining = totalAmount - totalAllocated;
  const isValid   = Math.abs(remaining) < 0.01;

  // ─── Confirm flow ───────────────────────────────────────────────────────────

  const handleShowConfirm = () => {
    if (selectedMethods.size === 0) { snackbar.error('Please select at least one payment method'); return; }
    if (!isValid)                    { snackbar.error('Total payment must match the split amount'); return; }
    setShowConfirmDialog(true);
  };

  const processPayment = () => {
    const payments: PaymentMethod[] = Array.from(selectedMethods).map(type => ({
      type:       type as PaymentMethod['type'],
      amount:     parseFloat(amounts[type]) || 0,
      percentage: parseFloat(percentages[type]) || 0,
    }));
    setShowConfirmDialog(false);
    onConfirm(payments);
  };

  // ─── Render ─���───────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Main payment dialog ── */}
      <Dialog open={open} onOpenChange={isOpen => !isOpen && onClose()}>
        <DialogContent
          className="p-0 gap-0 flex flex-col overflow-hidden [&>button:last-child]:hidden"
          style={{ width: '560px', maxWidth: 'calc(100vw - 48px)', maxHeight: '85vh', borderRadius: 'var(--radius-card)' }}
        >
          <DialogTitle className="sr-only">Payment for {splitName}</DialogTitle>

          {/* Header */}
          <div
            className="px-6 py-4 border-b shrink-0 flex items-center justify-between"
            style={{ borderColor: 'var(--neutral-line-outline)' }}
          >
            <div className="flex-1 min-w-0">
              <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-onsurface-primary)', fontFamily: 'Lato, sans-serif' }}>
                Payment for {splitName}
              </h2>

              {/* ── Amount summary row (the selected <p> element, now enriched) ── */}
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <p style={{ fontSize: 'var(--text-h4)', color: 'var(--neutral-onsurface-secondary)', fontFamily: 'Lato, sans-serif' }}>
                  Total: <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-onsurface-primary)' }}>{formatCurrency(totalAmount)}</span>
                </p>
                {selectedMethods.size > 0 && (
                  <>
                    <span style={{ color: 'var(--neutral-line-outline)', fontFamily: 'Lato, sans-serif' }}>·</span>
                    <p style={{ fontSize: 'var(--text-h4)', color: 'var(--neutral-onsurface-secondary)', fontFamily: 'Lato, sans-serif' }}>
                      Allocated: <span style={{ fontWeight: 'var(--font-weight-bold)', color: 'var(--feature-brand-primary)' }}>{formatCurrency(totalAllocated)}</span>
                    </p>
                    <span style={{ color: 'var(--neutral-line-outline)', fontFamily: 'Lato, sans-serif' }}>·</span>
                    <p style={{ fontSize: 'var(--text-h4)', fontFamily: 'Lato, sans-serif' }}>
                      Remaining:{' '}
                      <span style={{
                        fontWeight: 'var(--font-weight-bold)',
                        color: isValid
                          ? 'var(--status-green-primary)'
                          : remaining > 0
                            ? 'var(--status-red-primary)'
                            : 'var(--neutral-onsurface-secondary)',
                      }}>
                        {formatCurrency(remaining)}
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors shrink-0 ml-3"
              aria-label="Close"
            >
              <X className="w-5 h-5" style={{ color: 'var(--neutral-onsurface-secondary)' }} />
            </button>
          </div>

          {/* Body — scrollable */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-6 space-y-6">

              {/* Payment method cards */}
              <div>
                <p style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-onsurface-primary)', fontFamily: 'Lato, sans-serif', marginBottom: '12px' }}>
                  Select Payment Method
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {PAYMENT_TYPES.map(({ type, label, icon: Icon, color }) => {
                    const isSelected = selectedMethods.has(type);
                    return (
                      <button
                        key={type}
                        onClick={() => toggleMethod(type)}
                        className="p-3 flex flex-col items-center justify-center gap-2 min-h-[88px] transition-all"
                        style={{
                          borderRadius: 'var(--radius-card)',
                          border: `2px solid ${isSelected ? 'var(--feature-brand-primary)' : 'var(--neutral-line-outline)'}`,
                          backgroundColor: isSelected ? 'var(--feature-brand-container-light, #E6F0FF)' : 'var(--neutral-surface-primary)',
                        }}
                      >
                        <div
                          className={`p-2 ${isSelected ? color : ''} ${isSelected ? 'text-white' : ''}`}
                          style={{
                            borderRadius: 'var(--radius-small)',
                            backgroundColor: isSelected ? undefined : 'var(--neutral-surface-secondary)',
                            color: isSelected ? undefined : 'var(--neutral-onsurface-secondary)',
                          }}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-bold)', textAlign: 'center', fontFamily: 'Lato, sans-serif', color: isSelected ? 'var(--feature-brand-primary)' : 'var(--neutral-onsurface-primary)' }}>{label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Amount inputs */}
              {selectedMethods.size > 0 && (
                <div className="space-y-4">

                  {/* Mode toggle — only relevant when splitting across multiple methods */}
                  {selectedMethods.size > 1 && (
                    <TabGroup
                      options={[
                        { value: 'amount', label: 'By Amount' },
                        { value: 'percentage', label: 'By Percentage' },
                      ]}
                      value={inputMode}
                      onChange={handleModeSwitch}
                      size="md"
                    />
                  )}

                  {/* Input rows */}
                  <div className="space-y-3">
                    {PAYMENT_TYPES.filter(({ type }) => selectedMethods.has(type)).map(({ type, label, icon: Icon, color }) => {
                      const remainingPct = totalAmount > 0 ? (remaining / totalAmount) * 100 : 0;
                      return (
                        <div
                          key={type}
                          className="p-4 flex items-center gap-4"
                          style={{
                            borderRadius:    'var(--radius-card)',
                            border:          '2px solid var(--feature-brand-primary)',
                            backgroundColor: 'var(--feature-brand-container-light, #E6F0FF)',
                          }}
                        >
                          {/* Method icon + label */}
                          <div className="flex flex-col items-center gap-1 shrink-0 w-[72px]">
                            <div className={`p-2 ${color} text-white`} style={{ borderRadius: 'var(--radius-small)' }}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-bold)', textAlign: 'center', fontFamily: 'Lato, sans-serif' }}>{label}</p>
                          </div>

                          {/* Divider */}
                          <div className="h-12 w-px shrink-0" style={{ backgroundColor: 'var(--neutral-line-outline)' }} />

                          {/* Input area */}
                          <div className="flex-1">
                            {inputMode === 'amount' ? (
                              <div>
                                <div className="flex gap-2">
                                  {/* Amount input — type="text" so we can show comma-formatted value */}
                                  <div
                                    className="flex items-center flex-1"
                                    style={{
                                      height:          40,
                                      border:          '1.5px solid var(--neutral-line-outline)',
                                      borderRadius:    8,
                                      backgroundColor: 'var(--neutral-surface-primary)',
                                      overflow:        'hidden',
                                      paddingLeft:     8,
                                      paddingRight:    8,
                                    }}
                                  >
                                    <span style={{ fontSize: 'var(--text-h4)', color: 'var(--neutral-onsurface-tertiary)', fontFamily: 'Lato, sans-serif', marginRight: 4, flexShrink: 0 }}>Rp</span>
                                    <input
                                      type="text"
                                      readOnly
                                      value={
                                        amounts[type] !== undefined && amounts[type] !== ''
                                          ? Number(amounts[type]).toLocaleString('en-US')
                                          : ''
                                      }
                                      onPointerDown={(e) => { e.preventDefault(); ctx.openFor('numeric', amounts[type] || '', (val) => {
                                        if (val === '' || /^\d*$/.test(val)) handleAmountChange(type, val);
                                      }, e.currentTarget); }}
                                      placeholder={Number(Math.round(totalAmount)).toLocaleString('en-US')}
                                      style={{
                                        flex:        1,
                                        minWidth:    0,
                                        border:      'none',
                                        outline:     'none',
                                        background:  'transparent',
                                        fontFamily:  'Lato, sans-serif',
                                        fontWeight:  600,
                                        fontSize:    'var(--text-p)',
                                        color:       'var(--neutral-onsurface-primary)',
                                        textAlign:   'right',
                                        cursor:      'pointer',
                                      }}
                                    />
                                  </div>
                                  {/* Fill Rest — always shown; dimmed when nothing left */}
                                  <button
                                    onClick={() => fillRemaining(type)}
                                    disabled={remaining <= 0}
                                    style={{
                                      height:          40,
                                      padding:         '0 12px',
                                      borderRadius:    8,
                                      border:          '1.5px solid var(--feature-brand-primary, #006bff)',
                                      backgroundColor: 'transparent',
                                      color:           'var(--feature-brand-primary, #006bff)',
                                      fontSize:        'var(--text-label)',
                                      fontFamily:      'Lato, sans-serif',
                                      fontWeight:      700,
                                      cursor:          remaining > 0 ? 'pointer' : 'default',
                                      opacity:         remaining > 0 ? 1 : 0.35,
                                      flexShrink:      0,
                                      whiteSpace:      'nowrap',
                                    }}
                                  >
                                    Fill Rest
                                  </button>
                                </div>
                                <p style={{ fontSize: 'var(--text-label)', color: 'var(--neutral-onsurface-tertiary)', fontFamily: 'Lato, sans-serif', marginTop: 4 }}>
                                  {percentages[type] ? `${parseFloat(percentages[type]).toFixed(1)}% of total` : '0% of total'}
                                </p>
                              </div>
                            ) : (
                              <div>
                                <div className="flex gap-2">
                                  {/* Percentage input */}
                                  <div
                                    className="flex items-center flex-1"
                                    style={{
                                      height:          40,
                                      border:          '1.5px solid var(--neutral-line-outline)',
                                      borderRadius:    8,
                                      backgroundColor: 'var(--neutral-surface-primary)',
                                      overflow:        'hidden',
                                      paddingLeft:     10,
                                      paddingRight:    8,
                                    }}
                                  >
                                    <input
                                      type="text"
                                      readOnly
                                      value={percentages[type] || ''}
                                      onPointerDown={(e) => { e.preventDefault(); ctx.openFor('numeric', percentages[type] || '', (val) => handlePercentageChange(type, val), e.currentTarget); }}
                                      placeholder="0"
                                      style={{
                                        flex:        1,
                                        minWidth:    0,
                                        border:      'none',
                                        outline:     'none',
                                        background:  'transparent',
                                        fontFamily:  'Lato, sans-serif',
                                        fontWeight:  600,
                                        fontSize:    'var(--text-p)',
                                        color:       'var(--neutral-onsurface-primary)',
                                        textAlign:   'right',
                                        cursor:      'pointer',
                                      }}
                                    />
                                    <span style={{ fontSize: 'var(--text-h4)', color: 'var(--neutral-onsurface-tertiary)', fontFamily: 'Lato, sans-serif', marginLeft: 4, flexShrink: 0 }}>%</span>
                                  </div>
                                  {/* Fill Rest for percentage mode */}
                                  <button
                                    onClick={() => {
                                      const curPct = parseFloat(percentages[type] || '0');
                                      handlePercentageChange(type, Math.min(100, curPct + remainingPct).toFixed(2));
                                    }}
                                    disabled={remainingPct <= 0}
                                    style={{
                                      height:          40,
                                      padding:         '0 12px',
                                      borderRadius:    8,
                                      border:          '1.5px solid var(--feature-brand-primary, #006bff)',
                                      backgroundColor: 'transparent',
                                      color:           'var(--feature-brand-primary, #006bff)',
                                      fontSize:        'var(--text-label)',
                                      fontFamily:      'Lato, sans-serif',
                                      fontWeight:      700,
                                      cursor:          remainingPct > 0 ? 'pointer' : 'default',
                                      opacity:         remainingPct > 0 ? 1 : 0.35,
                                      flexShrink:      0,
                                      whiteSpace:      'nowrap',
                                    }}
                                  >
                                    Fill Rest
                                  </button>
                                </div>
                                <p style={{ fontSize: 'var(--text-label)', color: 'var(--neutral-onsurface-tertiary)', fontFamily: 'Lato, sans-serif', marginTop: 4 }}>
                                  {amounts[type] ? formatCurrency(parseFloat(amounts[type])) : formatCurrency(0)}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Remove method */}
                          <button
                            onClick={() => toggleMethod(type)}
                            className="flex items-center justify-center rounded-full shrink-0"
                            style={{ width: 32, height: 32, backgroundColor: 'var(--neutral-surface-secondary)' }}
                          >
                            <X className="w-4 h-4" style={{ color: 'var(--neutral-onsurface-secondary)' }} />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Remaining indicator */}
                  
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="shrink-0 p-5 border-t flex gap-3" style={{ borderColor: 'var(--neutral-line-outline)' }}>
            <MainBtn variant="secondary" size="lg" onClick={onClose} className="flex-1 h-[52px]" style={{ borderRadius: 'var(--radius-button)' }}>
              Cancel
            </MainBtn>
            <MainBtn
              size="lg"
              onClick={handleShowConfirm}
              disabled={!isValid || selectedMethods.size === 0}
              className="flex-1 h-[52px]"
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Confirm Payment
            </MainBtn>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Confirm dialog ── */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent style={{ borderRadius: 'var(--radius-card)' }}>
          <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'Lato, sans-serif' }}>
            Confirm Payment
          </DialogTitle>
          <DialogDescription style={{ fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif' }}>
            Process this payment for {splitName}?
          </DialogDescription>
          <div className="space-y-3 py-2">
            <div className="flex justify-between" style={{ fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif' }}>
              <span style={{ color: 'var(--neutral-onsurface-secondary)' }}>Total Amount</span>
              <span style={{ fontWeight: 'var(--font-weight-bold)' }}>{formatCurrency(totalAmount)}</span>
            </div>
            <Separator />
            {Array.from(selectedMethods).map(type => {
              const method = PAYMENT_TYPES.find(p => p.type === type);
              return (
                <div key={type} className="flex justify-between" style={{ fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif' }}>
                  <span style={{ color: 'var(--neutral-onsurface-secondary)' }}>{method?.label}</span>
                  <span style={{ fontWeight: 'var(--font-weight-bold)' }}>{formatCurrency(parseFloat(amounts[type]) || 0)}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-3 pt-2">
            <MainBtn variant="secondary" onClick={() => setShowConfirmDialog(false)} size="lg" className="w-full">Cancel</MainBtn>
            <MainBtn onClick={processPayment} size="lg" className="w-full">Process Payment</MainBtn>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}