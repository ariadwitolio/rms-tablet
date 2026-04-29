import { Info } from 'lucide-react';
import { useVirtualInputContext } from '../../context/VirtualInputContext';
import { formatCurrency } from '../../utils/formatters';

// ─── types (mirror PaymentScreen) ────────────────────────────────────────────
interface InlineSplit {
  id: string;
  name: string;
  paid: boolean;
  paidAmount?: number;
}

interface ExpandedUnit {
  id: string;
  name: string;
  price: number;
  quantity: number;
  modifiers?: string[];
  notes?: string;
  discountType?: string;
  discountValue?: number;
  isComplimentary?: boolean;
  isVoided?: boolean;
  _unitKey: string;
  _unitIndex: number;
  [key: string]: any;
}

interface Props {
  inlineSplits: InlineSplit[];
  getExpandedUnits: () => ExpandedUnit[];
  getItemPrice: (unit: ExpandedUnit) => number;
  itemSplitAssignment: Record<string, string[]>;
  itemAllocMethod: Record<string, 'equal' | 'pct' | 'amount'>;
  itemAllocValues: Record<string, Record<string, string>>;
  assignItem: (unitKey: string, splitId: string) => void;
  setAllocMethod: (unitKey: string, method: 'equal' | 'pct' | 'amount') => void;
  handleAllocValueChange: (unitKey: string, splitId: string, value: string) => void;
  /** Unit keys of items that are only partially paid — the paid split captured just a
   *  fraction of the item price because it was shared with other splits at payment time.
   *  These items must keep showing unassigned split buttons until the split is removed
   *  from the bill, regardless of the current assignment state. */
  partiallyPaidUnitKeys?: Set<string>;
}

// ─── Button visual states ─────────────────────────────────────────────────────
// 1. paid + assigned   → green fill   (settled; this item was paid under this split)
// 2. paid + !assigned  → grey faded   (locked; can't assign to an already-paid split)
// 3. !paid + assigned  → brand fill   (active; click to unassign)
// 4. !paid + !assigned → brand outline (inactive; click to assign)

