import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Store, Layers, Umbrella,
  Users, UtensilsCrossed, Minus, Plus,
  DoorOpen, DoorClosed, Bath, ChefHat, Wine, Package, Banknote, MoveVertical, Box,
  Printer, CreditCard, ClipboardList, X,
} from 'lucide-react';
import { SelectableCard } from '../ui/SelectableCard';
import { TextField } from '../ui/TextField';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../ui/dialog';
import { Label } from '../ui/label';
import { FLOORS, ROOM_AREAS, TABLES, FLOOR_LABELS } from '../../data/mockData';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatCurrency } from '../../utils/formatters';
import type { LabelType, Table, ItemStatus } from '../../types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function isRoundShape(shape: Table['shape']) {
  return shape === 'round' || shape === 'oval' || shape === 'circle';
}

function tableColors(opsState: string, isBlocked: boolean, isUnderMin: boolean) {
  if (isBlocked)  return { bg: 'rgba(107,114,128,0.15)', border: '#9CA3AF', text: '#9CA3AF' };
  if (isUnderMin) return { bg: '#F59E0B',                border: '#F59E0B', text: '#ffffff' };
  switch (opsState) {
    case 'OCCUPIED': return { bg: '#EF4444', border: '#EF4444', text: '#ffffff' };
    case 'BILLED':   return { bg: '#006BFF', border: '#006BFF', text: '#ffffff' };
    case 'PAID':     return { bg: '#22C55E', border: '#22C55E', text: '#ffffff' };
    default:         return { bg: '#22C55E', border: '#22C55E', text: '#ffffff' };
  }
}

const LABEL_ICONS: Record<LabelType, React.ElementType> = {
  entrance: DoorOpen, exit: DoorClosed, toilet: Bath, kitchen: ChefHat,
  bar: Wine, storage: Package, cashier: Banknote, stairs: Layers,
  elevator: MoveVertical, custom: Box,
};

const FLOOR_ICONS = [Store, Layers, Umbrella];

