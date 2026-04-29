import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { TextField } from '../ui/TextField';
import { MainBtn } from '../ui/MainBtn';
import { EmptyState } from '../ui/EmptyState';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatCurrency, formatTime } from '../../utils/formatters';
import { Plus, Clock, CheckCircle } from 'lucide-react';

export default function TakeawayList() {
  const navigate  = useNavigate();
  const { checks, createCheck } = useRestaurant();

  const [showNewOrder, setShowNewOrder] = useState(false);
  const [guestName,   setGuestName]     = useState('');
  const [guestPhone,  setGuestPhone]    = useState('');

  const takeawayChecks = checks.filter(c => c.serviceType === 'TAKEAWAY');
  const openChecks     = takeawayChecks.filter(c => c.status !== 'CLOSED');
  const closedChecks   = takeawayChecks.filter(c => c.status === 'CLOSED');

  const handleClose = () => {
    setShowNewOrder(false);
    setGuestName('');
    setGuestPhone('');
  };

  const handleNewOrder = () => {
    const checkId = createCheck({
      serviceType: 'TAKEAWAY',
      guestName:   guestName  || undefined,
      guestPhone:  guestPhone || undefined,
      status:      'OPEN',
      billPrinted: false,
    });
    handleClose();
    navigate(`/check/${checkId}?autoMenu=true`);
  };

  // ── Status badge ─────────────────────────────────────────────────────────────
  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      OPEN:           { bg: 'var(--status-green-container)',  color: 'var(--status-green-primary)',  label: 'Open' },
      PARTIALLY_PAID: { bg: 'var(--status-yellow-container)', color: 'var(--status-yellow-primary)', label: 'Partial' },
      CLOSED:         { bg: 'var(--neutral-surface-greylighter)', color: 'var(--neutral-onsurface-secondary)', label: 'Closed' },
    };
    const s = map[status] ?? { bg: 'var(--neutral-10)', color: 'var(--neutral-onsurface-secondary)', label: status };
    return (
      <span
        style={{
          backgroundColor: s.bg,
          color:           s.color,
          fontSize:        'var(--text-h4)',
          fontWeight:      'var(--font-weight-semibold)',
          fontFamily:      'Lato, sans-serif',
          padding:         '2px 10px',
          borderRadius:    'var(--radius-pill)',
        }}
      >
        {s.label}
      </span>
    );
  };

  // ── Order card ───────────────────────────────────────────────────────────────
  const OrderCard = ({ check, dimmed }: { check: (typeof openChecks)[0]; dimmed?: boolean }) => (
    <button
      key={check.id}
      onClick={() => navigate(`/check/${check.id}`)}
      className="w-full text-left transition-all duration-150"
      style={{
        backgroundColor: 'var(--neutral-surface-primary)',
        border:          '1px solid var(--neutral-line-outline)',
        borderRadius:    'var(--radius-card)',
        padding:         '16px',
        opacity:         dimmed ? 0.6 : 1,
        cursor:          'pointer',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--feature-brand-primary)';
        (e.currentTarget as HTMLElement).style.boxShadow  = '0 4px 12px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--neutral-line-outline)';
        (e.currentTarget as HTMLElement).style.boxShadow  = 'none';
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)' }}>
            #{check.id.slice(-6).toUpperCase()}
          </p>
          <p style={{ fontSize: 'var(--text-h4)', color: 'var(--neutral-onsurface-secondary)', fontFamily: 'Lato, sans-serif' }}>
            {formatTime(check.createdAt)}
          </p>
        </div>
        {statusBadge(check.status)}
      </div>

      {/* Guest details */}
      {check.guestName && (
        <p style={{ fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)', marginBottom: 4 }}>
          <span style={{ color: 'var(--neutral-onsurface-secondary)' }}>Name: </span>{check.guestName}
        </p>
      )}
      {check.guestPhone && (
        <p style={{ fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)', marginBottom: 8 }}>
          <span style={{ color: 'var(--neutral-onsurface-secondary)' }}>Phone: </span>{check.guestPhone}
        </p>
      )}

      {/* Total row */}
      <div
        className="flex items-center justify-between pt-3"
        style={{ borderTop: '1px solid var(--neutral-line-outline)' }}
      >
        <p style={{ fontSize: 'var(--text-h4)', color: 'var(--neutral-onsurface-secondary)', fontFamily: 'Lato, sans-serif' }}>Total</p>
        <p style={{
          fontSize:   'var(--text-h3)',
          fontWeight: 'var(--font-weight-bold)',
          fontFamily: 'Lato, sans-serif',
          color:      dimmed ? 'var(--neutral-onsurface-primary)' : 'var(--feature-brand-primary)',
        }}>
          {formatCurrency(check.totalAmount * 1.1)}
        </p>
      </div>
    </button>
  );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: 'var(--neutral-background-primary)' }}>

      {/* Page header */}
      <div
        className="flex items-center justify-between shrink-0 px-6"
        style={{ height: 72, backgroundColor: 'var(--neutral-surface-primary)', borderBottom: '1px solid var(--neutral-line-outline)' }}
      >
        <p style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)' }}>
          Takeaway Orders
        </p>
        <MainBtn variant="primary" size="md" onClick={() => setShowNewOrder(true)}>
          <Plus className="w-4 h-4" />
          New Order
        </MainBtn>
      </div>

      {/* List — or empty state filling remaining height */}
      {takeawayChecks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            title="No Takeaway Orders Yet"
            subtitle="Tap 'New Order' to add your first takeaway"
          />
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">

            {/* Active orders */}
            {openChecks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5" style={{ color: 'var(--status-yellow-primary)' }} />
                  <p style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)' }}>
                    Active Orders <span style={{ color: 'var(--neutral-onsurface-secondary)', fontWeight: 'var(--font-weight-regular)' }}>({openChecks.length})</span>
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {openChecks.map(c => <OrderCard key={c.id} check={c} />)}
                </div>
              </div>
            )}

            {/* Completed orders */}
            {closedChecks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5" style={{ color: 'var(--status-green-primary)' }} />
                  <p style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)' }}>
                    Completed <span style={{ color: 'var(--neutral-onsurface-secondary)', fontWeight: 'var(--font-weight-regular)' }}>({closedChecks.length})</span>
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {closedChecks.map(c => <OrderCard key={c.id} check={c} dimmed />)}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      )}

      {/* ── New Order Dialog ──────────────────────────────────────────────────── */}
      <Dialog open={showNewOrder} onOpenChange={v => { if (!v) handleClose(); }}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'Lato, sans-serif' }}>
              New Takeaway Order
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-secondary)' }}>
              Customer details are optional for takeaway.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">
            {/* Customer Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="tw-name"
                style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)', display: 'block' }}
              >
                Customer Name
                <span style={{ fontSize: 'var(--text-h4)', color: 'var(--neutral-onsurface-tertiary)', marginLeft: 6 }}>(optional)</span>
              </label>
              <TextField
                id="tw-name"
                type="text"
                placeholder="e.g. Budi Santoso"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                className="h-[48px]"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label
                htmlFor="tw-phone"
                style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)', display: 'block' }}
              >
                Phone Number
                <span style={{ fontSize: 'var(--text-h4)', color: 'var(--neutral-onsurface-tertiary)', marginLeft: 6 }}>(optional)</span>
              </label>
              <TextField
                id="tw-phone"
                type="tel"
                placeholder="e.g. 0812-3456-7890"
                value={guestPhone}
                onChange={e => setGuestPhone(e.target.value)}
                className="h-[48px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-3">
            <MainBtn variant="secondary" size="lg" onClick={handleClose} className="flex-1">
              Cancel
            </MainBtn>
            <MainBtn variant="primary" size="lg" onClick={handleNewOrder} className="flex-1">
              Create Order
            </MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}