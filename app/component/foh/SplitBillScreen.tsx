import { useState, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { MainBtn } from '../ui/MainBtn';
import { X, Plus, Trash2, ChevronDown, ChevronRight, Lock, Check } from 'lucide-react';
import ArrowLeft from '../../../imports/ArrowLeft';
import { useSnackbar } from '../labamu/Snackbar';
import { useRestaurant } from '../../context/RestaurantContext';
import { MENU_ITEMS, TABLES } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import SplitPaymentModal from './SplitPaymentModal';
import DiscardSplitBillModal from './DiscardSplitBillModal';
import { SelectableCard } from '../ui/SelectableCard';
import { Separator } from '../ui/separator';
import { useSplitBillNavigationGuard } from '../../context/SplitBillNavigationGuard';
import PaymentSuccessModal from './PaymentSuccessModal';

// Helper function to calculate discounted price (same as PaymentScreen)
function getItemPrice(item: any): number {
  if (item.isComplimentary) return 0;
  if (item.isVoided) return 0; // Voided items have no price
  if (!item.discountType || !item.discountValue) return item.price;
  
  if (item.discountType === 'PERCENTAGE') {
    return item.price * (1 - item.discountValue / 100);
  } else {
    return Math.max(0, item.price - item.discountValue);
  }
}

// Constants for service charge and tax (matching PaymentScreen)
const SERVICE_CHARGE_PERCENT = 10;
const TAX_PERCENT = 5;

interface SplitBillScreenProps {
  checkId: string;
  onClose: () => void;
  onPaySplit?: (splitId: string, amount: number) => void;
}

export interface SplitBillScreenRef {
  handleClose: () => void;
  hasUnsavedChanges: () => boolean;
  showDiscardModal: (onConfirm: () => void) => void;
}

interface Split {
  id: string;
  name: string;
  paid: boolean;
  voided?: boolean;      // true when payment was confirmed then voided
  voidedAmount?: number; // amount that was collected then voided
}

interface AllocateItemDialogState {
  open: boolean;
  itemId: string | null;
  itemName: string;
  itemPrice: number;
  selectedSplits: string[];
  method: 'EQUAL' | 'PERCENTAGE' | 'AMOUNT';
  allocations: { [splitId: string]: number };
}

interface AllocateCategoryDialogState {
  open: boolean;
  category: string | null;
  categoryTotal: number;
  itemCount: number;
  selectedSplits: string[];
  method: 'EQUAL' | 'PERCENTAGE' | 'AMOUNT';
  allocations: { [splitId: string]: number };
}

interface AllocateValueDialogState {
  open: boolean;
  splitId: string | null;
  method: 'AMOUNT' | 'PERCENT' | null;
  value: string;
}

type SplitMode = 'BY_ITEM' | 'BY_CATEGORY' | 'BY_VALUE';

const SplitBillScreen = forwardRef<SplitBillScreenRef, SplitBillScreenProps>(
  ({ checkId, onClose, onPaySplit }, ref) => {
  const snackbar = useSnackbar();
  const { getCheckById, getItemsByCheck, splitBills, saveSplitBill, paySplit: paySplitInContext, getMergedTableGroup } = useRestaurant();
  const { registerGuard, unregisterGuard } = useSplitBillNavigationGuard();
  
  const check = getCheckById(checkId);
  const allItems = getItemsByCheck(checkId);
  
  // Check if this is a merged table
  const mergedTableGroup = check?.tableId ? getMergedTableGroup(check.tableId) : undefined;
  const mergedTableNames = mergedTableGroup 
    ? mergedTableGroup.tableIds
        .map(tableId => TABLES.find(t => t.id === tableId)?.name)
        .filter(Boolean)
        .join(', ')
    : '';
  
  // Only show SENT, READY, SERVED items (no DRAFT, HELD)
  const allBillableItems = allItems.filter(item => 
    ['SENT', 'IN_PREP', 'READY', 'SERVED'].includes(item.status)
  );

  // Calculate bill totals (same as PaymentScreen and OperationalOrderScreen)
  const subtotal = allBillableItems.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
  
  // Calculate bill discount
  let billDiscountAmount = 0;
  if (check?.billDiscountType && check?.billDiscountValue) {
    if (check.billDiscountType === 'PERCENTAGE') {
      billDiscountAmount = subtotal * (check.billDiscountValue / 100);
    } else {
      billDiscountAmount = Math.min(check.billDiscountValue, subtotal);
    }
  }
  
  const subtotalAfterDiscount = subtotal - billDiscountAmount;
  const serviceCharge = subtotalAfterDiscount * 0.1; // 10%
  const tax = subtotalAfterDiscount * 0.05; // 5%
  const tipAmount = check?.tipAmount || 0;
  const grandTotal = subtotalAfterDiscount + serviceCharge + tax + tipAmount;
  
  // Calculate remaining balance after previous payments
  const previouslyPaid = check?.paidAmount || 0;
  const remainingBalance = grandTotal - previouslyPaid;
  
  // Calculate the ratio of remaining balance to grand total
  // This will be used to proportionally adjust split amounts
  const remainingRatio = grandTotal > 0 ? remainingBalance / grandTotal : 1;

  // Load existing split bill - use useMemo to make it reactive to splitBills changes
  const existingSplitBill = useMemo(() => 
    splitBills.find(sb => sb.checkId === checkId),
    [splitBills, checkId]
  );
  const [splits, setSplits] = useState<Split[]>(
    existingSplitBill?.splits || [
      { id: 'split-1', name: 'Split 1', paid: false },
      { id: 'split-2', name: 'Split 2', paid: false },
    ]
  );

  // Track allocations for each item (percentage 0-100)
  const [allocations, setAllocations] = useState<{ [itemId: string]: { [splitId: string]: number } }>(
    existingSplitBill?.allocations || {}
  );

  // Track allocation method per item
  const [itemAllocationMethods, setItemAllocationMethods] = useState<{ [itemId: string]: 'EQUAL' | 'AMOUNT' | 'PERCENTAGE' }>({});

  // Track custom allocation values per item per split (for AMOUNT and PERCENTAGE modes)
  const [customAllocations, setCustomAllocations] = useState<{ [itemId: string]: { [splitId: string]: string } }>({});

  // Split mode
  const [splitMode, setSplitMode] = useState<SplitMode>('BY_ITEM');

  // Active split tab
  const [activeSplitId, setActiveSplitId] = useState<string>(splits[0]?.id || 'split-1');

  // Payment modal state
  const [paymentSplitId, setPaymentSplitId] = useState<string | null>(null);

  // Expanded categories for BY_CATEGORY mode
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Dialogs
  const [allocateItemDialog, setAllocateItemDialog] = useState<AllocateItemDialogState>({
    open: false,
    itemId: null,
    itemName: '',
    itemPrice: 0,
    selectedSplits: [],
    method: 'EQUAL',
    allocations: {},
  });

  const [allocateCategoryDialog, setAllocateCategoryDialog] = useState<AllocateCategoryDialogState>({
    open: false,
    category: null,
    categoryTotal: 0,
    itemCount: 0,
    selectedSplits: [],
    method: 'EQUAL',
    allocations: {},
  });

  const [allocateValueDialog, setAllocateValueDialog] = useState<AllocateValueDialogState>({
    open: false,
    splitId: null,
    method: null,
    value: '',
  });

  // Split mode change confirmation
  const [splitModeChangeDialog, setSplitModeChangeDialog] = useState<{
    open: boolean;
    targetMode: SplitMode | null;
  }>({
    open: false,
    targetMode: null,
  });

  // Close confirmation dialog
  const [closeConfirmDialog, setCloseConfirmDialog] = useState(false);
  
  // Pending action to execute after confirming discard
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Allocation method picker modal (BY_ITEM mode, per-item)
  const [allocMethodModal, setAllocMethodModal] = useState<{
    open: boolean;
    itemId: string | null;
  }>({ open: false, itemId: null });

  // Delete split confirmation
  const [deleteSplitConfirm, setDeleteSplitConfirm] = useState<{
    open: boolean;
    splitId: string | null;
  }>({ open: false, splitId: null });

  // Payment success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedPayments, setCompletedPayments] = useState<Array<{ method: string; amount: number }>>([]);
  const [justPaidSplitId, setJustPaidSplitId] = useState<string | null>(null);

  // Sync splits state when existingSplitBill changes (e.g., when returning from navigation after payment)
  // Only sync if the data is actually different to avoid loops
  useEffect(() => {
    if (existingSplitBill?.splits) {
      // Check if splits are different before updating
      const isDifferent = JSON.stringify(existingSplitBill.splits) !== JSON.stringify(splits);
      if (isDifferent) {
        setSplits(existingSplitBill.splits);
      }
    }
  }, [existingSplitBill?.splits]); // Only depend on splits property

  // Sync allocations when existingSplitBill changes
  useEffect(() => {
    if (existingSplitBill?.allocations) {
      // Check if allocations are different before updating
      const isDifferent = JSON.stringify(existingSplitBill.allocations) !== JSON.stringify(allocations);
      if (isDifferent) {
        setAllocations(existingSplitBill.allocations);
      }
    }
  }, [existingSplitBill?.allocations]); // Only depend on allocations property

  // Calculate subtotal for each split
  const calculateSplitTotals = () => {
    const result: { [splitId: string]: { subtotal: number; service: number; tax: number; tip: number; total: number } } = {};

    splits.forEach(split => {
      let splitSubtotal = 0;
      
      allBillableItems.forEach(item => {
        const allocation = allocations[item.id]?.[split.id] || 0;
        // Use getItemPrice to account for discounts and complimentary items
        const itemPrice = getItemPrice(item) * item.quantity;
        splitSubtotal += (itemPrice * allocation) / 100;
      });

      // Apply bill discount proportionally to this split
      let splitSubtotalAfterDiscount = splitSubtotal;
      if (subtotal > 0 && billDiscountAmount > 0) {
        const discountRatio = billDiscountAmount / subtotal;
        splitSubtotalAfterDiscount = splitSubtotal * (1 - discountRatio);
      }
      
      // Calculate service charge, tax, and proportional tip (same as PaymentScreen: 10% service, 5% tax)
      const service = splitSubtotalAfterDiscount * 0.1;
      const tax = splitSubtotalAfterDiscount * 0.05;
      // Distribute tip proportionally based on this split's share of the post-discount subtotal
      const splitTip = subtotalAfterDiscount > 0
        ? (tipAmount * splitSubtotalAfterDiscount) / subtotalAfterDiscount
        : 0;
      const fullTotal = splitSubtotalAfterDiscount + service + tax + splitTip;
      
      // Apply remaining ratio - only charge for the unpaid portion
      const total = fullTotal * remainingRatio;

      result[split.id] = { 
        subtotal: splitSubtotalAfterDiscount * remainingRatio, 
        service: service * remainingRatio, 
        tax: tax * remainingRatio,
        tip: splitTip * remainingRatio,
        total 
      };
    });

    return result;
  };

  const splitTotals = useMemo(() => calculateSplitTotals(), [splits, allocations, allBillableItems, subtotal, billDiscountAmount, tipAmount, remainingRatio]);

  // Check if item is fully allocated
  const isItemFullyAllocated = (itemId: string): boolean => {
    const itemAllocations = allocations[itemId] || {};
    const total = Object.values(itemAllocations).reduce((sum, val) => sum + val, 0);
    return Math.abs(total - 100) < 0.01;
  };

  // Check if item is locked (part of paid split)
  const isItemLocked = (itemId: string): boolean => {
    const itemAllocations = allocations[itemId] || {};
    return splits.some(s => s.paid && (itemAllocations[s.id] || 0) > 0);
  };

  // Check if item is fully paid (all allocations are to paid splits with 100% allocated)
  const isItemFullyPaid = (itemId: string): boolean => {
    const itemAllocations = allocations[itemId] || {};
    const allocationEntries = Object.entries(itemAllocations);
    
    // If no allocations, item is not paid
    if (allocationEntries.length === 0) return false;
    
    // Check if 100% is allocated
    const totalAllocated = Object.values(itemAllocations).reduce((sum, val) => sum + val, 0);
    if (totalAllocated < 99.99) return false; // Allow small floating point errors
    
    // Check if all allocations (with percentage > 0) are to paid splits
    const allocationsWithPercentage = allocationEntries.filter(([_, percentage]) => percentage > 0);
    if (allocationsWithPercentage.length === 0) return false;
    
    const allPaid = allocationsWithPercentage.every(([splitId, _]) => {
      const split = splits.find(s => s.id === splitId);
      return split?.paid === true;
    });
    
    return allPaid;
  };

  // Filter out fully paid items from billable items when there are partial payments
  // Only show unpaid items if check has been partially paid
  const hasPartialPayment = check && check.paidAmount > 0 && check.paidAmount < grandTotal;
  const billableItems = hasPartialPayment 
    ? allBillableItems.filter(item => !isItemFullyPaid(item.id))
    : allBillableItems;

  // Alias for clarity - billableItems already filters out fully paid items
  const unpaidBillableItems = billableItems;

  // Calculate unpaid quantity for an item (based on allocations to paid splits)
  const getUnpaidQuantity = (item: typeof billableItems[0]): number => {
    const itemAllocations = allocations[item.id] || {};
    
    // Calculate percentage allocated to paid splits
    let paidPercentage = 0;
    Object.entries(itemAllocations).forEach(([splitId, percentage]) => {
      const split = splits.find(s => s.id === splitId);
      if (split?.paid) {
        paidPercentage += percentage;
      }
    });
    
    // Return unpaid quantity (original quantity minus paid quantity)
    const unpaidPercentage = 100 - paidPercentage;
    return (item.quantity * unpaidPercentage) / 100;
  };

  // Calculate unpaid price for an item (based on allocations to paid splits)
  const getUnpaidPrice = (item: typeof billableItems[0]): number => {
    const unpaidQty = getUnpaidQuantity(item);
    return getItemPrice(item) * unpaidQty;
  };

  // Calculate total unallocated percentage for an item
  const getUnallocatedPercentage = (itemId: string): number => {
    const itemAllocations = allocations[itemId] || {};
    const total = Object.values(itemAllocations).reduce((sum, val) => sum + val, 0);
    return 100 - total;
  };

  // Get all categories with items (filtered by payment status if partially paid)
  const getCategoriesWithItems = (): { [category: string]: typeof billableItems } => {
    const grouped: { [category: string]: typeof billableItems } = {}
    billableItems.forEach(item => {
      const menuItem = MENU_ITEMS.find(m => m.name === item.name);
      const category = menuItem?.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(item);
    });
    return grouped;
  };

  const categorizedItems = getCategoriesWithItems();

  // Add new split
  const handleAddSplit = () => {
    const newSplitNum = splits.length + 1;
    setSplits([...splits, { id: `split-${newSplitNum}`, name: `Split ${newSplitNum}`, paid: false }]);
  };

  // Combine all unpaid splits into one
  const handleCombineBills = () => {
    // Check if any split is paid
    const hasPaid = splits.some(s => s.paid);
    if (hasPaid) {
      snackbar.error('Cannot combine bills after partial payment');
      return;
    }

    // Combine all unpaid splits into the first split
    const firstSplit = splits[0];
    if (!firstSplit) return;

    // Create new allocations where all items are 100% allocated to the first split
    const newAllocations: { [itemId: string]: { [splitId: string]: number } } = {};
    allBillableItems.forEach(item => {
      newAllocations[item.id] = { [firstSplit.id]: 100 };
    });

    // Update allocations
    setAllocations(newAllocations);

    // Keep only the first split
    setSplits([firstSplit]);
    setActiveSplitId(firstSplit.id);

    snackbar.success('All bills combined into one');
  };

  // Remove split (only if empty and not paid)
  const handleRemoveSplit = (splitId: string) => {
    const split = splits.find(s => s.id === splitId);
    if (!split) return;

    if (split.paid) {
      snackbar.error('Cannot remove paid split');
      return;
    }

    const totals = splitTotals[splitId];
    if (totals && totals.total > 0) {
      snackbar.error('Reassign items before removing');
      return;
    }

    if (splits.length <= 2) {
      snackbar.error('Must have at least 2 splits');
      return;
    }

    setSplits(splits.filter(s => s.id !== splitId));
  };

  // Toggle split pill for item (inline allocation)
  const handleToggleItemSplit = (itemId: string, splitId: string) => {
    const item = billableItems.find(i => i.id === itemId);
    if (!item) return;

    // Block toggling a paid split — its allocation is permanently locked
    const targetSplit = splits.find(s => s.id === splitId);
    if (targetSplit?.paid) {
      snackbar.error('Cannot change allocation for a paid split');
      return;
    }

    const currentAllocations = allocations[itemId] || {};

    // Separate locked (paid) allocations — must be preserved as-is
    const lockedAllocations: { [id: string]: number } = {};
    let lockedTotal = 0;
    Object.entries(currentAllocations).forEach(([sid, pct]) => {
      const s = splits.find(sp => sp.id === sid);
      if (s?.paid && pct > 0) {
        lockedAllocations[sid] = pct;
        lockedTotal += pct;
      }
    });

    // Available % that unpaid splits can share
    const availablePercent = 100 - lockedTotal;

    // Currently selected unpaid splits
    const currentlySelectedUnpaid = Object.keys(currentAllocations).filter(id => {
      const s = splits.find(sp => sp.id === id);
      return !s?.paid && currentAllocations[id] > 0;
    });

    let newSelectedUnpaid: string[];
    if (currentlySelectedUnpaid.includes(splitId)) {
      newSelectedUnpaid = currentlySelectedUnpaid.filter(id => id !== splitId);
    } else {
      newSelectedUnpaid = [...currentlySelectedUnpaid, splitId];
    }

    if (newSelectedUnpaid.length === 0 && lockedTotal === 0) {
      // Nothing left — remove all allocations for this item
      const newAllocations = { ...allocations };
      delete newAllocations[itemId];
      setAllocations(newAllocations);
    } else {
      // Preserve locked %, distribute available % equally among unpaid splits
      const newItemAllocations: { [id: string]: number } = { ...lockedAllocations };
      if (newSelectedUnpaid.length > 0) {
        const equalPct = availablePercent / newSelectedUnpaid.length;
        newSelectedUnpaid.forEach(id => { newItemAllocations[id] = equalPct; });
      }
      setAllocations({ ...allocations, [itemId]: newItemAllocations });
    }

    // Reset allocation method to EQUAL on any structural change
    setItemAllocationMethods(prev => ({ ...prev, [itemId]: 'EQUAL' }));
  };

  // Toggle split pill for category (allocates all items in category)
  const handleToggleCategorySplit = (category: string, splitId: string, items: any[]) => {
    // Check if all items are allocated to this split
    const allItemsHaveSplit = items.every(item => {
      const itemAllocs = allocations[item.id] || {};
      return itemAllocs[splitId] > 0;
    });

    const newAllocations = { ...allocations };

    if (allItemsHaveSplit) {
      // Remove split from all items in category
      items.forEach(item => {
        if (!isItemLocked(item.id) && newAllocations[item.id]) {
          const currentAllocs = newAllocations[item.id];
          const remainingSplits = Object.keys(currentAllocs).filter(id => id !== splitId && currentAllocs[id] > 0);
          
          if (remainingSplits.length === 0) {
            delete newAllocations[item.id];
          } else {
            // Redistribute equally among remaining splits
            const equalPercentage = 100 / remainingSplits.length;
            const newItemAllocs: { [splitId: string]: number } = {};
            remainingSplits.forEach(id => {
              newItemAllocs[id] = equalPercentage;
            });
            newAllocations[item.id] = newItemAllocs;
          }
        }
      });
    } else {
      // Add split to all items in category
      items.forEach(item => {
        if (!isItemLocked(item.id)) {
          const currentAllocs = newAllocations[item.id] || {};
          const currentSelected = Object.keys(currentAllocs).filter(id => currentAllocs[id] > 0);
          
          if (!currentSelected.includes(splitId)) {
            // Add this split and redistribute equally
            const newSelected = [...currentSelected, splitId];
            const equalPercentage = 100 / newSelected.length;
            const newItemAllocs: { [splitId: string]: number } = {};
            newSelected.forEach(id => {
              newItemAllocs[id] = equalPercentage;
            });
            newAllocations[item.id] = newItemAllocs;
          }
        }
      });
    }

    setAllocations(newAllocations);
  };

  // Open value allocation dialog
  const handleOpenValueAllocation = (splitId: string, method: 'AMOUNT' | 'PERCENT') => {
    setAllocateValueDialog({
      open: true,
      splitId,
      method,
      value: '',
    });
  };

  // Apply value allocation
  const handleApplyValueAllocation = () => {
    if (!allocateValueDialog.splitId || !allocateValueDialog.method) return;

    const totalBill = billableItems.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
    let targetSubtotal = 0;

    if (allocateValueDialog.method === 'AMOUNT') {
      const amount = parseFloat(allocateValueDialog.value);
      if (isNaN(amount) || amount <= 0) {
        snackbar.error('Invalid amount');
        return;
      }
      targetSubtotal = amount;
    } else {
      const percent = parseFloat(allocateValueDialog.value);
      if (isNaN(percent) || percent <= 0 || percent > 100) {
        snackbar.error('Invalid percentage');
        return;
      }
      targetSubtotal = (totalBill * percent) / 100;
    }

    // Allocate items proportionally to reach target
    const newAllocations = { ...allocations };
    let remainingTarget = targetSubtotal;

    // Get unallocated items sorted by price (descending)
    const unallocatedItems = billableItems
      .filter(item => !isItemLocked(item.id))
      .sort((a, b) => (getItemPrice(b) * b.quantity) - (getItemPrice(a) * a.quantity));

    unallocatedItems.forEach(item => {
      if (remainingTarget <= 0) return;

      const unallocatedPercent = getUnallocatedPercentage(item.id);
      if (unallocatedPercent > 0) {
        const itemPrice = getItemPrice(item) * item.quantity;
        const maxAllocatable = (itemPrice * unallocatedPercent) / 100;
        const toAllocate = Math.min(maxAllocatable, remainingTarget);
        const percentToAllocate = (toAllocate / itemPrice) * 100;

        newAllocations[item.id] = {
          ...(newAllocations[item.id] || {}),
          [allocateValueDialog.splitId!]: (newAllocations[item.id]?.[allocateValueDialog.splitId!] || 0) + percentToAllocate,
        };

        remainingTarget -= toAllocate;
      }
    });

    setAllocations(newAllocations);
    setAllocateValueDialog({ open: false, splitId: null, method: null, value: '' });
    snackbar.success('Value allocated');
    
    // Switch back to BY_ITEM view to review
    setSplitMode('BY_ITEM');
  };

  // Calculate remaining unallocated amount for a split
  const calculateRemainingForSplit = (splitId: string) => {
    const totalBill = billableItems.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
    const allocatedTotal = splits.reduce((sum, s) => sum + splitTotals[s.id].subtotal, 0);
    const remainingAmount = totalBill - allocatedTotal;
    const remainingPercent = totalBill > 0 ? (remainingAmount / totalBill) * 100 : 0;
    return { remainingAmount, remainingPercent };
  };

  // Handle Fill Rest button
  const handleFillRest = (splitId: string) => {
    const { remainingAmount, remainingPercent } = calculateRemainingForSplit(splitId);
    const value = allocateValueDialog.method === 'PERCENT' 
      ? remainingPercent.toFixed(2)
      : remainingAmount.toFixed(0);
    
    // Apply immediately
    applyDirectAllocation(splitId, value);
  };

  // Apply allocation directly without dialog
  const applyDirectAllocation = (splitId: string, value: string) => {
    if (!value || !allocateValueDialog.method) return;

    const totalBill = billableItems.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
    let targetSubtotal = 0;

    if (allocateValueDialog.method === 'AMOUNT') {
      const amount = parseFloat(value);
      if (isNaN(amount) || amount < 0) {
        snackbar.error('Invalid amount');
        return;
      }
      if (amount === 0) return;
      targetSubtotal = amount;
    } else {
      const percent = parseFloat(value);
      if (isNaN(percent) || percent < 0 || percent > 100) {
        snackbar.error('Invalid percentage');
        return;
      }
      if (percent === 0) return;
      targetSubtotal = (totalBill * percent) / 100;
    }

    // Allocate items proportionally to reach target
    const newAllocations = { ...allocations };
    let remainingTarget = targetSubtotal;

    // Get unallocated items sorted by price (descending)
    const unallocatedItems = billableItems
      .filter(item => !isItemLocked(item.id))
      .sort((a, b) => (getItemPrice(b) * b.quantity) - (getItemPrice(a) * a.quantity));

    unallocatedItems.forEach(item => {
      if (remainingTarget <= 0) return;

      const unallocatedPercent = getUnallocatedPercentage(item.id);
      if (unallocatedPercent > 0) {
        const itemPrice = getItemPrice(item) * item.quantity;
        const maxAllocatable = (itemPrice * unallocatedPercent) / 100;
        const toAllocate = Math.min(maxAllocatable, remainingTarget);
        const percentToAllocate = (toAllocate / itemPrice) * 100;

        newAllocations[item.id] = {
          ...(newAllocations[item.id] || {}),
          [splitId]: (newAllocations[item.id]?.[splitId] || 0) + percentToAllocate,
        };

        remainingTarget -= toAllocate;
      }
    });

    setAllocations(newAllocations);
    // Keep the value in the input field after allocation
    snackbar.success('Value allocated');
  };

  // Handle value input change
  const handleValueInputChange = (splitId: string, value: string) => {
    setAllocateValueDialog({ ...allocateValueDialog, splitId, value });
  };

  // Handle Enter key in input
  const handleValueInputKeyDown = (splitId: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      applyDirectAllocation(splitId, allocateValueDialog.value);
    }
  };

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Handle allocation method change for an item
  const handleItemAllocationMethodChange = (itemId: string, method: 'EQUAL' | 'AMOUNT' | 'PERCENTAGE') => {
    const currentAllocations = allocations[itemId] || {};

    // Separate locked (paid) vs unpaid allocations
    const lockedAllocations: { [id: string]: number } = {};
    let lockedTotal = 0;
    Object.entries(currentAllocations).forEach(([sid, pct]) => {
      const s = splits.find(sp => sp.id === sid);
      if (s?.paid && pct > 0) { lockedAllocations[sid] = pct; lockedTotal += pct; }
    });
    const availablePercent = 100 - lockedTotal;
    const selectedUnpaidSplits = Object.keys(currentAllocations).filter(id => {
      const s = splits.find(sp => sp.id === id);
      return !s?.paid && currentAllocations[id] > 0;
    });

    setItemAllocationMethods(prev => ({ ...prev, [itemId]: method }));

    if (method === 'EQUAL' && selectedUnpaidSplits.length > 0) {
      // Redistribute available % equally among unpaid splits, preserving locked ones
      const equalPercentage = availablePercent / selectedUnpaidSplits.length;
      const newItemAllocations: { [id: string]: number } = { ...lockedAllocations };
      selectedUnpaidSplits.forEach(id => { newItemAllocations[id] = equalPercentage; });
      setAllocations({ ...allocations, [itemId]: newItemAllocations });

      const newCustom = { ...customAllocations };
      delete newCustom[itemId];
      setCustomAllocations(newCustom);
    } else if ((method === 'AMOUNT' || method === 'PERCENTAGE') && selectedUnpaidSplits.length > 0) {
      // Seed custom allocation inputs with current values (unpaid splits only)
      const newCustom = { ...customAllocations };
      if (!newCustom[itemId]) newCustom[itemId] = {};

      const item = billableItems.find(i => i.id === itemId);
      const itemPrice = item ? getItemPrice(item) * item.quantity : 0;

      selectedUnpaidSplits.forEach(splitId => {
        const currentPercentage = currentAllocations[splitId] || 0;
        newCustom[itemId][splitId] = method === 'AMOUNT'
          ? ((itemPrice * currentPercentage) / 100).toFixed(0)
          : currentPercentage.toFixed(1);
      });
      setCustomAllocations(newCustom);
    }
  };

  // Handle custom allocation value change
  const handleCustomAllocationChange = (itemId: string, splitId: string, value: string) => {
    const newCustom = { ...customAllocations };
    if (!newCustom[itemId]) {
      newCustom[itemId] = {};
    }
    newCustom[itemId][splitId] = value;
    setCustomAllocations(newCustom);
  };

  // Apply custom allocations for an item
  const applyCustomAllocations = (itemId: string) => {
    const method = itemAllocationMethods[itemId];
    const customValues = customAllocations[itemId] || {};
    const item = billableItems.find(i => i.id === itemId);

    if (!item || !method || method === 'EQUAL') return;

    const itemPrice = getItemPrice(item) * item.quantity;
    const existingAllocations = allocations[itemId] || {};

    // Start from locked (paid) allocations — never overwrite them
    const newItemAllocations: { [id: string]: number } = {};
    Object.entries(existingAllocations).forEach(([sid, pct]) => {
      const s = splits.find(sp => sp.id === sid);
      if (s?.paid && pct > 0) newItemAllocations[sid] = pct;
    });

    // Apply custom values only for unpaid splits
    Object.entries(customValues).forEach(([splitId, value]) => {
      const s = splits.find(sp => sp.id === splitId);
      if (s?.paid) return; // locked — skip
      const numValue = parseFloat(value) || 0;
      if (numValue <= 0) return;
      if (method === 'AMOUNT') {
        newItemAllocations[splitId] = Math.min(100, (numValue / itemPrice) * 100);
      } else {
        newItemAllocations[splitId] = Math.min(100, numValue);
      }
    });

    // Validate total doesn't exceed 100%
    const totalPercentage = Object.values(newItemAllocations).reduce((sum, val) => sum + val, 0);
    if (totalPercentage > 100.01) {
      snackbar.error('Total allocation cannot exceed 100%');
      return;
    }

    setAllocations({ ...allocations, [itemId]: newItemAllocations });
  };

  // Fill remaining for custom allocation
  const fillRemainingCustom = (itemId: string, splitId: string) => {
    const method = itemAllocationMethods[itemId];
    const item = billableItems.find(i => i.id === itemId);
    if (!item || !method || method === 'EQUAL') return;
    
    const itemPrice = getItemPrice(item) * item.quantity;
    const currentAllocations = allocations[itemId] || {};
    
    // Calculate total allocated EXCLUDING the current split
    const totalAllocatedExcludingCurrent = Object.entries(currentAllocations)
      .filter(([sid]) => sid !== splitId)
      .reduce((sum, [, val]) => sum + val, 0);
    
    const remainingPercentage = 100 - totalAllocatedExcludingCurrent;
    
    if (remainingPercentage <= 0) return;
    
    const newCustom = { ...customAllocations };
    if (!newCustom[itemId]) {
      newCustom[itemId] = {};
    }
    
    if (method === 'AMOUNT') {
      const remainingAmount = (itemPrice * remainingPercentage) / 100;
      newCustom[itemId][splitId] = remainingAmount.toFixed(0);
    } else {
      newCustom[itemId][splitId] = remainingPercentage.toFixed(1);
    }
    
    setCustomAllocations(newCustom);
    
    // Auto-apply
    setTimeout(() => applyCustomAllocations(itemId), 100);
  };

  // Handle split mode change with confirmation
  const handleSplitModeChange = (newMode: SplitMode) => {
    // If already in this mode, do nothing
    if (newMode === splitMode) return;

    // Check if any split has been paid
    const hasPartialPayment = splits.some(s => s.paid);
    if (hasPartialPayment) {
      snackbar.error('Cannot change split method after partial payment');
      return;
    }

    // Check if there are existing allocations
    const hasAllocations = Object.keys(allocations).some(itemId => {
      const itemAllocs = allocations[itemId] || {};
      return Object.keys(itemAllocs).length > 0;
    });

    if (hasAllocations) {
      // Show confirmation dialog
      setSplitModeChangeDialog({
        open: true,
        targetMode: newMode,
      });
    } else {
      // No allocations, switch directly
      setSplitMode(newMode);
    }
  };

  // Confirm split mode change
  const confirmSplitModeChange = () => {
    if (!splitModeChangeDialog.targetMode) return;

    // Clear all allocations
    setAllocations({});
    
    // Switch mode
    setSplitMode(splitModeChangeDialog.targetMode);
    
    // Close dialog
    setSplitModeChangeDialog({ open: false, targetMode: null });
    
    snackbar.success('Split method changed - starting fresh');
  };

  // Cancel split mode change
  const cancelSplitModeChange = () => {
    setSplitModeChangeDialog({ open: false, targetMode: null });
  };

  // Handle pay split - open payment modal
  const handlePaySplit = (splitId: string) => {
    const split = splits.find(s => s.id === splitId);
    if (!split) return;

    const totals = splitTotals[splitId];

    // Validation: split total must be > 0
    if (totals.total <= 0) {
      snackbar.error('Split total must be greater than 0');
      return;
    }

    // Validation: all items must be fully allocated
    let hasIncompleteAllocations = false;
    unpaidBillableItems.forEach(item => {
      if (!isItemFullyAllocated(item.id)) {
        hasIncompleteAllocations = true;
      }
    });

    if (hasIncompleteAllocations) {
      snackbar.error('All items must be fully allocated before payment');
      return;
    }

    // Open payment modal
    setPaymentSplitId(splitId);
  };

  // Confirm payment from modal
  const handleConfirmPayment = (splitId: string, payments: Array<{ type?: string; method?: string; amount: number }>) => {
    const split = splits.find(s => s.id === splitId);
    if (!split) return;

    const totals = splitTotals[splitId];

    // Mark split as paid in context, passing payment methods for transaction history display
    const paymentMethods = payments.map(p => ({ type: p.type || p.method || '', amount: p.amount }));
    paySplitInContext(checkId, splitId, totals.total, paymentMethods);
    
    // Update local splits state
    const updatedSplits = splits.map(s => 
      s.id === splitId ? { ...s, paid: true } : s
    );
    setSplits(updatedSplits);
    
    // Save split bill with allocations to ensure data persists when navigating back
    // This is critical to prevent split details from disappearing
    saveSplitBill(checkId, updatedSplits, allocations);
    
    // Store payment info for success modal
    const paymentRecords = payments.map(p => ({
      method: p.type,
      amount: p.amount,
    }));
    setCompletedPayments(paymentRecords);
    setJustPaidSplitId(splitId);
    
    // Close payment modal
    setPaymentSplitId(null);
    
    // Show success modal
    setShowSuccessModal(true);
    
    // Check if all splits are now paid
    const allSplitsPaid = updatedSplits.every(s => s.paid);
    
    // If all splits are paid (fully paid), call onPaySplit to navigate back
    // If not all splits are paid (partial payment), don't call onPaySplit to stay in payment screen
    if (allSplitsPaid && onPaySplit) {
      onPaySplit(splitId, totals.total);
    }
    // If not all splits are paid, stay in the split bill screen (don't call onPaySplit)
  };



  // Calculate overall bill totals
  const calculateOverallTotals = () => {
    const totalBill = billableItems.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
    const service = totalBill * (SERVICE_CHARGE_PERCENT / 100);
    const tax = totalBill * (TAX_PERCENT / 100);
    const grandTotal = totalBill + service + tax;
    const paidAmount = check?.paidAmount || 0;
    const outstanding = grandTotal - paidAmount;

    return { totalBill, service, tax, grandTotal, paidAmount, outstanding };
  };

  // Handle close - save split bill
  const handleClose = () => {
    // Check if there are any allocations
    const hasAllocations = Object.keys(allocations).length > 0;
    
    // Check if any split has been paid
    const hasPaidSplit = splits.some(s => s.paid);
    
    // Show confirmation modal if:
    // 1. User has configured splits (allocations exist)
    // 2. No split has been paid yet
    if (hasAllocations && !hasPaidSplit) {
      setCloseConfirmDialog(true);
      return;
    }
    
    // If at least one split is paid or no allocations, save and close normally
    if (hasAllocations) {
      saveSplitBill(checkId, splits, allocations);
    }
    onClose();
  };

  // Confirm close and reset split config
  const confirmCloseAndReset = () => {
    // Execute pending action if there is one
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    } else {
      // Default behavior: just close
      onClose();
    }
    setCloseConfirmDialog(false);
  };

  // Cancel close
  const cancelClose = () => {
    setCloseConfirmDialog(false);
    setPendingAction(null);
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = (): boolean => {
    const hasAllocations = Object.keys(allocations).length > 0;
    const hasPaidSplit = splits.some(s => s.paid);
    return hasAllocations && !hasPaidSplit;
  };

  // Show discard modal with custom action
  const showDiscardModal = (onConfirm: () => void) => {
    if (hasUnsavedChanges()) {
      setPendingAction(() => onConfirm);
      setCloseConfirmDialog(true);
    } else {
      // No unsaved changes, execute immediately
      onConfirm();
    }
  };

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    handleClose,
    hasUnsavedChanges,
    showDiscardModal,
  }));

  // Register/unregister navigation guard
  useEffect(() => {
    registerGuard(hasUnsavedChanges);
    return () => {
      unregisterGuard();
    };
  }, [registerGuard, unregisterGuard, allocations, splits]);

  if (!check) return null;

  const overallTotals = calculateOverallTotals();

  // Get payment modal split
  const paymentSplit = paymentSplitId ? splits.find(s => s.id === paymentSplitId) : null;
  const paymentTotal = paymentSplitId ? splitTotals[paymentSplitId] : null;

  // Check if any split has been paid (for disabling combine and mode switches)
  const hasPaidSplit = splits.some(s => s.paid);

  return (
    <>
      <div className="flex-1 flex flex-col bg-background overflow-hidden min-h-0">
        {/* Payment Info Banner - Show when there are paid splits */}
        {hasPaidSplit && (
          <div 
            className="px-6 py-3 flex items-center justify-between border-b"
            style={{
              backgroundColor: 'var(--feature-brand-containerlighter)',
              borderColor: 'var(--neutral-line-outline)',
            }}
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" style={{ color: 'var(--feature-brand-primary)' }} />
              <span style={{ 
                fontSize: 'var(--text-p)', 
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--neutral-onsurface-primary)'
              }}>
                Partial payment completed - Split method and combine bills are locked
              </span>
            </div>
            <Badge 
              variant="default" 
              style={{ 
                fontSize: 'var(--text-label)',
                backgroundColor: 'var(--feature-brand-primary)',
                color: '#fff'
              }} 
              className="px-2 py-0.5"
            >
              {splits.filter(s => s.paid).length} of {splits.length} PAID
            </Badge>
          </div>
        )}
        
        {/* Main Content - Two Panel Layout */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Left Panel - Split Method & Content */}
          <div className="w-[55%] border-r border-border flex flex-col overflow-hidden p-[24px] min-h-0">
            {/* Split Method Selector - Sticky */}
            <div className="content-stretch flex items-start p-[3px] relative rounded-[8px] w-full shrink-0 mb-4" style={{ 
              opacity: hasPaidSplit ? 0.5 : 1,
              pointerEvents: hasPaidSplit ? 'none' : 'auto'
            }}>
              <div aria-hidden="true" className="absolute border border-[#e9e9e9] border-solid inset-[-0.5px] pointer-events-none rounded-[8.5px] p-[16px] m-[0px]" />
              
              <button
                onClick={() => handleSplitModeChange('BY_ITEM')}
                disabled={hasPaidSplit}
                className={`flex-[1_0_0] h-[40px] min-h-px min-w-px relative rounded-[5px] ${
                  splitMode === 'BY_ITEM' ? 'bg-[#f3f7fe]' : ''
                }`}
              >
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
                    <p className={`leading-[20px] not-italic relative shrink-0 text-[14px] text-center tracking-[0.0962px] ${
                      splitMode === 'BY_ITEM'
                        ? "font-['Lato:Bold',sans-serif] text-[#006bff]"
                        : "font-['Lato:Regular',sans-serif] text-[#282828]"
                    }`}>
                      By Item
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleSplitModeChange('BY_CATEGORY')}
                disabled={hasPaidSplit}
                className={`flex-[1_0_0] h-[40px] min-h-px min-w-px relative rounded-[5px] ${
                  splitMode === 'BY_CATEGORY' ? 'bg-[#f3f7fe]' : ''
                }`}
              >
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
                    <p className={`leading-[20px] not-italic relative shrink-0 text-[14px] text-center tracking-[0.0962px] ${
                      splitMode === 'BY_CATEGORY'
                        ? "font-['Lato:Bold',sans-serif] text-[#006bff]"
                        : "font-['Lato:Regular',sans-serif] text-[#282828]"
                    }`}>By Category</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleSplitModeChange('BY_VALUE')}
                disabled={hasPaidSplit}
                className={`flex-[1_0_0] h-[40px] min-h-px min-w-px relative rounded-[5px] ${
                  splitMode === 'BY_VALUE' ? 'bg-[#f3f7fe]' : ''
                }`}
              >
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="content-stretch flex items-center justify-center p-[10px] relative size-full">
                    <p className={`leading-[20px] not-italic relative shrink-0 text-[14px] text-center tracking-[0.0962px] ${
                      splitMode === 'BY_VALUE'
                        ? "font-['Lato:Bold',sans-serif] text-[#006bff]"
                        : "font-['Lato:Regular',sans-serif] text-[#282828]"
                    }`}>
                      By Value
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {/* Scrollable Content Area */}
            <ScrollArea className="flex-1 min-h-0">
                {splitMode === 'BY_ITEM' && (
                  <div className="pb-4">
                    <div className="space-y-2">
                    {unpaidBillableItems.map(item => {
                      const itemAllocations = allocations[item.id] || {};
                      const isFullyAllocated = isItemFullyAllocated(item.id);
                      // All split IDs with a non-zero allocation (paid + unpaid)
                      const selectedSplits = Object.entries(itemAllocations).filter(([_, pct]) => pct > 0).map(([id]) => id);
                      // Paid split IDs locked into this item
                      const lockedSplitIds = selectedSplits.filter(id => splits.find(s => s.id === id)?.paid);
                      const hasPartialLock = lockedSplitIds.length > 0;
                      // Unpaid split IDs currently selected
                      const selectedUnpaidSplits = selectedSplits.filter(id => !splits.find(s => s.id === id)?.paid);
                      const unpaidQty = getUnpaidQuantity(item);
                      const unpaidPrice = getUnpaidPrice(item);
                      const fullItemPrice = getItemPrice(item) * item.quantity;

                      // Skip items with no unpaid quantity (fully paid)
                      if (unpaidQty === 0) return null;

                      return (
                        <div
                          key={item.id}
                          className="p-4 rounded-lg border border-border bg-background"
                          style={{ borderRadius: 'var(--radius-card)' }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>{item.name}</p>
                              {hasPartialLock && (
                                <Badge variant="secondary" className="text-[10px] px-2 py-0 flex items-center gap-0.5" style={{ fontSize: 'var(--text-label)' }}>
                                  <Lock className="w-2.5 h-2.5" /> Partial
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                              <span>Qty: {unpaidQty}</span>
                              <span>{formatCurrency(unpaidPrice)}</span>
                            </div>

                            {/* Split Pills — always visible */}
                            <div className="mt-3 space-y-2">
                              <div className="flex flex-wrap gap-2">

                                {/* Locked (paid) pills — read-only tokens */}
                                {lockedSplitIds.map(splitId => {
                                  const split = splits.find(s => s.id === splitId)!;
                                  const pct = itemAllocations[splitId] || 0;
                                  const lockedAmt = (fullItemPrice * pct) / 100;
                                  return (
                                    <div
                                      key={splitId}
                                      className="px-3 h-[44px] rounded-full flex items-center gap-1.5 border cursor-not-allowed select-none"
                                      style={{
                                        borderRadius: '9999px',
                                        background: 'var(--color-surface-secondary, #f3f4f6)',
                                        borderColor: 'var(--color-border, #e5e7eb)',
                                        fontSize: 'var(--text-label)',
                                        fontWeight: 'var(--font-weight-semibold)',
                                      }}
                                    >
                                      <Lock style={{ width: '12px', height: '12px', color: 'var(--color-success, #16a34a)', flexShrink: 0 }} />
                                      <span className="text-muted-foreground">{split.name}</span>
                                      <span style={{ color: 'var(--color-success, #16a34a)' }}>
                                        {pct.toFixed(0)}% · {formatCurrency(lockedAmt)}
                                      </span>
                                    </div>
                                  );
                                })}

                                {/* Interactive unpaid split pills */}
                                {splits.filter(s => !s.paid).map(split => {
                                  const isSelected = selectedUnpaidSplits.includes(split.id);
                                  const percentage = itemAllocations[split.id] || 0;
                                  return (
                                    <button
                                      key={split.id}
                                      onClick={() => !split.voided && handleToggleItemSplit(item.id, split.id)}
                                      disabled={split.voided}
                                      className={`px-4 h-[44px] rounded-full border transition-all ${
                                        split.voided
                                          ? 'border-dashed cursor-not-allowed'
                                          : isSelected
                                            ? 'bg-primary/10 text-primary border-primary'
                                            : 'bg-transparent border-border text-foreground hover:bg-muted/50'
                                      }`}
                                      style={{
                                        fontSize:     '16px',
                                        borderRadius: '9999px',
                                        fontWeight:   'var(--font-weight-semibold)',
                                        fontFamily:   'Lato, sans-serif',
                                        ...(split.voided ? {
                                          backgroundColor: 'var(--status-red-container)',
                                          borderColor:     'var(--status-red-primary)',
                                          color:           'var(--status-red-primary)',
                                          opacity:         0.72,
                                        } : {}),
                                      }}
                                    >
                                      {split.voided ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                          <s style={{ opacity: 0.75 }}>{split.name}</s>
                                          <span style={{
                                            fontSize:      'var(--text-h4)',
                                            fontWeight:    'var(--font-weight-bold)',
                                            letterSpacing: '0.04em',
                                            textTransform: 'uppercase' as const,
                                          }}>VOID</span>
                                        </span>
                                      ) : (
                                        <>{split.name} {isSelected && percentage > 0 && `(${percentage.toFixed(0)}%)`}</>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Allocation Method — only shown when 1+ unpaid splits are selected */}
                              {selectedUnpaidSplits.length > 0 && (
                                <div className="mt-3 space-y-3">
                                  {/* Method Selector — only when 2+ non-voided splits exist AND 2+ unpaid splits selected */}
                                  {splits.filter(s => !s.voided).length > 1 && selectedUnpaidSplits.length > 1 && (() => {
                                    const currentMethod = itemAllocationMethods[item.id] || 'EQUAL';
                                    const methodLabel = currentMethod === 'EQUAL' ? 'Equal Split' : currentMethod === 'AMOUNT' ? 'By Amount (Rp)' : 'By Percentage (%)';
                                    return (
                                      <div className="flex items-center gap-2">
                                        <Label style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)' }} className="text-muted-foreground">
                                          Allocation Method:
                                        </Label>
                                        <button
                                          onClick={() => setAllocMethodModal({ open: true, itemId: item.id })}
                                          style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 6,
                                            height: 36, padding: '0 12px',
                                            borderRadius: 'var(--radius-input)',
                                            border: '1px solid var(--neutral-line-outline)',
                                            backgroundColor: 'var(--neutral-surface-primary)',
                                            fontSize: 'var(--text-label)',
                                            fontFamily: 'Lato, sans-serif',
                                            fontWeight: 'var(--font-weight-semibold)',
                                            color: 'var(--neutral-onsurface-primary)',
                                            cursor: 'pointer',
                                          }}
                                        >
                                          {methodLabel}
                                          <ChevronDown style={{ width: 14, height: 14, color: 'var(--neutral-onsurface-secondary)' }} />
                                        </button>
                                      </div>
                                    );
                                  })()}

                                  {/* Custom Allocation Inputs — unpaid splits only */}
                                  {(itemAllocationMethods[item.id] === 'AMOUNT' || itemAllocationMethods[item.id] === 'PERCENTAGE') && (
                                    <div className="space-y-2 p-3 bg-muted/30 rounded-lg" style={{ borderRadius: 'var(--radius-small)' }}>
                                      {selectedUnpaidSplits.map(splitId => {
                                        const split = splits.find(s => s.id === splitId);
                                        if (!split) return null;
                                        const customValue = customAllocations[item.id]?.[splitId] || '';
                                        const currentPercentage = itemAllocations[splitId] || 0;
                                        const itemPrice = getItemPrice(item) * item.quantity;
                                        const allocatedAmount = (itemPrice * currentPercentage) / 100;
                                        return (
                                          <div key={splitId} className="flex items-center gap-2">
                                            <Label style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-semibold)' }} className="w-20 shrink-0">
                                              {split.name}:
                                            </Label>
                                            <Input
                                              type="number"
                                              min="0"
                                              max={itemAllocationMethods[item.id] === 'PERCENTAGE' ? '100' : undefined}
                                              step={itemAllocationMethods[item.id] === 'PERCENTAGE' ? '0.1' : '1'}
                                              value={customValue}
                                              onChange={(e) => handleCustomAllocationChange(item.id, splitId, e.target.value)}
                                              onBlur={() => applyCustomAllocations(item.id)}
                                              onKeyDown={(e) => { if (e.key === 'Enter') applyCustomAllocations(item.id); }}
                                              className="flex-1 h-9"
                                              style={{ borderRadius: 'var(--radius-input)', fontSize: 'var(--text-label)' }}
                                              placeholder={itemAllocationMethods[item.id] === 'PERCENTAGE' ? '0.0' : '0'}
                                            />
                                            <MainBtn
                                              variant="secondary"
                                              size="sm"
                                              onClick={() => fillRemainingCustom(item.id, splitId)}
                                              className="shrink-0 font-normal text-[14px]"
                                            >
                                              Fill Rest
                                            </MainBtn>
                                            <span className="text-muted-foreground w-16 text-right shrink-0" style={{ fontSize: 'var(--text-label)' }}>
                                              {itemAllocationMethods[item.id] === 'PERCENTAGE'
                                                ? formatCurrency(allocatedAmount)
                                                : `${currentPercentage.toFixed(0)}%`}
                                            </span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Unallocated warning — shows whenever item has any allocation but isn't fully allocated */}
                            {!isFullyAllocated && selectedSplits.length > 0 && (
                              <div className="mt-2">
                                <Badge variant="outline" className="px-2 py-0.5 text-orange-600 border-orange-300" style={{ fontSize: 'var(--text-label)' }}>
                                  {getUnallocatedPercentage(item.id).toFixed(0)}% Unallocated
                                </Badge>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {splitMode === 'BY_CATEGORY' && (
                <div className="px-[0px] pt-[20px] pb-4">
                  

                  <div className="space-y-3">
                    {Object.entries(categorizedItems).map(([category, items]) => {
                      // Filter to only show items with unpaid quantities
                      const unpaidItems = items.filter(item => getUnpaidQuantity(item) > 0);
                      
                      // Skip category if no unpaid items
                      if (unpaidItems.length === 0) return null;
                      
                      const isExpanded = expandedCategories.has(category);
                      const categoryTotal = unpaidItems.reduce((sum, item) => sum + getUnpaidPrice(item), 0);

                      return (
                        <div key={category} className="border border-border rounded-lg bg-background" style={{ borderRadius: 'var(--radius-card)' }}>
                          {/* Category Header */}
                          <div className="p-4">
                            <button
                              onClick={() => toggleCategory(category)}
                              className="flex items-center gap-2 w-full text-left mb-3"
                            >
                              {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                              <div>
                                <h4 style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>{category}</h4>
                                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                                  {unpaidItems.length} item{unpaidItems.length !== 1 ? 's' : ''} · {formatCurrency(categoryTotal)}
                                </p>
                              </div>
                            </button>

                            {/* Split Selection Pills for Category */}
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-2">
                                {splits.filter(s => !s.paid).map(split => {
                                  // Check if all UNPAID items in category are allocated to this split
                                  const allItemsHaveSplit = unpaidItems.every(item => {
                                    const itemAllocs = allocations[item.id] || {};
                                    return itemAllocs[split.id] > 0;
                                  });
                                  
                                  return (
                                    <button
                                      key={split.id}
                                      onClick={() => handleToggleCategorySplit(category, split.id, unpaidItems)}
                                      className={`px-4 h-[44px] rounded-full border transition-all ${
                                        allItemsHaveSplit
                                          ? 'bg-primary/10 text-primary border-primary' 
                                          : 'bg-transparent border-border text-foreground hover:bg-muted/50'
                                      }`}
                                      style={{ 
                                        fontSize: '16px',
                                        borderRadius: '9999px',
                                        fontWeight: 'var(--font-weight-semibold)',
                                      }}
                                    >
                                      {split.name}
                                    </button>
                                  );
                                })}
                              </div>
                              
                              {/* Allocation Method - Show when any item in category is allocated */}
                              {unpaidItems.some(item => Object.keys(allocations[item.id] || {}).length > 0) && (
                                <div className="text-muted-foreground mt-2" style={{ fontSize: 'var(--text-label)' }}>
                                  Note: Use "By Item" mode to customize allocation method per item
                                </div>
                              )}
                            </div>

                            {/* Expanded Items */}
                            {isExpanded && (
                              <div className="mt-3 pt-3 border-t border-border space-y-2">
                                {unpaidItems.map(item => {
                                  const itemAllocations = allocations[item.id] || {};
                                  const isFullyAllocated = isItemFullyAllocated(item.id);
                                  const unpaidQty = getUnpaidQuantity(item);
                                  const unpaidPrice = getUnpaidPrice(item);

                                  return (
                                    <div key={item.id} className="p-2 rounded bg-muted/50" style={{ borderRadius: 'var(--radius-small)' }}>
                                      <div className="flex items-center justify-between mb-1">
                                        <p style={{ fontSize: 'var(--text-label)' }}>{unpaidQty}x {item.name}</p>
                                        <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>{formatCurrency(unpaidPrice)}</p>
                                      </div>
                                      <div className="flex flex-wrap gap-1">
                                        {Object.entries(itemAllocations).map(([splitId, percentage]) => {
                                          if (percentage === 0) return null;
                                          const split = splits.find(s => s.id === splitId);
                                          const allocatedAmount = (unpaidPrice * percentage) / 100;
                                          const isPaidAllocation = split?.paid;
                                          return (
                                            <Badge
                                              key={splitId}
                                              variant={isPaidAllocation ? 'default' : isFullyAllocated ? 'default' : 'secondary'}
                                              className={`text-[10px] px-1 py-0 flex items-center gap-0.5 ${isPaidAllocation ? 'bg-green-600' : ''}`}
                                            >
                                              {isPaidAllocation && <Lock className="w-2.5 h-2.5" />}
                                              {split?.name} – {percentage.toFixed(0)}% ({formatCurrency(allocatedAmount)})
                                            </Badge>
                                          );
                                        })}
                                        {!isFullyAllocated && (
                                          <Badge variant="outline" className="text-[10px] px-1 py-0 text-orange-600 border-orange-300">
                                            {getUnallocatedPercentage(item.id).toFixed(0)}% Unallocated
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {splitMode === 'BY_VALUE' && (
                <div className="px-[0px] pt-[20px] pb-4">
                  

                  {/* Method Selection */}
                  <div className="mb-4 bg-muted/30 rounded-lg px-[0px] py-[16px]" style={{ borderRadius: 'var(--radius-card)' }}>
                    <Label style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-bold)' }} className="mb-3 block">
                      Allocation Method:
                    </Label>
                    <div className="flex gap-3">
                      <SelectableCard
                        onClick={() => setAllocateValueDialog({ ...allocateValueDialog, method: 'AMOUNT' })}
                        selected={allocateValueDialog.method === 'AMOUNT'}
                        className="flex-1 h-[120px] border rounded-lg px-[24px] py-[0px]"
                        style={{ 
                          borderRadius: 'var(--radius-card)',
                        }}
                      >
                        <div className="flex flex-col items-start justify-center w-full h-full">
                          <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>
                            By Amount (Rp)
                          </span>
                          <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-regular)' }} className="text-muted-foreground">
                            Allocate specific rupiah amounts
                          </span>
                        </div>
                      </SelectableCard>
                      <SelectableCard
                        onClick={() => setAllocateValueDialog({ ...allocateValueDialog, method: 'PERCENT' })}
                        selected={allocateValueDialog.method === 'PERCENT'}
                        className="flex-1 h-[120px] border rounded-lg px-[24px] py-[0px]"
                        style={{ 
                          borderRadius: 'var(--radius-card)',
                        }}
                      >
                        <div className="flex flex-col items-start justify-center w-full h-full">
                          <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>
                            By Percentage (%)
                          </span>
                          <span style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-regular)' }} className="text-muted-foreground">
                            Allocate percentage of total bill
                          </span>
                        </div>
                      </SelectableCard>
                    </div>
                  </div>

                  {/* Summary of current allocations */}
                  <div className="space-y-2">
                    
                    {unpaidBillableItems.map(item => {
                      const itemAllocations = allocations[item.id] || {};
                      const hasAllocations = Object.keys(itemAllocations).length > 0;
                      
                      if (!hasAllocations) return null;

                      return (
                        null
                      );
                    })}
                    {unpaidBillableItems.every(item => Object.keys(allocations[item.id] || {}).length === 0) && (
                      null
                    )}
                  </div>
                </div>
              )}
              </ScrollArea>
          </div>

          {/* Right Panel - Split Groups */}
          <div className="w-[45%] flex flex-col overflow-hidden min-h-0">
            {/* Split Tabs Header */}
            <div className="p-6 border-b border-border shrink-0">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>Split Groups</h3>
                <div className="flex items-center gap-2">
                  <MainBtn className="text-[14px] font-normal"
                    variant="secondary"
                    size="sm"
                    onClick={handleCombineBills}
                    disabled={hasPaidSplit || splits.length <= 1}
                    style={{
                      opacity: hasPaidSplit || splits.length <= 1 ? 0.5 : 1,
                      cursor: hasPaidSplit || splits.length <= 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Combine Bills
                  </MainBtn>
                  <MainBtn className="text-[14px] font-normal"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddSplit}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Split
                  </MainBtn>
                </div>
              </div>
              
              {/* Chip Tabs */}
              <div className="flex flex-wrap gap-2">
                {splits.map(split => {
                  const isActive = activeSplitId === split.id;
                  // Derive chip appearance from state priority: voided > paid > default
                  const chipClass = split.voided
                    ? isActive
                      ? 'bg-red-50 text-red-700 border border-red-400'
                      : 'bg-red-50 border border-red-300 text-red-600 hover:bg-red-100'
                    : split.paid
                      ? isActive
                        ? 'bg-green-50 text-green-700 border border-green-500'
                        : 'bg-green-50 border border-green-500 text-green-700 hover:bg-green-100'
                      : isActive
                        ? 'bg-primary/10 text-primary border border-primary'
                        : 'bg-transparent border border-border text-foreground hover:bg-muted/50 hover:border-border';
                  return (
                    <button
                      key={split.id}
                      onClick={() => setActiveSplitId(split.id)}
                      className={`px-4 h-[44px] rounded-full transition-all flex items-center gap-2 ${chipClass}`}
                      style={{
                        fontSize: '16px',
                        borderRadius: '9999px',
                        fontWeight: 'var(--font-weight-semibold)',
                        // Inactive (unselected): different styles based on paid status
                        ...(!isActive ? (
                          split.paid ? {
                            backgroundColor: '#f0fdf4',
                            border: '1.5px solid #86efac',
                            color: '#16a34a',
                          } : {
                            backgroundColor: 'var(--neutral-surface-primary)',
                            border: '1.5px solid var(--neutral-line-outline)',
                            color: 'var(--neutral-onsurface-primary)',
                          }
                        ) : {}),
                      }}
                    >
                      {/* Check icon only shown when active AND paid, never in inactive state */}
                      {isActive && !split.voided && split.paid && (
                        null
                      )}
                      {split.name}
                      {split.voided && (
                        <span
                          className="ml-1 px-1.5 py-0.5 rounded text-[10px]"
                          style={{
                            fontWeight: 'var(--font-weight-bold)',
                            backgroundColor: 'var(--status-red-primary)',
                            color: '#fff',
                          }}
                        >
                          VOID
                        </span>
                      )}
                      {split.paid && !split.voided && (
                        <span className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-600 text-white flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          PAID
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Split Content - Height Constrained */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {splits.map(split => {
                  if (split.id !== activeSplitId) return null;

                  const totals = splitTotals[split.id] || { subtotal: 0, service: 0, tax: 0, total: 0 };
                  const hasAllocations = totals.subtotal > 0;
                  const allItemsFullyAllocated = unpaidBillableItems.every(item => isItemFullyAllocated(item.id));

                  // Get ALL items allocated to this split — use allBillableItems so paid items
                  // are not dropped from a split's receipt after payment is confirmed.
                  // (unpaidBillableItems is only correct for the left panel re-allocation view.)
                  const splitItems = allBillableItems.filter(item => {
                    const itemAllocs = allocations[item.id] || {};
                    return (itemAllocs[split.id] || 0) > 0;
                  });

                  return (
                    <div 
                      key={split.id} 
                      className="flex-1 flex flex-col min-h-0 overflow-hidden"
                      style={{
                        backgroundColor: split.paid && !split.voided ? 'var(--feature-brand-containerlighter)' : 'transparent'
                      }}
                    >
                      {/* Top Section - Fixed */}
                      <div className="px-6 pt-6 pb-4 space-y-4 shrink-0">
                        {/* Split Header with Delete */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {split.voided ? null : split.paid && null}
                            <h4 style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
                              {split.voided ? <s>{split.name} ({splitItems.length})</s> : <>{split.name} ({splitItems.length})</>}
                            </h4>
                            {split.voided && (<Badge style={{fontSize:'var(--text-label)',backgroundColor:'var(--status-red-primary)',color:'#fff',borderRadius:'4px',fontFamily:'Lato, sans-serif',fontWeight:'var(--font-weight-bold)',letterSpacing:'0.04em'}} className="px-2 py-0.5">VOID</Badge>)} {split.paid && !split.voided && (
                              <Badge variant="default" style={{ fontSize: 'var(--text-label)' }} className="px-2 py-0.5 bg-green-600 flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                PAID
                              </Badge>
                            )}
                          </div>
                          {!split.paid && !split.voided && splits.length > 2 && (() => {
                            const hasItems = allBillableItems.some(item => (allocations[item.id]?.[split.id] || 0) > 0);
                            return (
                              <button
                                onClick={() => {
                                  if (hasItems) {
                                    setDeleteSplitConfirm({ open: true, splitId: split.id });
                                  } else {
                                    handleRemoveSplit(split.id);
                                  }
                                }}
                                aria-label={`Delete ${split.name}`}
                                style={{
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  width: 32, height: 32, padding: 0,
                                  background: 'none', border: 'none', cursor: 'pointer',
                                  color: 'var(--status-red-primary)',
                                }}
                              >
                                <Trash2 style={{ width: 18, height: 18 }} />
                              </button>
                            );
                          })()}
                        </div>

                        {/* By Value Controls - Only show in BY_VALUE mode and for unpaid splits */}
                        {splitMode === 'BY_VALUE' && !split.paid && !split.voided && (() => {
                          const { remainingAmount, remainingPercent } = calculateRemainingForSplit(split.id);
                          return (
                            <div className="p-3 bg-muted/50 rounded-lg space-y-2" style={{ borderRadius: 'var(--radius-small)' }}>
                              <Label style={{ fontSize: 'var(--text-label)', fontWeight: 'var(--font-weight-bold)' }} className="block">
                                {allocateValueDialog.method === 'PERCENT' ? 'Allocate Percentage:' : 'Allocate Amount (Rp):'}
                              </Label>
                              <div className="flex gap-2">
                                <Input
                                  type="number"
                                  min="0"
                                  max={allocateValueDialog.method === 'PERCENT' ? '100' : undefined}
                                  step={allocateValueDialog.method === 'PERCENT' ? '0.1' : '1'}
                                  value={allocateValueDialog.splitId === split.id ? allocateValueDialog.value : ''}
                                  onChange={(e) => handleValueInputChange(split.id, e.target.value)}
                                  onKeyDown={(e) => handleValueInputKeyDown(split.id, e)}
                                  onBlur={() => {
                                    if (allocateValueDialog.value && allocateValueDialog.splitId === split.id) {
                                      applyDirectAllocation(split.id, allocateValueDialog.value);
                                    }
                                  }}
                                  className="flex-1 h-10"
                                  style={{ borderRadius: 'var(--radius-input)', fontSize: 'var(--text-p)' }}
                                  placeholder={allocateValueDialog.method === 'PERCENT' ? '0.0' : '0'}
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleFillRest(split.id)}
                                  disabled={allocateValueDialog.method === 'PERCENT' ? remainingPercent <= 0 : remainingAmount <= 0}
                                  className="h-10 shrink-0"
                                  style={{ fontSize: 'var(--text-label)', borderRadius: 'var(--radius-button)' }}
                                >
                                  Fill Rest
                                </Button>
                              </div>
                              <p className="text-muted-foreground text-xs" style={{ fontSize: 'var(--text-label)' }}>
                                Remaining: {allocateValueDialog.method === 'PERCENT' 
                                  ? `${remainingPercent.toFixed(1)}%` 
                                  : formatCurrency(remainingAmount)
                                }
                              </p>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Middle Section - Scrollable Items */}
                      <div className="flex-1 overflow-y-auto px-6 pb-4 min-h-0">
                        {/* Items Assigned to This Split */}
                        {splitItems.length > 0 ? (
                          <div className="space-y-2">
                            {splitItems.map(item => {
                                const itemAllocs = allocations[item.id] || {};
                                const percentage = itemAllocs[split.id] || 0;
                                const allocatedAmount = (getItemPrice(item) * item.quantity * percentage) / 100;
                                // An item row is "settled" from this split's perspective if:
                                // this split is paid AND the item has allocation in it.
                                // (The item may have remaining % in other unpaid splits — that's fine.)
                                const isItemSettled = split.paid && percentage > 0;

                                return (
                                  <div
                                    key={item.id}
                                    className="py-2 border-b border-border last:border-b-0"
                                    style={{ opacity: isItemSettled ? 0.6 : 1 }}
                                  >
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                      <div className="flex items-center gap-1 min-w-0">
                                        {isItemSettled && (
                                          null
                                        )}
                                        <p className="truncate" style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>
                                          {item.name}
                                        </p>
                                      </div>
                                      <p className="shrink-0" style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>
                                        {formatCurrency(allocatedAmount)}
                                      </p>
                                    </div>
                                    <div className="flex items-center justify-between text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                                      <span>Qty: {item.quantity} × {formatCurrency(getItemPrice(item))}</span>
                                      <span>{percentage.toFixed(0)}%</span>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        ) : (
                          <div className="py-8 text-center">
                            <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                              No items allocated to this split yet
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Bottom Section - Always Visible Split Totals & Button */}
                      <div className="shrink-0 px-6 pt-4 pb-6 border-t border-border bg-background">
                        {/* Compute per-split display totals directly from allocations —
                            no global remainingRatio applied, so subtotal + service + tax (+ tip) === total exactly. */}
                        {(() => {
                          const rawItemSubtotal = allBillableItems.reduce((acc, item) => {
                            const alloc = (allocations[item.id] || {})[split.id] || 0;
                            return acc + (getItemPrice(item) * item.quantity * alloc / 100);
                          }, 0);
                          const discountFactor = subtotal > 0 ? (1 - billDiscountAmount / subtotal) : 1;
                          const dSubtotal = rawItemSubtotal * discountFactor;
                          const dService  = dSubtotal * 0.10;
                          const dTax      = dSubtotal * 0.05;
                          const dTip      = subtotalAfterDiscount > 0
                            ? (tipAmount * dSubtotal) / subtotalAfterDiscount
                            : 0;
                          const dTotal    = dSubtotal + dService + dTax + dTip;
                          return (
                            <div className="space-y-2" style={{ fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif' }}>
                              <div className="flex justify-between">
                                <span style={{ color: 'var(--neutral-onsurface-secondary)' }}>Subtotal</span>
                                <span style={{ fontWeight: 'var(--font-weight-bold)' }}>
                                  {formatCurrency(dSubtotal)}
                                </span>
                              </div>
                              <div className="flex justify-between" style={{ fontSize: 'var(--text-label)' }}>
                                <span style={{ color: 'var(--neutral-onsurface-secondary)' }}>Service (10%)</span>
                                <span>{formatCurrency(dService)}</span>
                              </div>
                              <div className="flex justify-between" style={{ fontSize: 'var(--text-label)' }}>
                                <span style={{ color: 'var(--neutral-onsurface-secondary)' }}>Tax (5%)</span>
                                <span>{formatCurrency(dTax)}</span>
                              </div>
                              {dTip > 0 && (
                                <div className="flex justify-between" style={{ fontSize: 'var(--text-label)' }}>
                                  <span style={{ color: 'var(--neutral-onsurface-secondary)' }}>Tip</span>
                                  <span>{formatCurrency(dTip)}</span>
                                </div>
                              )}
                              <div className="pt-2 mt-2" style={{ borderTop: '1px solid var(--neutral-border-subtle)' }}>
                                <div className="flex justify-between" style={{ fontWeight: 'var(--font-weight-bold)' }}>
                                  <span>Total</span>
                                  <span>{formatCurrency(dTotal)}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* Pay Button — visible when not yet paid and not voided */}
                        {!split.paid && !split.voided && (
                          <>
                            <Button
                              variant="default"
                              size="lg"
                              onClick={() => handlePaySplit(split.id)}
                              disabled={!hasAllocations || !allItemsFullyAllocated}
                              className="w-full mt-4 h-12"
                              style={{ borderRadius: 'var(--radius-button)' }}
                            >
                              Confirm Payment
                            </Button>
                            {(!hasAllocations || !allItemsFullyAllocated) && (
                              <p className="text-center text-orange-600 text-xs mt-2">
                                {!hasAllocations ? 'No items allocated to this split' : 'All items must be fully allocated'}
                              </p>
                            )}
                          </>
                        )}

                        {/* VOIDED permanent banner — replaces buttons after a void action */}
                        {split.voided && (
                          null
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Value Allocation Dialog */}
      <Dialog open={allocateValueDialog.open} onOpenChange={(open) => !open && setAllocateValueDialog({ open: false, splitId: null, method: null, value: '' })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Allocate by Value</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">
                {allocateValueDialog.method === 'AMOUNT' ? 'Enter Amount (Rp):' : 'Enter Percentage (%):'}
              </Label>
              <Input
                type="number"
                min="0"
                max={allocateValueDialog.method === 'PERCENT' ? '100' : undefined}
                step={allocateValueDialog.method === 'PERCENT' ? '0.1' : '1'}
                value={allocateValueDialog.value}
                onChange={(e) => setAllocateValueDialog({ ...allocateValueDialog, value: e.target.value })}
                className="h-12 text-lg"
                style={{ borderRadius: 'var(--radius-input)', fontSize: 'var(--text-h3)' }}
                placeholder="0"
              />
            </div>

            <p className="text-muted-foreground">
              Items will be allocated proportionally to reach this {allocateValueDialog.method === 'AMOUNT' ? 'amount' : 'percentage'}.
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAllocateValueDialog({ open: false, splitId: null, method: null, value: '' })}
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApplyValueAllocation}
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Allocate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Modal for individual split */}
      {paymentSplit && paymentTotal && (
        <SplitPaymentModal
          splitName={paymentSplit.name}
          totalAmount={paymentTotal.total}
          onConfirm={(payments) => handleConfirmPayment(paymentSplit.id, payments)}
          onClose={() => setPaymentSplitId(null)}
        />
      )}

      {/* Close Confirmation Dialog */}
      <DiscardSplitBillModal
        open={closeConfirmDialog}
        onCancel={cancelClose}
        onConfirm={confirmCloseAndReset}
      />

      {/* Split Mode Change Confirmation Dialog - using DiscardSplitBillModal */}
      <DiscardSplitBillModal
        open={splitModeChangeDialog.open}
        onCancel={cancelSplitModeChange}
        onConfirm={confirmSplitModeChange}
      />

      {/* ── Allocation Method Picker Modal ── */}
      <Dialog open={allocMethodModal.open} onOpenChange={v => { if (!v) setAllocMethodModal({ open: false, itemId: null }); }}>
        <DialogContent className="sm:max-w-[420px]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>
              Allocation Method
            </DialogTitle>
          </DialogHeader>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '8px 0' }}>
            {([
              { value: 'EQUAL', label: 'Equal Split', desc: 'Divide amount equally across selected splits' },
              { value: 'AMOUNT', label: 'By Amount (Rp)', desc: 'Enter a specific rupiah amount per split' },
              { value: 'PERCENTAGE', label: 'By Percentage (%)', desc: 'Enter a percentage of the item per split' },
            ] as const).map(opt => {
              const isSelected = (itemAllocationMethods[allocMethodModal.itemId || ''] || 'EQUAL') === opt.value;
              return (
                <SelectableCard
                  key={opt.value}
                  selected={isSelected}
                  onClick={() => {
                    if (allocMethodModal.itemId) {
                      handleItemAllocationMethodChange(allocMethodModal.itemId, opt.value);
                    }
                    setAllocMethodModal({ open: false, itemId: null });
                  }}
                  style={{
                    width: '100%', padding: '16px 20px',
                    borderRadius: 'var(--radius-card)',
                    border: `1.5px solid ${isSelected ? 'var(--feature-brand-primary)' : 'var(--neutral-line-outline)'}`,
                    flexDirection: 'column', alignItems: 'flex-start', gap: 4,
                    backgroundColor: isSelected ? 'var(--feature-brand-container)' : 'var(--neutral-surface-primary)',
                  }}
                >
                  <span style={{ fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif', fontWeight: 'var(--font-weight-semibold)', color: 'var(--neutral-onsurface-primary)' }}>
                    {opt.label}
                  </span>
                  <span style={{ fontSize: 'var(--text-label)', fontFamily: 'Lato, sans-serif', color: 'var(--muted-foreground)' }}>
                    {opt.desc}
                  </span>
                </SelectableCard>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Split Confirmation ── */}
      <Dialog open={deleteSplitConfirm.open} onOpenChange={v => { if (!v) setDeleteSplitConfirm({ open: false, splitId: null }); }}>
        <DialogContent className="sm:max-w-[400px]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>
              Delete Split
            </DialogTitle>
          </DialogHeader>
          <p style={{ fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif', color: 'var(--muted-foreground)', margin: '8px 0 20px', lineHeight: 1.6 }}>
            This split has items allocated to it. Deleting it will remove all its allocations. Are you sure?
          </p>
          <DialogFooter>
            <MainBtn
              variant="secondary"
              size="lg"
              onClick={() => setDeleteSplitConfirm({ open: false, splitId: null })}
              style={{ flex: 1 }}
            >
              Cancel
            </MainBtn>
            <MainBtn
              variant="destructive"
              size="lg"
              onClick={() => {
                if (deleteSplitConfirm.splitId) {
                  // Clear allocations for this split before removing
                  const newAllocations = { ...allocations };
                  Object.keys(newAllocations).forEach(itemId => {
                    if (newAllocations[itemId]?.[deleteSplitConfirm.splitId!]) {
                      const { [deleteSplitConfirm.splitId!]: _, ...rest } = newAllocations[itemId];
                      newAllocations[itemId] = rest;
                    }
                  });
                  setAllocations(newAllocations);
                  setSplits(prev => prev.filter(s => s.id !== deleteSplitConfirm.splitId));
                }
                setDeleteSplitConfirm({ open: false, splitId: null });
              }}
              style={{ flex: 1 }}
            >
              Delete Split
            </MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Success Modal */}
      {showSuccessModal && check && justPaidSplitId && (
        <PaymentSuccessModal
          check={check}
          items={allBillableItems}
          payments={completedPayments}
          onClose={() => {
            setShowSuccessModal(false);
            
            // Update local state to mark split as paid
            const updatedSplits = splits.map(s => 
              s.id === justPaidSplitId ? { ...s, paid: true } : s
            );
            setSplits(updatedSplits);
            const allSplitsPaid = updatedSplits.every(s => s.paid);
            
            // Clear the just paid split ID
            setJustPaidSplitId(null);
            
            // If all splits are paid, call onPaySplit to navigate back
            if (allSplitsPaid && onPaySplit) {
              onPaySplit(checkId, grandTotal);
            }
          }}
          onPrintReceipt={() => {
            snackbar.success('Successfully printed receipt');
          }}
        />
      )}
    </>
  );
});

SplitBillScreen.displayName = 'SplitBillScreen';

export default SplitBillScreen;