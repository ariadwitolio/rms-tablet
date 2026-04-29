import { useState } from 'react';
import {
  Store, Layers, Umbrella, Lock,
  Users, UtensilsCrossed, Minus, Plus,
  DoorOpen, DoorClosed, Bath, ChefHat, Wine, Package, Banknote, MoveVertical, Box,
} from 'lucide-react';
import { FLOORS, ROOM_AREAS, TABLES, FLOOR_LABELS } from '../../data/mockData';
import { useRestaurant } from '../../context/RestaurantContext';
import { formatCurrency } from '../../utils/formatters';
import type { LabelType, Table } from '../../types';

// ── Shared helpers (same as FloorLayout) ─────────────────────────────────────

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

export function TableLayoutPreview() {
  const [selectedFloor, setSelectedFloor] = useState(FLOORS[0].id);
  const [zoom, setZoom]                   = useState(1.0);
  const { getTableState, getCheckByTable, getItemsByCheck } = useRestaurant();

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

  const currentFloor  = FLOORS.find(f => f.id === selectedFloor);
  const floorSections = ROOM_AREAS.filter(a => a.floorId === selectedFloor);
  const floorTables   = TABLES.filter(t => ROOM_AREAS.find(a => a.id === t.areaId && a.floorId === selectedFloor));
  const floorLabels   = FLOOR_LABELS.filter(l => l.floorId === selectedFloor);

  const canvasW = (currentFloor?.canvasWidth  ?? 900) * zoom;
  const canvasH = (currentFloor?.canvasHeight ?? 600) * zoom;

  const zoomIn  = () => setZoom(z => Math.min(1.5, Math.round((z + 0.25) * 100) / 100));
  const zoomOut = () => setZoom(z => Math.max(0.5, Math.round((z - 0.25) * 100) / 100));

  return (
    <div className="h-full flex flex-col relative" style={{ backgroundColor: '#FFFFFF' }}>

      {/* VIEW ONLY badge */}
      <div
        className="absolute top-14 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5"
        style={{
          backgroundColor: 'rgba(0,0,0,0.42)',
          backdropFilter:  'blur(6px)',
          borderRadius:    999,
          pointerEvents:   'none',
        }}
      >
        <Lock size={11} color="white" />
        <span style={{ fontSize: 11, fontWeight: 700, fontFamily: 'Lato, sans-serif', color: 'white', letterSpacing: '0.04em' }}>
          VIEW ONLY
        </span>
      </div>

      {/* ── Floor tabs + legend ───────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between shrink-0 px-3"
        style={{ borderBottom: '1px solid var(--neutral-line-outline)', backgroundColor: '#FFFFFF' }}
      >
        <div className="flex">
          {FLOORS.map((floor, index) => {
            const Icon       = FLOOR_ICONS[index % FLOOR_ICONS.length];
            const isSelected = selectedFloor === floor.id;
            return (
              <button
                key={floor.id}
                onClick={() => setSelectedFloor(floor.id)}
                className="flex items-center gap-1.5 px-3 py-2.5 transition-colors"
                style={{
                  fontFamily:   'Lato, sans-serif',
                  fontSize:     13,
                  fontWeight:   isSelected ? 700 : 400,
                  color:        isSelected ? 'var(--feature-brand-primary)' : 'var(--neutral-onsurface-secondary)',
                  borderBottom: isSelected ? '2px solid var(--feature-brand-primary)' : '2px solid transparent',
                  marginBottom: -1,
                  background:   'none',
                  border:       'none',
                  borderBottom: isSelected ? '2px solid var(--feature-brand-primary)' : '2px solid transparent',
                  cursor:       'pointer',
                }}
              >
                <Icon size={13} />
                {floor.name}
              </button>
            );
          })}
        </div>

        {/* Compact legend */}
        <div className="flex items-center gap-3">
          {LEGEND.map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1">
              <div style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-secondary)' }}>
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Ceramic canvas — pointer-events disabled on tables ────────────── */}
      <div
        className="flex-1 overflow-auto p-4"
        style={{
          backgroundColor: '#F8F8F5',
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.055) 1px, transparent 1px)
          `,
          backgroundSize: '52px 52px',
        }}
      >
        <div style={{ position: 'relative', width: canvasW, height: canvasH }}>

          {/* Floor labels at canvas coordinates */}
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
                  fontSize:        11,
                  fontFamily:      'Lato, sans-serif',
                  fontWeight:      600,
                  color:           lbl.color,
                  whiteSpace:      'nowrap',
                  boxShadow:       '0 1px 3px rgba(0,0,0,0.08)',
                  pointerEvents:   'none',
                }}
              >
                <Icon size={12} />
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
                  style={{ padding: '9px 14px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{
                      fontFamily: 'Lato, sans-serif', fontSize: 13,
                      fontWeight: 700,
                      color: section.isBlocked ? '#9CA3AF' : 'var(--neutral-onsurface-primary)',
                    }}>
                      {section.name}
                    </span>
                    {section.isBlocked && (
                      <span style={{
                        fontSize: 10, fontFamily: 'Lato, sans-serif',
                        color: '#fff', backgroundColor: '#9CA3AF',
                        padding: '1px 6px', borderRadius: 999,
                      }}>
                        CLOSED
                      </span>
                    )}
                  </div>
                  {!section.isBlocked && (
                    <div className="flex items-center gap-1" style={{ color: '#22C55E', fontSize: 12, fontFamily: 'Lato, sans-serif', fontWeight: 600 }}>
                      <Users size={12} />
                      {occupiedSeats} / {totalSeats} Seats
                    </div>
                  )}
                </div>

                {/* Table canvas — non-interactive */}
                <div
                  className="relative"
                  style={{ width: cardW, height: cardH, pointerEvents: 'none' }}
                >
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
                      <div
                        key={table.id}
                        className="absolute flex flex-col items-center justify-center"
                        style={{
                          left:            (table.x - section.x) * zoom,
                          top:             (table.y - section.y) * zoom,
                          width:           table.width  * zoom,
                          height:          table.height * zoom,
                          borderRadius:    isRound ? '50%' : 8,
                          backgroundColor: bg,
                          border:          `2px solid ${border}`,
                          padding:         4,
                          gap:             2,
                          overflow:        'visible',
                        }}
                      >
                        {opsState === 'OCCUPIED' && hasReady && (
                          <div style={{
                            position: 'absolute', top: 0, right: 0,
                            transform: 'translate(50%,-50%)',
                            backgroundColor: '#54A73F',
                            width: 14, height: 14, borderRadius: '50%',
                            border: '2px solid #fff', zIndex: 10,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <UtensilsCrossed style={{ width: 8, height: 8, color: '#fff' }} />
                          </div>
                        )}

                        <p style={{ fontSize: table.width * zoom >= 90 ? 13 : 11, fontWeight: 700, fontFamily: 'Lato, sans-serif', color: text, lineHeight: 1 }}>
                          {table.name}
                        </p>

                        {opsState === 'AVAILABLE' && !isBlocked && (
                          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', fontFamily: 'Lato, sans-serif' }}>
                            {table.capacity} pax
                          </p>
                        )}
                        {isBlocked && (
                          <p style={{ fontSize: 9, color: '#9CA3AF', fontFamily: 'Lato, sans-serif' }}>Blocked</p>
                        )}
                        {opsState === 'OCCUPIED' && (
                          <>
                            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', fontFamily: 'Lato, sans-serif' }}>{gCount} pax</p>
                            <p style={{ fontSize: 10, fontWeight: 700, fontFamily: 'Lato, sans-serif', color: '#fff' }}>{formatCurrency(total)}</p>
                            {elapsed && (
                              <div style={{
                                fontSize: 9, fontWeight: 700, fontFamily: 'Lato, sans-serif',
                                color: elapsed.over ? '#ffcccc' : 'rgba(255,255,255,0.9)',
                                backgroundColor: 'rgba(0,0,0,0.25)',
                                padding: '1px 4px', borderRadius: 3,
                              }}>
                                {elapsed.str}
                              </div>
                            )}
                          </>
                        )}
                        {opsState === 'BILLED' && (
                          <>
                            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', fontFamily: 'Lato, sans-serif' }}>{gCount} pax</p>
                            <p style={{ fontSize: 10, fontWeight: 700, fontFamily: 'Lato, sans-serif', color: '#fff' }}>BILL OUT</p>
                          </>
                        )}
                        {opsState === 'PAID' && (
                          <>
                            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.85)', fontFamily: 'Lato, sans-serif' }}>{gCount} pax</p>
                            <p style={{ fontSize: 10, fontWeight: 700, fontFamily: 'Lato, sans-serif', color: '#fff' }}>PAID</p>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>{/* end absolute canvas */}
      </div>

      {/* ── Bottom bar ────────────────────────────────────────────────────── */}
      <div
        className="flex items-center justify-end px-3 py-1.5 shrink-0"
        style={{ borderTop: '1px solid var(--neutral-line-outline)', backgroundColor: '#FFFFFF' }}
      >
        <div className="flex items-center gap-1.5">
          <button
            onClick={zoomOut}
            className="flex items-center justify-center rounded-lg transition-colors hover:bg-gray-50"
            style={{ width: 28, height: 28, border: '1px solid var(--neutral-line-outline)' }}
          >
            <Minus size={11} />
          </button>
          <span style={{ fontSize: 12, fontFamily: 'Lato, sans-serif', fontWeight: 600, minWidth: 38, textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="flex items-center justify-center rounded-lg transition-colors hover:bg-gray-50"
            style={{ width: 28, height: 28, border: '1px solid var(--neutral-line-outline)' }}
          >
            <Plus size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
