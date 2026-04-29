import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import type { Check, Item, KOT, Course, Table, UserRole, TableState, ServiceType, CheckStatus, ItemStatus, PaymentMethod, Payment, SplitBill, SplitGroup, MergedTableGroup } from '../types';
import { TABLES, initialChecks, initialItems, initialKOTs, MENU_ITEMS, getCategoryRoute } from '../data/mockData';

// ── Context type interface ─────────────────────────────────────────────────────
interface RestaurantContextType {
  currentRole: UserRole;
  posProfile: 'POS_CASHIER' | 'POS_EMPTY_MENU' | 'POS_IMAGE';
  setPosProfile: (profile: 'POS_CASHIER' | 'POS_EMPTY_MENU' | 'POS_IMAGE') => void;
  checks: Check[];
  checkHistory: Check[];
  items: Item[];
  kots: KOT[];
  courses: Course[];
  payments: Payment[];
  splitBills: SplitBill[];
  mergedTableGroups: MergedTableGroup[];
  cashierOpen: boolean;
  cashierBalance: number;
  setCurrentRole: (role: UserRole) => void;
  openCashier: (pin: string, openingBalance: number) => void;
  closeCashier: (closingBalance: number) => void;
  createCheck: (checkData: Omit<Check, 'id' | 'createdAt' | 'totalAmount' | 'paidAmount' | 'billVersion' | 'billModified'>) => string;
  updateCheck: (id: string, updates: Partial<Check>) => void;
  voidCheck: (id: string, voidReason: string, managerPin: string) => void;
  addItems: (checkId: string, items: Omit<Item, 'id' | 'checkId' | 'createdAt'>[]) => string[];
  updateItem: (id: string, updates: Partial<Item>) => void;
  updateMultipleItems: (itemIds: string[], updates: Partial<Item>) => void;
  createKOT: (checkId: string, itemIds: string[], course?: number) => void;
  updateKOT: (id: string, updates: Partial<KOT>) => void;
  getTableState: (tableId: string) => TableState;
  getCheckByTable: (tableId: string) => Check | undefined;
  getCheckById: (checkId: string) => Check | undefined;
  getItemsByCheck: (checkId: string) => Item[];
  getKOTsByCheck: (checkId: string) => KOT[];
  addPayment: (checkId: string, method: PaymentMethod, amount: number) => void;
  completePayment: (checkId: string, payments: any[], combinedBillIds?: string[]) => void;
  deleteItem: (id: string) => void;
  closeCheck: (checkId: string) => void;
  deleteCheck: (checkId: string) => void;
  getSplitBillByCheck: (checkId: string) => SplitBill | undefined;
  saveSplitBill: (checkId: string, splits: SplitGroup[], allocations: Record<string, Record<string, number>>) => void;
  paySplit: (checkId: string, splitId: string, paymentMethods: Array<{ type: string; amount: number }>, billId?: string) => void;
  voidSplit: (checkId: string, splitId: string) => void;
  getCoursesByCheck: (checkId: string) => Course[];
  createCourse: (checkId: string, name: string, number: number) => string;
  updateCourse: (id: string, updates: Partial<Course>) => void;
  deleteCourse: (id: string) => void;
  reorderCourses: (checkId: string, orderedIds: string[]) => void;
  mergeTables: (primaryTableId: string, tableIds: string[]) => void;
  getMergedTableGroup: (tableId: string) => MergedTableGroup | undefined;
  isMergedTable: (tableId: string) => boolean;
}

// Helper function to calculate item price with discount
function getItemPrice(item: Item): number {
  if (item.isComplimentary) return 0;
  const basePrice = item.price + (item.packagingPrice || 0);
  if (!item.discountType || !item.discountValue) return basePrice;
  if (item.discountType === 'PERCENTAGE') {
    return basePrice * (1 - item.discountValue / 100);
  } else {
    return Math.max(0, basePrice - item.discountValue);
  }
}

/** Generates a unique Transaction ID like TXN-20250305-A1B2C3 */
function generateTransactionId(): string {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `TXN-${date}-${rand}`;
}

// HMR-safe singleton: preserve the context object across module re-evaluations
// so that React Fast Refresh never creates a mismatched Provider / useContext pair.
const CONTEXT_SYMBOL = Symbol.for('app.RestaurantContext');
type CtxType = RestaurantContextType | undefined;

