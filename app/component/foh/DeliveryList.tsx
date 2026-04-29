import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { TextField } from '../ui/TextField';
import { Textarea } from '../ui/textarea';
import { MainBtn } from '../ui/MainBtn';
import { EmptyState } from '../ui/EmptyState';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatCurrency, formatTime } from '../../utils/formatters';
import { Plus, Truck, CheckCircle } from 'lucide-react';

export default function DeliveryList() {
  const navigate = useNavigate();
  const { checks, createCheck } = useRestaurant();

  const [showNewOrder,     setShowNewOrder]     = useState(false);
  const [guestName,        setGuestName]         = useState('');
  const [guestPhone,       setGuestPhone]        = useState('');
  const [guestAddress,     setGuestAddress]      = useState('');
  // Track whether the user has attempted to submit (to reveal field errors)
  const [submitted,        setSubmitted]         = useState(false);
  // Textarea focus state (mirrors TextField focus ring behaviour)
  const [addressFocused,   setAddressFocused]    = useState(false);

  const addressHasError = submitted && !guestAddress.trim();

  const deliveryChecks = checks.filter(c => c.serviceType === 'DELIVERY');
  const openChecks     = deliveryChecks.filter(c => c.status !== 'CLOSED');
  const closedChecks   = deliveryChecks.filter(c => c.status === 'CLOSED');

  const handleClose = () => {
    setShowNewOrder(false);
    setGuestName('');
    setGuestPhone('');
    setGuestAddress('');
    setSubmitted(false);
    setAddressFocused(false);
  };

  const handleNewOrder = () => {
    setSubmitted(true);
    if (!guestAddress.trim()) return;   // Keep dialog open, show error

    const checkId = createCheck({
      serviceType:  'DELIVERY',
      guestName:    guestName    || undefined,
      guestPhone:   guestPhone   || undefined,
      guestAddress: guestAddress.trim(),
      status:       'OPEN',
      billPrinted:  false,
    });
    handleClose();
    navigate(`/check/${checkId}?autoMenu=true`);
  };

  // ── Status badge ─────────────────────────────────────────────────────────────
  const statusBadge = (status: string) => {
    const map: Record<string, { bg: string; color: string; label: string }> = {
      OPEN:           { bg: 'var(--status-green-container)',       color: 'var(--status-green-primary)',       label: 'Open' },
      PARTIALLY_PAID: { bg: 'var(--status-yellow-container)',      color: 'var(--status-yellow-primary)',      label: 'Partial' },
      CLOSED:         { bg: 'var(--neutral-surface-greylighter)',  color: 'var(--neutral-onsurface-secondary)', label: 'Closed' },
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

  // ── Textarea styled to match TextField design system ──────────────────────────
  // Mirrors TextField: same border, bg, radius, font, focus ring, error state
  const addressBorderColor = addressHasError
    ? 'var(--status-red-primary)'
    : addressFocused
      ? 'var(--feature-brand-primary)'
      : 'var(--neutral-line-outline)';

  const addressBoxShadow = addressFocused
    ? addressHasError
      ? '0 0 0 2px rgba(208,2,27,0.18)'
      : '0 0 0 2px rgba(0,107,255,0.18)'
    : 'none';

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
        <p style={{ fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)', marginBottom: 4 }}>
          <span style={{ color: 'var(--neutral-onsurface-secondary)' }}>Phone: </span>{check.guestPhone}
        </p>
      )}
      {check.guestAddress && (
        <p
          className="line-clamp-2"
          style={{ fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)', marginBottom: 8 }}
        >
          <span style={{ color: 'var(--neutral-onsurface-secondary)' }}>Address: </span>{check.guestAddress}
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
          Delivery Orders
        </p>
        <MainBtn variant="primary" size="md" onClick={() => setShowNewOrder(true)}>
          <Plus className="w-4 h-4" />
          New Order
        </MainBtn>
      </div>

      {/* List — or empty state filling remaining height */}
      {deliveryChecks.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            title="No Delivery Orders Yet"
            subtitle="Tap 'New Order' to add your first delivery"
          />
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-8">

            {/* Active deliveries */}
            {openChecks.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="w-5 h-5" style={{ color: 'var(--status-yellow-primary)' }} />
                  <p style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)' }}>
                    Active Deliveries <span style={{ color: 'var(--neutral-onsurface-secondary)', fontWeight: 'var(--font-weight-regular)' }}>({openChecks.length})</span>
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {openChecks.map(c => <OrderCard key={c.id} check={c} />)}
                </div>
              </div>
            )}

            {/* Completed deliveries */}
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
              New Delivery Order
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-secondary)' }}>
              Fill in the customer details and delivery address.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-4">

            {/* Customer Name — optional */}
            <div className="space-y-1.5">
              <label
                htmlFor="dl-name"
                style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)', display: 'block' }}
              >
                Customer Name
                <span style={{ fontSize: 'var(--text-h4)', color: 'var(--neutral-onsurface-tertiary)', marginLeft: 6 }}>(optional)</span>
              </label>
              <TextField
                id="dl-name"
                type="text"
                placeholder="e.g. Budi Santoso"
                value={guestName}
                onChange={e => setGuestName(e.target.value)}
                className="h-[48px]"
              />
            </div>

            {/* Phone — optional */}
            <div className="space-y-1.5">
              <label
                htmlFor="dl-phone"
                style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)', display: 'block' }}
              >
                Phone Number
                <span style={{ fontSize: 'var(--text-h4)', color: 'var(--neutral-onsurface-tertiary)', marginLeft: 6 }}>(optional)</span>
              </label>
              <TextField
                id="dl-phone"
                type="tel"
                placeholder="e.g. 0812-3456-7890"
                value={guestPhone}
                onChange={e => setGuestPhone(e.target.value)}
                className="h-[48px]"
              />
            </div>

            {/* Delivery Address — required */}
            <div className="space-y-1.5">
              <label
                htmlFor="dl-address"
                style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)', display: 'block' }}
              >
                <span style={{ color: 'var(--status-red-primary)' }}>* </span>Delivery Address
              </label>

              {/* Textarea styled to match TextField states */}
              <Textarea
                id="dl-address"
                rows={3}
                placeholder="Enter full delivery address..."
                value={guestAddress}
                onChange={e => setGuestAddress(e.target.value)}
                onFocus={() => setAddressFocused(true)}
                onBlur={() => setAddressFocused(false)}
                className="w-full px-3 py-2 outline-none resize-none transition-all duration-200"
                style={{
                  backgroundColor: 'var(--neutral-surface-primary)',
                  border:          `1px solid ${addressBorderColor}`,
                  borderRadius:    'var(--radius-input)',
                  boxShadow:       addressBoxShadow,
                  color:           'var(--neutral-onsurface-primary)',
                  fontFamily:      'Lato, sans-serif',
                  fontSize:        'var(--text-p)',
                  fontWeight:      'var(--font-weight-regular)',
                  // Placeholder inherits from CSS cascade
                }}
              />

              {/* Inline error message — shown after first submit attempt */}
              {addressHasError && (
                <p
                  style={{
                    fontSize:   'var(--text-h4)',
                    fontFamily: 'Lato, sans-serif',
                    color:      'var(--status-red-primary)',
                    marginTop:  4,
                  }}
                >
                  Delivery address is required.
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-3">
            <MainBtn variant="secondary" size="lg" onClick={handleClose} className="flex-1">
              Cancel
            </MainBtn>
            {/*
              MainBtn automatically switches to the 'disabled' variant style
              (greylighter bg + tertiary text + not-allowed cursor) when disabled={true}.
              We keep the button always rendered so the user sees it's unavailable.
            */}
            <MainBtn
              variant="primary"
              size="lg"
              onClick={handleNewOrder}
              disabled={submitted && !guestAddress.trim()}
              className="flex-1"
            >
              Create Order
            </MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}