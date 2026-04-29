import { formatCurrency } from '../../utils/formatters';
import { useRestaurant } from '../../context/RestaurantContext';
import type { SplitBill } from '../../types';

interface SplitBillCompactSectionProps {
  splitBill: SplitBill;
  onManage?: () => void;
}

// Helper function to calculate discounted price
function getItemPrice(item: any): number {
  if (item.isComplimentary) return 0;
  if (!item.discountType || !item.discountValue) return item.price;
  
  if (item.discountType === 'PERCENTAGE') {
    return item.price * (1 - item.discountValue / 100);
  } else {
    return Math.max(0, item.price - item.discountValue);
  }
}

export default function SplitBillCompactSection({ splitBill, onManage }: SplitBillCompactSectionProps) {
  const { getCheckById, getItemsByCheck } = useRestaurant();
  
  const check = getCheckById(splitBill.checkId);
  const allItems = getItemsByCheck(splitBill.checkId);
  
  // Safety check - don't render if no splits
  if (!splitBill.splits || splitBill.splits.length === 0) {
    return null;
  }
  
  // Only show billable items
  const billableItems = allItems.filter(item => 
    ['SENT', 'IN_PREP', 'READY', 'SERVED'].includes(item.status)
  );

  // Calculate subtotal using discounted item prices
  const subtotal = billableItems.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
  
  // Calculate bill discount
  let billDiscountAmount = 0;
  if (check?.billDiscountType && check?.billDiscountValue) {
    if (check.billDiscountType === 'PERCENTAGE') {
      billDiscountAmount = subtotal * (check.billDiscountValue / 100);
    } else {
      billDiscountAmount = Math.min(check.billDiscountValue, subtotal);
    }
  }
  
  // Calculate final amounts
  const subtotalAfterDiscount = subtotal - billDiscountAmount;
  const serviceCharge = subtotalAfterDiscount * 0.1; // 10%
  const tax = subtotalAfterDiscount * 0.05; // 5%
  const grandTotal = subtotalAfterDiscount + serviceCharge + tax;
  
  // Calculate totals
  const totalSplits = splitBill.splits.length;
  
  const totalPaidFromSplits = splitBill.splits
    .filter(s => s.paid && s.paidAmount)
    .reduce((sum, s) => sum + (s.paidAmount || 0), 0);
  
  const outstanding = grandTotal - totalPaidFromSplits;

  return (
    null
  );
}