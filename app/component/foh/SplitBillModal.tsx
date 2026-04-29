import { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { X, Plus, Trash2, ChevronDown, ChevronRight, Lock } from 'lucide-react';
import { useSnackbar } from '../labamu/Snackbar';
import { useRestaurant } from '../../context/RestaurantContext';
import { MENU_ITEMS } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import SplitPaymentModal from './SplitPaymentModal';

interface SplitBillModalProps {
  checkId: string;
  onClose: () => void;
  onPaySplit?: (splitId: string, amount: number) => void;
}

interface Split {
  id: string;
  name: string;
  paid: boolean;
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

export default function SplitBillModal({ checkId, onClose, onPaySplit }: SplitBillModalProps) {
  const snackbar = useSnackbar();
  const { getCheckById, getItemsByCheck, getSplitBillByCheck, saveSplitBill, paySplit: paySplitInContext } = useRestaurant();
  
  const check = getCheckById(checkId);
  const allItems = getItemsByCheck(checkId);
  
  // Only show SENT, READY, SERVED items (no DRAFT, HELD)
  const billableItems = allItems.filter(item => 
    ['SENT', 'IN_PREP', 'READY', 'SERVED'].includes(item.status)
  );

  // Load existing split bill or initialize with 2 splits
  const existingSplitBill = getSplitBillByCheck(checkId);
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

  // Split mode
  const [splitMode, setSplitMode] = useState<SplitMode>('BY_ITEM');

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

  const SERVICE_CHARGE_PERCENT = 5;
  const TAX_PERCENT = 10;

  // Calculate subtotal for each split
  const calculateSplitTotals = () => {
    const result: { [splitId: string]: { subtotal: number; service: number; tax: number; total: number } } = {};

    splits.forEach(split => {
      let subtotal = 0;
      
      billableItems.forEach(item => {
        const allocation = allocations[item.id]?.[split.id] || 0;
        subtotal += (item.price * allocation) / 100;
      });

      const service = subtotal * (SERVICE_CHARGE_PERCENT / 100);
      const tax = subtotal * (TAX_PERCENT / 100);
      const total = subtotal + service + tax;

      result[split.id] = { subtotal, service, tax, total };
    });

    return result;
  };

  const splitTotals = useMemo(() => calculateSplitTotals(), [splits, allocations, billableItems]);

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

  // Calculate total unallocated percentage for an item
  const getUnallocatedPercentage = (itemId: string): number => {
    const itemAllocations = allocations[itemId] || {};
    const total = Object.values(itemAllocations).reduce((sum, val) => sum + val, 0);
    return 100 - total;
  };

  // Get all categories with items
  const getCategoriesWithItems = (): { [category: string]: typeof billableItems } => {
    const grouped: { [category: string]: typeof billableItems } = {};
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

    if (isItemLocked(itemId)) {
      snackbar.error('Item is locked in a paid split');
      return;
    }

    const currentAllocations = allocations[itemId] || {};
    const currentlySelected = Object.keys(currentAllocations).filter(id => currentAllocations[id] > 0);
    
    let newSelectedSplits: string[];
    if (currentlySelected.includes(splitId)) {
      // Remove this split
      newSelectedSplits = currentlySelected.filter(id => id !== splitId);
    } else {
      // Add this split
      newSelectedSplits = [...currentlySelected, splitId];
    }

    // Calculate equal allocation
    if (newSelectedSplits.length === 0) {
      // Remove all allocations for this item
      const newAllocations = { ...allocations };
      delete newAllocations[itemId];
      setAllocations(newAllocations);
    } else {
      // Distribute equally
      const equalPercentage = 100 / newSelectedSplits.length;
      const newItemAllocations: { [splitId: string]: number } = {};
      newSelectedSplits.forEach(id => {
        newItemAllocations[id] = equalPercentage;
      });

      setAllocations({
        ...allocations,
        [itemId]: newItemAllocations,
      });
    }
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

  // Open allocate item dialog (for advanced allocation if needed)
  const handleOpenAllocateItem = (itemId: string) => {
    const item = billableItems.find(i => i.id === itemId);
    if (!item) return;

    if (isItemLocked(itemId)) {
      snackbar.error('Item is locked in a paid split');
      return;
    }

    setAllocateItemDialog({
      open: true,
      itemId,
      itemName: item.name,
      itemPrice: item.price,
      selectedSplits: [],
      method: 'EQUAL',
      allocations: {},
    });
  };

  // Toggle split selection in allocate item dialog (for modal)
  const handleToggleItemSplitInDialog = (splitId: string, checked: boolean) => {
    setAllocateItemDialog(prev => {
      const newSelected = checked
        ? [...prev.selectedSplits, splitId]
        : prev.selectedSplits.filter(id => id !== splitId);
      
      return {
        ...prev,
        selectedSplits: newSelected,
        allocations: {},
      };
    });
  };

  // Update allocation method in item dialog
  const handleUpdateItemMethod = (method: 'EQUAL' | 'PERCENTAGE' | 'AMOUNT') => {
    setAllocateItemDialog(prev => ({
      ...prev,
      method,
      allocations: {},
    }));
  };

  // Update allocation value in item dialog
  const handleUpdateItemAllocation = (splitId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAllocateItemDialog(prev => ({
      ...prev,
      allocations: {
        ...prev.allocations,
        [splitId]: numValue,
      },
    }));
  };

  // Apply item allocation
  const handleApplyItemAllocation = () => {
    if (!allocateItemDialog.itemId) return;

    const { selectedSplits, method, allocations: dialogAllocations } = allocateItemDialog;

    if (selectedSplits.length === 0) {
      snackbar.error('Select at least one split');
      return;
    }

    let finalAllocations: { [splitId: string]: number } = {};

    if (selectedSplits.length === 1) {
      // Single split = 100%
      finalAllocations[selectedSplits[0]] = 100;
    } else {
      // Multiple splits
      if (method === 'EQUAL') {
        const percentage = 100 / selectedSplits.length;
        selectedSplits.forEach(splitId => {
          finalAllocations[splitId] = percentage;
        });
      } else if (method === 'PERCENTAGE') {
        const total = selectedSplits.reduce((sum, splitId) => sum + (dialogAllocations[splitId] || 0), 0);
        if (Math.abs(total - 100) > 0.01) {
          snackbar.error('Percentages must total 100%');
          return;
        }
        finalAllocations = { ...dialogAllocations };
      } else if (method === 'AMOUNT') {
        const total = selectedSplits.reduce((sum, splitId) => sum + (dialogAllocations[splitId] || 0), 0);
        if (Math.abs(total - allocateItemDialog.itemPrice) > 0.01) {
          snackbar.error(`Amounts must total ${formatCurrency(allocateItemDialog.itemPrice)}`);
          return;
        }
        selectedSplits.forEach(splitId => {
          const amount = dialogAllocations[splitId] || 0;
          finalAllocations[splitId] = (amount / allocateItemDialog.itemPrice) * 100;
        });
      }
    }

    setAllocations({
      ...allocations,
      [allocateItemDialog.itemId]: finalAllocations,
    });

    setAllocateItemDialog({
      open: false,
      itemId: null,
      itemName: '',
      itemPrice: 0,
      selectedSplits: [],
      method: 'EQUAL',
      allocations: {},
    });

    snackbar.success('Item allocated');
  };

  // Open allocate category dialog
  const handleOpenAllocateCategory = (category: string) => {
    const items = categorizedItems[category] || [];
    const categoryTotal = items.reduce((sum, item) => sum + item.price, 0);

    const hasLockedItems = items.some(item => isItemLocked(item.id));
    if (hasLockedItems) {
      snackbar.error('Some items in this category are locked');
      return;
    }

    setAllocateCategoryDialog({
      open: true,
      category,
      categoryTotal,
      itemCount: items.length,
      selectedSplits: [],
      method: 'EQUAL',
      allocations: {},
    });
  };

  // Toggle split selection in allocate category dialog (for modal)
  const handleToggleCategorySplitInDialog = (splitId: string, checked: boolean) => {
    setAllocateCategoryDialog(prev => {
      const newSelected = checked
        ? [...prev.selectedSplits, splitId]
        : prev.selectedSplits.filter(id => id !== splitId);
      
      return {
        ...prev,
        selectedSplits: newSelected,
        allocations: {},
      };
    });
  };

  // Update allocation method in category dialog
  const handleUpdateCategoryMethod = (method: 'EQUAL' | 'PERCENTAGE' | 'AMOUNT') => {
    setAllocateCategoryDialog(prev => ({
      ...prev,
      method,
      allocations: {},
    }));
  };

  // Update allocation value in category dialog
  const handleUpdateCategoryAllocation = (splitId: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAllocateCategoryDialog(prev => ({
      ...prev,
      allocations: {
        ...prev.allocations,
        [splitId]: numValue,
      },
    }));
  };

  // Apply category allocation
  const handleApplyCategoryAllocation = () => {
    if (!allocateCategoryDialog.category) return;

    const { selectedSplits, method, allocations: dialogAllocations } = allocateCategoryDialog;

    if (selectedSplits.length === 0) {
      snackbar.error('Select at least one split');
      return;
    }

    let finalAllocations: { [splitId: string]: number } = {};

    if (selectedSplits.length === 1) {
      // Single split = 100%
      finalAllocations[selectedSplits[0]] = 100;
    } else {
      // Multiple splits
      if (method === 'EQUAL') {
        const percentage = 100 / selectedSplits.length;
        selectedSplits.forEach(splitId => {
          finalAllocations[splitId] = percentage;
        });
      } else if (method === 'PERCENTAGE') {
        const total = selectedSplits.reduce((sum, splitId) => sum + (dialogAllocations[splitId] || 0), 0);
        if (Math.abs(total - 100) > 0.01) {
          snackbar.error('Percentages must total 100%');
          return;
        }
        finalAllocations = { ...dialogAllocations };
      } else if (method === 'AMOUNT') {
        const total = selectedSplits.reduce((sum, splitId) => sum + (dialogAllocations[splitId] || 0), 0);
        if (Math.abs(total - allocateCategoryDialog.categoryTotal) > 0.01) {
          snackbar.error(`Amounts must total ${formatCurrency(allocateCategoryDialog.categoryTotal)}`);
          return;
        }
        selectedSplits.forEach(splitId => {
          const amount = dialogAllocations[splitId] || 0;
          finalAllocations[splitId] = (amount / allocateCategoryDialog.categoryTotal) * 100;
        });
      }
    }

    // Apply to all items in category
    const newAllocations = { ...allocations };
    const items = categorizedItems[allocateCategoryDialog.category] || [];
    
    items.forEach(item => {
      if (!isItemLocked(item.id)) {
        newAllocations[item.id] = { ...finalAllocations };
      }
    });

    setAllocations(newAllocations);

    setAllocateCategoryDialog({
      open: false,
      category: null,
      categoryTotal: 0,
      itemCount: 0,
      selectedSplits: [],
      method: 'EQUAL',
      allocations: {},
    });

    snackbar.success(`Category allocated`);
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

    const totalBill = billableItems.reduce((sum, item) => sum + item.price, 0);
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
      .sort((a, b) => b.price - a.price);

    unallocatedItems.forEach(item => {
      if (remainingTarget <= 0) return;

      const unallocatedPercent = getUnallocatedPercentage(item.id);
      if (unallocatedPercent > 0) {
        const maxAllocatable = (item.price * unallocatedPercent) / 100;
        const toAllocate = Math.min(maxAllocatable, remainingTarget);
        const percentToAllocate = (toAllocate / item.price) * 100;

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

  // Handle pay split
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
    billableItems.forEach(item => {
      if (!isItemFullyAllocated(item.id)) {
        hasIncompleteAllocations = true;
      }
    });

    if (hasIncompleteAllocations) {
      snackbar.error('All items must be fully allocated before payment');
      return;
    }

    // Mark split as paid in context and local state
    paySplitInContext(checkId, splitId, totals.total);
    setSplits(splits.map(s => s.id === splitId ? { ...s, paid: true, paidAmount: totals.total, paidAt: new Date() } : s));
    
    snackbar.success(`${split.name} paid - ${formatCurrency(totals.total)}`);
    
    // If callback provided for additional payment flow
    if (onPaySplit) {
      onPaySplit(splitId, totals.total);
    }
  };

  // Calculate overall bill totals
  const calculateOverallTotals = () => {
    const totalBill = billableItems.reduce((sum, item) => sum + item.price, 0);
    const service = totalBill * (SERVICE_CHARGE_PERCENT / 100);
    const tax = totalBill * (TAX_PERCENT / 100);
    const grandTotal = totalBill + service + tax;
    const paidAmount = check?.paidAmount || 0;
    const outstanding = grandTotal - paidAmount;

    return { totalBill, service, tax, grandTotal, paidAmount, outstanding };
  };

  // Handle close - save split bill
  const handleClose = () => {
    // Only save if there are any allocations
    const hasAllocations = Object.keys(allocations).length > 0;
    if (hasAllocations) {
      saveSplitBill(checkId, splits, allocations);
    }
    onClose();
  };

  if (!check) return null;

  const overallTotals = calculateOverallTotals();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border w-full max-w-[1400px] h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-bold" style={{ fontSize: 'var(--text-h2)' }}>Split Bill</h2>
            <div className="mt-2 space-y-1">
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                Grand Total: {formatCurrency(overallTotals.grandTotal)}
              </p>
              {overallTotals.paidAmount > 0 && (
                <>
                  <p className="text-green-600" style={{ fontSize: 'var(--text-label)' }}>
                    Paid: {formatCurrency(overallTotals.paidAmount)}
                  </p>
                  <p className="text-orange-600 font-bold" style={{ fontSize: 'var(--text-label)' }}>
                    Outstanding: {formatCurrency(overallTotals.outstanding)}
                  </p>
                </>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="h-10 w-10">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Paid Splits Notice Banner */}
        {splits.some(s => s.paid) && (
          <div className="bg-green-100 border-b border-green-300 px-6 py-3 shrink-0">
            <div className="flex items-center gap-2 text-green-800" style={{ fontSize: 'var(--text-label)' }}>
              <Lock className="w-4 h-4" />
              <span className="font-medium">
                {splits.filter(s => s.paid).length} split{splits.filter(s => s.paid).length > 1 ? 's' : ''} paid and locked. 
                Only unpaid portions can be modified.
              </span>
            </div>
          </div>
        )}

        {/* Main Content - Two Panel Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Split Method & Content */}
          <div className="w-[55%] border-r border-border flex flex-col">
            {/* Split Method Selector - Sticky */}
            <div className="p-6 border-b border-border bg-muted/30 shrink-0">
              <h3 className="font-bold mb-3" style={{ fontSize: 'var(--text-h3)' }}>Split Method</h3>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={splitMode === 'BY_ITEM' ? 'default' : 'outline'}
                  onClick={() => setSplitMode('BY_ITEM')}
                  className="h-14 flex flex-col items-center justify-center gap-1"
                  style={{ fontSize: 'var(--text-label)', borderRadius: 'var(--radius-button)' }}
                >
                  <span>By Item</span>
                </Button>
                <Button
                  variant={splitMode === 'BY_CATEGORY' ? 'default' : 'outline'}
                  onClick={() => setSplitMode('BY_CATEGORY')}
                  className="h-14 flex flex-col items-center justify-center gap-1"
                  style={{ fontSize: 'var(--text-label)', borderRadius: 'var(--radius-button)' }}
                >
                  <span>By Category</span>
                </Button>
                <Button
                  variant={splitMode === 'BY_VALUE' ? 'default' : 'outline'}
                  onClick={() => setSplitMode('BY_VALUE')}
                  className="h-14 flex flex-col items-center justify-center gap-1"
                  style={{ fontSize: 'var(--text-label)', borderRadius: 'var(--radius-button)' }}
                >
                  <span>By Value</span>
                </Button>
              </div>
            </div>

            {/* Scrollable Content Area */}
            <ScrollArea className="flex-1">
              {splitMode === 'BY_ITEM' && (
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold mb-2" style={{ fontSize: 'var(--text-h3)' }}>Bill Items</h3>
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                      Allocate individual items across splits
                    </p>
                  </div>

                  <div className="space-y-2">
                    {billableItems.map(item => {
                      const itemAllocations = allocations[item.id] || {};
                      const isLocked = isItemLocked(item.id);
                      const isFullyAllocated = isItemFullyAllocated(item.id);
                      const selectedSplits = Object.entries(itemAllocations).filter(([_, pct]) => pct > 0).map(([id]) => id);

                      return (
                        <div
                          key={item.id}
                          className="p-4 rounded-lg border border-border bg-background"
                          style={{ opacity: isLocked ? 0.6 : 1, borderRadius: 'var(--radius-card)' }}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium" style={{ fontSize: 'var(--text-p)' }}>{item.name}</p>
                              {isLocked && (
                                <Badge variant="secondary" className="text-[10px] px-2 py-0">LOCKED</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                              <span>Qty: 1</span>
                              <span>{formatCurrency(item.price)}</span>
                            </div>

                            {/* Split Selection Pills */}
                            {!isLocked && (
                              <div className="mt-3 space-y-2">
                                <div className="flex flex-wrap gap-2">
                                  {splits.filter(s => !s.paid).map(split => {
                                    const isSelected = selectedSplits.includes(split.id);
                                    const percentage = itemAllocations[split.id] || 0;
                                    
                                    return (
                                      <button
                                        key={split.id}
                                        onClick={() => handleToggleItemSplit(item.id, split.id)}
                                        className={`px-3 py-1.5 rounded-full border-2 transition-all ${
                                          isSelected 
                                            ? 'border-primary bg-primary text-white' 
                                            : 'border-border bg-background hover:border-primary/50'
                                        }`}
                                        style={{ 
                                          fontSize: 'var(--text-label)',
                                          borderRadius: 'var(--radius-pill)'
                                        }}
                                      >
                                        {split.name} {isSelected && percentage > 0 && `(${percentage.toFixed(0)}%)`}
                                      </button>
                                    );
                                  })}
                                </div>
                                
                                {/* Allocation Method - Show only when splits are selected */}
                                {selectedSplits.length > 0 && (
                                  <div className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                                    Allocation: Equal Split
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Show locked allocations */}
                            {isLocked && Object.entries(itemAllocations).length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {Object.entries(itemAllocations).map(([splitId, percentage]) => {
                                  if (percentage === 0) return null;
                                  const split = splits.find(s => s.id === splitId);
                                  const allocatedAmount = (item.price * percentage) / 100;
                                  return (
                                    <Badge
                                      key={splitId}
                                      variant="default"
                                      style={{ fontSize: 'var(--text-label)' }}
                                      className="px-2 py-0.5 flex items-center gap-1 bg-green-600"
                                    >
                                      <Lock className="w-3 h-3" />
                                      {split?.name} – {percentage.toFixed(0)}% ({formatCurrency(allocatedAmount)})
                                    </Badge>
                                  );
                                })}
                              </div>
                            )}

                            {/* Unallocated warning */}
                            {!isFullyAllocated && !isLocked && selectedSplits.length > 0 && (
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
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold mb-2" style={{ fontSize: 'var(--text-h3)' }}>Categories</h3>
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                      Allocate entire categories across splits
                    </p>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(categorizedItems).map(([category, items]) => {
                      const isExpanded = expandedCategories.has(category);
                      const categoryTotal = items.reduce((sum, item) => sum + item.price, 0);

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
                                <h4 className="font-bold" style={{ fontSize: 'var(--text-p)' }}>{category}</h4>
                                <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                                  {items.length} item{items.length !== 1 ? 's' : ''} · {formatCurrency(categoryTotal)}
                                </p>
                              </div>
                            </button>

                            {/* Split Selection Pills for Category */}
                            <div className="space-y-2">
                              <div className="flex flex-wrap gap-2">
                                {splits.filter(s => !s.paid).map(split => {
                                  // Check if all items in category are allocated to this split
                                  const allItemsHaveSplit = items.every(item => {
                                    const itemAllocs = allocations[item.id] || {};
                                    return itemAllocs[split.id] > 0;
                                  });
                                  
                                  return (
                                    <button
                                      key={split.id}
                                      onClick={() => handleToggleCategorySplit(category, split.id, items)}
                                      className={`px-3 py-1.5 rounded-full border-2 transition-all ${
                                        allItemsHaveSplit
                                          ? 'border-primary bg-primary text-white' 
                                          : 'border-border bg-background hover:border-primary/50'
                                      }`}
                                      style={{ 
                                        fontSize: 'var(--text-label)',
                                        borderRadius: 'var(--radius-pill)'
                                      }}
                                    >
                                      {split.name}
                                    </button>
                                  );
                                })}
                              </div>
                              
                              {/* Allocation Method - Show when any item in category is allocated */}
                              {items.some(item => Object.keys(allocations[item.id] || {}).length > 0) && (
                                <div className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                                  Allocation: Equal Split
                                </div>
                              )}
                            </div>

                            {/* Expanded Items */}
                            {isExpanded && (
                              <div className="mt-3 pt-3 border-t border-border space-y-2">
                                {items.map(item => {
                                  const itemAllocations = allocations[item.id] || {};
                                  const isFullyAllocated = isItemFullyAllocated(item.id);

                                  return (
                                    <div key={item.id} className="p-2 rounded bg-muted/50" style={{ borderRadius: 'var(--radius-small)' }}>
                                      <div className="flex items-center justify-between mb-1">
                                        <p style={{ fontSize: 'var(--text-label)' }}>{item.name}</p>
                                        <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>{formatCurrency(item.price)}</p>
                                      </div>
                                      <div className="flex flex-wrap gap-1">
                                        {Object.entries(itemAllocations).map(([splitId, percentage]) => {
                                          if (percentage === 0) return null;
                                          const split = splits.find(s => s.id === splitId);
                                          const allocatedAmount = (item.price * percentage) / 100;
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
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-bold mb-2" style={{ fontSize: 'var(--text-h3)' }}>Allocate by Value</h3>
                    <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                      Allocate a specific amount or percentage to splits. Items will be distributed proportionally.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-4" style={{ borderRadius: 'var(--radius-card)' }}>
                    <p className="text-blue-800" style={{ fontSize: 'var(--text-label)' }}>
                      Use the <strong>Split Groups</strong> panel on the right to allocate by value to each split.
                    </p>
                  </div>

                  {/* Summary of current allocations */}
                  <div className="space-y-2">
                    <h4 className="font-bold" style={{ fontSize: 'var(--text-p)' }}>Current Allocations</h4>
                    {billableItems.map(item => {
                      const itemAllocations = allocations[item.id] || {};
                      const hasAllocations = Object.keys(itemAllocations).length > 0;
                      
                      if (!hasAllocations) return null;

                      return (
                        <div key={item.id} className="p-3 rounded border border-border" style={{ borderRadius: 'var(--radius-small)' }}>
                          <div className="flex items-center justify-between mb-1">
                            <p style={{ fontSize: 'var(--text-label)' }}>{item.name}</p>
                            <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>{formatCurrency(item.price)}</p>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(itemAllocations).map(([splitId, percentage]) => {
                              if (percentage === 0) return null;
                              const split = splits.find(s => s.id === splitId);
                              const allocatedAmount = (item.price * percentage) / 100;
                              const isPaidAllocation = split?.paid;
                              return (
                                <Badge 
                                  key={splitId} 
                                  variant={isPaidAllocation ? 'default' : 'secondary'} 
                                  className={`text-[10px] px-1 py-0 flex items-center gap-0.5 ${isPaidAllocation ? 'bg-green-600' : ''}`}
                                >
                                  {isPaidAllocation && <Lock className="w-2.5 h-2.5" />}
                                  {split?.name} – {percentage.toFixed(0)}% ({formatCurrency(allocatedAmount)})
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    {billableItems.every(item => Object.keys(allocations[item.id] || {}).length === 0) && (
                      <p className="text-muted-foreground text-center py-4" style={{ fontSize: 'var(--text-label)' }}>
                        No allocations yet
                      </p>
                    )}
                  </div>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Right Panel - Split Groups */}
          <div className="w-[45%] flex flex-col">
            {/* Split Groups Header - Sticky */}
            <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
              <h3 className="font-bold" style={{ fontSize: 'var(--text-h3)' }}>Split Groups</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddSplit}
                className="h-10"
                style={{ fontSize: 'var(--text-label)', borderRadius: 'var(--radius-button)' }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Split
              </Button>
            </div>

            {/* Split Cards - Scrollable */}
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-4">
                {splits.map(split => {
                  const totals = splitTotals[split.id] || { subtotal: 0, service: 0, tax: 0, total: 0 };
                  const hasAllocations = totals.subtotal > 0;
                  const outstanding = totals.total;

                  // Check if all items fully allocated for pay validation
                  const allItemsFullyAllocated = billableItems.every(item => isItemFullyAllocated(item.id));

                  return (
                    <div
                      key={split.id}
                      className={`p-4 rounded-lg border-2 ${split.paid ? 'bg-green-50' : 'bg-background'}`}
                      style={{
                        borderColor: split.paid ? '#16a34a' : 'var(--color-border)',
                        borderRadius: 'var(--radius-card)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {split.paid && <Lock className="w-4 h-4 text-green-600" />}
                          <h4 className="font-bold" style={{ fontSize: 'var(--text-h3)' }}>{split.name}</h4>
                          {split.paid && (
                            <Badge variant="default" style={{ fontSize: 'var(--text-label)' }} className="px-2 py-0.5 bg-green-600">PAID</Badge>
                          )}
                        </div>
                        {!split.paid && splits.length > 2 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSplit(split.id)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        )}
                      </div>

                      {/* By Value Controls - Only show in BY_VALUE mode and for unpaid splits */}
                      {splitMode === 'BY_VALUE' && !split.paid && (
                        <div className="mb-4 p-3 bg-muted/50 rounded-lg space-y-2" style={{ borderRadius: 'var(--radius-small)' }}>
                          <Label style={{ fontSize: 'var(--text-label)' }} className="block font-bold">Allocate to this split:</Label>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenValueAllocation(split.id, 'AMOUNT')}
                              className="flex-1 h-10"
                              style={{ fontSize: 'var(--text-label)', borderRadius: 'var(--radius-button)' }}
                            >
                              By Amount (Rp)
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenValueAllocation(split.id, 'PERCENT')}
                              className="flex-1 h-10"
                              style={{ fontSize: 'var(--text-label)', borderRadius: 'var(--radius-button)' }}
                            >
                              By Percent (%)
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Split Totals */}
                      <div className="space-y-2" style={{ fontSize: 'var(--text-p)' }}>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
                        </div>
                        <div className="flex justify-between" style={{ fontSize: 'var(--text-label)' }}>
                          <span className="text-muted-foreground">Service ({SERVICE_CHARGE_PERCENT}%)</span>
                          <span>{formatCurrency(totals.service)}</span>
                        </div>
                        <div className="flex justify-between" style={{ fontSize: 'var(--text-label)' }}>
                          <span className="text-muted-foreground">Tax ({TAX_PERCENT}%)</span>
                          <span>{formatCurrency(totals.tax)}</span>
                        </div>
                        <div className="border-t border-border pt-2 mt-2">
                          <div className="flex justify-between font-bold">
                            <span>Total</span>
                            <span>{formatCurrency(totals.total)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Pay Button */}
                      {!split.paid && hasAllocations && (
                        <Button
                          variant="default"
                          size="lg"
                          onClick={() => setPaymentSplitId(split.id)}
                          disabled={!allItemsFullyAllocated}
                          className="w-full mt-4 h-12"
                          style={{ borderRadius: 'var(--radius-button)' }}
                        >
                          Pay {formatCurrency(totals.total)}
                        </Button>
                      )}

                      {!split.paid && hasAllocations && !allItemsFullyAllocated && (
                        <p className="text-center text-orange-600 text-xs mt-2">
                          All items must be fully allocated
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      {/* Allocate Item Dialog */}
      <Dialog open={allocateItemDialog.open} onOpenChange={(open) => !open && setAllocateItemDialog({
        open: false,
        itemId: null,
        itemName: '',
        itemPrice: 0,
        selectedSplits: [],
        method: 'EQUAL',
        allocations: {},
      })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h2)' }}>Allocate Item</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg" style={{ borderRadius: 'var(--radius-small)' }}>
              <p className="font-medium" style={{ fontSize: 'var(--text-p)' }}>{allocateItemDialog.itemName}</p>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>{formatCurrency(allocateItemDialog.itemPrice)}</p>
            </div>

            {/* Select Splits */}
            <div>
              <Label style={{ fontSize: 'var(--text-label)' }} className="mb-2 block">Select Splits (unpaid only):</Label>
              <div className="space-y-2">
                {splits.filter(s => !s.paid).map(split => (
                  <div key={split.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`item-split-${split.id}`}
                      checked={allocateItemDialog.selectedSplits.includes(split.id)}
                      onCheckedChange={(checked) => handleToggleItemSplitInDialog(split.id, checked as boolean)}
                    />
                    <Label htmlFor={`item-split-${split.id}`} style={{ fontSize: 'var(--text-label)' }} className="cursor-pointer flex-1">
                      {split.name}
                    </Label>
                  </div>
                ))}
              </div>
              {splits.some(s => s.paid) && (
                <p className="text-muted-foreground text-xs mt-2" style={{ fontSize: 'var(--text-label)' }}>
                  <Lock className="w-3 h-3 inline mr-1" />
                  Paid splits are locked and cannot be modified
                </p>
              )}
            </div>

            {/* Method Selection - Only show if 2+ splits selected */}
            {allocateItemDialog.selectedSplits.length > 1 && (
              <>
                <div>
                  <Label style={{ fontSize: 'var(--text-label)' }} className="mb-2 block">Allocation Method:</Label>
                  <RadioGroup value={allocateItemDialog.method} onValueChange={(value) => handleUpdateItemMethod(value as any)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="EQUAL" id="item-equal" />
                      <Label htmlFor="item-equal" style={{ fontSize: 'var(--text-label)' }} className="cursor-pointer">Equal Split</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PERCENTAGE" id="item-percentage" />
                      <Label htmlFor="item-percentage" style={{ fontSize: 'var(--text-label)' }} className="cursor-pointer">By Percentage (%)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="AMOUNT" id="item-amount" />
                      <Label htmlFor="item-amount" style={{ fontSize: 'var(--text-label)' }} className="cursor-pointer">By Amount (Rp)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Inputs based on method */}
                {allocateItemDialog.method === 'EQUAL' && (
                  <div className="p-3 bg-muted rounded-lg" style={{ borderRadius: 'var(--radius-small)' }}>
                    <p style={{ fontSize: 'var(--text-label)' }}>
                      Each split will receive <strong>{(100 / allocateItemDialog.selectedSplits.length).toFixed(1)}%</strong> ({formatCurrency(allocateItemDialog.itemPrice / allocateItemDialog.selectedSplits.length)})
                    </p>
                  </div>
                )}

                {allocateItemDialog.method === 'PERCENTAGE' && (
                  <div className="space-y-2">
                    {allocateItemDialog.selectedSplits.map(splitId => {
                      const split = splits.find(s => s.id === splitId);
                      return (
                        <div key={splitId} className="flex items-center gap-2">
                          <Label className="w-24" style={{ fontSize: 'var(--text-label)' }}>{split?.name}</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={allocateItemDialog.allocations[splitId] || ''}
                            onChange={(e) => handleUpdateItemAllocation(splitId, e.target.value)}
                            className="flex-1 h-10"
                            placeholder="0"
                          />
                          <span style={{ fontSize: 'var(--text-label)' }} className="text-muted-foreground w-8">%</span>
                        </div>
                      );
                    })}
                    <p style={{ fontSize: 'var(--text-label)' }} className="text-muted-foreground">
                      Total: {allocateItemDialog.selectedSplits.reduce((sum, id) => sum + (allocateItemDialog.allocations[id] || 0), 0).toFixed(1)}%
                    </p>
                  </div>
                )}

                {allocateItemDialog.method === 'AMOUNT' && (
                  <div className="space-y-2">
                    {allocateItemDialog.selectedSplits.map(splitId => {
                      const split = splits.find(s => s.id === splitId);
                      return (
                        <div key={splitId} className="flex items-center gap-2">
                          <Label className="w-24" style={{ fontSize: 'var(--text-label)' }}>{split?.name}</Label>
                          <Input
                            type="number"
                            min="0"
                            step="1000"
                            value={allocateItemDialog.allocations[splitId] || ''}
                            onChange={(e) => handleUpdateItemAllocation(splitId, e.target.value)}
                            className="flex-1 h-10"
                            placeholder="0"
                          />
                          <span style={{ fontSize: 'var(--text-label)' }} className="text-muted-foreground w-12">Rp</span>
                        </div>
                      );
                    })}
                    <p style={{ fontSize: 'var(--text-label)' }} className="text-muted-foreground">
                      Total: {formatCurrency(allocateItemDialog.selectedSplits.reduce((sum, id) => sum + (allocateItemDialog.allocations[id] || 0), 0))} / {formatCurrency(allocateItemDialog.itemPrice)}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Info for single split */}
            {allocateItemDialog.selectedSplits.length === 1 && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200" style={{ borderRadius: 'var(--radius-small)' }}>
                <p className="text-blue-800" style={{ fontSize: 'var(--text-label)' }}>
                  Item will be allocated 100% to {splits.find(s => s.id === allocateItemDialog.selectedSplits[0])?.name}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAllocateItemDialog({
              open: false,
              itemId: null,
              itemName: '',
              itemPrice: 0,
              selectedSplits: [],
              method: 'EQUAL',
              allocations: {},
            })}>
              Cancel
            </Button>
            <Button onClick={handleApplyItemAllocation} disabled={allocateItemDialog.selectedSplits.length === 0}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Allocate Category Dialog */}
      <Dialog open={allocateCategoryDialog.open} onOpenChange={(open) => !open && setAllocateCategoryDialog({
        open: false,
        category: null,
        categoryTotal: 0,
        itemCount: 0,
        selectedSplits: [],
        method: 'EQUAL',
        allocations: {},
      })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h2)' }}>Allocate Category</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg" style={{ borderRadius: 'var(--radius-small)' }}>
              <p className="font-medium" style={{ fontSize: 'var(--text-p)' }}>{allocateCategoryDialog.category}</p>
              <p className="text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                {allocateCategoryDialog.itemCount} items · {formatCurrency(allocateCategoryDialog.categoryTotal)}
              </p>
            </div>

            {/* Select Splits */}
            <div>
              <Label style={{ fontSize: 'var(--text-label)' }} className="mb-2 block">Select Splits (unpaid only):</Label>
              <div className="space-y-2">
                {splits.filter(s => !s.paid).map(split => (
                  <div key={split.id} className="flex items-center gap-2">
                    <Checkbox
                      id={`cat-split-${split.id}`}
                      checked={allocateCategoryDialog.selectedSplits.includes(split.id)}
                      onCheckedChange={(checked) => handleToggleCategorySplitInDialog(split.id, checked as boolean)}
                    />
                    <Label htmlFor={`cat-split-${split.id}`} style={{ fontSize: 'var(--text-label)' }} className="cursor-pointer flex-1">
                      {split.name}
                    </Label>
                  </div>
                ))}
              </div>
              {splits.some(s => s.paid) && (
                <p className="text-muted-foreground text-xs mt-2" style={{ fontSize: 'var(--text-label)' }}>
                  <Lock className="w-3 h-3 inline mr-1" />
                  Paid splits are locked and cannot be modified
                </p>
              )}
            </div>

            {/* Method Selection - Only show if 2+ splits selected */}
            {allocateCategoryDialog.selectedSplits.length > 1 && (
              <>
                <div>
                  <Label style={{ fontSize: 'var(--text-label)' }} className="mb-2 block">Allocation Method:</Label>
                  <RadioGroup value={allocateCategoryDialog.method} onValueChange={(value) => handleUpdateCategoryMethod(value as any)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="EQUAL" id="cat-equal" />
                      <Label htmlFor="cat-equal" style={{ fontSize: 'var(--text-label)' }} className="cursor-pointer">Equal Split</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="PERCENTAGE" id="cat-percentage" />
                      <Label htmlFor="cat-percentage" style={{ fontSize: 'var(--text-label)' }} className="cursor-pointer">By Percentage (%)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="AMOUNT" id="cat-amount" />
                      <Label htmlFor="cat-amount" style={{ fontSize: 'var(--text-label)' }} className="cursor-pointer">By Amount (Rp)</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Inputs based on method */}
                {allocateCategoryDialog.method === 'EQUAL' && (
                  <div className="p-3 bg-muted rounded-lg" style={{ borderRadius: 'var(--radius-small)' }}>
                    <p style={{ fontSize: 'var(--text-label)' }}>
                      Each split will receive <strong>{(100 / allocateCategoryDialog.selectedSplits.length).toFixed(1)}%</strong> ({formatCurrency(allocateCategoryDialog.categoryTotal / allocateCategoryDialog.selectedSplits.length)})
                    </p>
                  </div>
                )}

                {allocateCategoryDialog.method === 'PERCENTAGE' && (
                  <div className="space-y-2">
                    {allocateCategoryDialog.selectedSplits.map(splitId => {
                      const split = splits.find(s => s.id === splitId);
                      return (
                        <div key={splitId} className="flex items-center gap-2">
                          <Label className="w-24" style={{ fontSize: 'var(--text-label)' }}>{split?.name}</Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={allocateCategoryDialog.allocations[splitId] || ''}
                            onChange={(e) => handleUpdateCategoryAllocation(splitId, e.target.value)}
                            className="flex-1 h-10"
                            placeholder="0"
                          />
                          <span style={{ fontSize: 'var(--text-label)' }} className="text-muted-foreground w-8">%</span>
                        </div>
                      );
                    })}
                    <p style={{ fontSize: 'var(--text-label)' }} className="text-muted-foreground">
                      Total: {allocateCategoryDialog.selectedSplits.reduce((sum, id) => sum + (allocateCategoryDialog.allocations[id] || 0), 0).toFixed(1)}%
                    </p>
                  </div>
                )}

                {allocateCategoryDialog.method === 'AMOUNT' && (
                  <div className="space-y-2">
                    {allocateCategoryDialog.selectedSplits.map(splitId => {
                      const split = splits.find(s => s.id === splitId);
                      return (
                        <div key={splitId} className="flex items-center gap-2">
                          <Label className="w-24" style={{ fontSize: 'var(--text-label)' }}>{split?.name}</Label>
                          <Input
                            type="number"
                            min="0"
                            step="1000"
                            value={allocateCategoryDialog.allocations[splitId] || ''}
                            onChange={(e) => handleUpdateCategoryAllocation(splitId, e.target.value)}
                            className="flex-1 h-10"
                            placeholder="0"
                          />
                          <span style={{ fontSize: 'var(--text-label)' }} className="text-muted-foreground w-12">Rp</span>
                        </div>
                      );
                    })}
                    <p style={{ fontSize: 'var(--text-label)' }} className="text-muted-foreground">
                      Total: {formatCurrency(allocateCategoryDialog.selectedSplits.reduce((sum, id) => sum + (allocateCategoryDialog.allocations[id] || 0), 0))} / {formatCurrency(allocateCategoryDialog.categoryTotal)}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Info for single split */}
            {allocateCategoryDialog.selectedSplits.length === 1 && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200" style={{ borderRadius: 'var(--radius-small)' }}>
                <p className="text-blue-800" style={{ fontSize: 'var(--text-label)' }}>
                  All items in this category will be allocated 100% to {splits.find(s => s.id === allocateCategoryDialog.selectedSplits[0])?.name}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAllocateCategoryDialog({
              open: false,
              category: null,
              categoryTotal: 0,
              itemCount: 0,
              selectedSplits: [],
              method: 'EQUAL',
              allocations: {},
            })}>
              Cancel
            </Button>
            <Button onClick={handleApplyCategoryAllocation} disabled={allocateCategoryDialog.selectedSplits.length === 0}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Allocate Value Dialog */}
      <Dialog open={allocateValueDialog.open} onOpenChange={(open) => !open && setAllocateValueDialog({ open: false, splitId: null, method: null, value: '' })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h2)' }}>
              Allocate by {allocateValueDialog.method === 'AMOUNT' ? 'Amount' : 'Percentage'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-lg" style={{ borderRadius: 'var(--radius-small)' }}>
              <p className="font-medium" style={{ fontSize: 'var(--text-p)' }}>
                {splits.find(s => s.id === allocateValueDialog.splitId)?.name}
              </p>
            </div>

            <div>
              <Label style={{ fontSize: 'var(--text-label)' }}>
                {allocateValueDialog.method === 'AMOUNT' ? 'Enter amount (Rp)' : 'Enter percentage (%)'}
              </Label>
              <Input
                type="number"
                min="0"
                value={allocateValueDialog.value}
                onChange={(e) => setAllocateValueDialog({ ...allocateValueDialog, value: e.target.value })}
                placeholder="0"
                className="h-12 mt-2"
              />
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200" style={{ borderRadius: 'var(--radius-small)' }}>
              <p className="text-blue-800" style={{ fontSize: 'var(--text-label)' }}>
                Items will be allocated proportionally by price to reach this target value. You'll be switched to <strong>By Item</strong> view to review allocations.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAllocateValueDialog({ open: false, splitId: null, method: null, value: '' })}>
              Cancel
            </Button>
            <Button onClick={handleApplyValueAllocation}>
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Modal */}
      {paymentSplitId && (() => {
        const split = splits.find(s => s.id === paymentSplitId);
        const totals = splitTotals[paymentSplitId];
        
        if (!split || !totals) return null;

        return (
          <SplitPaymentModal
            splitName={split.name}
            totalAmount={totals.total}
            onConfirm={(payments) => {
              // Mark split as paid
              paySplitInContext(checkId, paymentSplitId, totals.total);
              setSplits(splits.map(s => s.id === paymentSplitId ? { ...s, paid: true, paidAmount: totals.total, paidAt: new Date() } : s));
              
              snackbar.success(`${split.name} paid - ${formatCurrency(totals.total)}`);
              
              // If callback provided for additional payment flow
              if (onPaySplit) {
                onPaySplit(paymentSplitId, totals.total);
              }

              setPaymentSplitId(null);
            }}
            onClose={() => setPaymentSplitId(null)}
          />
        );
      })()}
    </div>
  );
}
