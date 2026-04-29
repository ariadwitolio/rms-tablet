import { X } from 'lucide-react';
import { Check as CheckIcon, StickyNote } from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters';
import { MainBtn } from '../ui/MainBtn';
import { StatusTag } from '../ui/StatusTag';
import type { Check, Item, Payment } from '../../types';
import { TABLES } from '../../data/mockData';

// Helper function to calculate discounted price
function getItemPrice(item: Item): number {
  if (item.isComplimentary) return 0;
  if (item.isVoided) return 0;
  if (!item.discountType || !item.discountValue) return item.price;
  
  if (item.discountType === 'PERCENTAGE') {
    return item.price * (1 - item.discountValue / 100);
  } else {
    return Math.max(0, item.price - item.discountValue);
  }
}

interface PaymentSuccessModalProps {
  check: Check;
  items: Item[];
  payments: Payment[];
  onClose: () => void;
  onPrintReceipt?: () => void;
}

const SERVICE_TYPE_LABEL: Record<string, string> = {
  DINE_IN: 'Dine-In',
  TAKEAWAY: 'Takeaway',
  DELIVERY: 'Delivery',
  SCHEDULED_ORDER: 'Scheduled',
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  CASH: 'Cash',
  DEBIT: 'Debit Card',
  CREDIT: 'Credit Card',
  QRIS: 'QRIS',
  EWALLET: 'E-Wallet',
};

const SERVICE_MAP: Record<string, { bg: string; color: string; label: string }> = {
  DINE_IN:         { bg: 'var(--feature-brand-containerlighter)', color: 'var(--feature-brand-primary)',  label: 'Dine-In'   },
  TAKEAWAY:        { bg: 'rgba(139,92,246,0.10)',                 color: '#7C3AED',                       label: 'Takeaway'  },
  DELIVERY:        { bg: 'rgba(234,88,12,0.10)',                  color: '#EA580C',                       label: 'Delivery'  },
  SCHEDULED_ORDER: { bg: 'var(--status-green-container)',         color: 'var(--status-green-primary)',   label: 'Scheduled' },
};

