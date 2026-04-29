import { useState, useEffect, useRef } from 'react';
import { X, CreditCard, Banknote, Smartphone, Wallet, Check as CheckIcon, Link2, Unlink, Plus, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatCurrency } from '../../utils/formatters';
import { useSnackbar } from '../labamu/Snackbar';
import { StatusTag } from '../ui/StatusTag';
import { TextField } from '../ui/TextField';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { TABLES, MENU_ITEMS } from '../../data/mockData';
import { MainBtn } from '../ui/MainBtn';
import { Chip } from '../ui/Chip';
import PaymentSuccessModal from './PaymentSuccessModal';
import SplitPaymentModal from './SplitPaymentModal';
import { useVirtualInputContext } from '../../context/VirtualInputContext';
import { TabGroup } from '../ui/TabGroup';
import { ByItemPanel } from './ByItemPanel';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getItemPrice(item: any): number {
  if (item.isComplimentary) return 0;
  if (item.isVoided) return 0;
  if (!item.discountType || !item.discountValue) return item.price;
  if (item.discountType === 'PERCENTAGE') return item.price * (1 - item.discountValue / 100);
  return Math.max(0, item.price - item.discountValue);
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface InlineSplit {
  id: string;
  name: string;
  paid: boolean;
  paidAmount?: number;
}

interface PaymentMethod {
  type: 'CASH' | 'DEBIT' | 'CREDIT' | 'QRIS' | 'EWALLET';
  amount: number;
  percentage: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const PAYMENT_TYPES = [
  { type: 'CASH'    as const, label: 'Cash',        icon: Banknote,    color: 'bg-green-600'  },
  { type: 'DEBIT'   as const, label: 'Debit Card',  icon: CreditCard,  color: 'bg-blue-600'   },
  { type: 'CREDIT'  as const, label: 'Credit Card', icon: CreditCard,  color: 'bg-purple-600' },
  { type: 'QRIS'    as const, label: 'QRIS',        icon: Smartphone,  color: 'bg-orange-600' },
  { type: 'EWALLET' as const, label: 'E-Wallet',    icon: Wallet,      color: 'bg-pink-600'   },
];

const SPLIT_COLORS = [
  { solid: '#2563EB', light: '#EFF6FF' },
  { solid: '#EA580C', light: '#FFF7ED' },
  { solid: '#16A34A', light: '#F0FDF4' },
  { solid: '#9333EA', light: '#FAF5FF' },
  { solid: '#DC2626', light: '#FEF2F2' },
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface PaymentScreenProps {
  open: boolean;
  checkId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

// ═════════════════════════════════════════════════════════════════════════════
export default function PaymentScreen({ open, checkId, onClose, onSuccess }: PaymentScreenProps) {
  const {
    getCheckById, getItemsByCheck, completePayment,
    getMergedTableGroup, checks,
  } = useRestaurant();
  const snackbar = useSnackbar();
  const ctx = useVirtualInputContext();

  const check      = getCheckById(checkId);
  const allItems   = getItemsByCheck(checkId);

  // Merged table info
  const mergedTableGroup = check?.tableId ? getMergedTableGroup(check.tableId) : undefined;
  const mergedTableNames = mergedTableGroup
    ? mergedTableGroup.tableIds.map(id => TABLES.find(t => t.id === id)?.name).filter(Boolean).join(', ')
    : '';
  const tableInfo = check?.tableId ? TABLES.find(t => t.id === check.tableId) : undefined;
  const tableName = tableInfo?.name || check?.tableId?.split('-')[1] || '';

  // ─── Billable items ────────────────────────────────────────────────────────
  const [combinedBillIds, setCombinedBillIds] = useState<string[]>([]);

  const allCombinedItems = [
    ...allItems,
    ...combinedBillIds.flatMap(id => getItemsByCheck(id)),
  ];
  const billableItems = allCombinedItems.filter(item =>
    ['SENT', 'IN_PREP', 'READY', 'SERVED'].includes(item.status)
  );

  // ─── Totals (mirrors OperationalOrderScreen exactly) ──────────────────────
  const subtotal = billableItems.reduce((sum, item) => sum + getItemPrice(item) * item.quantity, 0);

  let billDiscountAmount = 0;
  if (check?.billDiscountType && check?.billDiscountValue) {
    billDiscountAmount = check.billDiscountType === 'PERCENTAGE'
      ? subtotal * (check.billDiscountValue / 100)
      : Math.min(check.billDiscountValue, subtotal);
  }
  const subtotalAfterDiscount = subtotal - billDiscountAmount;
  const serviceCharge = subtotalAfterDiscount * 0.1;
  const tax           = subtotalAfterDiscount * 0.05;
  const tipAmount     = check?.tipAmount || 0;
  const grandTotal    = subtotalAfterDiscount + serviceCharge + tax + tipAmount;
  const previouslyPaid = check?.paidAmount || 0;
  const remainingBalance = grandTotal - previouslyPaid;
  const totalAmount = remainingBalance; // amount to pay now

  // Payment status
  type PaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'FULLY_PAID';
  const paymentStatus: PaymentStatus =
    previouslyPaid === 0 ? 'UNPAID' :
    previouslyPaid >= grandTotal ? 'FULLY_PAID' : 'PARTIALLY_PAID';

  // ─── Full-bill payment state ───────────────────────────────────────────────
  const [selectedMethods, setSelectedMethods]   = useState<Set<string>>(new Set());
  const [amounts, setAmounts]                   = useState<Record<string, string>>({});
  const [percentages, setPercentages]           = useState<Record<string, string>>({});
  const [inputMode, setInputMode]               = useState<'amount' | 'percentage'>('amount');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedPayments, setCompletedPayments] = useState<any[]>([]);

  // ─── Split-bill inline state ───────────────────────────────────────────────
  const [splitMode, setSplitMode]                     = useState(false);
  const [inlineSplits, setInlineSplits]               = useState<InlineSplit[]>([]);
  // Each item maps to an array of split IDs it is assigned to (supports multi-split)
  const [itemSplitAssignment, setItemSplitAssignment] = useState<Record<string, string[]>>({});
  const [splitViewMode, setSplitViewMode]             = useState<'item' | 'category'>('item');
  const [payingSplitId, setPayingSplitId]             = useState<string | null>(null);
  // Allocation method per item when shared across splits: 'equal' | 'pct' | 'amount'
  const [itemAllocMethod, setItemAllocMethod]         = useState<Record<string, 'equal' | 'pct' | 'amount'>>({});
  // Custom allocation values: itemId → splitId → string input value
  const [itemAllocValues, setItemAllocValues]         = useState<Record<string, Record<string, string>>>({});
  // Active chip in the split summary panel — always points to the first unpaid split
  const [activeSplitChipId, setActiveSplitChipId]     = useState<string | null>(null);
  // Unit keys of items that were assigned to multiple splits when one of those splits was paid.
  // These items are only "partially paid" — their remaining split buttons must stay visible
  // even if the user later unassigns them from the unpaid split, until the split itself
  // is removed from the bill via the right-panel Remove button.
  const [partiallyPaidUnitKeys, setPartiallyPaidUnitKeys] = useState<Set<string>>(new Set());

  // Refs so the close-effect can read latest split state without re-subscribing
  const splitModeRef    = useRef(splitMode);
  const inlineSplitsRef = useRef(inlineSplits);
  useEffect(() => { splitModeRef.current    = splitMode;    }, [splitMode]);
  useEffect(() => { inlineSplitsRef.current = inlineSplits; }, [inlineSplits]);

  // Auto-select the first unpaid chip whenever the splits array changes
  useEffect(() => {
    if (inlineSplits.length === 0) { setActiveSplitChipId(null); return; }
    setActiveSplitChipId(prev => {
      // Keep current selection if it still exists and is not yet paid
      if (prev && inlineSplits.find(s => s.id === prev && !s.paid)) return prev;
      // Otherwise jump to first unpaid, or last split if all are paid
      return (inlineSplits.find(s => !s.paid) ?? inlineSplits[inlineSplits.length - 1]).id;
    });
  }, [inlineSplits]);

  // ─── Combine-bill dialog state ─────────────────────────────────────────────
  const [showCombineBillDialog, setShowCombineBillDialog]   = useState(false);
  const [selectedBillsToCombine, setSelectedBillsToCombine] = useState<string[]>([]);
  const [showDetachBillDialog, setShowDetachBillDialog]     = useState(false);

  const availableBillsToCombine = checks.filter(c =>
    c.id !== checkId && c.status === 'OPEN' && c.billNumber && !combinedBillIds.includes(c.id)
  );

  // ─── Reset all state when modal closes ────────────────────────────────────
  useEffect(() => {
    if (!open) {
      setSelectedMethods(new Set());
      setAmounts({});
      setPercentages({});
      setInputMode('amount');
      setShowConfirmDialog(false);
      setIsProcessingPayment(false);
      setShowSuccessModal(false);
      setCompletedPayments([]);
      setCombinedBillIds([]);
      setSelectedBillsToCombine([]);
      setPayingSplitId(null);        // always close SplitPaymentModal sub-dialog
      setActiveSplitChipId(null);   // will be re-set by the on-open effect below

      // Preserve split session when there are partially paid splits ──────────
      // Staff can close the modal (e.g. to add items), reopen, and continue
      // paying the remaining splits — the assignment state is kept intact.
      const splits = inlineSplitsRef.current;
      const hasPartialSplits =
        splitModeRef.current &&
        splits.length > 0 &&
        splits.some(s => s.paid) &&
        !splits.every(s => s.paid);

      if (!hasPartialSplits) {
        setSplitMode(false);
        setInlineSplits([]);
        setItemSplitAssignment({});
        setSplitViewMode('item');
        setItemAllocMethod({});
        setItemAllocValues({});
        setPartiallyPaidUnitKeys(new Set());
      }
      // When hasPartialSplits === true, split state intentionally survives
      // the close → reopen cycle.
    } else {
      // Modal opened — auto-select the first unpaid split (state may have been
      // preserved from a previous partial-payment session).
      const splits = inlineSplitsRef.current;
      if (splits.length > 0) {
        setActiveSplitChipId(
          (splits.find(s => !s.paid) ?? splits[splits.length - 1]).id
        );
      }
    }
  }, [open]);

  // ═══════════════════════════════════════════════════════════════════════════
  // FULL BILL — payment method helpers
  // ══════════════════════════════════════════════════��════════════════════════
  const toggleMethod = (type: string) => {
    const next = new Set(selectedMethods);
    if (next.has(type)) {
      next.delete(type);
      const a = { ...amounts };  delete a[type];
      const p = { ...percentages }; delete p[type];
      setAmounts(a); setPercentages(p);
    } else {
      next.add(type);
      const equalAmount = totalAmount / next.size;
      const a: Record<string, string> = {};
      const p: Record<string, string> = {};
      next.forEach(m => {
        a[m] = equalAmount.toFixed(0);
        p[m] = totalAmount > 0 ? ((equalAmount / totalAmount) * 100).toFixed(2) : '0';
      });
      setAmounts(a); setPercentages(p);
    }
    setSelectedMethods(next);
  };

  const handleAmountChange = (type: string, value: string) => {
    const numeric        = parseFloat(value.replace(/,/g, '')) || 0;
    const otherAllocated = Array.from(selectedMethods)
      .filter(m => m !== type)
      .reduce((s, m) => s + (parseFloat(amounts[m]) || 0), 0);
    const capped = Math.min(numeric, Math.max(0, totalAmount - otherAllocated));
    const final  = capped > 0 ? capped.toFixed(0) : '';
    setAmounts({ ...amounts, [type]: final });
    if (totalAmount > 0) setPercentages({ ...percentages, [type]: ((capped / totalAmount) * 100).toFixed(2) });
  };

  const handlePercentageChange = (type: string, value: string) => {
    const numeric  = parseFloat(value.replace(/,/g, '')) || 0;
    const otherPct = Array.from(selectedMethods)
      .filter(m => m !== type)
      .reduce((s, m) => s + (parseFloat(percentages[m]) || 0), 0);
    const capped   = Math.min(numeric, Math.max(0, 100 - otherPct));
    const final    = capped > 0 ? capped.toFixed(2) : '';
    setPercentages({ ...percentages, [type]: final });
    setAmounts({ ...amounts, [type]: ((totalAmount * capped) / 100).toFixed(0) });
  };

  const totalAllocated = Array.from(selectedMethods).reduce((s, t) => s + (parseFloat(amounts[t]) || 0), 0);
  const remaining      = totalAmount - totalAllocated;
  const isValid        = Math.abs(remaining) < 0.01;

  const fillRemaining = (type: string) => {
    if (remaining > 0) handleAmountChange(type, remaining.toFixed(0));
  };

  const handleConfirmPayment = () => {
    if (!isValid) { snackbar.error('Total payment must match the bill amount'); return; }
    if (selectedMethods.size === 0) { snackbar.error('Please select at least one payment method'); return; }
    setShowConfirmDialog(true);
  };

  const processPayment = async () => {
    setIsProcessingPayment(true);
    setShowConfirmDialog(false);
    const payments: PaymentMethod[] = Array.from(selectedMethods).map(type => ({
      type: type as PaymentMethod['type'],
      amount: parseFloat(amounts[type]) || 0,
      percentage: parseFloat(percentages[type]) || 0,
    }));
    const totalPaid   = payments.reduce((s, p) => s + p.amount, 0);
    const isFullyPaid = check && totalPaid >= grandTotal;
    await new Promise(r => setTimeout(r, 1200));
    completePayment(checkId, payments, combinedBillIds.length > 0 ? combinedBillIds : undefined);
    setIsProcessingPayment(false);
    if (isFullyPaid) {
      setCompletedPayments(payments.map(p => ({ method: p.type as string, amount: p.amount })));
      setShowSuccessModal(true);
    } else {
      snackbar.success('Partial payment recorded');
      setSelectedMethods(new Set());
      setAmounts({});
      setPercentages({});
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // SPLIT BILL — inline helpers
  // ═══════════════════════════════════════════════════════════════════════════
  const activateSplitMode = () => {
    const splits: InlineSplit[] = [
      { id: 'split-1', name: 'Split 1', paid: false },
      { id: 'split-2', name: 'Split 2', paid: false },
    ];
    setInlineSplits(splits);
    const assignment: Record<string, string[]> = {};
    billableItems.forEach(item => {
      for (let i = 0; i < item.quantity; i++) {
        assignment[`${item.id}_u${i}`] = [];
      }
    });
    setItemSplitAssignment(assignment);
    setSplitMode(true);
  };

  const deactivateSplitMode = () => {
    if (inlineSplits.some(s => s.paid)) {
      snackbar.error('Cannot undo split — some splits have already been paid');
      return;
    }
    setSplitMode(false);
    setInlineSplits([]);
    setItemSplitAssignment({});
    setSplitViewMode('item');
    setPartiallyPaidUnitKeys(new Set());
  };

  const addSplit = () => {
    const n     = inlineSplits.length + 1;
    const newId = `split-${Date.now()}`;
    setInlineSplits(prev => [...prev, { id: newId, name: `Split ${n}`, paid: false }]);
  };

  const removeSplit = (splitId: string) => {
    const split = inlineSplits.find(s => s.id === splitId);
    if (!split) return;
    if (split.paid) { snackbar.error('Cannot remove a paid split'); return; }
    // Remove this splitId from all item assignment arrays
    setItemSplitAssignment(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(id => {
        next[id] = (next[id] || []).filter(sid => sid !== splitId);
      });
      return next;
    });
    const remaining = inlineSplits.filter(s => s.id !== splitId);
    setInlineSplits(remaining);
    // Revert to single-bill UI when 1 or fewer splits remain
    if (remaining.length <= 1) {
      setSplitMode(false);
      setInlineSplits([]);
      setItemSplitAssignment({});
      setSplitViewMode('item');
      setPartiallyPaidUnitKeys(new Set());
    }
  };

  // ── Item assignment helpers ──────────────────────────────────────────────
  const getItemCategory = (item: any): string => {
    if (!item.menuItemId) return 'Other';
    return MENU_ITEMS.find(mi => mi.id === item.menuItemId)?.category || 'Other';
  };

  const getCategoryGroups = () => {
    const groups: Record<string, typeof billableItems> = {};
    billableItems.forEach(item => {
      const cat = getItemCategory(item);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return Object.entries(groups).map(([category, items]) => ({ category, items }));
  };

  // Expand each billable item into individual unit objects (qty=2 → 2 rows)
  const getExpandedUnits = () =>
    billableItems.flatMap(item =>
      Array.from({ length: item.quantity }, (_, i) => ({
        ...item,
        _unitKey: `${item.id}_u${i}`,
        _unitIndex: i,
        quantity: 1, // each virtual row represents 1 unit
      }))
    );

  // Auto-calculate a split's total from its assigned items (proportional tax/service/tip).
  // Items shared across multiple splits are divided equally among them.
  const calculateSplitAmount = (splitId: string): number => {
    if (subtotal === 0) return 0;
    let assignedSubtotal = 0;
    getExpandedUnits().forEach(unit => {
      const splits = itemSplitAssignment[unit._unitKey] || [];
      if (!splits.includes(splitId) || splits.length === 0) return;
      const unitPrice = getItemPrice(unit); // 1 unit
      const method = splits.length > 1 ? (itemAllocMethod[unit._unitKey] || 'equal') : 'equal';
      if (method === 'equal') {
        assignedSubtotal += unitPrice / splits.length;
      } else if (method === 'pct') {
        const pct = parseFloat(itemAllocValues[unit._unitKey]?.[splitId] || '0') / 100;
        assignedSubtotal += unitPrice * pct;
      } else {
        assignedSubtotal += Math.min(parseFloat(itemAllocValues[unit._unitKey]?.[splitId] || '0'), unitPrice);
      }
    });
    if (assignedSubtotal === 0) return 0;
    const proportion    = assignedSubtotal / subtotal;
    const afterDiscount = assignedSubtotal - billDiscountAmount * proportion;
    return Math.round(afterDiscount * 1.15 + tipAmount * proportion);
  };

  // Toggle a single split in/out of an item's assignment array
  const assignItem = (itemId: string, splitId: string) => {
    setItemSplitAssignment(prev => {
      const current = prev[itemId] || [];
      const next = current.includes(splitId)
        ? current.filter(id => id !== splitId)
        : [...current, splitId];
      return { ...prev, [itemId]: next };
    });
  };

  // Update a custom allocation input value (percentage or amount) for one item+split
  const handleAllocValueChange = (itemId: string, splitId: string, value: string) => {
    setItemAllocValues(prev => ({
      ...prev,
      [itemId]: { ...(prev[itemId] || {}), [splitId]: value },
    }));
  };

  // Change allocation method for a shared item; clear previous custom values
  const setAllocMethod = (itemId: string, method: 'equal' | 'pct' | 'amount') => {
    setItemAllocMethod(prev => ({ ...prev, [itemId]: method }));
    setItemAllocValues(prev => ({ ...prev, [itemId]: {} }));
  };

  // Toggle a split for every item in a category
  const assignCategory = (category: string, splitId: string, assign: boolean) => {
    const catItems = billableItems.filter(i => getItemCategory(i) === category);
    const unitKeys = catItems.flatMap(i =>
      Array.from({ length: i.quantity }, (_, idx) => `${i.id}_u${idx}`)
    );
    setItemSplitAssignment(prev => {
      const next = { ...prev };
      unitKeys.forEach(key => {
        const current = next[key] || [];
        if (assign && !current.includes(splitId)) {
          next[key] = [...current, splitId];
        } else if (!assign) {
          next[key] = current.filter(id => id !== splitId);
        }
      });
      return next;
    });
  };

  const allSplitsPaid   = inlineSplits.length > 0 && inlineSplits.every(s => s.paid);
  // A unit is "unassigned" when its split array is empty
  const unassignedItems = splitMode ? getExpandedUnits().filter(u => !(itemSplitAssignment[u._unitKey] || []).length) : [];

  const handleSplitPaymentConfirm = async (payments: any[]) => {
    if (!payingSplitId) return;
    const split = inlineSplits.find(s => s.id === payingSplitId);
    if (!split) return;
    const totalPaid = payments.reduce((s: number, p: any) => s + p.amount, 0);
    completePayment(checkId, payments);
    const updated = inlineSplits.map(s =>
      s.id === payingSplitId ? { ...s, paid: true, paidAmount: totalPaid } : s
    );
    setInlineSplits(updated);
    setPayingSplitId(null);

    // Record any item that was assigned to THIS split AND at least one other split.
    // Those items are "partially paid" — the paid split only covered their fraction,
    // so their unassigned split buttons must remain visible even if the user later
    // untaps the remaining unpaid split.
    setPartiallyPaidUnitKeys(prev => {
      const next = new Set(prev);
      getExpandedUnits().forEach(unit => {
        const assignments = itemSplitAssignment[unit._unitKey] || [];
        if (assignments.includes(payingSplitId) && assignments.length > 1) {
          next.add(unit._unitKey);
        }
      });
      return next;
    });

    const allPaid = updated.every(s => s.paid);
    if (allPaid) {
      setCompletedPayments(payments.map((p: any) => ({ method: (p.type || p.method) as string, amount: p.amount })));
      setShowSuccessModal(true);
    } else {
      snackbar.success(`${split.name} paid — ${updated.filter(s => !s.paid).length} split(s) remaining`);
    }
  };

  // ─── Combine-bill helpers ──────────────────────────────────────────────────
  const toggleBillToCombine = (id: string) =>
    setSelectedBillsToCombine(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const handleConfirmCombineBills = () => {
    if (selectedBillsToCombine.length === 0) { snackbar.error('Select at least one bill'); return; }
    setCombinedBillIds(prev => [...prev, ...selectedBillsToCombine]);
    snackbar.success(`Combined ${selectedBillsToCombine.length} bill(s)`);
    setShowCombineBillDialog(false);
    setSelectedBillsToCombine([]);
  };

  const handleDetachBill = () => {
    if (combinedBillIds.length === 1) {
      const bill = checks.find(c => c.id === combinedBillIds[0]);
      setCombinedBillIds([]);
      snackbar.success(`Detached Bill #${bill?.billNumber}`);
    } else {
      setShowDetachBillDialog(true);
    }
  };

  const handleDetachSpecificBill = (billId: string) => {
    const bill = checks.find(c => c.id === billId);
    setCombinedBillIds(prev => prev.filter(id => id !== billId));
    snackbar.success(`Detached Bill #${bill?.billNumber}`);
    if (combinedBillIds.length <= 1) setShowDetachBillDialog(false);
  };

  // ─── Success modal handler ─────────────────────────────────────────────────
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    if (onSuccess) onSuccess(); else onClose();
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <>
      {/* ── Payment Dialog Modal ─────────────────────────────────────────── */}
      <Dialog
        open={open && !showSuccessModal}
        onOpenChange={isOpen => { if (!showSuccessModal && !isOpen) onClose(); }}
      >
        <DialogContent
          className="p-0 gap-0 flex flex-col overflow-hidden [&>button:last-child]:hidden"
          style={{ width: '1020px', maxWidth: 'calc(100vw - 48px)', height: '90vh', maxHeight: '90vh', borderRadius: 'var(--radius-card)' }}
        >
          <DialogTitle className="sr-only">Payment</DialogTitle>
          {/* ── Header ───────────────────────────────────────────────────── */}
          <div
            className="h-[64px] flex items-center justify-between shrink-0 px-6 border-b"
            style={{ borderColor: 'var(--neutral-line-outline)' }}
          >
            {/* Left: title + meta */}
            <div className="flex items-center gap-3 min-w-0">
              <h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-onsurface-primary)', whiteSpace: 'nowrap' }}>
                Payment
              </h2>
              {(check?.tableId || check?.billNumber) && (
                <div className="flex items-center gap-2 min-w-0" style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-secondary)', fontWeight: 'var(--font-weight-semibold)' }}>
                  {check?.tableId && (
                    <span className="truncate">
                      {mergedTableGroup ? `Table ${tableName} (${mergedTableNames})` : `Table ${tableName}`}
                    </span>
                  )}
                  {check?.tableId && check?.billNumber && <span className="shrink-0">·</span>}
                  {check?.billNumber && (
                    <span className="truncate">
                      Bill #{check.billNumber}
                      {combinedBillIds.map(id => {
                        const b = checks.find(c => c.id === id);
                        return b?.billNumber ? `, #${b.billNumber}` : '';
                      }).join('')}
                    </span>
                  )}
                </div>
              )}
              {paymentStatus !== 'UNPAID' && (() => {
                const cfg = paymentStatus === 'PARTIALLY_PAID'
                  ? { text: 'Partially Paid', bgColor: '#FFF9E6', textColor: '#A65F00' }
                  : { text: 'Fully Paid', bgColor: '#E8F5E5', textColor: '#54A73F' };
                return <StatusTag text={cfg.text} bgColor={cfg.bgColor} textColor={cfg.textColor} />;
              })()}
            </div>

            {/* Right: actions + close */}
            <div className="flex items-center gap-2 shrink-0 ml-4">
              {combinedBillIds.length > 0 && (
                <MainBtn
                  variant="secondary"
                  size="sm"
                  onClick={handleDetachBill}
                  style={{ color: 'var(--status-red-primary)', borderColor: 'var(--status-red-primary)' }}
                >
                  <Unlink className="w-4 h-4" />
                  Detach
                </MainBtn>
              )}
              
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" style={{ color: 'var(--neutral-onsurface-secondary)' }} />
              </button>
            </div>
          </div>

          {/* ── Body (2 columns) ──────────────────────────────────────────── */}
          <div className="flex-1 flex overflow-hidden min-h-0">

            {/* ── LEFT: Bill Summary ─────────────────────────────────────── */}
            <div
              className="w-[300px] shrink-0 flex flex-col border-r overflow-y-auto"
              style={{ borderColor: 'var(--neutral-line-outline)', backgroundColor: 'var(--neutral-surface-primary)' }}
            >
              {/* Summary header */}
              <div className="px-5 py-4 shrink-0" style={{ borderColor: 'var(--neutral-line-outline)' }}>
                <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-onsurface-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Bill Summary
                </p>
              </div>

              {/* Items list */}
              <div className="flex-1 px-5 py-4 space-y-3">
                {billableItems.length === 0 ? (
                  <p style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-tertiary)' }}>No items billed yet</p>
                ) : (
                  (() => {
                    // Group identical items (same name + modifiers + notes)
                    const grouped = billableItems.reduce((acc, item) => {
                      const key = `${item.name}||${(item.modifiers || []).join('\x00')}||${item.notes || ''}`;
                      const existing = acc.get(key);
                      if (existing) {
                        existing.totalQty += item.quantity;
                      } else {
                        acc.set(key, { item, totalQty: item.quantity });
                      }
                      return acc;
                    }, new Map<string, { item: typeof billableItems[0]; totalQty: number }>());

                    return Array.from(grouped.values()).map(({ item, totalQty }) => (
                      <div
                        key={`${item.name}||${(item.modifiers || []).join('\x00')}||${item.notes || ''}`}
                        className="flex items-start justify-between gap-2"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="truncate" style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--neutral-onsurface-primary)', fontFamily: 'Lato, sans-serif' }}>
                            {totalQty}x {item.name}
                          </p>
                          {item.modifiers?.length > 0 && (
                            <p className="truncate" style={{ fontSize: 'var(--text-h4)', color: 'var(--neutral-onsurface-tertiary)', fontFamily: 'Lato, sans-serif' }}>
                              {item.modifiers.join(', ')}
                            </p>
                          )}
                          {item.notes && (
                            <p className="truncate" style={{ fontSize: 'var(--text-h4)', color: 'var(--neutral-onsurface-tertiary)', fontFamily: 'Lato, sans-serif', fontStyle: 'italic' }}>
                              *{item.notes}
                            </p>
                          )}
                        </div>
                        <p className="shrink-0" style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--neutral-onsurface-primary)', fontFamily: 'Lato, sans-serif' }}>
                          {formatCurrency(getItemPrice(item) * totalQty)}
                        </p>
                      </div>
                    ));
                  })()
                )}
              </div>

              {/* Totals */}
              <div className="px-5 py-4 border-t space-y-2 shrink-0" style={{ borderColor: 'var(--neutral-line-outline)' }}>
                <div className="flex justify-between" style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-secondary)' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{formatCurrency(subtotal)}</span>
                </div>
                {billDiscountAmount > 0 && (
                  <div className="flex justify-between" style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-secondary)' }}>
                    <span>Discount</span>
                    <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--status-green-primary)' }}>-{formatCurrency(billDiscountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between" style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-secondary)' }}>
                  <span>Service (10%)</span>
                  <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{formatCurrency(serviceCharge)}</span>
                </div>
                <div className="flex justify-between" style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-secondary)' }}>
                  <span>Tax (5%)</span>
                  <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{formatCurrency(tax)}</span>
                </div>
                {tipAmount > 0 && (
                  <div className="flex justify-between" style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-secondary)' }}>
                    <span>Tip</span>
                    <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{formatCurrency(tipAmount)}</span>
                  </div>
                )}

                <Separator style={{ backgroundColor: 'var(--neutral-line-outline)' }} />

                {previouslyPaid > 0 && (
                  <>
                    <div className="flex justify-between" style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-secondary)' }}>
                      <span>Grand Total</span>
                      <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{formatCurrency(grandTotal)}</span>
                    </div>
                    <div className="flex justify-between" style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-secondary)' }}>
                      <span>Previously Paid</span>
                      <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--status-green-primary)' }}>-{formatCurrency(previouslyPaid)}</span>
                    </div>
                    <Separator style={{ backgroundColor: 'var(--neutral-line-outline)' }} />
                  </>
                )}

                <div className="flex justify-between">
                  <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-onsurface-primary)' }}>
                    {previouslyPaid > 0 ? 'Remaining' : 'Total'}
                  </span>
                  <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)', color: 'var(--feature-brand-primary)' }}>
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* ── RIGHT: Payment Area ────────────────────────────────────── */}
            <div className="w-[720px] flex flex-col overflow-hidden min-h-0">

              {/* ── Bill / Split header — always visible ─────────────────── */}
              <div className="px-5 py-3 flex items-center justify-between shrink-0 border-b" style={{ borderColor: 'var(--neutral-line-outline)' }}>
                <div>
                  <h3 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-onsurface-primary)' }}>
                    Bill
                  </h3>
                  <p style={{ fontSize: 'var(--text-label)', color: 'var(--neutral-onsurface-secondary)', marginTop: '2px' }}>
                    {inlineSplits.length === 0 ? (
                      '1 bill'
                    ) : (
                      <>
                        {inlineSplits.length} split{inlineSplits.length > 1 ? 's' : ''}
                        {' · '}
                        {inlineSplits.filter(s => s.paid).length}/{inlineSplits.length} paid
                        {unassignedItems.length > 0 && (
                          <span style={{ color: 'var(--status-red-primary)', marginLeft: '8px' }}>
                            · {unassignedItems.length} item{unassignedItems.length > 1 ? 's' : ''} unassigned
                          </span>
                        )}
                      </>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <MainBtn
                    variant="primary"
                    size="lg"
                    onClick={() => setShowCombineBillDialog(true)}
                    disabled={splitMode && inlineSplits.some(s => s.paid)}
                    style={{
                      fontWeight: 600,
                      ...(!(splitMode && inlineSplits.some(s => s.paid)) ? { backgroundColor: 'var(--feature-brand-container-light)', borderColor: 'var(--feature-brand-primary)', borderWidth: '1.5px', color: 'var(--neutral-onsurface-primary)' } : {}),
                    }}
                  >
                    <Link2 className="w-4 h-4 mr-1.5 shrink-0" />
                    Combine Bill
                  </MainBtn>
                  <MainBtn
                    variant="primary"
                    size="lg"
                    onClick={splitMode ? addSplit : activateSplitMode}
                    disabled={allSplitsPaid}
                     style={{ backgroundColor: 'var(--feature-brand-container-light)', borderColor: 'var(--feature-brand-primary)', borderWidth: '1.5px', color: 'var(--neutral-onsurface-primary)', fontWeight: 600 }}
                  >
                    <Plus className="w-4 h-4 mr-1.5 shrink-0" /> Add Split
                  </MainBtn>
                </div>
              </div>

              {!splitMode ? (
                /* ── SINGLE PAYMENT MODE ────────────────────────────────── */
                <>
                  <ScrollArea className="flex-1 min-h-0">
                    <div className="p-6 space-y-6">
                      {/* Section title */}
                      <div className="flex items-center justify-between">
                        <h3 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-onsurface-primary)' }}>
                          Select Payment Method
                        </h3>
                      </div>

                      {/* Payment method cards */}
                      <div className="grid grid-cols-5 gap-2">
                        {PAYMENT_TYPES.map(({ type, label, icon: Icon, color }) => {
                          const isSelected = selectedMethods.has(type);
                          return (
                            <button
                              key={type}
                              onClick={() => toggleMethod(type)}
                              className={`border-2 p-3 flex flex-col items-center justify-center gap-2 min-h-[88px] transition-all ${
                                isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                              }`}
                              style={{ borderRadius: 'var(--radius-card)' }}
                            >
                              <div className={`p-2 ${isSelected ? color : 'bg-muted'} ${isSelected ? 'text-white' : 'text-muted-foreground'}`} style={{ borderRadius: 'var(--radius-small)' }}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-bold)', textAlign: 'center' }}>{label}</p>
                            </button>
                          );
                        })}
                      </div>

                      {/* Amount inputs (only when methods selected) */}
                      {selectedMethods.size > 0 && (
                        <div className="space-y-4">
                          {/* Input mode toggle */}
                          <div className="flex p-1 gap-1 rounded-lg border" style={{ borderColor: 'var(--neutral-line-outline)' }}>
                            {(['amount', 'percentage'] as const).map(mode => (
                              <button
                                key={mode}
                                onClick={() => setInputMode(mode)}
                                className="flex-1 h-9 rounded-md transition-colors"
                                style={{
                                  backgroundColor: inputMode === mode ? 'var(--feature-brand-containerlighter)' : 'transparent',
                                  color: inputMode === mode ? 'var(--feature-brand-primary)' : 'var(--neutral-onsurface-primary)',
                                  fontSize: 'var(--text-p)',
                                  fontWeight: inputMode === mode ? 'var(--font-weight-bold)' : 'var(--font-weight-regular)',
                                }}
                              >
                                By {mode.charAt(0).toUpperCase() + mode.slice(1)}
                              </button>
                            ))}
                          </div>

                          {/* Inputs per method */}
                          <div className="space-y-3">
                            {PAYMENT_TYPES.filter(({ type }) => selectedMethods.has(type)).map(({ type, label, icon: Icon, color }) => (
                              <div
                                key={type}
                                className="border-2 border-primary p-4 flex items-center gap-4 bg-primary/5"
                                style={{ borderRadius: 'var(--radius-card)' }}
                              >
                                <div className="flex flex-col items-center gap-1 shrink-0 w-[72px]">
                                  <div className={`p-2 ${color} text-white`} style={{ borderRadius: 'var(--radius-small)' }}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <p style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-bold)', textAlign: 'center' }}>{label}</p>
                                </div>
                                <div className="h-12 w-px bg-border shrink-0" />
                                <div className="flex-1">
                                  {inputMode === 'amount' ? (
                                    <div>
                                      <div className="flex gap-2">
                                        <div
                                          className="flex items-center flex-1"
                                          style={{
                                            height: 40, border: '1.5px solid var(--neutral-line-outline)',
                                            borderRadius: 'var(--radius-input)', backgroundColor: 'var(--neutral-surface-primary)',
                                            overflow: 'hidden', paddingLeft: 8, paddingRight: 8,
                                          }}
                                        >
                                          <span style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-tertiary)', fontFamily: 'Lato, sans-serif', marginRight: 4, flexShrink: 0 }}>Rp</span>
                                          <input
                                            type="text"
                                            readOnly
                                            value={amounts[type] !== undefined && amounts[type] !== '' ? Number(amounts[type]).toLocaleString('en-US') : ''}
                                            onPointerDown={(e) => { e.preventDefault(); ctx.openFor('numeric', amounts[type] || '', (val) => {
                                              if (val === '' || /^\d*$/.test(val)) handleAmountChange(type, val);
                                            }, e.currentTarget); }}
                                            placeholder={Number(Math.round(totalAmount)).toLocaleString('en-US')}
                                            style={{
                                              flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
                                              fontFamily: 'Lato, sans-serif', fontWeight: 600, fontSize: 'var(--text-p)',
                                              color: 'var(--neutral-onsurface-primary)', textAlign: 'right',
                                              cursor: 'pointer',
                                            }}
                                          />
                                        </div>
                                        {/* Fill Rest — always visible; dimmed when nothing left */}
                                        <button
                                          onClick={() => fillRemaining(type)}
                                          disabled={remaining <= 0 || remaining <= (parseFloat(amounts[type]) || 0)}
                                          style={{
                                            height: 40, padding: '0 12px', borderRadius: 'var(--radius-button)',
                                            border: '1.5px solid var(--feature-brand-primary)',
                                            backgroundColor: 'transparent', color: 'var(--feature-brand-primary)',
                                            fontSize: 'var(--text-label)', fontFamily: 'Lato, sans-serif', fontWeight: 700,
                                            cursor: remaining > 0 && remaining > (parseFloat(amounts[type]) || 0) ? 'pointer' : 'default',
                                            opacity: remaining > 0 && remaining > (parseFloat(amounts[type]) || 0) ? 1 : 0.35,
                                            flexShrink: 0, whiteSpace: 'nowrap',
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
                                      <div
                                        className="flex items-center"
                                        style={{
                                          height: 40, border: '1.5px solid var(--neutral-line-outline)',
                                          borderRadius: 'var(--radius-input)', backgroundColor: 'var(--neutral-surface-primary)',
                                          overflow: 'hidden', paddingLeft: 10, paddingRight: 8,
                                        }}
                                      >
                                        <input
                                          type="text"
                                          readOnly
                                          value={percentages[type] || ''}
                                          onPointerDown={(e) => { e.preventDefault(); ctx.openFor('numeric', percentages[type] || '', (val) => {
                                            if (val === '' || /^\d*\.?\d*$/.test(val)) handlePercentageChange(type, val);
                                          }, e.currentTarget); }}
                                          placeholder="0"
                                          style={{
                                            flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
                                            fontFamily: 'Lato, sans-serif', fontWeight: 600, fontSize: 'var(--text-p)',
                                            color: 'var(--neutral-onsurface-primary)', textAlign: 'right',
                                            cursor: 'pointer',
                                          }}
                                        />
                                        <span style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-tertiary)', fontFamily: 'Lato, sans-serif', marginLeft: 4, flexShrink: 0 }}>%</span>
                                      </div>
                                      <p style={{ fontSize: 'var(--text-label)', color: 'var(--neutral-onsurface-tertiary)', fontFamily: 'Lato, sans-serif', marginTop: 4 }}>
                                        {amounts[type] ? formatCurrency(parseFloat(amounts[type])) : formatCurrency(0)}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                <button
                                  onClick={() => toggleMethod(type)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted shrink-0"
                                >
                                  <X className="w-4 h-4 text-muted-foreground" />
                                </button>
                              </div>
                            ))}
                          </div>

                          {/* Remaining indicator — never shows a minus sign */}
                          {(() => {
                            const clamped     = Math.max(0, remaining);
                            const done        = clamped < 0.01;
                            const methodCount = selectedMethods.size;
                            const perMethod   = methodCount > 0 && clamped > 0.01
                              ? formatCurrency(Math.round(clamped / methodCount))
                              : null;
                            return (
                              <div
                                className="flex items-center justify-between p-4"
                                style={{
                                  backgroundColor: done ? 'var(--status-green-container)' : 'var(--neutral-surface-primary)',
                                  border:          `1px solid ${done ? 'var(--status-green-primary)' : 'var(--neutral-line-outline)'}`,
                                  borderRadius:    'var(--radius-card)',
                                }}
                              >
                                <div className="flex flex-col gap-0.5">
                                  <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--neutral-onsurface-primary)' }}>
                                    {done ? '✓ Fully Allocated' : 'Remaining'}
                                  </span>
                                  {perMethod && (
                                    <span style={{ fontSize: 'var(--text-label)', color: 'var(--neutral-onsurface-tertiary)' }}>
                                      {perMethod} × {methodCount} method{methodCount > 1 ? 's' : ''}
                                    </span>
                                  )}
                                </div>
                                <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)', color: done ? 'var(--status-green-primary)' : 'var(--status-red-primary)' }}>
                                  {formatCurrency(clamped)}
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Sticky footer — single payment mode */}
                  <div className="shrink-0 p-5 border-t flex gap-3" style={{ borderColor: 'var(--neutral-line-outline)' }}>
                    <MainBtn
                      size="lg"
                      onClick={handleConfirmPayment}
                      disabled={!isValid || selectedMethods.size === 0 || isProcessingPayment}
                      className="flex-1 h-[52px]"
                      style={{ borderRadius: 'var(--radius-button)' }}
                    >
                      {isProcessingPayment ? 'Processing…' : 'Confirm Payment'}
                    </MainBtn>
                  </div>
                </>
              ) : (
                /* ── SPLIT BILL MODE ─────────────────────────────────────── */
                <>

                  {/* Body: item-assignment panel + split-summary panel */}
                  <div className="flex-1 flex overflow-hidden min-h-0">

                    {/* ── LEFT: Item Assignment (300px) ───────────────────── */}
                    <div className="w-[300px] shrink-0 flex flex-col border-r overflow-hidden min-h-0" style={{ borderColor: 'var(--neutral-line-outline)' }}>
                      {/* By Item / By Category toggle */}
                      <div className="px-3 pt-3 pb-2 border-b shrink-0" style={{ borderColor: 'var(--neutral-line-outline)', backgroundColor: 'var(--neutral-surface-primary)' }}>
                        <TabGroup
                          options={[
                            { value: 'item', label: 'By Item' },
                            { value: 'category', label: 'By Category' },
                          ]}
                          value={splitViewMode}
                          onChange={setSplitViewMode}
                          size="lg"
                        />
                      </div>

                      <div className="flex-1 overflow-y-auto min-h-0">
                        <div className="p-3">
                          {splitViewMode === 'item' ? (
                            /* ── By Item: delegates to ByItemPanel ── */
                            <ByItemPanel
                              inlineSplits={inlineSplits}
                              getExpandedUnits={getExpandedUnits}
                              getItemPrice={getItemPrice}
                              itemSplitAssignment={itemSplitAssignment}
                              itemAllocMethod={itemAllocMethod}
                              itemAllocValues={itemAllocValues}
                              assignItem={assignItem}
                              setAllocMethod={setAllocMethod}
                              handleAllocValueChange={handleAllocValueChange}
                              partiallyPaidUnitKeys={partiallyPaidUnitKeys}
                            />
                          ) : (
                            /* ── By Category: bulk-assign entire category ── */
                            getCategoryGroups().map(({ category, items }) => {
                              const categoryTotal = items.reduce((s, i) => s + getItemPrice(i) * i.quantity, 0);
                              return (
                                <div
                                  key={category}
                                  className="flex flex-col gap-2 p-3 mb-2 border rounded-lg"
                                  style={{ borderColor: 'var(--neutral-line-outline)', borderRadius: 'var(--radius-card)' }}
                                >
                                  <div className="min-w-0">
                                    <p style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-onsurface-primary)' }}>{category}</p>
                                    <p style={{ fontSize: 'var(--text-label)', color: 'var(--neutral-onsurface-secondary)' }}>
                                      {items.length} item{items.length > 1 ? 's' : ''} · {formatCurrency(categoryTotal)}
                                    </p>
                                  </div>
                                  <div className="flex gap-1">
                                    {inlineSplits.map((split, idx) => {
                                      // A split is "fully assigned" to this category when all items include it
                                      const allAssigned = items.every(i => (itemSplitAssignment[i.id] || []).includes(split.id));
                                      // "Partially assigned" = some but not all items include it
                                      const someAssigned = items.some(i => (itemSplitAssignment[i.id] || []).includes(split.id));
                                      return (
                                        <button
                                          key={split.id}
                                          onClick={() => assignCategory(category, split.id, !allAssigned)}
                                          disabled={split.paid}
                                          className="rounded-full flex items-center justify-center transition-all shrink-0 relative active:scale-95"
                                          style={{
                                            width: '56px',
                                            height: '56px',
                                            backgroundColor: split.paid ? 'var(--neutral-surface-secondary)' : (allAssigned ? 'var(--feature-brand-primary)' : 'transparent'),
                                            color: split.paid ? 'var(--neutral-onsurface-tertiary)' : (allAssigned ? 'var(--primary-foreground)' : 'var(--feature-brand-primary)'),
                                            border: `2.5px solid ${split.paid ? 'var(--neutral-line-outline)' : 'var(--feature-brand-primary)'}`,
                                            fontSize: 'var(--text-h3)',
                                            fontWeight: 700,
                                            cursor: split.paid ? 'default' : 'pointer',
                                          }}
                                          title={allAssigned ? `Remove all from ${split.name}` : `Add all to ${split.name}`}
                                        >
                                          {idx + 1}
                                          {/* Partial indicator dot — only for non-paid splits */}
                                          {!split.paid && someAssigned && !allAssigned && (
                                            <span
                                              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                                              style={{ backgroundColor: 'var(--feature-brand-primary)', border: '2px solid var(--neutral-surface-primary)' }}
                                            />
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ── RIGHT: Split chips + active detail (flex-1) ──── */}
                    {(() => {
                      const activeSplit   = inlineSplits.find(s => s.id === activeSplitChipId);
                      const isPaid        = activeSplit?.paid ?? false;
                      const assignedItems = activeSplit
                        ? getExpandedUnits().filter(u => (itemSplitAssignment[u._unitKey] || []).includes(activeSplit.id))
                        : [];
                      const splitAmt = activeSplit ? calculateSplitAmount(activeSplit.id) : 0;

                      return (
                        <div className="flex-1 flex flex-col min-h-0">

                          {/* ── Chip strip (pinned) ── */}
                          <div
                            className="flex gap-2 flex-wrap px-4 pt-4 pb-3 shrink-0"
                            style={{ borderBottom: '1px solid var(--neutral-line-outline)' }}
                          >
                            {inlineSplits.map((split) => {
                              const isActive  = activeSplitChipId === split.id;
                              const splitPaid = split.paid;
                              return (
                                <button
                                  key={split.id}
                                  onClick={() => setActiveSplitChipId(split.id)}
                                  className="flex items-center gap-1.5 shrink-0 transition-all"
                                  style={{
                                    height: '56px',
                                    padding: '0 20px',
                                    borderRadius: 'var(--radius-pill)',
                                    border: `2px solid ${
                                      isActive
                                        ? (splitPaid ? 'var(--status-green-primary)' : 'var(--feature-brand-primary)')
                                        : 'var(--neutral-line-outline)'
                                    }`,
                                    backgroundColor: isActive
                                      ? (splitPaid ? 'var(--status-green-container)' : 'var(--feature-brand-container-light)')
                                      : 'var(--neutral-surface-primary)',
                                    color: splitPaid
                                      ? 'var(--status-green-primary)'
                                      : (isActive ? 'var(--feature-brand-primary)' : 'var(--neutral-onsurface-secondary)'),
                                    fontFamily: 'Lato, sans-serif',
                                    fontSize: 'var(--text-h3)',
                                    fontWeight: 'var(--font-weight-bold)',
                                  }}
                                >
                                  {splitPaid && <CheckIcon className="w-4 h-4 shrink-0" />}
                                  {split.name}
                                </button>
                              );
                            })}
                          </div>

                          {/* ── Detail header (pinned) ── */}
                          {activeSplit ? (
                            <div
                              className="flex items-center justify-between px-4 py-3 shrink-0"
                              style={{ borderBottom: '1px solid var(--neutral-line-outline)' }}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <p style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)', color: isPaid ? 'var(--status-green-primary)' : 'var(--neutral-onsurface-primary)', fontFamily: 'Lato, sans-serif' }}>
                                  {activeSplit.name}
                                </p>
                                <span style={{ fontSize: 'var(--text-label)', color: 'var(--neutral-onsurface-tertiary)', fontFamily: 'Lato, sans-serif' }}>
                                  {assignedItems.length} item{assignedItems.length !== 1 ? 's' : ''}
                                </span>
                                {isPaid && (
                                  <span
                                    className="flex items-center gap-1 px-2 py-0.5 rounded-full shrink-0"
                                    style={{ backgroundColor: 'var(--status-green-primary)', color: 'var(--primary-foreground)', fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'Lato, sans-serif' }}
                                  >
                                    <CheckIcon className="w-3 h-3" /> PAID
                                  </span>
                                )}
                              </div>
                              {!isPaid && !allSplitsPaid && (
                                <button
                                  onClick={() => removeSplit(activeSplit.id)}
                                  style={{
                                    width: 44, height: 44,
                                    borderRadius: 'var(--radius-small)',
                                    backgroundColor: 'var(--status-red-container)',
                                    border: '1.5px solid var(--status-red-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', flexShrink: 0, marginLeft: 8,
                                    transition: 'background-color 0.15s',
                                  }}
                                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--status-red-primary)')}
                                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'var(--status-red-container)')}
                                >
                                  <Trash2 className="w-5 h-5" style={{ color: 'var(--status-red-primary)' }} />
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center p-10 flex-1">
                              <p style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-tertiary)', fontFamily: 'Lato, sans-serif' }}>
                                Select a split above
                              </p>
                            </div>
                          )}

                          {/* ── Scrollable items only ── */}
                          {activeSplit && (
                            <ScrollArea className="flex-1 min-h-0">
                              <div className="px-4 py-3 space-y-2">
                                {assignedItems.length === 0 ? (
                                  <p style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-tertiary)', fontFamily: 'Lato, sans-serif' }}>
                                    No items assigned yet
                                  </p>
                                ) : assignedItems.map(item => {
                                  const sharedWith = (itemSplitAssignment[item._unitKey] || []).length;
                                  const lineAmt    = getItemPrice(item) / Math.max(sharedWith, 1);
                                  return (
                                    <div key={item._unitKey} className="flex justify-between gap-2 py-0.5">
                                      <p className="truncate" style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-secondary)', fontFamily: 'Lato, sans-serif' }}>
                                        {item.name}
                                      </p>
                                      <p style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--neutral-onsurface-secondary)', whiteSpace: 'nowrap', fontFamily: 'Lato, sans-serif' }}>
                                        {formatCurrency(lineAmt)}
                                      </p>
                                    </div>
                                  );
                                })}
                              </div>
                            </ScrollArea>
                          )}

                          {/* ── Pinned footer: Total + Pay button ── */}
                          {activeSplit && (
                            <div
                              className="shrink-0"
                              style={{ borderTop: `2px solid ${isPaid ? 'var(--status-green-primary)' : '#006bff40'}` }}
                            >
                              {/* ── Service & Tax breakdown ── */}
                              {(() => {
                                let assignedSubtotal = 0;
                                getExpandedUnits().forEach(unit => {
                                  const splits = itemSplitAssignment[unit._unitKey] || [];
                                  if (!splits.includes(activeSplit.id) || splits.length === 0) return;
                                  const unitPrice = getItemPrice(unit);
                                  const method = splits.length > 1 ? (itemAllocMethod[unit._unitKey] || 'equal') : 'equal';
                                  if (method === 'equal') {
                                    assignedSubtotal += unitPrice / splits.length;
                                  } else if (method === 'pct') {
                                    const pct = parseFloat(itemAllocValues[unit._unitKey]?.[activeSplit.id] || '0') / 100;
                                    assignedSubtotal += unitPrice * pct;
                                  } else {
                                    assignedSubtotal += Math.min(parseFloat(itemAllocValues[unit._unitKey]?.[activeSplit.id] || '0'), unitPrice);
                                  }
                                });
                                const proportion    = subtotal > 0 ? assignedSubtotal / subtotal : 0;
                                const afterDiscount = assignedSubtotal - billDiscountAmount * proportion;
                                const splitService  = Math.round(afterDiscount * 0.10);
                                const splitTax      = Math.round(afterDiscount * 0.05);
                                const splitTip      = Math.round(tipAmount * proportion);
                                const rowStyle: React.CSSProperties = {
                                  fontSize: 'var(--text-p)',
                                  color: 'var(--neutral-onsurface-secondary)',
                                  fontFamily: 'Lato, sans-serif',
                                };
                                return (
                                  <div
                                    className="flex flex-col px-4 pt-3 pb-1"
                                    style={{ borderBottom: `1px solid ${isPaid ? 'var(--status-green-container)' : 'var(--neutral-line-outline)'}` }}
                                  >
                                    <div className="flex justify-between items-center py-1">
                                      <span style={rowStyle}>Service (10%)</span>
                                      <span style={{ ...rowStyle, fontWeight: 'var(--font-weight-semibold)', color: isPaid ? 'var(--status-green-primary)' : 'var(--neutral-onsurface-primary)' }}>
                                        {formatCurrency(splitService)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center py-1">
                                      <span style={rowStyle}>Tax (5%)</span>
                                      <span style={{ ...rowStyle, fontWeight: 'var(--font-weight-semibold)', color: isPaid ? 'var(--status-green-primary)' : 'var(--neutral-onsurface-primary)' }}>
                                        {formatCurrency(splitTax)}
                                      </span>
                                    </div>
                                    {splitTip > 0 && (
                                      <div className="flex justify-between items-center py-1">
                                        <span style={rowStyle}>Tip</span>
                                        <span style={{ ...rowStyle, fontWeight: 'var(--font-weight-semibold)', color: isPaid ? 'var(--status-green-primary)' : 'var(--neutral-onsurface-primary)' }}>
                                          {formatCurrency(splitTip)}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })()}

                              {/* Total row */}
                              <div className="flex justify-between items-center px-4 py-3">
                                <span style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-secondary)', fontFamily: 'Lato, sans-serif' }}>
                                  {isPaid ? 'Paid' : 'Total'}
                                </span>
                                <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)', color: isPaid ? 'var(--status-green-primary)' : '#006bff', fontFamily: 'Lato, sans-serif' }}>
                                  {formatCurrency(isPaid ? (activeSplit.paidAmount || splitAmt) : splitAmt)}
                                </span>
                              </div>

                              {/* Pay button */}
                              {!isPaid && (
                                <div className="px-4 pb-4 pt-0">
                                  <MainBtn
                                    size="md"
                                    onClick={() => setPayingSplitId(activeSplit.id)}
                                    disabled={splitAmt <= 0}
                                    className="w-full"
                                    style={{ borderRadius: 'var(--radius-button)', backgroundColor: splitAmt > 0 ? '#006bff' : undefined, height: '56px' }}
                                  >
                                    Pay {activeSplit.name}
                                  </MainBtn>
                                </div>
                              )}
                            </div>
                          )}

                        </div>
                      );
                    })()}
                  </div>

                  {/* Footer */}
                  
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Payment Confirmation Dialog (full bill) ───────────────────────── */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>Confirm Payment</DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)' }}>Are you sure you want to process this payment?</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <div className="flex justify-between" style={{ fontSize: 'var(--text-p)' }}>
              <span className="text-muted-foreground">Total Amount</span>
              <span style={{ fontWeight: 'var(--font-weight-bold)' }}>{formatCurrency(totalAmount)}</span>
            </div>
            <Separator />
            {Array.from(selectedMethods).map(type => {
              const method = PAYMENT_TYPES.find(p => p.type === type);
              return (
                <div key={type} className="flex justify-between" style={{ fontSize: 'var(--text-p)' }}>
                  <span className="text-muted-foreground">{method?.label}</span>
                  <span style={{ fontWeight: 'var(--font-weight-bold)' }}>{formatCurrency(parseFloat(amounts[type]) || 0)}</span>
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <MainBtn variant="secondary" onClick={() => setShowConfirmDialog(false)} size="lg" className="w-full">Cancel</MainBtn>
            <MainBtn onClick={processPayment} size="lg" className="w-full">Process Payment</MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Combine Bill Dialog ───────────────────────────────────────────── */}
      <Dialog open={showCombineBillDialog} onOpenChange={setShowCombineBillDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>Combine Bills</DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)' }}>Select bills to combine with Bill #{check?.billNumber}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4 max-h-[300px] overflow-y-auto">
            {availableBillsToCombine.length === 0 ? (
              <p style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-tertiary)' }}>No other open bills available</p>
            ) : availableBillsToCombine.map(bill => {
              const isSelected = selectedBillsToCombine.includes(bill.id);
              const billItems  = getItemsByCheck(bill.id).filter(i => ['SENT','IN_PREP','READY','SERVED'].includes(i.status));
              const billTotal  = billItems.reduce((s, i) => s + getItemPrice(i) * i.quantity, 0);
              return (
                <button
                  key={bill.id}
                  onClick={() => toggleBillToCombine(bill.id)}
                  className="w-full flex items-center justify-between p-3 border-2 rounded-lg transition-all text-left"
                  style={{
                    borderColor: isSelected ? 'var(--feature-brand-primary)' : 'var(--neutral-line-outline)',
                    backgroundColor: isSelected ? 'var(--feature-brand-containerlighter)' : 'transparent',
                    borderRadius: 'var(--radius-card)',
                  }}
                >
                  <div>
                    <p style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-onsurface-primary)' }}>
                      Bill #{bill.billNumber}
                    </p>
                    <p style={{ fontSize: 'var(--text-label)', color: 'var(--neutral-onsurface-secondary)' }}>
                      {bill.tableId ? `Table ${TABLES.find(t => t.id === bill.tableId)?.name}` : 'Takeaway'} · {billItems.length} items
                    </p>
                  </div>
                  <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)', color: 'var(--feature-brand-primary)' }}>
                    {formatCurrency(billTotal)}
                  </span>
                </button>
              );
            })}
          </div>
          <DialogFooter>
            <MainBtn variant="secondary" onClick={() => { setShowCombineBillDialog(false); setSelectedBillsToCombine([]); }} size="lg" className="w-full">Cancel</MainBtn>
            <MainBtn onClick={handleConfirmCombineBills} size="lg" className="w-full" disabled={selectedBillsToCombine.length === 0}>
              Combine {selectedBillsToCombine.length > 0 ? `(${selectedBillsToCombine.length})` : ''}
            </MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Detach Bill Dialog ────────────────────────────────────────────── */}
      <Dialog open={showDetachBillDialog} onOpenChange={setShowDetachBillDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>Detach Bill</DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)' }}>Select a bill to detach from this payment</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            {combinedBillIds.map(billId => {
              const bill      = checks.find(c => c.id === billId);
              const billItems = getItemsByCheck(billId).filter(i => ['SENT','IN_PREP','READY','SERVED'].includes(i.status));
              const billTotal = billItems.reduce((s, i) => s + getItemPrice(i) * i.quantity, 0);
              return (
                <button
                  key={billId}
                  onClick={() => handleDetachSpecificBill(billId)}
                  className="w-full flex items-center justify-between p-3 border rounded-lg hover:bg-red-50 transition-colors text-left"
                  style={{ borderColor: 'var(--neutral-line-outline)', borderRadius: 'var(--radius-card)' }}
                >
                  <div>
                    <p style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)', color: 'var(--neutral-onsurface-primary)' }}>
                      Bill #{bill?.billNumber}
                    </p>
                    <p style={{ fontSize: 'var(--text-label)', color: 'var(--neutral-onsurface-secondary)' }}>
                      {billItems.length} items · {formatCurrency(billTotal)}
                    </p>
                  </div>
                  <span style={{ fontSize: 'var(--text-label)', color: 'var(--status-red-primary)', fontWeight: 'var(--font-weight-semibold)' }}>
                    Detach
                  </span>
                </button>
              );
            })}
          </div>
          <DialogFooter>
            <MainBtn variant="secondary" onClick={() => setShowDetachBillDialog(false)} size="lg" className="w-full">Cancel</MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Split Payment Modal ───────────────────────────────────────────── */}
      {payingSplitId && (
        <SplitPaymentModal
          open={!!payingSplitId}
          splitName={inlineSplits.find(s => s.id === payingSplitId)?.name || ''}
          totalAmount={calculateSplitAmount(payingSplitId)}
          onConfirm={handleSplitPaymentConfirm}
          onClose={() => setPayingSplitId(null)}
        />
      )}

      {/* ── Success Modal ─────────────────────────────────────────────────── */}
      {showSuccessModal && check && (
        <PaymentSuccessModal
          check={check}
          items={billableItems}
          payments={completedPayments.map((p: { method: string; amount: number }, i: number) => ({
            id: `pay-${i}`,
            checkId: checkId,
            method: p.method as any,
            amount: p.amount,
            createdAt: new Date(),
          }))}
          onClose={handleSuccessModalClose}
        />
      )}
    </>
  );
}
