import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Users, DollarSign } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { TABLES } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';
import { MainBtn } from '../ui/MainBtn';

// Helper function to calculate discounted price (same as other screens)
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

interface MergeTablesModalProps {
  open: boolean;
  onClose: () => void;
  currentTableId: string;
  onMergeComplete: () => void;
  onBackToMoreOptions?: () => void;
  hasBillDiscount?: boolean;
  onDiscountWarningConfirm?: () => void;
}

export default function MergeTablesModal({ open, onClose, currentTableId, onMergeComplete, onBackToMoreOptions, hasBillDiscount, onDiscountWarningConfirm }: MergeTablesModalProps) {
  const { getTableState, getCheckByTable, getItemsByCheck, isMergedTable, mergeTables, getMergedTableGroup, mergedTableGroups } = useRestaurant();
  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set());
  const [showDiscountWarning, setShowDiscountWarning] = useState(false);

  // Build list of available options: individual tables + merged groups
  type MergeOption = {
    id: string; // For merged groups, this is the primary table ID
    displayName: string;
    isMergedGroup: boolean;
    tableIds: string[]; // For merged groups, all constituent tables; for single tables, just that table
    state: string;
  };

  const mergeOptions: MergeOption[] = [];
  const processedTableIds = new Set<string>();

  // First, add all merged groups (excluding current table's group if it's merged)
  const currentMergedGroup = getMergedTableGroup(currentTableId);
  
  mergedTableGroups?.forEach(group => {
    // Skip if this is the current table's merged group
    if (currentMergedGroup && group.primaryTableId === currentMergedGroup.primaryTableId) {
      // Mark all tables in current group as processed so they don't appear individually
      group.tableIds.forEach(id => processedTableIds.add(id));
      return;
    }
    
    // Get table names for this merged group
    const tableNames = group.tableIds
      .map(tableId => TABLES.find(t => t.id === tableId)?.name)
      .filter(Boolean)
      .join(', ');
    
    mergeOptions.push({
      id: group.primaryTableId,
      displayName: `Merged Table (${tableNames})`,
      isMergedGroup: true,
      tableIds: group.tableIds,
      state: getTableState(group.primaryTableId),
    });
    
    // Mark all tables in this group as processed
    group.tableIds.forEach(id => processedTableIds.add(id));
  });

  // Then, add individual tables that are not part of any merged group and not the current table
  TABLES.forEach(table => {
    // Skip if already processed or is current table
    if (processedTableIds.has(table.id) || table.id === currentTableId) return;
    
    mergeOptions.push({
      id: table.id,
      displayName: table.name,
      isMergedGroup: false,
      tableIds: [table.id],
      state: getTableState(table.id),
    });
  });

  const toggleTable = (tableId: string) => {
    const newSelected = new Set(selectedTables);
    if (newSelected.has(tableId)) {
      newSelected.delete(tableId);
    } else {
      newSelected.add(tableId);
    }
    setSelectedTables(newSelected);
  };

  const handleMerge = () => {
    if (selectedTables.size === 0) return;
    
    // Check if there's a bill discount applied
    if (hasBillDiscount) {
      setShowDiscountWarning(true);
      return;
    }
    
    // Merge tables
    mergeTables(currentTableId, Array.from(selectedTables));
    
    // Close modal and trigger merge complete
    onMergeComplete();
    onClose();
  };
  
  const handleConfirmMergeWithDiscountRemoval = () => {
    if (selectedTables.size === 0) return;
    
    // Call the callback to clear discount in parent
    if (onDiscountWarningConfirm) {
      onDiscountWarningConfirm();
    }
    
    // Merge tables
    mergeTables(currentTableId, Array.from(selectedTables));
    
    // Close modals and trigger merge complete
    setShowDiscountWarning(false);
    onMergeComplete();
    onClose();
  };

  const getTableInfo = (option: MergeOption) => {
    // For merged groups, aggregate info from all constituent tables
    if (option.isMergedGroup) {
      let totalPax = 0;
      let totalAmount = 0;
      
      option.tableIds.forEach(tableId => {
        const check = getCheckByTable(tableId);
        const items = check ? getItemsByCheck(check.id) : [];
        const billableItems = items.filter(item => 
          ['SENT', 'IN_PREP', 'READY', 'SERVED'].includes(item.status)
        );
        totalPax += check?.pax || 0;
        totalAmount += billableItems.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
      });
      
      return { pax: totalPax, totalAmount };
    }
    
    // For single tables
    const check = getCheckByTable(option.id);
    const items = check ? getItemsByCheck(check.id) : [];
    const billableItems = items.filter(item => 
      ['SENT', 'IN_PREP', 'READY', 'SERVED'].includes(item.status)
    );
    const totalAmount = billableItems.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
    
    return {
      pax: check?.pax || 0,
      totalAmount,
    };
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl flex flex-col" style={{ maxHeight: '700px' }}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
            Merge Tables
          </DialogTitle>
          <DialogDescription style={{ fontSize: 'var(--text-p)' }}>
            Select tables or merged groups to combine with {TABLES.find(t => t.id === currentTableId)?.name || 'this table'}. All orders will be merged together.
          </DialogDescription>
        </DialogHeader>

        {/* Fixed height scrollable area */}
        <div className="flex-1 overflow-hidden min-h-0">
          <ScrollArea className="h-full">
            <div className="space-y-3 p-1 pr-4">
              {mergeOptions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" style={{ fontSize: 'var(--text-p)' }}>
                  No other tables available to merge.
                </div>
              ) : (
                mergeOptions.map(option => {
                  const isSelected = selectedTables.has(option.id);
                  const tableInfo = getTableInfo(option);
                  const state = option.state;
                  
                  return (
                    <div
                      key={option.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                      }`}
                      style={{ borderRadius: 'var(--radius-card)' }}
                      onClick={() => toggleTable(option.id)}
                    >
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleTable(option.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold" style={{ fontSize: 'var(--text-h4)' }}>
                              {option.displayName}
                            </h4>
                            
                            <Badge
                              className={`${
                                state === 'AVAILABLE' 
                                  ? 'bg-gray-200 text-gray-700' 
                                  : state === 'BILLED' 
                                  ? 'bg-yellow-600 text-white' 
                                  : 'bg-primary text-primary-foreground'
                              } px-2 py-1`}
                              style={{ fontSize: 'var(--text-label)', borderRadius: 'var(--radius-small)' }}
                            >
                              {state}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-muted-foreground" style={{ fontSize: 'var(--text-label)' }}>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>{tableInfo.pax} pax</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              <span>{formatCurrency(tableInfo.totalAmount)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Sticky footer with action buttons */}
        <div className="border-t border-border pt-6 pb-2 bg-background flex-shrink-0">
          <div className="flex gap-3">
            {onBackToMoreOptions && (
              <MainBtn
                variant="secondary"
                size="lg"
                onClick={() => {
                  onClose();
                  onBackToMoreOptions();
                }}
                className="flex-1"
              >
                Back
              </MainBtn>
            )}
            <MainBtn
              onClick={handleMerge}
              disabled={selectedTables.size === 0}
              variant="primary"
              size="lg"
              className="flex-1"
            >
              Merge {selectedTables.size > 0 ? `${selectedTables.size + 1} Tables` : 'Tables'}
            </MainBtn>
          </div>
        </div>
      </DialogContent>
    </Dialog>

    {/* Discount Warning Modal */}
    <Dialog open={showDiscountWarning} onOpenChange={setShowDiscountWarning}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
            Discount Will Be Discarded
          </DialogTitle>
          <DialogDescription style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-normal)' }}>
            The discount that has been set for these tables will be discarded. Please adjust them later accordingly.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <div className="flex gap-3 w-full">
            <MainBtn
              variant="secondary"
              onClick={() => setShowDiscountWarning(false)}
              size="lg"
              className="flex-1"
            >
              Cancel
            </MainBtn>
            <MainBtn
              onClick={handleConfirmMergeWithDiscountRemoval}
              size="lg"
              className="flex-1"
            >
              Yes, Proceed
            </MainBtn>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}