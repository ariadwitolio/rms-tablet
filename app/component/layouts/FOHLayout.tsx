import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, useMatch } from 'react-router';
import { Button } from '../ui/button';
import { Receipt, DoorClosed, Plus, Minus, User } from 'lucide-react';
import svgNavPaths from '../../../imports/svg-529qqhvi70';
import { useRestaurant } from '../../context/RestaurantContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { MainBtn } from '../ui/MainBtn';
import { useSnackbar } from '../labamu/Snackbar';
import { SelectableCard } from '../ui/SelectableCard';
import { TextField } from '../ui/TextField';
import { Textarea } from '../ui/textarea';
import { OperationIcon } from '../ui/OperationIcon';
import { CashCounterBtn } from '../ui/CashCounterBtn';
import { QuantityStepper } from '../ui/QuantityStepper';
import { SelectionIndicator } from '../labamu/SelectionIndicator';
import { useSplitBillNavigationGuard } from '../../context/SplitBillNavigationGuard';
import { EmptyState } from '../ui/EmptyState';
import { Chip } from '../ui/Chip';
import { DesktopTab } from '../ui/DesktopTab';
import { TabGroup } from '../ui/TabGroup';
import { LabamuWordmark } from '../LabamuWordmark';

function FOHLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cashierOpen, cashierBalance, openCashier, closeCashier, checks } = useRestaurant();
  const { requestNavigation } = useSplitBillNavigationGuard();
  const snackbar = useSnackbar();

  // Resolve the current check's service type when on /check/:checkId route
  const checkMatch = useMatch('/check/:checkId');
  const currentCheckId = checkMatch?.params?.checkId;
  const currentCheck = currentCheckId ? checks.find(c => c.id === currentCheckId) : undefined;

  const isDineInActive =
    location.pathname === '/' ||
    location.pathname === '/dine-in' ||
    (location.pathname.startsWith('/check') && (!currentCheck || currentCheck.serviceType === 'DINE_IN'));

  const isTakeawayActive =
    location.pathname === '/takeaway' ||
    (location.pathname.startsWith('/check') && currentCheck?.serviceType === 'TAKEAWAY');

  const isDeliveryActive =
    location.pathname === '/delivery' ||
    (location.pathname.startsWith('/check') && currentCheck?.serviceType === 'DELIVERY');

  // Cashier modals
  const [showOpenCashierModal, setShowOpenCashierModal] = useState(!cashierOpen);

  useEffect(() => {
    if (!cashierOpen) setShowOpenCashierModal(true);
  }, [cashierOpen]);
  const [showCloseCashierModal, setShowCloseCashierModal] = useState(false);
  const [openingBalance, setOpeningBalance] = useState('');
  const [cashCount, setCashCount] = useState('');
  const [cardCounted, setCardCounted] = useState('0.00');
  const [accountCounted, setAccountCounted] = useState('0.00');
  const [openingNote, setOpeningNote] = useState('');
  const [closingNote, setClosingNote] = useState('');

  // Cash breakdown modal
  const PAPER_MONEY = [100000, 50000, 20000, 10000, 5000, 2000, 1000];
  const COIN_DENOMS = [1000, 500, 200, 100, 50];
  const ALL_DENOMS = [...PAPER_MONEY, ...COIN_DENOMS];

  const initDenominations = () => {
    const d: Record<number, number> = {};
    ALL_DENOMS.forEach(v => { d[v] = 0; });
    return d;
  };

  const [showCashBreakdownModal, setShowCashBreakdownModal] = useState(false);
  const [denominations, setDenominations] = useState<Record<number, number>>(initDenominations());

  const denominationTotal = ALL_DENOMS.reduce((sum, denom) => sum + denom * (denominations[denom] || 0), 0);

  const updateDenomination = (value: number, delta: number) => {
    setDenominations(prev => ({ ...prev, [value]: Math.max(0, (prev[value] || 0) + delta) }));
  };

  const handleOpenBreakdown = () => {
    setDenominations(initDenominations());
    setShowCashBreakdownModal(true);
  };

  const handleCashBreakdownConfirm = () => {
    setOpeningBalance(denominationTotal.toString());
    setShowCashBreakdownModal(false);
  };

  const handleOpenCashier = () => {
    setShowOpenCashierModal(true);
    setOpeningBalance(cashierBalance.toString());
  };

  const handleConfirmOpenCashier = () => {
    openCashier('', parseFloat(openingBalance) || 0);
    setShowOpenCashierModal(false);
    setOpeningBalance('');
    
    // Navigate to table layout screen (Dine-In)
    navigate('/dine-in');
  };

  const handleCloseCashier = () => {
    requestNavigation(() => {
      setShowCloseCashierModal(true);
      setCashCount(cashierBalance.toString());
      setCardCounted('0.00');
      setAccountCounted('0.00');
      setClosingNote('');
    });
  };

  const handleConfirmCloseCashier = () => {
    const cashCountValue = parseFloat(cashCount) || 0;
    closeCashier(cashCountValue);
    snackbar.success('Cashier closed successfully');
    setShowCloseCashierModal(false);
    setCashCount('');
    setCardCounted('0.00');
    setAccountCounted('0.00');
    setClosingNote('');
  };

  const handleDiscardCloseCashier = () => {
    setShowCloseCashierModal(false);
    setCashCount('');
    setCardCounted('0.00');
    setAccountCounted('0.00');
    setClosingNote('');
  };

  // Calculate values for closing register
  const openingCash = cashierBalance;
  const cashInOut = 0; // This would come from actual cash in/out transactions
  const cashCounted = parseFloat(cashCount) || 0;
  const cashDifference = cashCounted - (openingCash + cashInOut);
  const cardCountedValue = parseFloat(cardCounted) || 0;
  const cardDifference = cardCountedValue - 0; // Actual card total would come from transactions
  const accountCountedValue = parseFloat(accountCounted) || 0;
  const accountDifference = accountCountedValue - 0; // Actual account total would come from transactions
  const totalOrders = 0; // This would come from actual orders
  const totalOrdersAmount = 0; // This would come from actual orders

  const isServiceRoute = () => {
    return location.pathname === '/' || 
           location.pathname === '/dine-in' || 
           location.pathname === '/takeaway' || 
           location.pathname === '/delivery' ||
           location.pathname.startsWith('/check');
  };

  const isTransactionsRoute = () => {
    return location.pathname === '/transactions';
  };

  const isTransactionHistoryRoute = () => {
    return location.pathname === '/transaction-history';
  };

  const getCurrentServiceType = () => {
    if (location.pathname === '/takeaway') return 'Takeaway';
    if (location.pathname === '/delivery') return 'Delivery';
    return 'Dine-In';
  };

  return (
    <div className="h-screen flex bg-background relative">
      {/* Main Content Area — full width, sidebar removed */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <div
          className="shrink-0 z-10 flex items-center relative"
          style={{
            height: 72,
            backgroundColor: 'var(--neutral-surface-primary)',
            borderBottom: '1px solid var(--neutral-line-outline)',
          }}
        >
          {/* Left: Labamu logo — always visible, sits above the tab overlay */}
          <div
            style={{
              width:       420,
              height:      '100%',
              display:     'flex',
              alignItems:  'center',
              padding:     '0 24px',
              flexShrink:  0,
              position:    'relative',
              zIndex:      1,
            }}
          >
            <LabamuWordmark size="sm" />
          </div>

          {/* Center spacer — keeps the right zone pushed to the edge;
              the actual tabs live in the absolutely-centred overlay below */}
          <div style={{ flex: 1 }} />

          {/* Right: action buttons — sits above the tab overlay */}
          <div
            className="flex items-center gap-4"
            style={{ paddingRight: 24, flexShrink: 0, position: 'relative', zIndex: 11 }}
          >
            {cashierOpen && (
              <MainBtn
                size="lg"
                style={{ backgroundColor: '#e6f0ff', borderColor: '#b3d9ff', borderWidth: '1.5px', color: '#282828', fontWeight: 600 }}
                onClick={handleCloseCashier}
              >
                <DoorClosed className="w-4 h-4 mr-1.5 shrink-0" />
                Close POS
              </MainBtn>
            )}

            <MainBtn
              size="lg"
              style={{ backgroundColor: '#e6f0ff', borderColor: '#b3d9ff', borderWidth: '1.5px', color: '#282828', fontWeight: 600 }}
              className="min-w-[56px]"
              onClick={() => navigate('/home')}
            >
              <User className="w-5 h-5" />
            </MainBtn>
          </div>

          {/* Tabs: absolutely centred across the full header width so they
              land at exactly 50 % of the viewport regardless of the
              asymmetric left (420 px) / right (~211 px) flank widths.
              pointer-events:none on the overlay + auto on the inner
              wrapper means left/right zones remain fully interactive. */}
          {cashierOpen && (() => {
            const activeKey =
              isServiceRoute()      ? 'service' :
              isTransactionsRoute() ? 'order'   : 'transaction';

            type TabKey = 'service' | 'order' | 'transaction';

            const handleTabClick = (key: TabKey) => {
              if (key === 'service')     requestNavigation(() => navigate('/dine-in'));
              if (key === 'order')       requestNavigation(() => navigate('/transactions'));
              if (key === 'transaction') requestNavigation(() => navigate('/transaction-history'));
            };

            return (
              <div
                style={{
                  position:       'absolute',
                  inset:          0,
                  display:        'flex',
                  justifyContent: 'center',
                  alignItems:     'center',
                  pointerEvents:  'none',
                  zIndex:         10,
                }}
              >
                <div style={{ pointerEvents: 'auto', width: 'fit-content', position: 'relative', zIndex: 10 }}>
                  <TabGroup
                    options={[
                      {
                        value: 'service',
                        label: 'Service',
                        icon: (
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <g clipPath="url(#clip_service)">
                              <path d={svgNavPaths.p3af0d580} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                              <path d={svgNavPaths.p3514ce64} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                              <path d={svgNavPaths.pbe0900}   stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                              <path d="M1.5 5.25H16.5"        stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                              <path d={svgNavPaths.p3d952b80} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                            </g>
                            <defs>
                              <clipPath id="clip_service"><rect width="18" height="18" fill="white" /></clipPath>
                            </defs>
                          </svg>
                        ),
                      },
                      {
                        value: 'order',
                        label: 'Order',
                        icon: (
                          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d={svgNavPaths.p22c79200} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                            <path d={svgNavPaths.p173d700}   stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                            <path d="M9 8.25H12"             stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                            <path d="M9 12H12"               stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                            <path d="M6 8.25H6.0075"         stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                            <path d="M6 12H6.0075"           stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </svg>
                        ),
                      },
                      {
                        value: 'transaction',
                        label: 'Transaction',
                        icon: <Receipt width={18} height={18} strokeWidth={1.5} />,
                      },
                    ]}
                    value={activeKey}
                    onChange={handleTabClick}
                    size="md"
                    tabWidth={140}
                  />
                </div>
              </div>
            );
          })()}
        </div>

        {/* Content area below header */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Service Type Sub-Navigation — Dine-In / Takeaway / Delivery chips */}
          {cashierOpen && isServiceRoute() && !checkMatch && (
            <div
              className="shrink-0 flex items-center gap-2"
              style={{
                backgroundColor: 'var(--neutral-surface-primary)',
                borderBottom:    '1px solid var(--neutral-line-outline)',
                padding:         '10px 20px',
              }}
            >
              <Chip
                active={isDineInActive}
                onClick={() => requestNavigation(() => navigate('/dine-in'))}
                label="Dine-In"
              />
              <Chip
                active={isTakeawayActive}
                onClick={() => requestNavigation(() => navigate('/takeaway'))}
                label="Takeaway"
              />
              <Chip
                active={isDeliveryActive}
                onClick={() => requestNavigation(() => navigate('/delivery'))}
                label="Delivery"
              />
            </div>
          )}

          {/* Page Content */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Open Cashier Modal */}
      <Dialog
        open={showOpenCashierModal}
        onOpenChange={(open) => { if (cashierOpen) setShowOpenCashierModal(open); }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="items-center text-center">
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Open POS
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-regular)' }}>
              Enter the opening cash balance
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="opening-balance" style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)' }}>
                Opening Cash Balance
              </Label>
              <div className="flex gap-2">
                <TextField
                  id="opening-balance"
                  type="number"
                  placeholder="0.00"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  className="h-[48px] flex-1"
                />
                <CashCounterBtn
                  onClick={handleOpenBreakdown}
                  variant="primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="opening-note" style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)' }}>
                Opening Note
              </Label>
              <TextField
                id="opening-note"
                type="text"
                placeholder="Enter any notes"
                value={openingNote}
                onChange={(e) => setOpeningNote(e.target.value)}
                className="h-[48px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <MainBtn variant="primary" onClick={handleConfirmOpenCashier} size="lg" className="w-full">
              Open POS
            </MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cash Breakdown Modal */}
      <Dialog open={showCashBreakdownModal} onOpenChange={setShowCashBreakdownModal}>
        <DialogContent className="sm:max-w-[1100px] max-h-[90vh] flex flex-col">
          <DialogHeader className="items-center text-center shrink-0">
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
              Count Cash
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-body)', fontWeight: 'var(--font-weight-regular)' }}>
              Enter the quantity for each denomination
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 space-y-5">
            {/* Running total */}
            <div
              className="flex items-center justify-between px-4 py-3 rounded-lg"
              style={{ backgroundColor: 'var(--feature-brand-containerlighter)', borderRadius: 'var(--radius-card)', border: '1px solid var(--neutral-line-outline)' }}
            >
              <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--neutral-onsurface-primary)' }}>
                Total
              </span>
              <span style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)', color: 'var(--feature-brand-primary)' }}>
                Rp {denominationTotal.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Paper Money */}
              <div className="space-y-6" style={{ padding: '16px', border: '1px solid var(--neutral-line-outline)', borderRadius: 'var(--radius-card)' }}>
                <div className="flex items-center gap-2 pb-2" style={{ borderBottom: '1px solid var(--neutral-line-outline)' }}>
                  
                  <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>Paper Money</span>
                </div>
                {PAPER_MONEY.map(denom => (
                  <div key={denom} className="flex items-center gap-4">
                    <span className="w-[90px] shrink-0" style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-secondary)' }}>
                      Rp {denom.toLocaleString('id-ID')}
                    </span>
                    <QuantityStepper
                      value={denominations[denom] || 0}
                      onDecrement={() => updateDenomination(denom, -1)}
                      onIncrement={() => updateDenomination(denom, 1)}
                      min={0}
                      size="xl"
                    />
                    <span
                      className="min-w-[190px] text-right whitespace-nowrap shrink-0"
                      style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-secondary)' }}
                    >
                      Rp {(denom * (denominations[denom] || 0)).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coins */}
              <div className="space-y-6" style={{ padding: '16px', border: '1px solid var(--neutral-line-outline)', borderRadius: 'var(--radius-card)' }}>
                <div className="flex items-center gap-2 pb-2" style={{ borderBottom: '1px solid var(--neutral-line-outline)' }}>
                  <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>Coins</span>
                </div>
                {COIN_DENOMS.map(denom => (
                  <div key={denom} className="flex items-center gap-4">
                    <span className="w-[90px] shrink-0" style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-secondary)' }}>
                      Rp {denom.toLocaleString('id-ID')}
                    </span>
                    <QuantityStepper
                      value={denominations[denom] || 0}
                      onDecrement={() => updateDenomination(denom, -1)}
                      onIncrement={() => updateDenomination(denom, 1)}
                      min={0}
                      size="xl"
                    />
                    <span
                      className="min-w-[190px] text-right whitespace-nowrap shrink-0"
                      style={{ fontSize: 'var(--text-p)', color: 'var(--neutral-onsurface-secondary)' }}
                    >
                      Rp {(denom * (denominations[denom] || 0)).toLocaleString('id-ID')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 shrink-0 pt-2 border-t" style={{ borderColor: 'var(--neutral-line-outline)' }}>
            <MainBtn variant="secondary" onClick={() => setShowCashBreakdownModal(false)} size="lg" className="w-full">
              Back
            </MainBtn>
            <MainBtn variant="primary" onClick={handleCashBreakdownConfirm} size="lg" className="w-full">
              Apply Total
            </MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Close Cashier Modal */}
      <Dialog open={showCloseCashierModal} onOpenChange={setShowCloseCashierModal}>
        <DialogContent className="sm:max-w-[820px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <div className="space-y-2 text-center">
              <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-bold)' }}>
                Closing Register
              </DialogTitle>
              <p style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-regular)', color: 'var(--neutral-onsurface-secondary)' }}>
                {totalOrders} orders: Rp {totalOrdersAmount.toFixed(2)}
              </p>
            </div>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Cash Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-regular)' }}>Opening</span>
                <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>Rp {openingCash.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-regular)' }}>Cash Count</span>
                <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>Rp {cashCounted.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-regular)' }}>Cash In/Out</span>
                <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>Rp {cashInOut.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-regular)' }}>Difference</span>
                <span style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)' }}>Rp {cashDifference.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t" style={{ borderColor: 'var(--neutral-line-outline)' }} />

            {/* Cash Count Input */}
            <div className="space-y-2">
              <Label htmlFor="cash-count-input" style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)' }}>
                Cash Count
              </Label>
              <div className="flex gap-2">
                <TextField
                  id="cash-count-input"
                  type="number"
                  placeholder="0.00"
                  value={cashCount}
                  onChange={(e) => setCashCount(e.target.value)}
                  className="h-[48px] flex-1"
                  style={{ fontSize: 'var(--text-p)', borderRadius: '8px' }}
                />
                <CashCounterBtn
                  onClick={() => setShowCashBreakdownModal(true)}
                  variant="primary"
                />
              </div>
            </div>

            {/* Notes Section */}
            <div className="grid grid-cols-2 gap-4">
              {/* Opening Note */}
              <div className="space-y-2">
                <Label htmlFor="opening-note-display" style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)' }}>
                  Opening Note
                </Label>
                <textarea
                  id="opening-note-display"
                  className="w-full h-[100px] p-3 border border-border rounded-md bg-muted text-muted-foreground resize-none"
                  value={openingNote || 'Opening details:\n  3 x Rp 100.00\n  2 x Rp 200.00'}
                  readOnly
                  style={{ fontSize: 'var(--text-p)' }}
                />
              </div>

              {/* Closing Note */}
              <div className="space-y-2">
                <Label htmlFor="closing-note-input" style={{ fontSize: 'var(--text-h4)', fontWeight: 'var(--font-weight-semibold)' }}>
                  Closing Note
                </Label>
                <Textarea
                  id="closing-note-input"
                  placeholder="Add a closing note..."
                  value={closingNote}
                  onChange={(e) => setClosingNote(e.target.value)}
                  className="min-h-[100px]"
                  style={{ fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif' }}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-between items-center gap-3 pt-4">
            <div className="flex gap-2 flex-1">
              <MainBtn variant="primary" onClick={handleConfirmCloseCashier} size="lg" className="flex-1">
                Close Register
              </MainBtn>
            </div>
            <div className="flex gap-2 flex-1">
              <MainBtn variant="secondary" size="lg" className="flex-1">
                Cash In/Out
              </MainBtn>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

FOHLayout.displayName = 'FOHLayout';

export default FOHLayout;