function splitButtonStyle(paid: boolean, isAssigned: boolean) {
  if (paid && isAssigned) {
    // Green = this item has been settled under this split
    return {
      backgroundColor: 'var(--status-green-primary)',
      color:           'var(--primary-foreground)',
      border:          '2.5px solid var(--status-green-primary)',
      opacity:         1,
    };
  }
  if (paid && !isAssigned) {
    // Grey faded = split already closed, cannot add item to it
    return {
      backgroundColor: 'var(--neutral-surface-secondary)',
      color:           'var(--neutral-onsurface-disabled)',
      border:          '2.5px solid var(--neutral-line-outline)',
      opacity:         0.45,
    };
  }
  if (!paid && isAssigned) {
    return {
      backgroundColor: 'var(--feature-brand-primary)',
      color:           'var(--primary-foreground)',
      border:          '2.5px solid var(--feature-brand-primary)',
      opacity:         1,
    };
  }
  // !paid && !isAssigned
  return {
    backgroundColor: 'transparent',
    color:           'var(--feature-brand-primary)',
    border:          '2.5px solid var(--feature-brand-primary)',
    opacity:         1,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export function ByItemPanel({
  inlineSplits,
  getExpandedUnits,
  getItemPrice,
  itemSplitAssignment,
  itemAllocMethod,
  itemAllocValues,
  assignItem,
  setAllocMethod,
  handleAllocValueChange,
  partiallyPaidUnitKeys = new Set(),
}: Props) {
  const ctx = useVirtualInputContext();
  const allUnits = getExpandedUnits();

  // Count units with no split assignment yet
  const unassignedCount = allUnits.filter(
    u => (itemSplitAssignment[u._unitKey] || []).length === 0
  ).length;

  return (
    <>
      {/* ── Unassigned items info banner ── */}
      {unassignedCount > 0 && (
        null
      )}

      {/* ── Item rows ── */}
      {allUnits.map(unit => {
        const assignedSplitIds = itemSplitAssignment[unit._unitKey] || [];
        const isShared         = assignedSplitIds.length > 1;
        const currentMethod    = isShared ? (itemAllocMethod[unit._unitKey] || 'equal') : 'equal';
        const itemTotal        = getItemPrice(unit);

        // Only show allocation rows when both sides are *unpaid* splits assigned
        const unpaidAssigned   = assignedSplitIds.filter(sid => !inlineSplits.find(s => s.id === sid)?.paid);
        const showAlloc        = unpaidAssigned.length > 1;

        // Validation for pct / amount rows
        const allocSum = showAlloc && currentMethod !== 'equal'
          ? assignedSplitIds.reduce((s, sid) => {
              const split = inlineSplits.find(sp => sp.id === sid);
              if (split?.paid) return s; // paid splits are fixed
              return s + (parseFloat(itemAllocValues[unit._unitKey]?.[sid] || '0') || 0);
            }, 0)
          : 0;
        const allocTarget = currentMethod === 'pct' ? 100 : itemTotal;
        const allocValid  = showAlloc && currentMethod !== 'equal'
          ? Math.abs(allocSum - allocTarget) < (currentMethod === 'pct' ? 0.01 : 1)
          : true;

        return (
          <div
            key={unit._unitKey}
            className="flex flex-col mb-1"
            style={{
              backgroundColor: 'var(--neutral-surface-primary)',
              borderRadius:    'var(--radius-small)',
            }}
          >
            {/* ── Row 1: item name ── */}
            <div className="px-2 pt-2 pb-1">
              <p
                className="truncate"
                style={{
                  fontSize:   'var(--text-p)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color:      'var(--neutral-onsurface-primary)',
                  fontFamily: 'Lato, sans-serif',
                }}
              >
                {unit.name}
              </p>
              {unit.modifiers?.length > 0 && (
                <p className="truncate" style={{ fontSize: 'var(--text-h4)', color: 'var(--neutral-onsurface-tertiary)', fontFamily: 'Lato, sans-serif' }}>
                  {unit.modifiers.join(', ')}
                </p>
              )}
              {unit.notes && (
                <p className="truncate" style={{ fontSize: 'var(--text-h4)', color: 'var(--neutral-onsurface-tertiary)', fontFamily: 'Lato, sans-serif', fontStyle: 'italic' }}>
                  *{unit.notes}
                </p>
              )}
            </div>

            {/* ── Row 2: split toggle buttons — always visible ── */}
            <div
              className="px-2 pb-2"
              style={{ borderTop: '1px solid var(--neutral-line-outline)', paddingTop: '8px' }}
            >
              <div className="flex flex-col gap-1" style={{ paddingBottom: '2px' }}>
                {Array.from({ length: Math.ceil(inlineSplits.length / 4) }, (_, rowIdx) => (
                  <div key={rowIdx} className="flex gap-2">
                    {inlineSplits.slice(rowIdx * 4, rowIdx * 4 + 4).map((split) => {
                      const isAssigned = assignedSplitIds.includes(split.id);
                      // Original 1-based index so "Split 3" always shows "3"
                      const splitNum   = inlineSplits.findIndex(s => s.id === split.id) + 1;
                      const btnStyle   = splitButtonStyle(split.paid, isAssigned);

                      // Item is fully settled when:
                      //   1. It has at least one paid-split assignment
                      //   2. ALL its assigned splits are paid
                      //   3. It is NOT in the partiallyPaidUnitKeys set
                      //
                      // The third guard handles Wagyu Steak:
                      //   — Split 1 was paid while Wagyu was shared with Split 2
                      //     → Split 1 only captured ~50% of Wagyu's price
                      //     → Wagyu is recorded in partiallyPaidUnitKeys
                      //   — If the user then unassigns Split 2, assignedSplitIds becomes
                      //     [Split1(paid)] — identical to Bruschetta — but the flag prevents
                      //     the buttons from hiding. They remain until Split 2 is removed
                      //     from the bill via the right-panel Remove button.
                      //
                      // Bruschetta is never in partiallyPaidUnitKeys because it was always
                      // solo-assigned to Split 1, so Split 1 captured 100% of its price.
                      const itemFullySettled =
                        !partiallyPaidUnitKeys.has(unit._unitKey) &&
                        assignedSplitIds.length > 0 &&
                        assignedSplitIds.every(sid => inlineSplits.find(s => s.id === sid)?.paid);

                      return (
                        <button
                          key={split.id}
                          onClick={() => !split.paid && assignItem(unit._unitKey, split.id)}
                          disabled={split.paid}
                          className="flex items-center justify-center transition-all shrink-0 active:scale-95"
                          style={{
                            width:        '56px',
                            height:       '56px',
                            borderRadius: '50%',
                            fontSize:     'var(--text-h3)',
                            fontWeight:   700,
                            fontFamily:   'Lato, sans-serif',
                            cursor:       split.paid ? 'default' : 'pointer',
                            ...btnStyle,
                            // Visibility rules for unassigned buttons:
                            //   paid   + !assigned → always hide (grey/disabled, useless)
                            //   unpaid + !assigned → hide only when item is fully settled
                            //                        (keeps Wagyu's outline buttons visible)
                            display: !isAssigned && (split.paid || itemFullySettled)
                              ? 'none'
                              : 'flex',
                          }}
                          title={
                            split.paid
                              ? `${split.name} – paid`
                              : isAssigned
                                ? `Remove from ${split.name}`
                                : `Add to ${split.name}`
                          }
                        >
                          {splitNum}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Row 3: allocation method chips — only for 2+ unpaid assigned splits ── */}
            {showAlloc && (
              <div
                className="flex gap-2 px-2 pb-2"
                style={{ borderTop: '1px solid var(--neutral-line-outline)', paddingTop: '8px' }}
              >
                {([
                  {
                    key: 'equal' as const,
                    label: (
                      <span style={{ display: 'inline-flex', alignItems: 'baseline', gap: '1px', fontFamily: 'Lato, sans-serif' }}>
                        <sup style={{ fontSize: '10px', lineHeight: 1 }}>1</sup>
                        <span style={{ fontSize: '12px', margin: '0 1px' }}>/</span>
                        <sub style={{ fontSize: '10px', lineHeight: 1 }}>2</sub>
                      </span>
                    ),
                  },
                  { key: 'pct'    as const, label: '%'  },
                  { key: 'amount' as const, label: 'Rp' },
                ]).map(({ key, label }) => {
                  const isActive = currentMethod === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setAllocMethod(unit._unitKey, key)}
                      className="flex-1 inline-flex items-center justify-center transition-colors"
                      style={{
                        height:          '56px',
                        borderRadius:    'var(--radius-pill)',
                        fontFamily:      'Lato, sans-serif',
                        fontSize:        'var(--text-h3)',
                        fontWeight:      'var(--font-weight-bold)',
                        cursor:          'pointer',
                        backgroundColor: isActive ? 'var(--feature-brand-container-light)' : 'var(--neutral-surface-primary)',
                        color:           isActive ? 'var(--feature-brand-primary)' : 'var(--neutral-onsurface-secondary)',
                        border:          `2px solid ${isActive ? 'var(--feature-brand-primary)' : 'var(--neutral-line-outline)'}`,
                        outline:         'none',
                        whiteSpace:      'nowrap',
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ── Row 4: allocation inputs — only when % or Rp and 2+ unpaid splits ── */}
            {showAlloc && currentMethod !== 'equal' && (
              <div
                className="px-2 pb-2 flex flex-col gap-1.5"
                style={{ borderTop: '1px solid var(--neutral-line-outline)', paddingTop: '8px' }}
              >
                {assignedSplitIds.map(sid => {
                  const split = inlineSplits.find(s => s.id === sid);
                  if (!split) return null;
                  const val      = itemAllocValues[unit._unitKey]?.[sid] || '';
                  const isPaidSplit = split.paid;

                  return (
                    <div key={sid} className="flex flex-col gap-1">
                      {/* Split name label */}
                      <span style={{ fontSize: 'var(--text-h4)', color: 'var(--neutral-onsurface-secondary)', fontFamily: 'Lato, sans-serif' }}>
                        {split.name}
                        {isPaidSplit && (
                          <span style={{ marginLeft: '6px', fontSize: 'var(--text-label)', color: 'var(--status-green-primary)', fontWeight: 700 }}>PAID</span>
                        )}
                      </span>

                      {/* Input row */}
                      <div className="flex items-center gap-2">
                        <div
                          className="flex items-center flex-1"
                          style={{
                            height:          '36px',
                            border:          isPaidSplit
                              ? '1.5px solid var(--neutral-line-outline)'
                              : '1.5px solid var(--neutral-line-outline)',
                            borderRadius:    '8px',
                            backgroundColor: isPaidSplit ? 'var(--neutral-surface-secondary)' : 'var(--neutral-surface-primary)',
                            overflow:        'hidden',
                            paddingLeft:     currentMethod === 'amount' ? '8px' : '10px',
                            paddingRight:    currentMethod === 'pct'    ? '8px' : '10px',
                            opacity:         isPaidSplit ? 0.6 : 1,
                          }}
                        >
                          {currentMethod === 'amount' && (
                            <span style={{ fontSize: 'var(--text-h4)', color: 'var(--neutral-onsurface-tertiary)', fontFamily: 'Lato, sans-serif', marginRight: '4px', flexShrink: 0 }}>Rp</span>
                          )}
                          <input
                            type="text"
                            readOnly
                            value={val}
                            onPointerDown={(e) => {
                              if (isPaidSplit) return;
                              e.preventDefault();
                              ctx.openFor('numeric', val, (newVal) => handleAllocValueChange(unit._unitKey, sid, newVal), e.currentTarget);
                            }}
                            placeholder="0"
                            style={{
                              flex:       1,
                              minWidth:   0,
                              border:     'none',
                              outline:    'none',
                              background: 'transparent',
                              fontFamily: 'Lato, sans-serif',
                              fontWeight: 600,
                              fontSize:   'var(--text-p)',
                              color:      isPaidSplit ? 'var(--neutral-onsurface-tertiary)' : 'var(--neutral-onsurface-primary)',
                              textAlign:  currentMethod === 'amount' ? 'right' : 'left',
                              cursor:     isPaidSplit ? 'default' : 'pointer',
                            }}
                          />
                          {currentMethod === 'pct' && (
                            <span style={{ fontSize: 'var(--text-h4)', color: 'var(--neutral-onsurface-tertiary)', fontFamily: 'Lato, sans-serif', marginLeft: '4px', flexShrink: 0 }}>%</span>
                          )}
                        </div>

                        {/* Fill Rest — hidden for paid splits */}
                        {!isPaidSplit && (
                          <button
                            onClick={() => {
                              const others   = assignedSplitIds.filter(id => id !== sid);
                              const otherSum = others.reduce((s, id) => {
                                const sp = inlineSplits.find(x => x.id === id);
                                if (sp?.paid) return s; // paid portion fixed
                                return s + (parseFloat(itemAllocValues[unit._unitKey]?.[id] || '0') || 0);
                              }, 0);
                              const target = currentMethod === 'pct' ? 100 : itemTotal;
                              const rest   = Math.max(0, target - otherSum);
                              handleAllocValueChange(
                                unit._unitKey,
                                sid,
                                currentMethod === 'pct' ? rest.toFixed(1) : String(Math.round(rest)),
                              );
                            }}
                            style={{
                              height:          '36px',
                              padding:         '0 10px',
                              borderRadius:    'var(--radius-small)',
                              border:          '1.5px solid var(--feature-brand-primary)',
                              backgroundColor: 'transparent',
                              color:           'var(--feature-brand-primary)',
                              fontSize:        'var(--text-label)',
                              fontFamily:      'Lato, sans-serif',
                              fontWeight:      700,
                              cursor:          'pointer',
                              flexShrink:      0,
                              whiteSpace:      'nowrap',
                            }}
                          >
                            Fill Rest
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Sum validation hint */}
                <div className="flex items-center justify-end gap-1" style={{ marginTop: '2px' }}>
                  <span style={{
                    fontSize:   'var(--text-label)',
                    fontFamily: 'Lato, sans-serif',
                    fontWeight: 600,
                    color:      allocValid ? 'var(--status-green-primary)' : 'var(--status-red-primary)',
                  }}>
                    {currentMethod === 'pct'
                      ? `${allocSum.toFixed(1)}% / 100%`
                      : `${formatCurrency(allocSum)} / ${formatCurrency(itemTotal)}`
                    }
                  </span>
                  {allocValid && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="var(--status-green-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}