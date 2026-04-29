import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ScrollArea } from '../ui/scroll-area';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatCurrency, formatTime, formatDate } from '../../utils/formatters';
import { EmptyState } from '../ui/EmptyState';
import { ChevronRight, Search, X } from 'lucide-react';
import { TABLES } from '../../data/mockData';
import { StatusTag } from '../ui/StatusTag';
import { Chip } from '../ui/Chip';
import { useVirtualInputContext } from '../../context/VirtualInputContext';

const SERVICE_MAP: Record<string, { bg: string; color: string; label: string }> = {
  DINE_IN:         { bg: 'var(--feature-brand-container-light)', color: 'var(--feature-brand-primary)',  label: 'Dine-In'   },
  TAKEAWAY:        { bg: 'rgba(139,92,246,0.10)',                 color: '#7C3AED',                       label: 'Takeaway'  },
  DELIVERY:        { bg: 'rgba(234,88,12,0.10)',                  color: '#EA580C',                       label: 'Delivery'  },
  SCHEDULED_ORDER: { bg: 'var(--status-green-container)',         color: 'var(--status-green-primary)',   label: 'Scheduled' },
};

const STATUS_MAP: Record<string, { bg: string; color: string; label: string }> = {
  OPEN:           { bg: 'var(--status-green-container)',     color: 'var(--status-green-primary)',    label: 'Open'    },
  PARTIALLY_PAID: { bg: 'var(--status-yellow-container)',    color: 'var(--status-yellow-primary)',   label: 'Partial' },
  CLOSED:         { bg: 'var(--neutral-surface-greylighter)',color: 'var(--neutral-onsurface-secondary)', label: 'Closed' },
};

