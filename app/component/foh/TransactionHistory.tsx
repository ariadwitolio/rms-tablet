import { useState, useMemo } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatCurrency, formatTime, formatDate } from '../../utils/formatters';
import { EmptyState } from '../ui/EmptyState';
import { Chip } from '../ui/Chip';
import { MainBtn } from '../ui/MainBtn';
import { useSnackbar } from '../labamu/Snackbar';
import { StatusTag } from '../ui/StatusTag';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { TextField } from '../ui/TextField';
import {
  Receipt, X, CreditCard, Banknote, QrCode,
  AlertTriangle, Users, Ban, Archive, ChevronDown, StickyNote, Search,
} from 'lucide-react';
import type { Check, Item, Payment, SplitBill } from '../../types';
import { TABLES } from '../../data/mockData';
import React from 'react';
import { useVirtualInputContext } from '../../context/VirtualInputContext';

// ─── Tab definition ──────────────────────────────────────────────────────────
type TabKey = 'closed' | 'history';

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'closed',  label: 'Closed Bill', icon: Receipt },
  { key: 'history', label: 'History',        icon: Archive },
];

// ─── Helpers ──────────────────────────────────────────────────────────────
function getItemEffectivePrice(item: Item): number {
  if (item.isComplimentary) return 0;
  if (!item.discountType || !item.discountValue) return item.price;
  if (item.discountType === 'PERCENTAGE') return item.price * (1 - item.discountValue / 100);
  return Math.max(0, item.price - item.discountValue);
}

function paymentMethodLabel(method: string): string {
  if (method === 'CASH') return 'Cash';
  if (method === 'CARD') return 'Card';
  if (method === 'DEBIT') return 'Debit Card';
  if (method === 'CREDIT') return 'Credit Card';
  if (method === 'QRIS') return 'QRIS';
  if (method === 'EWALLET') return 'E-Wallet';
  return method;
}

/** Bare bill number — no "Bill" prefix */
function billRawId(check: Check): string {
  const raw = check.billNumber
    ?? (() => { const n = parseInt(check.id.slice(-6), 10) || 0; return n.toString().padStart(5, '0'); })();
  return raw.startsWith('Comb#') ? raw : `#${raw}`;
}

/** Resolve table display from TABLES data (T01, V01 format) */
function resolveTableDisplay(
  check: Check,
  getMergedTableGroup: (id: string) => any,
): string | null {
  if (!check.tableId) return null;
  const mergedGroup = getMergedTableGroup(check.tableId);
  if (mergedGroup) {
    return mergedGroup.tableIds
      .map((id: string) => TABLES.find(t => t.id === id)?.name || id)
      .join(', ');
  }
  return TABLES.find(t => t.id === check.tableId)?.name || check.tableId;
}

// ─── Badges ───────────────────────────────────────────────────────────────────
const SERVICE_MAP: Record<string, { bg: string; color: string; label: string }> = {
  DINE_IN:         { bg: 'var(--status-blue-container, #DBEAFE)',  color: 'var(--status-blue-primary, #2563EB)', label: 'Dine-In'   },
  TAKEAWAY:        { bg: 'rgba(139,92,246,0.10)',                  color: '#7C3AED',                             label: 'Takeaway'  },
  DELIVERY:        { bg: 'rgba(234,88,12,0.10)',                   color: '#EA580C',                             label: 'Delivery'  },
  SCHEDULED_ORDER: { bg: 'var(--status-green-container)',          color: 'var(--status-green-primary)',         label: 'Scheduled' },
};

const PAYMENT_STATUS_MAP: Record<string, { bg: string; color: string; label: string }> = {
  OPEN:           { bg: 'var(--neutral-surface-greylighter)', color: 'var(--neutral-onsurface-secondary)', label: 'Unpaid' },
  PARTIALLY_PAID: { bg: 'var(--status-yellow-container)',     color: 'var(--status-yellow-primary)',       label: 'Partially Paid' },
  CLOSED:         { bg: 'var(--status-green-container)',      color: 'var(--status-green-primary)',        label: 'Fully Paid' },
};

function getServiceBadgeConfig(type: string) {
  const s = SERVICE_MAP[type] ?? { bg: 'var(--neutral-surface-secondary)', color: 'var(--neutral-onsurface-secondary)', label: type };
  return { text: s.label, bgColor: s.bg, textColor: s.color };
}

function getPaymentStatusBadgeConfig(status: string) {
  const s = PAYMENT_STATUS_MAP[status] ?? { bg: 'var(--neutral-surface-greylighter)', color: 'var(--neutral-onsurface-secondary)', label: status };
  return { text: s.label, bgColor: s.bg, textColor: s.color };
}

function VoidedBadge() {
  return (
    <StatusTag
      text="VOID"
      bgColor="var(--status-red-container)"
      textColor="var(--status-red-primary)"
    />
  );
}

function PaymentMethodIcon({ method }: { method: string }) {
  const props = { style: { width: 16, height: 16, flexShrink: 0 } };
  if (method === 'CASH') return <Banknote {...props} />;
  if (method === 'CARD') return <CreditCard {...props} />;
  if (method === 'QRIS') return <QrCode {...props} />;
  return <CreditCard {...props} />;
}

// ─── Section card wrapper ────────────��───────────────────────────────────────
function SectionCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{
      backgroundColor: 'var(--neutral-surface-primary)',
      border: '1px solid var(--neutral-line-outline)',
      borderRadius: 'var(--radius-card)',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '10px 16px',
        borderBottom: '1px solid var(--neutral-line-outline)',
        backgroundColor: 'var(--neutral-surface-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        {icon && <span style={{ color: 'var(--neutral-onsurface-secondary)', display: 'flex', alignItems: 'center' }}>{icon}</span>}
        <span style={{
          fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)',
          fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)',
        }}>
          {title}
        </span>
      </div>
      <div style={{ padding: 16 }}>
        {children}
      </div>
    </div>
  );
}