export default function PaymentSuccessModal({
  check,
  items,
  payments,
  onClose,
  onPrintReceipt,
}: PaymentSuccessModalProps) {
  // Calculate totals
  const billableItems = items.filter(item =>
    ['SENT', 'IN_PREP', 'READY', 'SERVED'].includes(item.status)
  );
  
  const subtotal = billableItems.reduce((sum, item) => sum + (getItemPrice(item) * item.quantity), 0);
  
  let billDiscount = 0;
  if (check.billDiscountType && check.billDiscountValue) {
    if (check.billDiscountType === 'PERCENTAGE') {
      billDiscount = subtotal * (check.billDiscountValue / 100);
    } else {
      billDiscount = Math.min(check.billDiscountValue, subtotal);
    }
  }
  
  const afterDiscount = subtotal - billDiscount;
  const serviceCharge = afterDiscount * 0.10;
  const tax = afterDiscount * 0.05;
  const total = afterDiscount + serviceCharge + tax + (check.tipAmount || 0);
  
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  
  // Get table name
  const tableInfo = check.tableId ? TABLES.find(t => t.id === check.tableId) : undefined;
  const tableName = tableInfo?.name || '';
  
  // Format payment method display
  const paymentMethodDisplay = payments.length === 1
    ? PAYMENT_METHOD_LABEL[payments[0].method] || payments[0].method
    : `${payments.length} Payment Methods`;
  
  // Get timestamp
  const paidDate = check.closedAt || new Date();
  const formattedDate = formatDate(paidDate);
  const formattedTime = formatTime(paidDate);
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div 
        className="bg-white rounded-[16px] p-[40px] flex gap-[40px] relative"
        style={{ maxWidth: '90vw', height: '680px', maxHeight: '680px' }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-[40px] top-[40px] w-[24px] h-[24px] flex items-center justify-center hover:opacity-70 transition-opacity z-10"
          aria-label="Close"
        >
          <X size={24} style={{ color: 'var(--neutral-onsurface-primary)' }} />
        </button>

        {/* Left Side - Receipt Preview */}
        <div className="flex flex-col items-center shrink-0 w-[335px] h-full relative">
          {/* Scrollable receipt area with fixed height */}
          <div className="flex flex-col items-center w-full overflow-y-auto" style={{ maxHeight: '551px' }}>
          {/* Top wavy border */}
          <div className="h-[6.619px] mb-[-1px] relative shrink-0 w-full">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 336 8.30603">
              <path
                clipRule="evenodd"
                d="M0.5 1.18674L5.28571 5.85799L10.0714 1.18674L14.8571 5.85799L19.6429 1.18674L24.4286 5.85799L29.2143 1.18674L34 5.85799L38.7857 1.18674L43.5714 5.85799L48.3571 1.18674L53.1429 5.85799L57.9286 1.18674L62.7143 5.85799L67.5 1.18674L72.2857 5.85799L77.0714 1.18674L81.8571 5.85799L86.6429 1.18674L91.4286 5.85799L96.2143 1.18674L101 5.85799L105.786 1.18674L110.571 5.85799L115.357 1.18674L120.143 5.85799L124.929 1.18674L129.714 5.85799L134.5 1.18674L139.286 5.85799L144.071 1.18674L148.857 5.85799L153.643 1.18674L158.429 5.85799L163.214 1.18674L168 5.85799L172.786 1.18674L177.571 5.85799L182.357 1.18674L187.143 5.85799L191.929 1.18674L196.714 5.85799L201.5 1.18674L206.286 5.85799L211.071 1.18674L215.857 5.85799L220.643 1.18674L225.429 5.85799L230.214 1.18674L235 5.85799L239.786 1.18674L244.571 5.85799L249.357 1.18674L254.143 5.85799L258.929 1.18674L263.714 5.85799L268.5 1.18674L273.286 5.85799L278.071 1.18674L282.857 5.85799L287.643 1.18674L292.429 5.85799L297.214 1.18674L302 5.85799L306.786 1.18674L311.571 5.85799L316.357 1.18674L321.143 5.85799L325.929 1.18674L330.714 5.85799L335.5 1.18674V7.80603H0.5V1.18674Z"
                fill="white"
                fillRule="evenodd"
                stroke="var(--neutral-line-outline)"
              />
            </svg>
          </div>

          {/* Receipt Body */}
          <div className="bg-white mb-[-1px] relative shrink-0 w-full border-l border-r" style={{ borderColor: 'var(--neutral-line-outline)' }}>
            <div className="flex flex-col items-center size-full">
              <div className="flex flex-col gap-[10px] items-center px-[16px] py-[24px] relative w-full">
                {/* Restaurant Info */}
                <div className="flex flex-col items-center gap-[8px] w-full">
                  {/* Logo */}
                  <div 
                    className="relative rounded-full shrink-0 size-[32px] flex items-center justify-center"
                    style={{ backgroundColor: 'var(--neutral-surface-secondary)' }}
                  >
                    <div 
                      className="rounded-full flex items-center justify-center"
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: 'var(--feature-brand-primary)',
                        color: 'white',
                        fontSize: 'var(--text-label)',
                        fontWeight: 'var(--font-weight-bold)',
                      }}
                    >
                      L
                    </div>
                  </div>

                  {/* Restaurant Name & Address */}
                  <div className="flex flex-col items-center text-center">
                    <p style={{
                      fontSize: 'var(--text-p)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--neutral-onsurface-primary)',
                    }}>
                      Labamu Cafe
                    </p>
                    <p style={{
                      fontSize: 'var(--text-p)',
                      fontWeight: 'var(--font-weight-regular)',
                      color: 'var(--neutral-onsurface-primary)',
                    }}>
                      The Icon Business Park blok M1 M2
                    </p>
                    <p style={{
                      fontSize: 'var(--text-p)',
                      fontWeight: 'var(--font-weight-regular)',
                      color: 'var(--neutral-onsurface-primary)',
                    }}>
                      +6221123456789
                    </p>
                  </div>
                </div>

                {/* Transaction Details */}
                <div className="flex flex-col gap-[12px] w-full">
                  <div className="flex flex-col gap-[4px] w-full" style={{
                    fontSize: 'var(--text-p)',
                    fontWeight: 'var(--font-weight-regular)',
                  }}>
                    <div className="flex gap-[20px] items-start justify-between w-full">
                      <p style={{ color: 'var(--neutral-onsurface-tertiary)' }}>Time</p>
                      <p style={{ color: 'var(--neutral-onsurface-primary)', textAlign: 'right' }}>
                        {formattedDate}, {formattedTime}
                      </p>
                    </div>
                    <div className="flex gap-[20px] items-start justify-between w-full">
                      <p style={{ color: 'var(--neutral-onsurface-tertiary)', whiteSpace: 'nowrap' }}>Txn Labamu</p>
                      <p style={{ color: 'var(--neutral-onsurface-primary)', textAlign: 'right' }}>
                        {check.transactionId || `#Transaction${check.billNumber}`}
                      </p>
                    </div>
                    {/* StatusTags for Service Type and Payment Status */}
                    
                    {check.guestName && (
                      <div className="flex gap-[20px] items-start justify-between w-full">
                        <p style={{ color: 'var(--neutral-onsurface-tertiary)' }}>Customer</p>
                        <p style={{ color: 'var(--neutral-onsurface-primary)', textAlign: 'right' }}>
                          {check.guestName}
                        </p>
                      </div>
                    )}
                    {check.guestPhone && (
                      <div className="flex gap-[20px] items-start justify-between w-full">
                        <p style={{ color: 'var(--neutral-onsurface-tertiary)', whiteSpace: 'nowrap' }}>Customer No</p>
                        <p style={{ color: 'var(--neutral-onsurface-primary)', textAlign: 'right' }}>
                          {check.guestPhone}
                        </p>
                      </div>
                    )}
                    <div className="flex gap-[20px] items-start justify-between w-full">
                      <p style={{ color: 'var(--neutral-onsurface-tertiary)' }}>Made By</p>
                      <p style={{ color: 'var(--neutral-onsurface-primary)', textAlign: 'right' }}>Staff</p>
                    </div>
                  </div>

                  {/* Transaction Note - Only show if checkNote exists */}
                  {check.checkNote && (
                    <>
                      <div className="h-[1px] w-full" style={{ backgroundColor: 'var(--neutral-line-outline)' }} />
                      <div className="flex flex-col gap-[8px] items-center w-full">
                        <div className="flex gap-[4px] items-center">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path
                              d="M3.71111 13.0989V15.3389C3.71111 15.3389 3.72667 15.3778 3.75 15.3778H10.8511C11.6289 15.3778 12.2667 14.7478 12.2667 13.9622V2.01556C12.2667 1.23778 11.6367 0.6 10.8511 0.6H2.01556C1.23778 0.6 0.6 1.23 0.6 2.01556V12.2278C0.6 12.2278 0.615556 12.2667 0.638889 12.2667H2.87889C3.33778 12.2667 3.71111 12.64 3.71111 13.0989Z"
                              stroke="var(--neutral-onsurface-tertiary)"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeMiterlimit="10"
                              fill="none"
                            />
                            <path
                              d="M3.71111 7.79444H9.15556M3.71111 5.08001H9.15556M3.71111 10.5245H9.15556M3.71111 15.3778L0.6 12.2667"
                              stroke="var(--neutral-onsurface-tertiary)"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeMiterlimit="10"
                              fill="none"
                            />
                          </svg>
                          <p style={{
                            fontSize: 'var(--text-p)',
                            fontWeight: 'var(--font-weight-regular)',
                            color: 'var(--neutral-onsurface-tertiary)',
                          }}>
                            Transaction Note
                          </p>
                        </div>
                        <p style={{
                          fontSize: 'var(--text-p)',
                          fontWeight: 'var(--font-weight-regular)',
                          color: 'var(--neutral-onsurface-primary)',
                          textAlign: 'center',
                        }}>
                          {check.checkNote}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="h-[1px] w-full" style={{ backgroundColor: 'var(--neutral-line-outline)' }} />

                  {/* Items List - Show first 3 items */}
                  <div className="flex flex-col gap-[8px] w-full">
                    {billableItems.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex flex-col gap-[4px]">
                        <div className="flex items-start justify-between w-full">
                          <p style={{
                            fontSize: 'var(--text-p)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--neutral-onsurface-primary)',
                            flex: 1,
                          }}>
                            {item.name}
                          </p>
                        </div>
                        <div className="flex items-start justify-between w-full" style={{
                          fontSize: 'var(--text-p)',
                          fontWeight: 'var(--font-weight-regular)',
                          color: 'var(--neutral-onsurface-primary)',
                        }}>
                          <p>{item.quantity}x {formatCurrency(item.price)}</p>
                          <p>{formatCurrency(getItemPrice(item) * item.quantity)}</p>
                        </div>
                        {item.modifiers && item.modifiers.length > 0 && (
                          <div className="pl-[20px] flex flex-col gap-[2px]" style={{
                            fontSize: 'var(--text-p)',
                            fontWeight: 'var(--font-weight-regular)',
                            color: 'var(--neutral-onsurface-primary)',
                          }}>
                            {item.modifiers.slice(0, 2).map((modifier, modIndex) => (
                              <p key={modIndex}>+ {modifier}</p>
                            ))}
                          </div>
                        )}
                        {item.notes && (
                          <p style={{
                            fontSize: 'var(--text-p)',
                            fontWeight: 'var(--font-weight-regular)',
                            color: 'var(--neutral-onsurface-primary)',
                          }}>
                            *{item.notes}
                          </p>
                        )}
                      </div>
                    ))}
                    {billableItems.length > 3 && (
                      <p style={{
                        fontSize: 'var(--text-p)',
                        fontWeight: 'var(--font-weight-regular)',
                        color: 'var(--neutral-onsurface-tertiary)',
                        fontStyle: 'italic',
                      }}>
                        +{billableItems.length - 3} more items...
                      </p>
                    )}
                  </div>

                  <div className="h-[1px] w-full" style={{ backgroundColor: 'var(--neutral-line-outline)' }} />

                  {/* Summary */}
                  <div className="flex flex-col gap-[4px] w-full" style={{
                    fontSize: 'var(--text-p)',
                    fontWeight: 'var(--font-weight-regular)',
                  }}>
                    <div className="flex items-center justify-between w-full">
                      <p style={{ color: 'var(--neutral-onsurface-tertiary)' }}>Subtotal</p>
                      <p style={{ color: 'var(--neutral-onsurface-primary)' }}>{formatCurrency(subtotal)}</p>
                    </div>
                    {billDiscount > 0 && (
                      <div className="flex items-center justify-between w-full">
                        <p style={{ color: 'var(--neutral-onsurface-tertiary)' }}>
                          Discount ({check.billDiscountType === 'PERCENTAGE' ? `${check.billDiscountValue}%` : 'Amount'})
                        </p>
                        <p style={{ color: 'var(--neutral-onsurface-primary)' }}>-{formatCurrency(billDiscount)}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between w-full">
                      <p style={{ color: 'var(--neutral-onsurface-tertiary)' }}>Service Charge (10%)</p>
                      <p style={{ color: 'var(--neutral-onsurface-primary)' }}>{formatCurrency(serviceCharge)}</p>
                    </div>
                    <div className="flex items-center justify-between w-full">
                      <p style={{ color: 'var(--neutral-onsurface-tertiary)' }}>Tax (5%)</p>
                      <p style={{ color: 'var(--neutral-onsurface-primary)' }}>{formatCurrency(tax)}</p>
                    </div>
                    {check.tipAmount && check.tipAmount > 0 && (
                      <div className="flex items-center justify-between w-full">
                        <p style={{ color: 'var(--neutral-onsurface-tertiary)' }}>Tip</p>
                        <p style={{ color: 'var(--neutral-onsurface-primary)' }}>{formatCurrency(check.tipAmount)}</p>
                      </div>
                    )}
                  </div>

                  <div className="h-[1px] w-full" style={{ backgroundColor: 'var(--neutral-line-outline)' }} />

                  {/* Total and Payment */}
                  <div className="flex flex-col gap-[4px] w-full">
                    <div className="flex items-center justify-between w-full" style={{
                      fontSize: 'var(--text-p)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--neutral-onsurface-primary)',
                    }}>
                      <p>Total Order</p>
                      <p>{formatCurrency(total)}</p>
                    </div>
                    <div className="flex items-center justify-between w-full" style={{
                      fontSize: 'var(--text-p)',
                      fontWeight: 'var(--font-weight-regular)',
                    }}>
                      <p style={{ color: 'var(--neutral-onsurface-tertiary)' }}>Payment Method</p>
                      <p style={{ color: 'var(--neutral-onsurface-primary)' }}>{paymentMethodDisplay}</p>
                    </div>
                    <div className="flex items-center justify-between w-full" style={{
                      fontSize: 'var(--text-p)',
                      fontWeight: 'var(--font-weight-regular)',
                    }}>
                      <p style={{ color: 'var(--neutral-onsurface-tertiary)' }}>Paid</p>
                      <p style={{ color: 'var(--neutral-onsurface-primary)' }}>{formatCurrency(totalPaid)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom wavy border */}
          <div className="flex items-center justify-center mb-[-1px] relative shrink-0 w-full">
            <div className="-scale-y-100 flex-none w-full">
              <div className="h-[6.619px] relative w-full">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 336 8.30603">
                  <path
                    clipRule="evenodd"
                    d="M0.5 1.18674L5.28571 5.85799L10.0714 1.18674L14.8571 5.85799L19.6429 1.18674L24.4286 5.85799L29.2143 1.18674L34 5.85799L38.7857 1.18674L43.5714 5.85799L48.3571 1.18674L53.1429 5.85799L57.9286 1.18674L62.7143 5.85799L67.5 1.18674L72.2857 5.85799L77.0714 1.18674L81.8571 5.85799L86.6429 1.18674L91.4286 5.85799L96.2143 1.18674L101 5.85799L105.786 1.18674L110.571 5.85799L115.357 1.18674L120.143 5.85799L124.929 1.18674L129.714 5.85799L134.5 1.18674L139.286 5.85799L144.071 1.18674L148.857 5.85799L153.643 1.18674L158.429 5.85799L163.214 1.18674L168 5.85799L172.786 1.18674L177.571 5.85799L182.357 1.18674L187.143 5.85799L191.929 1.18674L196.714 5.85799L201.5 1.18674L206.286 5.85799L211.071 1.18674L215.857 5.85799L220.643 1.18674L225.429 5.85799L230.214 1.18674L235 5.85799L239.786 1.18674L244.571 5.85799L249.357 1.18674L254.143 5.85799L258.929 1.18674L263.714 5.85799L268.5 1.18674L273.286 5.85799L278.071 1.18674L282.857 5.85799L287.643 1.18674L292.429 5.85799L297.214 1.18674L302 5.85799L306.786 1.18674L311.571 5.85799L316.357 1.18674L321.143 5.85799L325.929 1.18674L330.714 5.85799L335.5 1.18674V7.80603H0.5V1.18674Z"
                    fill="white"
                    fillRule="evenodd"
                    stroke="var(--neutral-line-outline)"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Shadow */}
          <div className="absolute bottom-0 h-[16px] left-0 opacity-10 w-[335px] pointer-events-none" />
          </div>
          
          {/* Scrollbar Indicator - Positioned on the right */}
          <div className="absolute right-0 top-0 w-[4px] h-[230px] rounded-[10px]" style={{ backgroundColor: 'var(--neutral-surface-secondary)' }} />
        </div>

        {/* Right Side - Success Message */}
        <div className="flex flex-col justify-between w-[409px] h-full">
          {/* Top Content - Centered */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex flex-col gap-[24px] items-center w-full">
              {/* Success Icon */}
              <div className="flex flex-col gap-[8px] items-center justify-center w-full">
                <div className="relative shrink-0 size-[80px] flex items-center justify-center">
                  <div 
                    className="rounded-full flex items-center justify-center"
                    style={{
                      width: '80px',
                      height: '80px',
                      border: '3px solid var(--neutral-onsurface-primary)',
                    }}
                  >
                    <CheckIcon size={40} style={{ color: 'var(--neutral-onsurface-primary)' }} />
                  </div>
                </div>
                <p style={{
                  fontSize: 'var(--text-h3)',
                  fontWeight: 'var(--font-weight-regular)',
                  color: 'var(--neutral-onsurface-primary)',
                  textAlign: 'center',
                }}>
                  {paymentMethodDisplay} Payment Successful
                </p>
                <p style={{
                  fontSize: 'var(--text-h2)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--neutral-onsurface-primary)',
                  textAlign: 'center',
                }}>
                  {formatCurrency(totalPaid)}
                </p>
                <p style={{
                  fontSize: 'var(--text-p)',
                  fontWeight: 'var(--font-weight-regular)',
                  color: 'var(--neutral-onsurface-primary)',
                  textAlign: 'center',
                }}>
                  Paid on {formattedDate} ; {formattedTime}
                </p>
              </div>

              {/* Transaction Note - Only show if checkNote exists */}
              {check.checkNote && (
                <div 
                  className="rounded-[12px] border w-full p-[16px] flex flex-col gap-[8px]"
                  style={{ borderColor: 'var(--neutral-line-outline)' }}
                >
                  <div className="flex gap-[4px] items-center">
                    <StickyNote size={16} style={{ color: 'var(--neutral-onsurface-secondary)', flexShrink: 0 }} />
                    <p style={{
                      fontSize: 'var(--text-label)',
                      fontWeight: 'var(--font-weight-regular)',
                      color: 'var(--neutral-onsurface-secondary)',
                    }}>
                      Transaction Note
                    </p>
                  </div>
                  <div className="h-[1px] w-full" style={{ backgroundColor: 'var(--neutral-line-outline)' }} />
                  <p style={{
                    fontSize: 'var(--text-p)',
                    fontWeight: 'var(--font-weight-regular)',
                    color: 'var(--neutral-onsurface-primary)',
                    textAlign: 'left',
                  }}>
                    {check.checkNote}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-[12px] w-full shrink-0">
            <MainBtn
              size="lg"
              onClick={onPrintReceipt}
              className="w-full"
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Print Receipt
            </MainBtn>
            <MainBtn
              variant="secondary"
              size="lg"
              onClick={onClose}
              className="w-full"
              style={{ borderRadius: 'var(--radius-button)' }}
            >
              Close
            </MainBtn>
          </div>
        </div>
      </div>
    </div>
  );
}