function getContext(): React.Context<CtxType> {
  const g = globalThis as Record<symbol, React.Context<CtxType>>;
  if (!g[CONTEXT_SYMBOL]) {
    g[CONTEXT_SYMBOL] = createContext<CtxType>(undefined);
    g[CONTEXT_SYMBOL].displayName = 'RestaurantContext';
  }
  return g[CONTEXT_SYMBOL];
}

const RestaurantContext = getContext();

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('FOH');
  const [posProfile, setPosProfile] = useState<'POS_CASHIER' | 'POS_EMPTY_MENU' | 'POS_IMAGE'>('POS_CASHIER');
  const [checks, setChecks] = useState<Check[]>(initialChecks);
  const [checkHistory, setCheckHistory] = useState<Check[]>([]); // Historical checks (up to 2 weeks)
  const [items, setItems] = useState<Item[]>(initialItems);
  const [kots, setKots] = useState<KOT[]>(initialKOTs);
  const [courses, setCourses] = useState<Course[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [splitBills, setSplitBills] = useState<SplitBill[]>([]);
  const [mergedTableGroups, setMergedTableGroups] = useState<MergedTableGroup[]>([]);
  const [cashierOpen, setCashierOpen] = useState<boolean>(false); // Default to closed
  const [cashierBalance, setCashierBalance] = useState<number>(0);

  const createCheck = useCallback((checkData: Omit<Check, 'id' | 'createdAt' | 'totalAmount' | 'paidAmount' | 'billVersion' | 'billModified'>) => {
    // Generate bill number - sequential based on existing checks
    const billCount = checks.length + 1;
    const billNumber = String(billCount).padStart(5, '0');
    
    const newCheck: Check = {
      ...checkData,
      id: `check-${Date.now()}`,
      billNumber,
      createdAt: new Date(),
      totalAmount: 0,
      paidAmount: 0,
      billVersion: 0,
      billModified: false,
    };
    setChecks(prev => [...prev, newCheck]);
    return newCheck.id;
  }, [checks]);

  const updateCheck = useCallback((id: string, updates: Partial<Check>) => {
    setChecks(prev => prev.map(check => 
      check.id === id ? { ...check, ...updates } : check
    ));
  }, []);

  /**
   * Marks a check as voided without removing it from the system.
   * Voided transactions remain in CLOSED status but are flagged for audit purposes.
   * Important: When implementing sales reports, filter out checks where voided === true
   */
  const voidCheck = useCallback((id: string, voidReason: string, managerPin: string) => {
    setChecks(prev => prev.map(check => 
      check.id === id ? { 
        ...check, 
        voided: true,
        voidedAt: new Date(),
        voidReason,
        voidedBy: managerPin
      } : check
    ));
  }, []);

  const addItems = useCallback((checkId: string, items: Omit<Item, 'id' | 'checkId' | 'createdAt'>[]) => {
    console.log('[RestaurantContext] addItems called:', { checkId, items });
    
    const newItemIds: string[] = [];
    const newItems: Item[] = [];
    
    // Use a counter to ensure unique IDs even if Date.now() is the same
    const timestamp = Date.now();
    items.forEach((item, index) => {
      const itemId = `item-${timestamp}-${index}-${Math.random().toString(36).substr(2, 9)}`;
      newItemIds.push(itemId);
      
      console.log('[RestaurantContext] Creating item with ID:', itemId, 'Name:', item.name);
      
      newItems.push({
        ...item,
        id: itemId,
        checkId,
        createdAt: new Date(),
      });
    });
    
    setItems(prev => {
      const updated = [...prev, ...newItems];
      console.log('[RestaurantContext] Updated items array:', updated);
      return updated;
    });
    
    // Update check total and mark bill as modified if it was already printed
    const itemsTotal = items.reduce((sum, item) => sum + getItemPrice(item), 0);
    setChecks(prev => prev.map(check => 
      check.id === checkId
        ? { 
            ...check, 
            totalAmount: check.totalAmount + itemsTotal,
            // Mark bill as modified when new items are added after bill was printed
            billModified: check.billPrinted ? true : check.billModified
          }
        : check
    ));
    
    return newItemIds;
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<Item>) => {
    console.log('[RestaurantContext] updateItem called:', { id, updates });
    
    if (updates.status === 'VOIDED') {
      console.log('[RestaurantContext] Item being voided:', id, 'Reason:', updates.voidReason);
    }
    
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    
    // Note: Removed auto-complete logic for single-item voided KOTs
    // Kitchen staff should manually mark KOT as completed even if only item is voided
  }, []);

  const updateMultipleItems = useCallback((itemIds: string[], updates: Partial<Item>) => {
    console.log('[RestaurantContext] Updating multiple items:', { itemIds, updates });
    setItems(prev => prev.map(item => 
      itemIds.includes(item.id) ? { ...item, ...updates } : item
    ));
  }, []);

  const deleteItem = useCallback((id: string) => {
    const item = items.find(i => i.id === id);
    if (item && (item.status === 'DRAFT' || item.status === 'HELD')) {
      setItems(prev => prev.filter(i => i.id !== id));
      
      // Update check total using discounted price
      const itemPrice = getItemPrice(item);
      setChecks(prev => prev.map(check => 
        check.id === item.checkId 
          ? { ...check, totalAmount: check.totalAmount - itemPrice }
          : check
      ));
    }
  }, [items]);

  const createKOT = useCallback((checkId: string, itemIds: string[], course?: number) => {
    console.log('[RestaurantContext] Creating KOT/BOT:', { checkId, itemIds, course });
    
    // Use functional update to get the CURRENT items state
    // This is critical because addItems() might have just been called
    setItems(currentItems => {
      // Log the batchIds of the items being sent
      const batchIds = itemIds.map(id => {
        const item = currentItems.find(i => i.id === id);
        return item ? { id: item.id, name: item.name, batchId: item.batchId } : null;
      }).filter(Boolean);
      console.log('[RestaurantContext] Items with batchIds:', batchIds);
      
      const check = checks.find(c => c.id === checkId);
      const table = check?.tableId ? TABLES.find(t => t.id === check.tableId) : undefined;
      
      // Group items by station (KITCHEN or BAR)
      const itemsByStation: { [station: string]: string[] } = {
        KITCHEN: [],
        BAR: [],
      };
      
      itemIds.forEach(itemId => {
        const item = currentItems.find(i => i.id === itemId);
        if (item) {
          // Find the menu item to get its category
          const menuItem = MENU_ITEMS.find(mi => mi.name === item.name || mi.id === item.menuItemId);
          if (menuItem) {
            const station = getCategoryRoute(menuItem.category);
            itemsByStation[station].push(itemId);
          } else {
            // Default to KITCHEN if menu item not found
            itemsByStation.KITCHEN.push(itemId);
          }
        }
      });
      
      console.log('[RestaurantContext] Items grouped by station:', itemsByStation);
      
      // Update tickets and items in a single state update to avoid race conditions
      setKots(prev => {
        const newTickets: KOT[] = [];
        
        // Create KOT for Kitchen items
        if (itemsByStation.KITCHEN.length > 0) {
          const kotCount = prev.filter(k => k.ticketType === 'KOT').length + 1;
          const kotId = `KOT-${String(kotCount).padStart(4, '0')}`;
          
          const newKOT: KOT = {
            id: kotId,
            checkId,
            itemIds: itemsByStation.KITCHEN,
            status: 'NEW',
            course,
            createdAt: new Date(),
            tableName: table?.name,
            serviceType: check?.serviceType || 'DINE_IN',
            ticketType: 'KOT',
            station: 'KITCHEN',
          };
          
          newTickets.push(newKOT);
          console.log('[RestaurantContext] Created KOT for Kitchen:', newKOT);
          console.log('[RestaurantContext] KOT itemIds count:', itemsByStation.KITCHEN.length, 'IDs:', itemsByStation.KITCHEN);
        }
        
        // Create BOT for Bar items
        if (itemsByStation.BAR.length > 0) {
          const botCount = prev.filter(k => k.ticketType === 'BOT').length + 1;
          const botId = `BOT-${String(botCount).padStart(4, '0')}`;
          
          const newBOT: KOT = {
            id: botId,
            checkId,
            itemIds: itemsByStation.BAR,
            status: 'NEW',
            course,
            createdAt: new Date(),
            tableName: table?.name,
            serviceType: check?.serviceType || 'DINE_IN',
            ticketType: 'BOT',
            station: 'BAR',
          };
          
          newTickets.push(newBOT);
          console.log('[RestaurantContext] Created BOT for Bar:', newBOT);
        }
        
        const updated = [...prev, ...newTickets];
        console.log('[RestaurantContext] Updated KOTs/BOTs array:', updated);
        
        // Update items with their respective KOT/BOT IDs
        setItems(prevItems => {
          const updatedItems = prevItems.map(item => {
            const ticket = newTickets.find(t => t.itemIds.includes(item.id));
            return ticket ? { ...item, kotId: ticket.id } : item;
          });
          console.log('[RestaurantContext] Updated items with kotId/botId:', updatedItems.filter(item => itemIds.includes(item.id)));
          return updatedItems;
        });
        
        return updated;
      });
      
      // Return currentItems unchanged (we're only using this to read the current state)
      return currentItems;
    });
  }, [checks]);

  const updateKOT = useCallback((id: string, updates: Partial<KOT>) => {
    setKots(prev => prev.map(ticket => 
      ticket.id === id ? { ...ticket, ...updates } : ticket
    ));
  }, []);

  const getTableState = useCallback((tableId: string): TableState => {
    // Check if this table is part of a merged group
    const mergedGroup = mergedTableGroups.find(group => group.tableIds.includes(tableId));
    if (mergedGroup) {
      // Use the primary table's check for the state
      const check = checks.find(c => c.tableId === mergedGroup.primaryTableId);
      if (!check) return 'AVAILABLE';
      // Fully paid (before or after release) → PAID
      if (check.paidAmount >= check.totalAmount && check.totalAmount > 0) return 'PAID';
      // All splits paid → PAID (handles totalAmount mismatch / 0 edge cases)
      const splitBill = splitBills.find(sb => sb.checkId === check.id);
      if (splitBill && splitBill.splits.length > 0 && splitBill.splits.every(s => s.paid)) return 'PAID';
      // Released / closed table
      if (check.status === 'CLOSED') return 'AVAILABLE';
      if (check.billPrinted && check.billModified) return 'OCCUPIED';
      if (check.billPrinted) return 'BILLED';
      return 'OCCUPIED';
    }
    
    const check = checks.find(c => c.tableId === tableId);
    if (!check) return 'AVAILABLE';
    // Fully paid (before or after release) → PAID
    if (check.paidAmount >= check.totalAmount && check.totalAmount > 0) return 'PAID';
    // All splits paid → PAID (handles totalAmount mismatch / 0 edge cases)
    const splitBill = splitBills.find(sb => sb.checkId === check.id);
    if (splitBill && splitBill.splits.length > 0 && splitBill.splits.every(s => s.paid)) return 'PAID';
    // Released / closed table
    if (check.status === 'CLOSED') return 'AVAILABLE';
    // If bill is modified after printing, show as OCCUPIED (not BILLED)
    if (check.billPrinted && check.billModified) return 'OCCUPIED';
    // If bill is printed and not modified, show as BILLED
    if (check.billPrinted) return 'BILLED';
    return 'OCCUPIED';
  }, [checks, mergedTableGroups, splitBills]);

  const getCheckByTable = useCallback((tableId: string) => {
    // Check if this table is part of a merged group
    const mergedGroup = mergedTableGroups.find(group => group.tableIds.includes(tableId));
    if (mergedGroup) {
      // Return the primary table's check
      return checks.find(c => c.tableId === mergedGroup.primaryTableId && c.status !== 'CLOSED');
    }
    
    return checks.find(c => c.tableId === tableId && c.status !== 'CLOSED');
  }, [checks, mergedTableGroups]);

  const getCheckById = useCallback((checkId: string) => {
    return checks.find(c => c.id === checkId);
  }, [checks]);

  const getItemsByCheck = useCallback((checkId: string) => {
    return items.filter(item => item.checkId === checkId);
  }, [items]);

  const getKOTsByCheck = useCallback((checkId: string) => {
    return kots.filter(ticket => ticket.checkId === checkId);
  }, [kots]);

  const addPayment = useCallback((checkId: string, method: PaymentMethod, amount: number) => {
    const newPayment: Payment = {
      id: `payment-${Date.now()}`,
      checkId,
      method,
      amount,
      createdAt: new Date(),
    };
    setPayments(prev => [...prev, newPayment]);
    
    // Update check - DO NOT auto-close when fully paid, only update paidAmount and status
    setChecks(prev => prev.map(check => {
      if (check.id === checkId) {
        const newPaidAmount = check.paidAmount + amount;
        // Keep as PARTIALLY_PAID even when fully paid - only set to CLOSED when Release Table is clicked
        const newStatus: CheckStatus = 
          newPaidAmount > 0 ? 'PARTIALLY_PAID' : 'OPEN';
        return {
          ...check,
          paidAmount: newPaidAmount,
          status: newStatus,
        };
      }
      return check;
    }));
  }, []);

  const completePayment = useCallback((checkId: string, payments: any[], combinedBillIds?: string[]) => {
    const check = checks.find(c => c.id === checkId);
    if (!check) return;
    
    // Create payments with the amounts specified
    const newPayments: Payment[] = payments.map((method, index) => ({
      id: `payment-${Date.now()}-${index}`,
      checkId,
      method,
      amount: method.amount,
      createdAt: new Date(),
    }));
    
    setPayments(prev => [...prev, ...newPayments]);
    
    // Calculate total paid amount
    const totalPaid = newPayments.reduce((sum, p) => sum + p.amount, 0);
    
    // Get items from current check and all combined bills to calculate total
    const allCombinedCheckIds = [checkId, ...(combinedBillIds || [])];
    const allCombinedItems = allCombinedCheckIds.flatMap(id => 
      items.filter(item => item.checkId === id && ['SENT', 'IN_PREP', 'READY', 'SERVED'].includes(item.status))
    );
    
    // Calculate combined total with discounts, service charge, and tax
    const combinedSubtotal = allCombinedItems.reduce((sum, item) => {
      const itemPrice = getItemPrice(item);
      return sum + (itemPrice * item.quantity);
    }, 0);
    
    // Apply bill discount from the main check
    let billDiscountAmount = 0;
    if (check.billDiscountType && check.billDiscountValue) {
      if (check.billDiscountType === 'PERCENTAGE') {
        billDiscountAmount = combinedSubtotal * (check.billDiscountValue / 100);
      } else {
        billDiscountAmount = Math.min(check.billDiscountValue, combinedSubtotal);
      }
    }
    
    const subtotalAfterDiscount = combinedSubtotal - billDiscountAmount;
    const serviceCharge = subtotalAfterDiscount * 0.1; // 10%
    const tax = subtotalAfterDiscount * 0.05; // 5%
    const grandTotal = subtotalAfterDiscount + serviceCharge + tax;
    
    // Check if payment is complete (fully paid)
    const isFullyPaid = totalPaid >= grandTotal;
    const now = new Date();

    setChecks(prev => prev.map(checkItem => {
      if (checkItem.id === checkId) {
        const newPaidAmount = checkItem.paidAmount + totalPaid;
        if (isFullyPaid) {
          // Auto-close and generate Transaction ID when bill is fully paid
          return {
            ...checkItem,
            paidAmount: newPaidAmount,
            status: 'CLOSED' as CheckStatus,
            transactionId: checkItem.transactionId || generateTransactionId(),
            closedAt: checkItem.closedAt || now,
          };
        }
        return {
          ...checkItem,
          paidAmount: newPaidAmount,
          status: 'PARTIALLY_PAID' as CheckStatus,
        };
      }
      
      // If fully paid and this is a combined bill, mark it as CLOSED with its own transaction ID
      if (isFullyPaid && combinedBillIds && combinedBillIds.includes(checkItem.id)) {
        return {
          ...checkItem,
          status: 'CLOSED' as CheckStatus,
          transactionId: checkItem.transactionId || generateTransactionId(),
          closedAt: checkItem.closedAt || now,
        };
      }
      
      return checkItem;
    }));
  }, [checks, items]);

  const closeCheck = useCallback((checkId: string) => {
    const now = new Date();
    setChecks(prev => prev.map(check => {
      if (check.id === checkId) {
        return {
          ...check,
          status: 'CLOSED' as CheckStatus,
          // Generate transactionId if not already set (e.g. voided / complimentary checks)
          transactionId: check.transactionId || generateTransactionId(),
          closedAt: check.closedAt || now,
        };
      }
      return check;
    }));
  }, []);

  const deleteCheck = useCallback((checkId: string) => {
    setChecks(prev => prev.filter(check => check.id !== checkId));
  }, []);

  const getSplitBillByCheck = useCallback((checkId: string) => {
    return splitBills.find(splitBill => splitBill.checkId === checkId);
  }, [splitBills]);

  const saveSplitBill = useCallback((checkId: string, splits: SplitGroup[], allocations: Record<string, Record<string, number>>) => {
    // Check if split bill already exists for this check
    const existingIndex = splitBills.findIndex(sb => sb.checkId === checkId);
    
    if (existingIndex !== -1) {
      // Update existing split bill - merge splits to preserve payment data
      setSplitBills(prev => prev.map((sb, idx) => {
        if (idx === existingIndex) {
          // Merge splits: preserve paidAmount, paidAt from existing splits
          const mergedSplits = splits.map(newSplit => {
            const existingSplit = sb.splits.find(es => es.id === newSplit.id);
            if (existingSplit && existingSplit.paid) {
              // Preserve payment data from existing split
              return {
                ...newSplit,
                paid: existingSplit.paid,
                paidAmount: existingSplit.paidAmount,
                paidAt: existingSplit.paidAt,
              };
            }
            return newSplit;
          });
          return { ...sb, splits: mergedSplits, allocations };
        }
        return sb;
      }));
    } else {
      // Create new split bill
      const newSplitBill: SplitBill = {
        id: `splitBill-${Date.now()}`,
        checkId,
        splits,
        allocations,
        createdAt: new Date(),
      };
      setSplitBills(prev => [...prev, newSplitBill]);
    }
  }, [splitBills]);

  const paySplit = useCallback((checkId: string, splitId: string, paymentMethods: Array<{ type: string; amount: number }>, billId?: string) => {
    let allSplitsPaid = false;

    // Update the split bill with paid split and check if all are done
    setSplitBills(prev => {
      const updated = prev.map(sb => {
        if (sb.checkId === checkId) {
          const updatedSplits = sb.splits.map(split => 
            split.id === splitId 
              ? { ...split, paid: true, paidAmount: paymentMethods.reduce((sum, p) => sum + p.amount, 0), paidAt: new Date(), billId: billId || generateTransactionId(), paymentMethods }
              : split
          );
          allSplitsPaid = updatedSplits.every(s => s.paid);
          return { ...sb, splits: updatedSplits };
        }
        return sb;
      });
      return updated;
    });
    
    // Update check paidAmount and auto-close when all splits are settled
    const now = new Date();
    setChecks(prev => prev.map(check => {
      if (check.id === checkId) {
        const newPaidAmount = (check.paidAmount || 0) + paymentMethods.reduce((sum, p) => sum + p.amount, 0);
        if (allSplitsPaid) {
          return {
            ...check,
            paidAmount: newPaidAmount,
            status: 'CLOSED' as CheckStatus,
            transactionId: check.transactionId || generateTransactionId(),
            closedAt: check.closedAt || now,
          };
        }
        return {
          ...check,
          paidAmount: newPaidAmount,
          status: 'PARTIALLY_PAID' as CheckStatus,
        };
      }
      return check;
    }));
  }, []);

  const voidSplit = useCallback((checkId: string, splitId: string) => {
    // Capture voided amount before mutating state, then update both in one pass
    setSplitBills(prev => {
      const targetSb = prev.find(sb => sb.checkId === checkId);
      const voidedAmount = targetSb?.splits.find(s => s.id === splitId)?.paidAmount ?? 0;

      // Adjust check's paidAmount and status now that we have the voided amount
      setChecks(prevChecks => prevChecks.map(check => {
        if (check.id !== checkId) return check;
        const newPaidAmount = Math.max(0, (check.paidAmount || 0) - voidedAmount);
        const newStatus: CheckStatus = newPaidAmount > 0 ? 'PARTIALLY_PAID' : 'OPEN';
        return { ...check, paidAmount: newPaidAmount, status: newStatus };
      }));

      // Revert the split's paid state
      return prev.map(sb => {
        if (sb.checkId !== checkId) return sb;
        return {
          ...sb,
          splits: sb.splits.map(split =>
            split.id === splitId
              ? { ...split, paid: false, paidAmount: 0, paidAt: undefined }
              : split
          ),
        };
      });
    });
  }, []);

  const getCoursesByCheck = useCallback((checkId: string) => {
    return courses.filter(course => course.checkId === checkId);
  }, [courses]);

  const createCourse = useCallback((checkId: string, name: string, number: number) => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      checkId,
      name,
      number,
      order: number,
      state: 'DRAFT',
    };
    setCourses(prev => [...prev, newCourse]);
    return newCourse.id;
  }, []);

  const updateCourse = useCallback((id: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(course => 
      course.id === id ? { ...course, ...updates } : course
    ));
  }, []);

  const deleteCourse = useCallback((id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
  }, []);

  const reorderCourses = useCallback((checkId: string, orderedIds: string[]) => {
    setCourses(prev => prev.map(course => {
      const newOrder = orderedIds.indexOf(course.id) + 1;
      if (newOrder !== undefined) {
        return {
          ...course,
          order: newOrder,
        };
      }
      return course;
    }));
  }, []);

  const mergeTables = useCallback((primaryTableId: string, tableIds: string[]) => {
    const primaryTable = TABLES.find(t => t.id === primaryTableId);
    if (!primaryTable) return;
    
    // Get the primary table's check
    const primaryCheck = checks.find(c => c.tableId === primaryTableId && c.status !== 'CLOSED');
    if (!primaryCheck) return;
    
    // Get all checks from the tables being merged
    const tablesToMerge = tableIds;
    const checksToMerge = checks.filter(c => 
      tablesToMerge.includes(c.tableId) && c.status !== 'CLOSED'
    );
    
    // Combine all items from merged checks into the primary check
    const itemsToMove = items.filter(item => 
      checksToMerge.some(check => check.id === item.checkId)
    );
    
    // Update all items to belong to the primary check
    setItems(prev => prev.map(item => {
      if (itemsToMove.some(i => i.id === item.id)) {
        return { ...item, checkId: primaryCheck.id };
      }
      return item;
    }));
    
    // Update KOTs to belong to the primary check
    const kotsToMove = kots.filter(kot => 
      checksToMerge.some(check => check.id === kot.checkId)
    );
    
    setKots(prev => prev.map(kot => {
      if (kotsToMove.some(k => k.id === kot.id)) {
        return { ...kot, checkId: primaryCheck.id };
      }
      return kot;
    }));
    
    // Calculate combined totals
    const combinedGuestCount = [primaryCheck, ...checksToMerge].reduce((sum, check) => sum + (check.guestCount || 0), 0);
    const combinedTotal = [primaryCheck, ...checksToMerge].reduce((sum, check) => sum + check.totalAmount, 0);
    const combinedPaidAmount = [primaryCheck, ...checksToMerge].reduce((sum, check) => sum + check.paidAmount, 0);
    const combinedMinPurchaseAmount = [primaryCheck, ...checksToMerge].reduce((sum, check) => sum + (check.minPurchaseAmount || 0), 0);
    const earliestSeatedAt = [primaryCheck, ...checksToMerge]
      .map(c => c.seatedAt)
      .filter((date): date is Date => date !== undefined)
      .sort((a, b) => a.getTime() - b.getTime())[0];
    
    // Generate combined bill number - count existing merged groups + 1
    const combCount = mergedTableGroups.length + 1;
    const combinedBillNumber = `Comb#${String(combCount).padStart(4, '0')}`;
    
    // Update primary check with combined data
    setChecks(prev => prev.map(check => {
      if (check.id === primaryCheck.id) {
        return {
          ...check,
          billNumber: combinedBillNumber,
          guestCount: combinedGuestCount,
          totalAmount: combinedTotal,
          paidAmount: combinedPaidAmount,
          minPurchaseAmount: combinedMinPurchaseAmount,
          seatedAt: earliestSeatedAt,
        };
      }
      // Close the other checks
      if (checksToMerge.some(c => c.id === check.id)) {
        return {
          ...check,
          status: 'CLOSED' as CheckStatus,
        };
      }
      return check;
    }));
    
    // Create the merged table group
    const mergedTableGroup: MergedTableGroup = {
      id: `mergedTableGroup-${Date.now()}`,
      primaryTableId,
      tableIds: [primaryTableId, ...tableIds],
      checkId: primaryCheck.id,
      createdAt: new Date(),
    };
    
    setMergedTableGroups(prev => [...prev, mergedTableGroup]);
  }, [checks, items, kots, mergedTableGroups]);

  const getMergedTableGroup = useCallback((tableId: string) => {
    return mergedTableGroups.find(group => group.tableIds.includes(tableId));
  }, [mergedTableGroups]);

  const isMergedTable = useCallback((tableId: string) => {
    return !!mergedTableGroups.find(group => group.tableIds.includes(tableId));
  }, [mergedTableGroups]);

  // Cashier management
  // Updated: PIN validation removed - handled at login only
  const openCashier = useCallback((pin: string, openingBalance: number) => {
    setCashierOpen(true);
    setCashierBalance(openingBalance);
  }, []);

  const closeCashier = useCallback((closingBalance: number) => {
    // Move all CLOSED checks to history with closedAt timestamp
    const closedChecksToArchive = checks.filter(c => c.status === 'CLOSED');
    
    if (closedChecksToArchive.length > 0) {
      const archivedChecks = closedChecksToArchive.map(check => ({
        ...check,
        closedAt: new Date(),
      }));
      
      // Add to history
      setCheckHistory(prev => [...prev, ...archivedChecks]);
      
      // Remove from active checks
      setChecks(prev => prev.filter(c => c.status !== 'CLOSED'));
    }
    
    setCashierOpen(false);
    setCashierBalance(closingBalance);
  }, [checks]);

  const value: RestaurantContextType = useMemo(() => ({
    currentRole,
    posProfile,
    setPosProfile,
    checks,
    checkHistory,
    items,
    kots,
    courses,
    payments,
    splitBills,
    mergedTableGroups,
    cashierOpen,
    cashierBalance,
    setCurrentRole,
    openCashier,
    closeCashier,
    createCheck,
    updateCheck,
    voidCheck,
    addItems,
    updateItem,
    updateMultipleItems,
    createKOT,
    updateKOT,
    getTableState,
    getCheckByTable,
    getCheckById,
    getItemsByCheck,
    getKOTsByCheck,
    addPayment,
    completePayment,
    deleteItem,
    closeCheck,
    deleteCheck,
    getSplitBillByCheck,
    saveSplitBill,
    paySplit,
    voidSplit,
    getCoursesByCheck,
    createCourse,
    updateCourse,
    deleteCourse,
    reorderCourses,
    mergeTables,
    getMergedTableGroup,
    isMergedTable,
  }), [
    currentRole,
    posProfile,
    setPosProfile,
    checks,
    checkHistory,
    items,
    kots,
    courses,
    payments,
    splitBills,
    mergedTableGroups,
    cashierOpen,
    cashierBalance,
    setCurrentRole,
    openCashier,
    closeCashier,
    createCheck,
    updateCheck,
    voidCheck,
    addItems,
    updateItem,
    updateMultipleItems,
    createKOT,
    updateKOT,
    getTableState,
    getCheckByTable,
    getCheckById,
    getItemsByCheck,
    getKOTsByCheck,
    addPayment,
    completePayment,
    deleteItem,
    closeCheck,
    deleteCheck,
    getSplitBillByCheck,
    saveSplitBill,
    paySplit,
    voidSplit,
    getCoursesByCheck,
    createCourse,
    updateCourse,
    deleteCourse,
    reorderCourses,
    mergeTables,
    getMergedTableGroup,
    isMergedTable,
  ]);

  return (
    <RestaurantContext.Provider value={value}>
      {children}
    </RestaurantContext.Provider>
  );
}

RestaurantProvider.displayName = 'RestaurantProvider';

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within RestaurantProvider');
  }
  return context;
}