const LEGEND = [
  { color: '#22C55E', label: 'Available' },
  { color: '#EF4444', label: 'Occupied' },
  { color: '#F59E0B', label: 'Min. Not Reached' },
  { color: '#006BFF', label: 'Paid' },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function FloorLayout() {
  const navigate = useNavigate();
  const { getTableState, getCheckByTable, createCheck, getItemsByCheck, checks } = useRestaurant();

  const [selectedFloor, setSelectedFloor] = useState(FLOORS[0].id);
  const [zoom, setZoom] = useState(1.0);
  const [showGuestModal, setShowGuestModal]     = useState(false);
  const [selectedTableId, setSelectedTableId]   = useState<string | null>(null);
  const [guestCount, setGuestCount]             = useState('');
  const [guestName, setGuestName]               = useState('');
  const [guestPhone, setGuestPhone]             = useState('');
  const [manualInputMode, setManualInputMode]   = useState(false);

  // Preview modal for occupied tables
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTableId, setPreviewTableId]     = useState<string | null>(null);

  // ── Table interaction ──────────────────────────────────────────────────────

  const handleTableClick = (tableId: string) => {
    const table = TABLES.find(t => t.id === tableId);
    if (!table || table.tableStatus === 'Blocked') return;
    const state = getTableState(tableId);
    if (state === 'AVAILABLE') {
      setSelectedTableId(tableId);
      setShowGuestModal(true);
    } else {
      // Show preview popup for all occupied/billed/paid tables
      setPreviewTableId(tableId);
      setShowPreviewModal(true);
    }
  };

  const handleGuestConfirm = () => {
    if (!selectedTableId || !guestCount) return;
    const table = TABLES.find(t => t.id === selectedTableId);
    const checkId = createCheck({
      serviceType:     'DINE_IN',
      tableId:         selectedTableId,
      guestCount:      parseInt(guestCount),
      guestName:       guestName || undefined,
      guestPhone:      guestPhone || undefined,
      status:          'OPEN',
      billPrinted:     false,
      seatedAt:        new Date(),
      maxSeatedMinutes: 90,
      minPurchaseAmount: table?.minimumPurchase || 0,
    });
    setShowGuestModal(false);
    setGuestCount(''); setGuestName(''); setGuestPhone('');
    setSelectedTableId(null); setManualInputMode(false);
    navigate(`/check/${checkId}`, { state: { autoOpenMenu: true } });
  };

  // ── Per-table helpers ──────────────────────────────────────────────────────

  const getTableTotal      = (id: string) => getCheckByTable(id)?.totalAmount ?? 0;
  const getTableGuestCount = (id: string) => getCheckByTable(id)?.guestCount  ?? 0;
  const getElapsed         = (id: string) => {
    const check = getCheckByTable(id);
    if (!check) return null;
    const mins = Math.floor((Date.now() - check.createdAt.getTime()) / 60000);
    return { str: mins < 60 ? `${mins}m` : `${Math.floor(mins/60)}h ${mins%60}m`,
             over: (check.maxSeatedMinutes ?? 0) > 0 && mins > (check.maxSeatedMinutes ?? 0) };
  };
  const getOrderStatus = (id: string) => {
    const check = getCheckByTable(id);
    return check && getItemsByCheck(check.id).some(i => i.status === 'READY') ? 'READY' : null;
  };

  // ── Floor data ─────────────────────────────────────────────────────────────

  const currentFloor  = FLOORS.find(f => f.id === selectedFloor);
  const floorSections = ROOM_AREAS.filter(a => a.floorId === selectedFloor);
  const floorTables   = TABLES.filter(t => ROOM_AREAS.find(a => a.id === t.areaId && a.floorId === selectedFloor));
  const floorLabels   = FLOOR_LABELS.filter(l => l.floorId === selectedFloor);

  const canvasW = (currentFloor?.canvasWidth  ?? 900) * zoom;
  const canvasH = (currentFloor?.canvasHeight ?? 600) * zoom;

  const zoomIn  = () => setZoom(z => Math.min(1.5, Math.round((z + 0.25) * 100) / 100));
  const zoomOut = () => setZoom(z => Math.max(0.5, Math.round((z - 0.25) * 100) / 100));

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>

      {/* ── Floor tabs + legend ───────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between shrink-0 px-4"
        style={{ borderBottom: '1px solid var(--neutral-line-outline)', backgroundColor: '#FFFFFF' }}
      >
        {/* Floor tabs */}
        <div className="flex">
          {FLOORS.map((floor, index) => {
            const Icon       = FLOOR_ICONS[index % FLOOR_ICONS.length];
            const isSelected = selectedFloor === floor.id;
            return (
              <button
                key={floor.id}
                onClick={() => setSelectedFloor(floor.id)}
                className="flex items-center gap-2 px-4 py-3 transition-colors"
                style={{
                  fontFamily:   'Lato, sans-serif',
                  fontSize:     'var(--text-p)',
                  fontWeight:   isSelected ? 'var(--font-weight-bold)' : 'var(--font-weight-regular)',
                  color:        isSelected ? 'var(--feature-brand-primary)' : 'var(--neutral-onsurface-secondary)',
                  borderBottom: isSelected ? '2px solid var(--feature-brand-primary)' : '2px solid transparent',
                  marginBottom: -1,
                  background:   'none',
                  border:       'none',
                  borderBottom: isSelected ? '2px solid var(--feature-brand-primary)' : '2px solid transparent',
                  cursor:       'pointer',
                }}
              >
                <Icon size={15} />
                {floor.name}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-5">
          {LEGEND.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div style={{ width: 9, height: 9, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-secondary)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Body row: canvas + optional right panel ──────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

      {/* ── Ceramic canvas ────────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-auto p-6"
        style={{
          backgroundColor: '#F8F8F5',
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.055) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
        }}
      >
        {/* Absolute-positioned canvas — sections and labels share the same coordinate space */}
        <div style={{ position: 'relative', width: canvasW, height: canvasH }}>

          {/* Floor labels — rendered at their canvas coordinates */}
          {floorLabels.map(lbl => {
            const Icon = LABEL_ICONS[lbl.type] || Box;
            return (
              <div
                key={lbl.id}
                className="flex items-center gap-1.5"
                style={{
                  position:        'absolute',
                  left:            lbl.x * zoom,
                  top:             lbl.y * zoom,
                  height:          lbl.height * zoom,
                  padding:         '0 10px',
                  backgroundColor: 'white',
                  border:          `1.5px solid ${lbl.color}`,
                  borderRadius:    8,
                  fontSize:        12,
                  fontFamily:      'Lato, sans-serif',
                  fontWeight:      600,
                  color:           lbl.color,
                  whiteSpace:      'nowrap',
                  boxShadow:       '0 1px 3px rgba(0,0,0,0.08)',
                  pointerEvents:   'none',
                }}
              >
                <Icon size={13} />
                {lbl.name}
              </div>
            );
          })}

          {floorSections.map(section => {
            const sectionTables = floorTables.filter(t => t.areaId === section.id);
            const totalSeats    = sectionTables.reduce((s, t) => s + t.capacity, 0);
            const occupiedSeats = sectionTables
              .filter(t => getTableState(t.id) === 'OCCUPIED')
              .reduce((s, t) => s + getTableGuestCount(t.id), 0);
            const cardW = section.width  * zoom;
            const cardH = section.height * zoom;

            return (
              <div
                key={section.id}
                className="bg-white rounded-2xl overflow-hidden"
                style={{
                  position:  'absolute',
                  left:      section.x * zoom,
                  top:       section.y * zoom,
                  width:     cardW,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.06)',
                  opacity:   section.isBlocked ? 0.65 : 1,
                }}
              >
                {/* Section header */}
                <div
                  className="flex items-center justify-between"
                  style={{
                    padding:      '10px 16px',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{
                      fontFamily:  'Lato, sans-serif',
                      fontSize:    'var(--text-p)',
                      fontWeight:  'var(--font-weight-bold)',
                      color:       section.isBlocked ? '#9CA3AF' : 'var(--neutral-onsurface-primary)',
                    }}>
                      {section.name}
                    </span>
                    {section.isBlocked && (
                      <span style={{
                        fontSize: 11, fontFamily: 'Lato, sans-serif',
                        color: '#fff', backgroundColor: '#9CA3AF',
                        padding: '1px 7px', borderRadius: 999,
                      }}>
                        CLOSED
                      </span>
                    )}
                  </div>
                  {!section.isBlocked && (
                    <div className="flex items-center gap-1" style={{ color: '#22C55E', fontSize: 13, fontFamily: 'Lato, sans-serif', fontWeight: 600 }}>
                      <Users size={13} />
                      {occupiedSeats} / {totalSeats} Seats
                    </div>
                  )}
                </div>

                {/* Table canvas — coordinates normalised to section origin */}
                <div className="relative" style={{ width: cardW, height: cardH }}>
                  {sectionTables.map(table => {
                    const opsState   = getTableState(table.id);
                    const isBlocked  = (table.tableStatus === 'Blocked') && opsState === 'AVAILABLE';
                    const total      = getTableTotal(table.id);
                    const gCount     = getTableGuestCount(table.id);
                    const isUnderMin = opsState === 'OCCUPIED' && table.minimumPurchase > 0 && total < table.minimumPurchase;
                    const elapsed    = getElapsed(table.id);
                    const hasReady   = getOrderStatus(table.id) === 'READY';
                    const { bg, border, text } = tableColors(opsState, isBlocked, isUnderMin);
                    const isRound    = isRoundShape(table.shape);

                    return (
                      <button
                        key={table.id}
                        onClick={() => handleTableClick(table.id)}
                        disabled={isBlocked}
                        className="absolute flex flex-col items-center justify-center transition-transform duration-150"
                        style={{
                          left:            (table.x - section.x) * zoom,
                          top:             (table.y - section.y) * zoom,
                          width:           table.width  * zoom,
                          height:          table.height * zoom,
                          borderRadius:    isRound ? '50%' : 8,
                          backgroundColor: bg,
                          border:          `2px solid ${border}`,
                          cursor:          isBlocked ? 'not-allowed' : 'pointer',
                          padding:         4,
                          gap:             2,
                          overflow:        'visible',
                        }}
                        onMouseEnter={e => {
                          if (!isBlocked) {
                            (e.currentTarget as HTMLElement).style.transform  = 'scale(1.05)';
                            (e.currentTarget as HTMLElement).style.boxShadow  = '0 4px 14px rgba(0,0,0,0.22)';
                            (e.currentTarget as HTMLElement).style.zIndex     = '10';
                          }
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                          (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                          (e.currentTarget as HTMLElement).style.zIndex    = '';
                        }}
                      >
                        {/* Order-ready badge */}
                        {opsState === 'OCCUPIED' && hasReady && (
                          <div style={{
                            position: 'absolute', top: 0, right: 0,
                            transform: 'translate(50%,-50%)',
                            backgroundColor: '#54A73F',
                            width: 16, height: 16, borderRadius: '50%',
                            border: '2px solid #fff', zIndex: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <UtensilsCrossed style={{ width: 9, height: 9, color: '#fff' }} />
                          </div>
                        )}

                        <p style={{ fontSize: table.width * zoom >= 90 ? 14 : 12, fontWeight: 700, fontFamily: 'Lato, sans-serif', color: text, lineHeight: 1 }}>
                          {table.name}
                        </p>

                        {opsState === 'AVAILABLE' && !isBlocked && (
                          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontFamily: 'Lato, sans-serif' }}>
                            {table.capacity} pax
                          </p>
                        )}

                        {isBlocked && (
                          <p style={{ fontSize: 10, color: '#9CA3AF', fontFamily: 'Lato, sans-serif' }}>Blocked</p>
                        )}

                        {opsState === 'OCCUPIED' && (
                          <>
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontFamily: 'Lato, sans-serif' }}>
                              {gCount} pax
                            </p>
                            <p style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Lato, sans-serif', color: '#fff' }}>
                              {formatCurrency(total)}
                            </p>
                            {elapsed && (
                              <div style={{
                                fontSize: 10, fontWeight: 700, fontFamily: 'Lato, sans-serif',
                                color:    elapsed.over ? '#ffcccc' : 'rgba(255,255,255,0.9)',
                                backgroundColor: 'rgba(0,0,0,0.25)',
                                padding: '1px 5px', borderRadius: 3,
                                border:  `1px solid ${elapsed.over ? 'rgba(255,180,180,0.4)' : 'rgba(255,255,255,0.3)'}`,
                              }}>
                                {elapsed.str}
                              </div>
                            )}
                          </>
                        )}

                        {opsState === 'BILLED' && (
                          <>
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontFamily: 'Lato, sans-serif' }}>{gCount} pax</p>
                            <p style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Lato, sans-serif', color: '#fff' }}>BILL OUT</p>
                          </>
                        )}

                        {opsState === 'PAID' && (
                          <>
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontFamily: 'Lato, sans-serif' }}>{gCount} pax</p>
                            <p style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Lato, sans-serif', color: '#fff' }}>PAID</p>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>{/* end absolute canvas */}
      </div>{/* end ceramic canvas */}

      {/* ── Inline right panel ────────────────────────────────────────────── */}
      {showPreviewModal && (() => {
        const prevTable = previewTableId ? TABLES.find(t => t.id === previewTableId) : null;
        const prevCheck = previewTableId
          ? (getCheckByTable(previewTableId) ?? checks.find(c => c.tableId === previewTableId))
          : null;
        const prevItems = prevCheck
          ? getItemsByCheck(prevCheck.id).filter(i => i.status !== 'VOIDED')
          : [];

        const STATUS_LABEL: Record<ItemStatus, string> = {
          DRAFT: 'Draft', HELD: 'Held', SENT: 'Sent',
          IN_PREP: 'In Prep', READY: 'Ready', SERVED: 'Served', VOIDED: 'Voided',
        };
        const STATUS_COLOR: Record<ItemStatus, { bg: string; text: string }> = {
          DRAFT:   { bg: '#F1F5F9', text: '#64748B' },
          HELD:    { bg: '#F1F5F9', text: '#64748B' },
          SENT:    { bg: '#EFF6FF', text: '#2563EB' },
          IN_PREP: { bg: '#FFFBEB', text: '#D97706' },
          READY:   { bg: '#F0FDF4', text: '#16A34A' },
          SERVED:  { bg: '#F0FDF4', text: '#16A34A' },
          VOIDED:  { bg: '#FEF2F2', text: '#DC2626' },
        };
        const closePanel = () => { setShowPreviewModal(false); setPreviewTableId(null); };

        return (
          <div
            style={{
              width: 360, flexShrink: 0,
              borderLeft: '1px solid var(--neutral-line-outline)',
              backgroundColor: '#ffffff',
              display: 'flex', flexDirection: 'column',
              overflowY: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 20px 16px', borderBottom: '1px solid var(--neutral-line-outline)', flexShrink: 0 }}>
              <div>
                <p style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-bold)', fontFamily: 'Lato, sans-serif', color: '#1E293B' }}>
                  Table {prevTable?.name ?? '—'}
                </p>
                {prevCheck && (
                  <p style={{ fontSize: 'var(--text-p)', fontFamily: 'Lato, sans-serif', color: '#64748B', marginTop: 2 }}>
                    {prevCheck.guestCount} pax{prevCheck.guestName ? ` · ${prevCheck.guestName}` : ''}
                  </p>
                )}
              </div>
              <button
                onClick={closePanel}
                style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid var(--neutral-line-outline)', backgroundColor: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748B', flexShrink: 0 }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Item list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
              {prevItems.length === 0 ? (
                <p style={{ fontSize: 'var(--text-p)', color: '#94A3B8', textAlign: 'center', padding: '32px 20px', fontFamily: 'Lato, sans-serif' }}>
                  No items in this order yet.
                </p>
              ) : prevItems.map((it, idx) => {
                const sc = STATUS_COLOR[it.status as ItemStatus] ?? STATUS_COLOR.DRAFT;
                return (
                  <div
                    key={it.id}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: idx < prevItems.length - 1 ? '1px solid #F1F5F9' : 'none' }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, fontFamily: 'Lato, sans-serif', color: '#1E293B', marginBottom: 2 }}>
                        {it.quantity}x {it.name}
                      </p>
                      {it.modifiers.length > 0 && (
                        <p style={{ fontSize: 12, fontFamily: 'Lato, sans-serif', color: '#94A3B8' }}>{it.modifiers.join(', ')}</p>
                      )}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'Lato, sans-serif', color: sc.text, backgroundColor: sc.bg, padding: '3px 10px', borderRadius: 999, flexShrink: 0, marginLeft: 12 }}>
                      {STATUS_LABEL[it.status as ItemStatus] ?? it.status}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Action buttons */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--neutral-line-outline)', display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
              <button
                onClick={() => { closePanel(); if (prevCheck) navigate(`/check/${prevCheck.id}`); }}
                style={{ height: 48, borderRadius: 10, border: '1px solid var(--neutral-line-outline)', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'Lato, sans-serif', color: '#1E293B' }}
              >
                <ClipboardList size={16} /> Modify Order
              </button>
              <button
                onClick={() => { closePanel(); if (prevCheck) navigate(`/check/${prevCheck.id}`, { state: { autoPrintBill: true } }); }}
                style={{ height: 48, borderRadius: 10, border: '1px solid var(--neutral-line-outline)', backgroundColor: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'Lato, sans-serif', color: '#1E293B' }}
              >
                <Printer size={16} /> Print Bill
              </button>
              <button
                onClick={() => { closePanel(); if (prevCheck) navigate(`/check/${prevCheck.id}`, { state: { autoOpenPayment: true } }); }}
                style={{ height: 48, borderRadius: 10, border: 'none', backgroundColor: 'var(--feature-brand-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', fontFamily: 'Lato, sans-serif', color: '#ffffff' }}
              >
                <CreditCard size={16} /> Pay Bill
              </button>
            </div>
          </div>
        );
      })()}

      </div>{/* end body row */}

      {/* ── Bottom bar ────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-end px-4 py-2 shrink-0"
        style={{ borderTop: '1px solid var(--neutral-line-outline)', backgroundColor: '#FFFFFF' }}
      >
        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={zoomOut}
            className="flex items-center justify-center rounded-lg transition-colors hover:bg-gray-50"
            style={{ width: 32, height: 32, border: '1px solid var(--neutral-line-outline)' }}
          >
            <Minus size={13} />
          </button>
          <span style={{ fontSize: 13, fontFamily: 'Lato, sans-serif', fontWeight: 600, minWidth: 44, textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="flex items-center justify-center rounded-lg transition-colors hover:bg-gray-50"
            style={{ width: 32, height: 32, border: '1px solid var(--neutral-line-outline)' }}
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {/* ── Guest / Seating Modal ──────────────────────────────────────────── */}
      <Dialog open={showGuestModal} onOpenChange={setShowGuestModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h2)', fontWeight: 'var(--font-weight-bold)' }}>
              Table {TABLES.find(t => t.id === selectedTableId)?.name}
            </DialogTitle>
            <DialogDescription style={{ fontSize: 'var(--text-p)' }} className="text-muted-foreground">
              Select guest count and enter details to create a new check.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label style={{ fontSize: '14px', fontWeight: 'var(--font-weight-regular)' }}>
                <span style={{ color: 'var(--status-red-primary)' }}>* </span>Guest Count
              </Label>
              {!manualInputMode ? (
                <>
                  <div className="grid grid-cols-5 gap-3">
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <SelectableCard
                        key={num}
                        onClick={() => setGuestCount(num.toString())}
                        selected={guestCount === num.toString()}
                        className={`h-[56px] ${guestCount === num.toString() ? 'border' : 'border-0'}`}
                        style={{
                          borderRadius:    'var(--radius-button)',
                          fontSize:        'var(--text-h3)',
                          fontWeight:      'var(--font-weight-bold)',
                          backgroundColor: 'var(--feature-brand-container-darker)',
                          ...(guestCount === num.toString() && { borderColor: 'var(--feature-brand-primary)', borderWidth: '1.5px' }),
                        }}
                      >
                        {num}
                      </SelectableCard>
                    ))}
                  </div>
                  <button
                    onClick={() => setManualInputMode(true)}
                    className="w-full h-[48px] border border-border rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                    style={{ fontSize: 'var(--text-p)', borderRadius: 'var(--radius-button)' }}
                  >
                    Input Manually
                  </button>
                </>
              ) : (
                <>
                  <TextField
                    type="number"
                    placeholder="Enter number of guests"
                    value={guestCount}
                    onChange={e => setGuestCount(e.target.value)}
                    className="h-[56px]"
                    autoFocus
                  />
                  <button
                    onClick={() => { setManualInputMode(false); setGuestCount(''); }}
                    className="w-full h-[48px] border border-border rounded-lg text-muted-foreground hover:bg-muted/50 transition-colors"
                    style={{ fontSize: 'var(--text-p)', borderRadius: 'var(--radius-button)' }}
                  >
                    Back to Quick Select
                  </button>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label style={{ fontSize: '14px', fontWeight: 'var(--font-weight-regular)' }}>
                Guest Name <span className="text-muted-foreground">(optional)</span>
              </Label>
              <TextField
                type="text" placeholder="Enter guest name"
                value={guestName} onChange={e => setGuestName(e.target.value)}
                className="h-[48px]"
              />
            </div>

            <div className="space-y-2">
              <Label style={{ fontSize: '14px', fontWeight: 'var(--font-weight-regular)' }}>
                Phone Number <span className="text-muted-foreground">(optional)</span>
              </Label>
              <TextField
                type="tel" placeholder="Enter phone number"
                value={guestPhone} onChange={e => setGuestPhone(e.target.value)}
                className="h-[48px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-3">
            <button
              onClick={() => {
                setShowGuestModal(false);
                setGuestCount(''); setGuestName(''); setGuestPhone('');
                setManualInputMode(false);
              }}
              className="flex-1 h-[52px] border border-border rounded-lg text-foreground hover:bg-muted/50 transition-colors"
              style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', borderRadius: 'var(--radius-button)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleGuestConfirm}
              disabled={!guestCount}
              className="flex-1 h-[52px] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                fontSize:        'var(--text-p)',
                fontWeight:      'var(--font-weight-semibold)',
                borderRadius:    'var(--radius-button)',
                backgroundColor: guestCount ? 'var(--feature-brand-primary)' : 'var(--neutral-surface-disabled)',
                color:           guestCount ? '#fff' : 'var(--neutral-onsurface-secondary)',
              }}
            >
              Open Table
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

FloorLayout.displayName = 'FloorLayout';
