import React, { useState, useEffect } from 'react';
import { Check, Table, SplitBill } from '../../types';
import svgPaths from '../../../imports/svg-0mbrad7amz';

interface DineInCheckHeaderProps {
  check: Check;
  table?: Table;
  splitBill?: SplitBill;
  grandTotal: number;
}

type PaymentStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'FULLY_PAID';

export function DineInCheckHeader({ check, table, splitBill, grandTotal }: DineInCheckHeaderProps) {
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    if (!check.seatedAt) return;
    const update = () => {
      const diffMs = new Date().getTime() - new Date(check.seatedAt!).getTime();
      setElapsedMinutes(Math.floor(diffMs / 60000));
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [check.seatedAt]);

  const getPaymentStatus = (): PaymentStatus => {
    const totalPaid = check.paidAmount || 0;
    if (totalPaid === 0) return 'UNPAID';
    if (totalPaid >= grandTotal) return 'FULLY_PAID';
    return 'PARTIALLY_PAID';
  };

  const paymentStatus      = getPaymentStatus();
  const maxSeatedMinutes   = check.maxSeatedMinutes || 90;
  const isTimeExceeded     = elapsedMinutes > maxSeatedMinutes;
  const isPurchaseBelowMin = grandTotal < (check.minPurchaseAmount || 0);

  const formatCurrency = (n: number) => n.toLocaleString('id-ID');

  const getPaymentBadgeConfig = () => {
    switch (paymentStatus) {
      case 'UNPAID':
        return {
          text: 'Unpaid',
          bgColor:     'var(--neutral-surface-greylighter)',
          textColor:   'var(--neutral-onsurface-secondary)',
          borderColor: 'var(--neutral-line-outline)',
        };
      case 'PARTIALLY_PAID':
        return {
          text: 'Partially Paid',
          bgColor:     'var(--status-yellow-container)',
          textColor:   'var(--status-yellow-primary)',
          borderColor: 'var(--status-yellow-primary)',
        };
      case 'FULLY_PAID':
        return {
          text: 'Fully Paid',
          bgColor:     'var(--status-green-container)',
          textColor:   'var(--status-green-primary)',
          borderColor: 'var(--status-green-primary)',
        };
    }
  };

  const badge = getPaymentBadgeConfig();

  const displayOrderNumber = check.billNumber
    ? (check.billNumber.startsWith('Comb#') ? `Order ${check.billNumber}` : `Order #${check.billNumber}`)
    : `Order #${String(parseInt(check.id.slice(-6), 10) || 0).padStart(5, '0')}`;

  const billId = check.transactionId ?? null;

  // ── Shared typography helpers ────────────────────────────────────────────────
  const labelStyle: React.CSSProperties = {
    fontFamily: 'Lato, sans-serif',
    fontSize:   'var(--text-h4)',
    fontWeight: 'var(--font-weight-normal)',
    color:      'var(--neutral-onsurface-secondary)',
  };
  const valueStyle: React.CSSProperties = {
    fontFamily: 'Lato, sans-serif',
    fontSize:   'var(--text-h4)',
    fontWeight: 'var(--font-weight-semibold)',
    color:      'var(--neutral-onsurface-primary)',
  };
  const divider = (
    <div style={{ width: 1, height: 24, backgroundColor: 'var(--neutral-line-outline)', flexShrink: 0 }} />
  );

  return (
    <div
      className="flex items-center justify-between gap-4 px-6 py-4 w-full border-b"
      style={{
        backgroundColor: 'var(--neutral-surface-primary)',
        borderColor:     'var(--neutral-line-outline)',
      }}
    >
      {/* LEFT: Table + Bill Number + Status */}
      <div className="flex items-center gap-3 shrink-0 flex-wrap">
        {/* Table Name */}
        <p
          style={{
            fontFamily:    'Lato, sans-serif',
            fontSize:      'var(--text-h2)',
            fontWeight:    'var(--font-weight-bold)',
            color:         'var(--neutral-onsurface-primary)',
            letterSpacing: '-0.4px',
          }}
        >
          {table?.name || 'Table'}
        </p>

        {divider}

        {/* Order Number + Bill ID */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <p style={{ ...valueStyle, fontSize: 'var(--text-p)' }}>
            {displayOrderNumber}
          </p>
          {billId && (
            <p style={{ ...labelStyle, fontSize: 'var(--text-label)' }}>
              Bill: {billId}
            </p>
          )}
        </div>

        {divider}

        {/* Payment Status Badge */}
        <div
          style={{
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            height:          32,
            padding:         '0 12px',
            borderRadius:    'var(--radius-small)',
            border:          `1px solid ${badge.borderColor}`,
            backgroundColor: badge.bgColor,
          }}
        >
          <p
            style={{
              fontFamily:  'Lato, sans-serif',
              fontSize:    'var(--text-h4)',
              fontWeight:  'var(--font-weight-semibold)',
              color:       badge.textColor,
              whiteSpace:  'nowrap',
            }}
          >
            {badge.text}
          </p>
        </div>
      </div>

      {/* RIGHT: Pax + Time + Purchase */}
      <div className="flex items-center gap-3 flex-wrap justify-end">
        {/* Pax */}
        <div className="flex items-center gap-2">
          <div style={{ width: 20, height: 20, flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d={svgPaths.p38fdee00} stroke="var(--neutral-onsurface-primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d={svgPaths.p13058e80} stroke="var(--neutral-onsurface-primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d={svgPaths.p3b81ea80} stroke="var(--neutral-onsurface-primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              <path d={svgPaths.p3b3a5000} stroke="var(--neutral-onsurface-primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </div>
          <p style={valueStyle}>{check.guestCount || 0} pax</p>
        </div>

        {divider}

        {/* Time Seated */}
        <div className="flex items-center gap-2">
          <p style={labelStyle}>Time Seated</p>
          <p
            style={{
              ...valueStyle,
              color: isTimeExceeded ? 'var(--destructive)' : 'var(--neutral-onsurface-primary)',
            }}
          >
            {elapsedMinutes}m / {maxSeatedMinutes}m
          </p>
        </div>

        {divider}

        {/* Purchase */}
        <div className="flex items-center gap-2">
          <p style={labelStyle}>Purchase</p>
          <p
            style={{
              ...valueStyle,
              color: isPurchaseBelowMin ? 'var(--destructive)' : 'var(--neutral-onsurface-primary)',
            }}
          >
            {formatCurrency(grandTotal)} / {formatCurrency(check.minPurchaseAmount || 0)}
          </p>
        </div>
      </div>
    </div>
  );
}