function Pill({ bg, color, label, radius = 'var(--radius-pill)' }: { bg: string; color: string; label: string; radius?: string }) {
  return (
    <span style={{
      fontSize: 'var(--text-h4)',
      fontWeight: 'var(--font-weight-semibold)',
      fontFamily: 'Lato, sans-serif',
      backgroundColor: bg,
      color,
      padding: '2px 10px',
      borderRadius: radius,
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

export default function Transactions() {
  const navigate = useNavigate();
  const { checks, getMergedTableGroup } = useRestaurant();
  const [serviceTypeFilter, setServiceTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const ctx = useVirtualInputContext();

  const openChecks = checks
    .filter(c => c.status === 'OPEN' || c.status === 'PARTIALLY_PAID')
    .filter(c => serviceTypeFilter === 'ALL' || c.serviceType === serviceTypeFilter)
    .filter(c => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.trim().toLowerCase();
      // Order number
      const billNumber = c.billNumber
        ? c.billNumber
        : String(parseInt(c.id.slice(-6), 10) || 0).padStart(5, '0');
      if (billNumber.toLowerCase().includes(q)) return true;
      if (`order #${billNumber}`.toLowerCase().includes(q)) return true;
      // Customer name
      if (c.guestName?.toLowerCase().includes(q)) return true;
      // Table number
      if (c.tableId) {
        const mergedGroup = getMergedTableGroup(c.tableId);
        const tableDisplay = mergedGroup
          ? mergedGroup.tableIds.map((id: string) => TABLES.find(t => t.id === id)?.name || id).join(', ')
          : TABLES.find(t => t.id === c.tableId)?.name || c.tableId;
        if (tableDisplay?.toLowerCase().includes(q)) return true;
      }
      return false;
    });

  const SERVICE_FILTERS = [
    { key: 'ALL',      label: 'All'      },
    { key: 'DINE_IN',  label: 'Dine-In'  },
    { key: 'TAKEAWAY', label: 'Takeaway' },
    { key: 'DELIVERY', label: 'Delivery' },
  ];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--neutral-background-primary)' }}>

      {/* ── Filter chips ── */}
      <div
        className="shrink-0"
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--neutral-line-outline)',
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          backgroundColor: 'var(--neutral-surface-primary)',
        }}
      >
        {SERVICE_FILTERS.map(f => (
          <Chip
            key={f.key}
            label={f.label}
            active={serviceTypeFilter === f.key}
            onClick={() => setServiceTypeFilter(f.key)}
          />
        ))}
      </div>

      {/* ── Search bar ── */}
      <div
        className="shrink-0"
        style={{
          padding: '10px 16px',
          borderBottom: '1px solid var(--neutral-line-outline)',
          backgroundColor: 'var(--neutral-surface-primary)',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          height: 44,
          padding: '0 12px',
          borderRadius: 'var(--radius-input)',
          border: 'none',
          backgroundColor: 'var(--neutral-surface-greylighter)',
        }}
        >
          <Search style={{ width: 16, height: 16, color: 'var(--neutral-onsurface-tertiary)', flexShrink: 0 }} />
          <input
            type="text"
            readOnly
            value={searchQuery}
            onPointerDown={(e) => { e.preventDefault(); ctx.openFor('text', searchQuery, setSearchQuery, e.currentTarget); }}
            placeholder="Search by order number, table, or customer name…"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 'var(--text-p)',
              fontFamily: 'Lato, sans-serif',
              color: 'var(--neutral-onsurface-primary)',
              cursor: 'pointer',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 20, height: 20, borderRadius: '50%',
                border: 'none', background: 'var(--neutral-surface-secondary)',
                cursor: 'pointer', padding: 0, flexShrink: 0,
              }}
            >
              <X style={{ width: 11, height: 11, color: 'var(--neutral-onsurface-secondary)' }} />
            </button>
          )}
        </div>
      </div>

      {openChecks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            title={searchQuery ? 'No Results Found' : 'No Active Orders'}
            subtitle={searchQuery ? `No orders match "${searchQuery}"` : 'Open checks and pending orders will appear here'}
          />
        </div>
      ) : (
        <ScrollArea className="flex-1">
          {/* 3-column card grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
            padding: 20,
          }}>
            {openChecks.map((check) => {
              const displayBillNumber = check.billNumber
                ? check.billNumber
                : String(parseInt(check.id.slice(-6), 10) || 0).padStart(5, '0');

              const mergedGroup = check.tableId ? getMergedTableGroup(check.tableId) : null;
              const tableDisplay = (() => {
                if (!check.tableId) return null;
                if (mergedGroup) {
                  const names = mergedGroup.tableIds
                    .map((id: string) => TABLES.find(t => t.id === id)?.name || id)
                    .join(', ');
                  return names;
                }
                return TABLES.find(t => t.id === check.tableId)?.name || check.tableId;
              })();

              const svc    = SERVICE_MAP[check.serviceType] ?? SERVICE_MAP.DINE_IN;
              const status = STATUS_MAP[check.status] ?? STATUS_MAP.OPEN;

              const grandTotal = check.totalAmount * 1.15;

              return (
                <button
                  key={check.id}
                  onClick={() => navigate(`/check/${check.id}`)}
                  className="text-left transition-all duration-150"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'var(--neutral-surface-primary)',
                    border: '1px solid var(--neutral-line-outline)',
                    borderRadius: 'var(--radius-card)',
                    padding: 16,
                    gap: 12,
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--feature-brand-primary)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,107,255,0.10)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--neutral-line-outline)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                  }}
                >
                  {/* Top: Order # + badges */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{
                      fontFamily: 'Lato, sans-serif',
                      fontSize: 'var(--text-p)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--neutral-onsurface-primary)',
                      lineHeight: '1.4',
                    }}>
                      {displayBillNumber.startsWith('Comb#') ? displayBillNumber : `Order #${displayBillNumber}`}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      <StatusTag text={svc.label} bgColor={svc.bg} textColor={svc.color} />
                      {check.status !== 'OPEN' && (
                        <StatusTag text={status.label} bgColor={status.bg} textColor={status.color} />
                      )}
                    </div>
                  </div>

                  {/* Middle: table / guest / date */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
                    {(tableDisplay || check.guestName) && (
                      <span style={{
                        fontFamily: 'Lato, sans-serif',
                        fontSize: 'var(--text-p)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--neutral-onsurface-secondary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {[tableDisplay, check.guestName].filter(Boolean).join(' · ')}
                      </span>
                    )}
                    <span style={{
                      fontFamily: 'Lato, sans-serif',
                      fontSize: 'var(--text-h4)',
                      color: 'var(--neutral-onsurface-tertiary)',
                    }}>
                      {formatDate(check.createdAt)} · {formatTime(check.createdAt)}
                    </span>
                  </div>

                  {/* Divider */}
                  <div style={{ height: 1, backgroundColor: 'var(--neutral-line-outline)', margin: '0 -16px' }} />

                  {/* Bottom: amount */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontFamily: 'Lato, sans-serif',
                      fontSize: 'var(--text-h4)',
                      color: 'var(--neutral-onsurface-tertiary)',
                    }}>
                      Total
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                      <span style={{
                        fontFamily: 'Lato, sans-serif',
                        fontSize: 'var(--text-p)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--feature-brand-primary)',
                      }}>
                        {formatCurrency(grandTotal)}
                      </span>
                      {check.paidAmount > 0 && (
                        <span style={{
                          fontFamily: 'Lato, sans-serif',
                          fontSize: 'var(--text-h4)',
                          color: 'var(--status-green-primary)',
                        }}>
                          Paid {formatCurrency(check.paidAmount)}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}