// ─── Left list card ───────────────────────────────────────────────────────────
function ListCard({
  check, isSelected, isVoided, onClick, getMergedTableGroup,
}: {
  check: Check;
  isSelected: boolean;
  isVoided: boolean;
  onClick: () => void;
  getMergedTableGroup: (id: string) => any;
}) {
  const tableDisplay = resolveTableDisplay(check, getMergedTableGroup);
  const txId = check.transactionId;

  return (
    <button
      onClick={onClick}
      className="w-full text-left transition-colors block"
      style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--neutral-line-outline)',
        borderLeft: `3px solid ${isSelected ? 'var(--feature-brand-primary)' : isVoided ? 'var(--status-red-primary)' : 'transparent'}`,
        backgroundColor: isSelected ? 'var(--feature-brand-containerlighter)' : isVoided ? 'var(--status-red-container)' : 'transparent',
        cursor: 'pointer',
        opacity: isVoided ? 0.8 : 1,
      }}
      onMouseEnter={e => { 
        if (!isSelected && !isVoided) e.currentTarget.style.backgroundColor = 'var(--neutral-surface-greylighter)'; 
        if (!isSelected && isVoided) e.currentTarget.style.backgroundColor = 'var(--status-red-container)';
      }}
      onMouseLeave={e => { 
        if (!isSelected && !isVoided) e.currentTarget.style.backgroundColor = 'transparent'; 
        if (!isSelected && isVoided) e.currentTarget.style.backgroundColor = 'var(--status-red-container)';
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          {/* Transaction ID — primary identifier */}
          <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 3 }}>
            <span style={{
              fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'Lato, sans-serif',
              color: isVoided ? 'var(--neutral-onsurface-tertiary)' : 'var(--neutral-onsurface-primary)',
              textDecoration: isVoided ? 'line-through' : 'none',
              letterSpacing: '0.01em',
            }}>
              {txId ?? `Order ${billRawId(check)}`}
            </span>
          </div>

          {/* Order ID — shown as secondary label only when Bill ID is the primary */}
          {txId && (
            <p style={{
              fontSize: 'var(--text-h4)', fontFamily: 'Lato, sans-serif',
              color: 'var(--neutral-onsurface-tertiary)',
              marginBottom: 3,
            }}>
              Order {billRawId(check)}
            </p>
          )}

          {/* Date + time */}
          <p style={{
            fontSize: 'var(--text-h4)', fontFamily: 'Lato, sans-serif',
            color: 'var(--neutral-onsurface-tertiary)',
          }}>
            {formatDate(check.closedAt ?? check.createdAt)} · {formatTime(check.closedAt ?? check.createdAt)}
          </p>

          {/* Table / guest */}
          {(tableDisplay || check.guestName) && (
            <p style={{
              fontSize: 'var(--text-h4)', fontFamily: 'Lato, sans-serif',
              color: 'var(--neutral-onsurface-secondary)', marginTop: 2,
            }}>
              {tableDisplay && check.guestName ? `${tableDisplay} · ${check.guestName}` : tableDisplay || check.guestName}
            </p>
          )}
        </div>

        {/* Dine-type badge + Payment Status + total + VOID tag */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-1">
            <StatusTag {...getServiceBadgeConfig(check.serviceType)} />
            <StatusTag {...getPaymentStatusBadgeConfig(check.status)} />
          </div>
          <span style={{
            fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'Lato, sans-serif',
            color: 'var(--neutral-onsurface-primary)',
          }}>
            {formatCurrency(check.totalAmount * 1.1)}
          </span>
          {isVoided && <VoidedBadge />}
        </div>
      </div>
    </button>
  );
}

// ─── Info cell ──────────���─────────────────────────────────────────────────────
function InfoCell({ label, value, badge }: { label: string; value?: string; badge?: React.ReactNode }) {
  return (
    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{
        fontSize: 'var(--text-h4)', fontFamily: 'Lato, sans-serif',
        color: 'var(--neutral-onsurface-tertiary)', letterSpacing: '0.007em',
      }}>
        {label}
      </span>
      {badge ?? (
        <span style={{
          fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif',
          color: value === '-' ? 'var(--neutral-onsurface-tertiary)' : 'var(--neutral-onsurface-primary)',
          letterSpacing: '0.007em',
        }}>
          {value}
        </span>
      )}
    </div>
  );
}

// ─── Detail panel ─────────────────────────────────────────────────────────────
function DetailPanel({
  check, items, checkPayments, splitBill, isVoided, getMergedTableGroup, onClose, onVoid,
  isPaymentExpanded, onTogglePayment,
}: {
  check: Check;
  items: Item[];
  checkPayments: Payment[];
  splitBill: SplitBill | undefined;
  isVoided: boolean;
  getMergedTableGroup: (id: string) => any;
  onClose: () => void;
  onVoid: () => void;
  isPaymentExpanded: boolean;
  onTogglePayment: () => void;
}) {
  const tableDisplay = resolveTableDisplay(check, getMergedTableGroup);

  // ── Totals ──
  const activeItems  = items.filter(i => !['VOIDED', 'DRAFT', 'HELD'].includes(i.status));
  const voidedItems  = items.filter(i => i.status === 'VOIDED');
  const subtotal     = activeItems.reduce((s, i) => s + getItemEffectivePrice(i) * i.quantity, 0);
  let   billDiscount = 0;
  if (check.billDiscountType && check.billDiscountValue) {
    billDiscount = check.billDiscountType === 'PERCENTAGE'
      ? subtotal * (check.billDiscountValue / 100)
      : Math.min(check.billDiscountValue, subtotal);
  }
  const afterDiscount  = subtotal - billDiscount;
  const serviceCharge  = afterDiscount * 0.10;
  const tax            = afterDiscount * 0.05;
  const total          = afterDiscount + serviceCharge + tax + (check.tipAmount ?? 0);
  const totalPaid      = checkPayments.reduce((s, p) => s + p.amount, 0);
  const change         = Math.max(0, totalPaid - total);

  // Group payments by method
  const payByMethod: Record<string, number> = {};
  checkPayments.forEach(p => { payByMethod[p.method] = (payByMethod[p.method] ?? 0) + p.amount; });

  // Split amounts per group
  const splitAmounts: Record<string, number> = {};
  if (splitBill) {
    splitBill.splits.forEach(split => {
      const raw = activeItems.reduce((sum, item) => {
        const pct = splitBill.allocations[item.id]?.[split.id] ?? 0;
        return sum + getItemEffectivePrice(item) * item.quantity * pct / 100;
      }, 0);
      const prop = subtotal > 0 ? raw / subtotal : 0;
      splitAmounts[split.id] = raw + (serviceCharge + tax) * prop;
    });
  }

  const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
  const labelStyle = { fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-secondary)' as const };
  const valueStyle = { fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)' as const };

  const closedAt = check.closedAt;

  // ── Table / order number cell ──
  const tableLabel =
    check.serviceType === 'TAKEAWAY' ? 'Takeaway Number' :
    check.serviceType === 'DELIVERY' ? 'Delivery Number' :
    'Table Number';

  const displayBillNumber = check.billNumber
    ? check.billNumber
    : String(parseInt(check.id.slice(-6), 10) || 0).padStart(5, '0');

  const tableValue =
    check.serviceType === 'DINE_IN'
      ? (tableDisplay || '-')
      : (displayBillNumber || '-');

  const billIdDisplay = `#${displayBillNumber}`;
  const transactionIdDisplay = check.transactionId ?? '-';

  return (
    <div className="h-full flex flex-col">

      {/* ── Sticky header ── */}
      <div
        className="shrink-0"
        style={{
          padding: '20px',
          backgroundColor: 'var(--neutral-surface-primary)',
          borderBottom: '1px solid var(--neutral-line-outline)',
        }}
      >
        {/* Row 1: TXN ID + date/time | Void button */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', gap: 16, marginBottom: 24,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)',
                fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)',
                letterSpacing: '0.01em', lineHeight: 1.3,
              }}>
                {check.transactionId || 'N/A'}
              </span>
              {isVoided && <VoidedBadge />}
            </div>
            <span style={{
              fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif',
              color: 'var(--neutral-onsurface-tertiary)',
            }}>
              {closedAt
                ? `${formatDate(closedAt)} · ${formatTime(closedAt)}`
                : formatDate(check.createdAt)}
            </span>
          </div>

          {!isVoided && (
            <button
              onClick={onVoid}
              style={{
                flexShrink: 0,
                height: 50,
                padding: '0 24px',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--status-red-primary)',
                backgroundColor: 'var(--neutral-surface-primary)',
                color: 'var(--status-red-primary)',
                fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'background-color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--status-red-container)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--neutral-surface-primary)'; }}
            >
              Void Transaction
            </button>
          )}
        </div>

        {/* Separator */}
        <div style={{ height: 1, backgroundColor: 'var(--neutral-line-outline)', marginBottom: 24 }} />

        {/* Info grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Row 1: Bill ID | Transaction ID | Dine Type | Payment Status */}
          <div style={{ display: 'flex', gap: 8 }}>
            <InfoCell label="Bill ID" value={billIdDisplay} />
            <InfoCell label="Transaction ID" value={transactionIdDisplay} />
            <InfoCell
              label="Dine Type"
              badge={
                <div style={{ display: 'inline-flex' }}>
                  <StatusTag {...getServiceBadgeConfig(check.serviceType)} />
                </div>
              }
            />
            <InfoCell
              label="Payment Status"
              badge={
                <div style={{ display: 'inline-flex' }}>
                  <StatusTag {...getPaymentStatusBadgeConfig(check.status)} />
                </div>
              }
            />
          </div>

          {/* Row 2: Table/Takeaway/Delivery | Customer Name | Customer Number | (spacer) */}
          <div style={{ display: 'flex', gap: 8 }}>
            <InfoCell label={tableLabel} value={tableValue} />
            <InfoCell label="Customer Name" value={check.guestName || '-'} />
            <InfoCell label="Customer Number" value={check.guestPhone || '-'} />
            <div style={{ flex: 1 }} />
          </div>
        </div>

        {/* Void banner — full void or partial item void */}
        {(isVoided || voidedItems.length > 0) && (
          <div style={{ marginTop: 20 }}>
            <div style={{
              backgroundColor: 'var(--status-red-container)',
              border: '1px solid var(--status-red-primary)',
              borderRadius: 'var(--radius-card)',
              padding: '12px',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              {/* Banner header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Ban style={{ width: 16, height: 16, color: 'var(--status-red-primary)' }} />
                <span style={{
                  fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)',
                  fontFamily: 'Lato, sans-serif', color: 'var(--status-red-primary)',
                }}>
                  {isVoided ? 'Transaction Voided' : 'Items Voided'}
                </span>
              </div>

              {/* Void reason — only for full check void */}
              {isVoided && check.voidReason && (
                <div>
                  <span style={{
                    fontSize: 'var(--text-h4)', fontFamily: 'Lato, sans-serif',
                    color: 'var(--status-red-primary)', fontWeight: 'var(--font-weight-semibold)',
                  }}>
                    Reason:
                  </span>
                  <span style={{
                    fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif',
                    color: 'var(--neutral-onsurface-primary)', marginLeft: 6,
                  }}>
                    {check.voidReason}
                  </span>
                </div>
              )}

              {/* Voided items list — shown for partial voids or alongside full void */}
              {voidedItems.length > 0 && (
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: 6,
                  borderTop: (isVoided && check.voidReason) ? '1px dashed var(--status-red-primary)' : 'none',
                  paddingTop: (isVoided && check.voidReason) ? 8 : 0,
                  opacity: 0.9,
                }}>
                  {voidedItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{
                        fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif',
                        color: 'var(--neutral-onsurface-tertiary)',
                        minWidth: 24, textAlign: 'center',
                        textDecoration: 'line-through',
                      }}>
                        {item.quantity}×
                      </span>
                      <span style={{
                        flex: 1,
                        fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif',
                        color: 'var(--neutral-onsurface-secondary)',
                        textDecoration: 'line-through',
                      }}>
                        {item.name}
                      </span>
                      {item.voidReason && (
                        <span style={{
                          fontSize: 'var(--text-h4)', fontFamily: 'Lato, sans-serif',
                          color: 'var(--neutral-onsurface-tertiary)',
                          fontStyle: 'italic',
                        }}>
                          {item.voidReason}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Timestamp */}
              {check.voidedAt && (
                <div style={{
                  fontSize: 'var(--text-h4)', fontFamily: 'Lato, sans-serif',
                  color: 'var(--neutral-onsurface-tertiary)',
                }}>
                  Voided on {formatDate(check.voidedAt)} at {formatTime(check.voidedAt)}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Scrollable body ── */}
      <ScrollArea className="flex-1">
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* ─ Payment section ─ */}
          <SectionCard title="Payment" icon={<CreditCard style={{ width: 16, height: 16 }} />}>
            {/* Amount breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={rowStyle}>
                <span style={labelStyle}>Subtotal</span>
                <span style={valueStyle}>{formatCurrency(subtotal)}</span>
              </div>
              {billDiscount > 0 && (
                <div style={rowStyle}>
                  <span style={{ ...labelStyle, color: 'var(--status-red-primary)' }}>
                    Discount{check.billDiscountType === 'PERCENTAGE' ? ` (${check.billDiscountValue}%)` : ''}
                  </span>
                  <span style={{ ...valueStyle, color: 'var(--status-red-primary)' }}>
                    −{formatCurrency(billDiscount)}
                  </span>
                </div>
              )}
              <div style={rowStyle}>
                <span style={labelStyle}>Service Charge (10%)</span>
                <span style={valueStyle}>{formatCurrency(serviceCharge)}</span>
              </div>
              <div style={rowStyle}>
                <span style={labelStyle}>Tax (5%)</span>
                <span style={valueStyle}>{formatCurrency(tax)}</span>
              </div>
              {(check.tipAmount ?? 0) > 0 && (
                <div style={rowStyle}>
                  <span style={labelStyle}>Tip</span>
                  <span style={valueStyle}>{formatCurrency(check.tipAmount!)}</span>
                </div>
              )}
              {/* Total row */}
              <div
                style={{
                  ...rowStyle,
                  borderTop: '1px solid var(--neutral-line-outline)',
                  paddingTop: 10, marginTop: 2,
                }}
              >
                <span style={{
                  fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)',
                  fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)',
                }}>
                  Total
                </span>
                <span style={{
                  fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)',
                  fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)',
                }}>
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            {/* Payment methods - show only for closed checks with payments */}
            {checkPayments.length > 0 && (
              null
            )}
          </SectionCard>

          {/* ─ Items section ─ */}
          <SectionCard
            title={`Items (${activeItems.length})`}
            icon={<Receipt style={{ width: 16, height: 16 }} />}
          >
            {activeItems.length === 0 && (
              <p style={{ ...labelStyle, textAlign: 'center', padding: '8px 0' }}>No items</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activeItems.map(item => (
                <div key={item.id} className="flex items-start gap-3">
                  {/* Qty */}
                  <span style={{
                    fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)',
                    fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-tertiary)',
                    minWidth: 28, textAlign: 'center', paddingTop: 1,
                  }}>
                    {item.quantity}×
                  </span>
                  {/* Name + meta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span style={{
                        fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)',
                        fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)',
                      }}>
                        {item.name}
                      </span>
                      {item.isComplimentary && (
                        <span style={{
                          fontSize: 'var(--text-h4)', fontFamily: 'Lato, sans-serif',
                          backgroundColor: 'var(--status-green-container)', color: 'var(--status-green-primary)',
                          padding: '1px 8px', borderRadius: 'var(--radius-pill)',
                        }}>Comp</span>
                      )}
                    </div>
                    {item.modifiers.length > 0 && (
                      <p style={{
                        fontSize: 'var(--text-h4)', fontFamily: 'Lato, sans-serif',
                        color: 'var(--neutral-onsurface-tertiary)', marginTop: 2,
                      }}>
                        {item.modifiers.join(' · ')}
                      </p>
                    )}
                    {item.notes && (
                      <p style={{
                        fontSize: 'var(--text-h4)', fontFamily: 'Lato, sans-serif',
                        color: 'var(--neutral-onsurface-secondary)', fontStyle: 'italic', marginTop: 2,
                      }}>
                        Note: {item.notes}
                      </p>
                    )}
                    {(item.discountValue ?? 0) > 0 && !item.isComplimentary && (
                      <p style={{
                        fontSize: 'var(--text-h4)', fontFamily: 'Lato, sans-serif',
                        color: 'var(--status-red-primary)', marginTop: 2,
                      }}>
                        Discount: {item.discountType === 'PERCENTAGE'
                          ? `${item.discountValue}%`
                          : formatCurrency(item.discountValue!)}
                        {item.discountReason && ` · ${item.discountReason}`}
                      </p>
                    )}
                    {(item.packagingPrice ?? 0) > 0 && (
                      <p style={{
                        fontSize: 'var(--text-h4)', fontFamily: 'Lato, sans-serif',
                        color: 'var(--neutral-onsurface-secondary)', marginTop: 2,
                      }}>
                        +{formatCurrency(item.packagingPrice!)} (Packaging)
                      </p>
                    )}
                  </div>
                  {/* Line total */}
                  <span style={{
                    fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)',
                    fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)',
                    whiteSpace: 'nowrap',
                  }}>
                    {item.isComplimentary ? 'Comp' : formatCurrency(getItemEffectivePrice(item) * item.quantity)}
                  </span>
                </div>
              ))}

              {/* Voided items */}
              {voidedItems.length > 0 && (
                <>
                  <div style={{
                    borderTop: '1px dashed var(--neutral-line-outline)',
                    paddingTop: 10, marginTop: 2,
                  }}>
                    <p style={{
                      fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)',
                      fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-tertiary)',
                      letterSpacing: '0.06em', marginBottom: 8,
                    }}>
                      VOIDED ITEMS
                    </p>
                  </div>
                  {voidedItems.map(item => (
                    <div key={item.id} className="flex items-start gap-3" style={{ opacity: 0.55 }}>
                      <span style={{
                        fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)',
                        fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-tertiary)',
                        minWidth: 28, textAlign: 'center', paddingTop: 1,
                        textDecoration: 'line-through',
                      }}>
                        {item.quantity}×
                      </span>
                      <div className="flex-1 min-w-0">
                        <span style={{
                          fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif',
                          color: 'var(--neutral-onsurface-tertiary)', textDecoration: 'line-through',
                        }}>
                          {item.name}
                        </span>
                        {item.voidReason && (
                          <p style={{
                            fontSize: 'var(--text-h4)', fontFamily: 'Lato, sans-serif',
                            color: 'var(--neutral-onsurface-tertiary)', marginTop: 2,
                          }}>
                            Reason: {item.voidReason}
                          </p>
                        )}
                      </div>
                      <span style={{
                        fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-bold)',
                        fontFamily: 'Lato, sans-serif',
                        backgroundColor: 'var(--status-red-container)', color: 'var(--status-red-primary)',
                        padding: '1px 8px', borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap',
                      }}>
                        VOIDED
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </SectionCard>

          {/* ─ Split Bill section ─ */}
          {splitBill && splitBill.splits.length > 0 && (
            <SectionCard
              title={`Split Bill · ${splitBill.splits.length} guests`}
              icon={<Users style={{ width: 16, height: 16 }} />}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {splitBill.splits.flatMap((split, idx) => {
                  const groupAmount = splitAmounts[split.id] ?? 0;
                  const displayAmount = split.paidAmount ?? groupAmount;
                  const isLast = idx === splitBill.splits.length - 1;

                  // Build the payment method label for this split
                  const splitMethodLabel = (() => {
                    if (split.paymentMethods && split.paymentMethods.length > 0) {
                      // Deduplicate methods (in case same type appears multiple times)
                      const seen = new Set<string>();
                      const labels: string[] = [];
                      split.paymentMethods.forEach(pm => {
                        const key = pm.type.toUpperCase();
                        if (!seen.has(key)) {
                          seen.add(key);
                          labels.push(paymentMethodLabel(pm.type.toUpperCase()));
                        }
                      });
                      return labels.join(', ');
                    }
                    // Fallback: split name if no payment methods stored
                    return split.name || `Guest ${idx + 1}`;
                  })();

                  const row = (
                    <div
                      key={`row-${split.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 12,
                        padding: '10px 0',
                      }}
                    >
                      {/* Payment method label + Bill ID if paid */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{
                          fontSize: 'var(--text-p)',
                          fontWeight: 'var(--font-weight-regular)',
                          fontFamily: 'Lato, sans-serif',
                          color: 'var(--neutral-onsurface-primary)',
                        }}>
                          {splitMethodLabel}
                        </span>
                        {split.billId && (
                          <span style={{
                            fontSize: 'var(--text-h4)',
                            fontFamily: 'Lato, sans-serif',
                            color: 'var(--neutral-onsurface-tertiary)',
                          }}>
                            Bill: {split.billId}
                          </span>
                        )}
                      </div>

                      {/* Split total */}
                      <span style={{
                        fontSize: 'var(--text-p)',
                        fontWeight: 'var(--font-weight-bold)',
                        fontFamily: 'Lato, sans-serif',
                        color: 'var(--neutral-onsurface-primary)',
                        whiteSpace: 'nowrap',
                      }}>
                        {formatCurrency(displayAmount)}
                      </span>
                    </div>
                  );

                  if (isLast) return [row];

                  return [
                    row,
                    <div
                      key={`sep-${split.id}`}
                      style={{ height: 1, backgroundColor: 'var(--neutral-line-outline)' }}
                    />,
                  ];
                })}
              </div>
            </SectionCard>
          )}

          {/* ─ Transaction Note section ─ */}
          {check.checkNote && (
            <SectionCard
              title="Transaction Note"
              icon={<StickyNote style={{ width: 16, height: 16 }} />}
            >
              <p style={{
                fontSize: 'var(--text-p)',
                fontFamily: 'Lato, sans-serif',
                color: 'var(--neutral-onsurface-primary)',
                lineHeight: 1.5,
              }}>
                {check.checkNote}
              </p>
            </SectionCard>
          )}

        </div>
      </ScrollArea>


    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function TransactionHistory() {
  const {
    checks, checkHistory, items, payments,
    getMergedTableGroup, updateCheck, voidCheck, getSplitBillByCheck,
  } = useRestaurant();
  const snackbar = useSnackbar();
  const ctx = useVirtualInputContext();

  const [activeTab,         setActiveTab]         = useState<TabKey>('closed');
  const [selectedId,        setSelectedId]        = useState<string | null>(null);
  // ── Void flow (2-step) ──
  const [showVoidItemsModal,   setShowVoidItemsModal]   = useState(false);
  const [selectedVoidItemIds,  setSelectedVoidItemIds]  = useState<Set<string>>(new Set());
  const [showVoidConfirmModal, setShowVoidConfirmModal] = useState(false);
  const [voidReason,           setVoidReason]           = useState('');
  const [managerPin,           setManagerPin]           = useState('');
  const [expandedPayments,  setExpandedPayments]  = useState<Set<string>>(new Set());
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('ALL');
  const [searchQuery,       setSearchQuery]       = useState<string>('');

  // ── Filtered lists ──
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const closedChecks  = checks.filter(c => c.status === 'CLOSED');
  const historyChecks = checkHistory.filter(c => c.closedAt && c.closedAt >= twoWeeksAgo);

  // Search predicate — shared across both tabs
  const matchesSearch = (c: typeof closedChecks[0]): boolean => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.trim().toLowerCase();
    // Bill ID / bill number
    const billNum = c.billNumber
      ? c.billNumber
      : String(parseInt(c.id.slice(-6), 10) || 0).padStart(5, '0');
    if (billNum.toLowerCase().includes(q)) return true;
    if (`#${billNum}`.includes(q)) return true;
    // Transaction ID
    if (c.transactionId?.toLowerCase().includes(q)) return true;
    // Customer name
    if (c.guestName?.toLowerCase().includes(q)) return true;
    // Table name
    if (c.tableId) {
      const mg = getMergedTableGroup(c.tableId);
      const tableDisplay = mg
        ? mg.tableIds.map((id: string) => TABLES.find((t: any) => t.id === id)?.name || id).join(', ')
        : TABLES.find((t: any) => t.id === c.tableId)?.name || c.tableId;
      if (tableDisplay?.toLowerCase().includes(q)) return true;
    }
    return false;
  };

  // Apply service type + search filter to closed checks
  const filteredClosedChecks = closedChecks
    .filter(c => serviceTypeFilter === 'ALL' || c.serviceType === serviceTypeFilter)
    .filter(matchesSearch);

  const filteredHistoryChecks = historyChecks.filter(matchesSearch);

  const activeChecks  = activeTab === 'closed' ? filteredClosedChecks : filteredHistoryChecks;
  const counts: Record<TabKey, number> = { closed: closedChecks.length, history: historyChecks.length };
  const hasSearch = searchQuery.trim().length > 0;

  // ── Derived data for selected check ──
  const selectedCheck = useMemo(
    () => activeChecks.find(c => c.id === selectedId) ?? null,
    [activeChecks, selectedId],
  );
  const selectedItems = useMemo(
    () => selectedCheck ? items.filter(i => i.checkId === selectedCheck.id) : [],
    [selectedCheck, items],
  );
  const selectedPayments = useMemo(
    () => selectedCheck ? payments.filter(p => p.checkId === selectedCheck.id) : [],
    [selectedCheck, payments],
  );
  const selectedSplitBill = useMemo(
    () => selectedCheck ? getSplitBillByCheck(selectedCheck.id) : undefined,
    [selectedCheck, getSplitBillByCheck],
  );

  // ── Void helpers ──
  const voidableItems = useMemo(
    () => selectedItems.filter(i => !['VOIDED', 'DRAFT', 'HELD'].includes(i.status)),
    [selectedItems],
  );
  const selectedVoidItems = useMemo(
    () => voidableItems.filter(i => selectedVoidItemIds.has(i.id)),
    [voidableItems, selectedVoidItemIds],
  );
  const voidSubtotal = selectedVoidItems.reduce(
    (s, i) => s + getItemEffectivePrice(i) * i.quantity, 0,
  );
  const fullSubtotal = voidableItems.reduce(
    (s, i) => s + getItemEffectivePrice(i) * i.quantity, 0,
  );
  const voidProportion = fullSubtotal > 0 ? voidSubtotal / fullSubtotal : 0;
  const fullAfterDisc = (() => {
    let disc = 0;
    if (selectedCheck?.billDiscountType && selectedCheck?.billDiscountValue) {
      disc = selectedCheck.billDiscountType === 'PERCENTAGE'
        ? fullSubtotal * (selectedCheck.billDiscountValue / 100)
        : Math.min(selectedCheck.billDiscountValue, fullSubtotal);
    }
    return fullSubtotal - disc;
  })();
  const voidSC          = fullAfterDisc * 0.10 * voidProportion;
  const voidTax         = fullAfterDisc * 0.05 * voidProportion;
  const voidTotalRefund = voidSubtotal + voidSC + voidTax;
  const allVoidSelected = voidableItems.length > 0 && voidableItems.every(i => selectedVoidItemIds.has(i.id));

  const handleToggleAllVoidItems = () => {
    if (allVoidSelected) {
      setSelectedVoidItemIds(new Set());
    } else {
      setSelectedVoidItemIds(new Set(voidableItems.map(i => i.id)));
    }
  };
  const handleToggleVoidItem = (itemId: string) => {
    setSelectedVoidItemIds(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) { next.delete(itemId); } else { next.add(itemId); }
      return next;
    });
  };
  const resetVoidFlow = () => {
    setShowVoidItemsModal(false);
    setShowVoidConfirmModal(false);
    setSelectedVoidItemIds(new Set());
    setVoidReason('');
    setManagerPin('');
  };
  const handleConfirmVoid = () => {
    if (!voidReason.trim()) { snackbar.error('Please enter a reason for voiding'); return; }
    if (!managerPin.trim()) { snackbar.error('Manager PIN is required'); return; }
    if (managerPin !== '1234') { snackbar.error('Invalid Manager PIN'); return; }
    if (!selectedCheck) return;
    voidCheck(selectedCheck.id, voidReason, managerPin);
    snackbar.success(`${billRawId(selectedCheck)} has been voided`);
    resetVoidFlow();
    setSelectedId(null);
  };

  // ── Handlers ──
  const handleSelectCheck = (id: string) => {
    setSelectedId(prev => prev === id ? null : id);
  };

  const emptyLabels: Record<TabKey, { title: string; subtitle: string }> = {
    closed:  { title: 'No Closed Checks',  subtitle: 'Fully settled checks will appear here after payment' },
    history: { title: 'No History Yet',    subtitle: 'Transaction history up to 14 days will appear here' },
  };

  return (
    <div
      className="h-full flex flex-row overflow-hidden"
      style={{ backgroundColor: 'var(--neutral-background-primary)' }}
    >
      {/* ══ Left panel ══ */}
      <div
        className="flex flex-col shrink-0"
        style={{
          width: 420,
          borderRight: '1px solid var(--neutral-line-outline)',
          backgroundColor: 'var(--neutral-surface-primary)',
        }}
      >
        {/* Chip tab bar — count badge only on History, NOT on Closed Checks */}
        <div
          className="shrink-0 flex items-center gap-2"
          style={{
            height: 69,
            padding: '0 16px',
            borderBottom: '1px solid var(--neutral-line-outline)',
          }}
        >
          {TABS.map(tab => (
            <Chip
              key={tab.key}
              active={activeTab === tab.key}
              onClick={() => { setActiveTab(tab.key); setSelectedId(null); }}
              label={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  {tab.label}
                  {/* Remove count badge from History tab */}
                  {false && tab.key === 'history' && counts[tab.key] > 0 && (
                    <span
                      style={{
                        display:         'inline-flex',
                        alignItems:      'center',
                        justifyContent:  'center',
                        minWidth:        18,
                        height:          18,
                        padding:         '0 5px',
                        borderRadius:    'var(--radius-pill)',
                        fontSize:        'var(--text-h4)',
                        fontWeight:      'var(--font-weight-bold)',
                        fontFamily:      'Lato, sans-serif',
                        backgroundColor: activeTab === tab.key
                          ? 'var(--feature-brand-primary)'
                          : 'var(--neutral-surface-secondary)',
                        color: activeTab === tab.key
                          ? 'var(--neutral-surface-primary)'
                          : 'var(--neutral-onsurface-tertiary)',
                        lineHeight: 1,
                      }}
                    >
                      {counts[tab.key]}
                    </span>
                  )}
                </span>
              }
            />
          ))}
        </div>

        {/* ── Service type filter chips — History & Closed Bill tabs ── */}
        {(activeTab === 'closed' || activeTab === 'history') && (
          <div
            className="shrink-0"
            style={{
              padding: '10px 16px',
              borderBottom: '1px solid var(--neutral-line-outline)',
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
            }}
          >
            {[
              { key: 'ALL',      label: 'All'      },
              { key: 'DINE_IN',  label: 'Dine-In'  },
              { key: 'TAKEAWAY', label: 'Takeaway' },
              { key: 'DELIVERY', label: 'Delivery' },
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setServiceTypeFilter(filter.key)}
                style={{
                  height: 44,
                  padding: '0 20px',
                  borderRadius: '9999px',
                  border: serviceTypeFilter === filter.key
                    ? '1.5px solid var(--feature-brand-primary)'
                    : '1.5px solid var(--neutral-line-outline)',
                  fontSize: 'var(--text-p)',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontFamily: 'Lato, sans-serif',
                  backgroundColor: serviceTypeFilter === filter.key
                    ? 'var(--feature-brand-primary)'
                    : 'var(--neutral-surface-secondary)',
                  color: serviceTypeFilter === filter.key
                    ? 'var(--neutral-surface-primary)'
                    : 'var(--neutral-onsurface-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  flexShrink: 0,
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (serviceTypeFilter !== filter.key) {
                    e.currentTarget.style.backgroundColor = 'var(--neutral-surface-greylighter)';
                  }
                }}
                onMouseLeave={e => {
                  if (serviceTypeFilter !== filter.key) {
                    e.currentTarget.style.backgroundColor = 'var(--neutral-surface-secondary)';
                  }
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Search bar — always visible ── */}
        <div
          className="shrink-0"
          style={{
            padding: '10px 16px',
            borderBottom: '1px solid var(--neutral-line-outline)',
            backgroundColor: 'var(--neutral-surface-primary)',
          }}
        >
          <div className="bg-[#f4f4f4] h-[44px] relative rounded-[8px] flex">
            <div className="flex flex-row items-center size-full">
              <div className="content-stretch flex items-center justify-between px-[10px] py-[2px] relative w-full h-full">
                <div className="content-stretch flex flex-1 gap-[8px] items-center min-h-px min-w-px relative">
                  <div className="relative shrink-0 size-[24px]">
                    <Search style={{ width: 24, height: 24, color: '#282828' }} />
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={searchQuery}
                    onPointerDown={(e) => { e.preventDefault(); ctx.openFor('text', searchQuery, (val) => { setSearchQuery(val); setSelectedId(null); }, e.currentTarget); }}
                    placeholder="Search by Bill ID, Transaction ID, customer, or table…"
                    className="flex-1 bg-transparent border-none outline-none font-['Lato:Regular',sans-serif] leading-[22px] not-italic text-[#282828] text-[16px] tracking-[0.11px] placeholder:text-[#a9a9a9]"
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); }}
                    className="relative shrink-0 size-[24px] cursor-pointer hover:opacity-70 transition-opacity"
                    aria-label="Clear search"
                  >
                    <X style={{ width: 24, height: 24, color: '#282828' }} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* List */}
        {activeChecks.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              title={hasSearch ? 'No Results Found' : emptyLabels[activeTab].title}
              subtitle={hasSearch ? `No transactions match "${searchQuery}"` : emptyLabels[activeTab].subtitle}
            />
          </div>
        ) : (
          <ScrollArea className="flex-1">
            {activeChecks.map(check => (
              <ListCard
                key={check.id}
                check={check}
                isSelected={selectedId === check.id}
                isVoided={check.voided || false}
                onClick={() => handleSelectCheck(check.id)}
                getMergedTableGroup={getMergedTableGroup}
              />
            ))}
          </ScrollArea>
        )}
      </div>

      {/* ══ Right panel ══ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!selectedCheck ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3" style={{ opacity: 0.45 }}>
            <Receipt style={{ width: 48, height: 48, color: 'var(--neutral-onsurface-tertiary)' }} />
            <p style={{
              fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif',
              color: 'var(--neutral-onsurface-tertiary)',
            }}>
              Select a transaction to view details
            </p>
          </div>
        ) : (
          <DetailPanel
            check={selectedCheck}
            items={selectedItems}
            checkPayments={selectedPayments}
            splitBill={selectedSplitBill}
            isVoided={selectedCheck.voided || false}
            getMergedTableGroup={getMergedTableGroup}
            onClose={() => setSelectedId(null)}
            onVoid={() => { resetVoidFlow(); setShowVoidItemsModal(true); }}
            isPaymentExpanded={expandedPayments.has(selectedCheck.id)}
            onTogglePayment={() => {
              const newExpanded = new Set(expandedPayments);
              if (newExpanded.has(selectedCheck.id)) {
                newExpanded.delete(selectedCheck.id);
              } else {
                newExpanded.add(selectedCheck.id);
              }
              setExpandedPayments(newExpanded);
            }}
          />
        )}
      </div>

      {/* ══ Step 1: Void Item Selection Modal ══ */}
      <Dialog open={showVoidItemsModal} onOpenChange={open => { if (!open) resetVoidFlow(); }}>
        <DialogContent
          className="sm:max-w-[520px]"
          aria-describedby={undefined}
          style={{ maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', gap: 0 }}
        >
          {/* Header */}
          <div style={{
            padding: '24px 24px 16px',
            borderBottom: '1px solid var(--neutral-line-outline)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                backgroundColor: 'var(--status-red-container)',
              }}>
                <AlertTriangle style={{ width: 20, height: 20, color: 'var(--status-red-primary)' }} />
              </span>
              <DialogTitle style={{
                fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)',
                fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)',
                margin: 0,
              }}>
                Void Transaction
              </DialogTitle>
            </div>
            <p style={{
              fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif',
              color: 'var(--neutral-onsurface-secondary)', lineHeight: 1.5,
              paddingLeft: 52, margin: 0,
            }}>
              You'd need to issue a refund manually
            </p>
          </div>

          {/* Select All row */}
          <div style={{
            padding: '12px 24px',
            borderBottom: '1px solid var(--neutral-line-outline)',
            flexShrink: 0,
          }}>
            <button
              onClick={handleToggleAllVoidItems}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', background: 'none', border: 'none',
                cursor: 'pointer', padding: 0, minHeight: 40,
              }}
            >
              <span style={{
                width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                border: `2px solid ${allVoidSelected ? 'var(--feature-brand-primary)' : 'var(--neutral-line-outline)'}`,
                backgroundColor: allVoidSelected ? 'var(--feature-brand-primary)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}>
                {allVoidSelected && (
                  <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                    <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              <span style={{
                fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)',
                fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)',
              }}>
                Select All Items
              </span>
              <span style={{
                marginLeft: 'auto',
                fontSize: 'var(--text-label)', fontFamily: 'Lato, sans-serif',
                color: 'var(--neutral-onsurface-tertiary)',
              }}>
                {selectedVoidItemIds.size}/{voidableItems.length} selected
              </span>
            </button>
          </div>

          {/* Scrollable item list */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {voidableItems.length === 0 ? (
              <p style={{
                textAlign: 'center', padding: '32px 24px',
                fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif',
                color: 'var(--neutral-onsurface-tertiary)',
              }}>
                No items available to void
              </p>
            ) : (
              voidableItems.map(item => {
                const isChecked = selectedVoidItemIds.has(item.id);
                const lineTotal = getItemEffectivePrice(item) * item.quantity;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleToggleVoidItem(item.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      width: '100%', padding: '13px 24px',
                      background: isChecked ? 'var(--status-red-container)' : 'none',
                      border: 'none', cursor: 'pointer',
                      borderBottom: '1px solid var(--neutral-line-outline)',
                      minHeight: 56, textAlign: 'left',
                      transition: 'background-color 0.15s',
                    }}
                    onMouseEnter={e => { if (!isChecked) e.currentTarget.style.backgroundColor = 'var(--neutral-surface-greylighter)'; }}
                    onMouseLeave={e => { if (!isChecked) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <span style={{
                      width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                      border: `2px solid ${isChecked ? 'var(--status-red-primary)' : 'var(--neutral-line-outline)'}`,
                      backgroundColor: isChecked ? 'var(--status-red-primary)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s',
                    }}>
                      {isChecked && (
                        <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                          <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </span>
                    <span style={{
                      fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif',
                      color: 'var(--neutral-onsurface-tertiary)', minWidth: 28,
                      fontWeight: 'var(--font-weight-bold)',
                    }}>
                      {item.quantity}×
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{
                        fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--neutral-onsurface-primary)', display: 'block',
                      }}>
                        {item.name}
                      </span>
                      {item.modifiers.length > 0 && (
                        <span style={{
                          fontSize: 'var(--text-h4)', fontFamily: 'Lato, sans-serif',
                          color: 'var(--neutral-onsurface-tertiary)',
                        }}>
                          {item.modifiers.join(' · ')}
                        </span>
                      )}
                    </div>
                    <span style={{
                      fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif',
                      fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap',
                      color: isChecked ? 'var(--status-red-primary)' : 'var(--neutral-onsurface-primary)',
                    }}>
                      {item.isComplimentary ? 'Comp' : formatCurrency(lineTotal)}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--neutral-line-outline)',
            backgroundColor: 'var(--neutral-surface-primary)',
            flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            {selectedVoidItemIds.size > 0 && (
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px',
                backgroundColor: 'var(--status-red-container)',
                borderRadius: 'var(--radius-small)',
              }}>
                <span style={{
                  fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif',
                  color: 'var(--status-red-primary)',
                }}>
                  {selectedVoidItemIds.size} item{selectedVoidItemIds.size !== 1 ? 's' : ''} selected
                </span>
                <span style={{
                  fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)',
                  fontFamily: 'Lato, sans-serif', color: 'var(--status-red-primary)',
                }}>
                  {formatCurrency(voidSubtotal)}
                </span>
              </div>
            )}
            <div style={{ display: 'flex', gap: 12 }}>
              <MainBtn variant="secondary" size="lg" onClick={resetVoidFlow} style={{ flex: 1 }}>
                Cancel
              </MainBtn>
              <MainBtn
                variant="destructive"
                size="lg"
                disabled={selectedVoidItemIds.size === 0}
                onClick={() => { setShowVoidItemsModal(false); setShowVoidConfirmModal(true); }}
                style={{ flex: 1 }}
              >
                Proceed
              </MainBtn>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ══ Step 2: Void Confirmation Modal ══ */}
      <Dialog
        open={showVoidConfirmModal}
        onOpenChange={open => { if (!open) { setShowVoidConfirmModal(false); setShowVoidItemsModal(true); } }}
      >
        <DialogContent
          className="sm:max-w-[440px]"
          aria-describedby={undefined}
          style={{ padding: 0, overflow: 'hidden', gap: 0 }}
        >
          {/* Header */}
          <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid var(--neutral-line-outline)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                backgroundColor: 'var(--status-red-container)',
              }}>
                <AlertTriangle style={{ width: 20, height: 20, color: 'var(--status-red-primary)' }} />
              </span>
              <DialogTitle style={{
                fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)',
                fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)', margin: 0,
              }}>
                Confirm Void
              </DialogTitle>
            </div>
          </div>

          {/* Refund summary */}
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--neutral-line-outline)' }}>
            <div style={{
              backgroundColor: 'var(--status-red-container)',
              borderRadius: 'var(--radius-card)',
              padding: '14px 16px',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <p style={{
                fontSize: 'var(--text-label)', fontFamily: 'Lato, sans-serif',
                color: 'var(--status-red-primary)', fontWeight: 'var(--font-weight-semibold)',
                letterSpacing: '0.04em', margin: '0 0 4px',
              }}>
                ITEMS TO BE VOIDED
              </p>
              {selectedVoidItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif',
                    color: 'var(--neutral-onsurface-primary)',
                  }}>
                    {item.quantity}× {item.name}
                  </span>
                  <span style={{
                    fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif',
                    fontWeight: 'var(--font-weight-semibold)', color: 'var(--neutral-onsurface-primary)',
                  }}>
                    {item.isComplimentary ? 'Comp' : formatCurrency(getItemEffectivePrice(item) * item.quantity)}
                  </span>
                </div>
              ))}
              <div style={{ height: 1, backgroundColor: 'rgba(211,47,47,0.2)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-secondary)' }}>Service Charge (10%)</span>
                <span style={{ fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)' }}>{formatCurrency(voidSC)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-secondary)' }}>Tax (5%)</span>
                <span style={{ fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)' }}>{formatCurrency(voidTax)}</span>
              </div>
              <div style={{ height: 1, backgroundColor: 'rgba(211,47,47,0.2)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)',
                  fontFamily: 'Lato, sans-serif', color: 'var(--status-red-primary)',
                }}>Total Refund</span>
                <span style={{
                  fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)',
                  fontFamily: 'Lato, sans-serif', color: 'var(--status-red-primary)',
                }}>{formatCurrency(voidTotalRefund)}</span>
              </div>
            </div>
          </div>

          {/* Reason + PIN */}
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <Label style={{
                fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)',
                fontFamily: 'Lato, sans-serif', display: 'block', marginBottom: 8,
                color: 'var(--neutral-onsurface-primary)',
              }}>
                Reason for voiding
              </Label>
              <TextField
                value={voidReason}
                onChange={e => setVoidReason(e.target.value)}
                placeholder="Enter reason…"
              />
            </div>
            <div>
              <Label style={{
                fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)',
                fontFamily: 'Lato, sans-serif', display: 'block', marginBottom: 8,
                color: 'var(--neutral-onsurface-primary)',
              }}>
                Manager PIN
              </Label>
              <TextField
                type="password"
                value={managerPin}
                onChange={e => setManagerPin(e.target.value)}
                placeholder="Enter manager PIN…"
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '0 24px 24px', display: 'flex', gap: 12 }}>
            <MainBtn
              variant="secondary"
              size="lg"
              onClick={() => { setShowVoidConfirmModal(false); setShowVoidItemsModal(true); }}
              style={{ flex: 1 }}
            >
              Back
            </MainBtn>
            <MainBtn
              variant="destructive"
              size="lg"
              onClick={handleConfirmVoid}
              style={{ flex: 1 }}
            >
              Void Transaction
            </MainBtn>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}