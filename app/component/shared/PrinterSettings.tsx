import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { MainBtn } from '../ui/MainBtn';
import { Button } from '../ui/button';
import { SelectableCard } from '../ui/SelectableCard';
import { EmptyState } from '../ui/EmptyState';
import { ScrollArea } from '../ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { TextField } from '../ui/TextField';
import { useSnackbar } from '../labamu/Snackbar';
import { useVirtualInputContext } from '../../context/VirtualInputContext';
import { useRestaurant } from '../../context/RestaurantContext';
import ArrowLeft from '../../../imports/ArrowLeft';
import {
  Printer,
  Wifi,
  Bluetooth,
  RefreshCw,
  WifiOff,
  PenLine,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  Plus,
  Pencil,
  Menu,
  ChefHat,
  UtensilsCrossed,
  Wine,
  LogOut,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ConnectionType = 'LAN' | 'BLUETOOTH';
type PrinterStatus = 'CONNECTED' | 'OFFLINE' | 'CONNECTING';

interface PrinterDevice {
  id: string;
  name: string;
  connectionType: ConnectionType;
  address: string;
  status: PrinterStatus;
}

type AddStep =
  | 'SELECT_TYPE'
  | 'LAN_SCAN'
  | 'LAN_MANUAL_FORM'
  | 'BT_SCAN'
  | 'BT_PIN'
  | 'CONNECTING'
  | 'SUCCESS'
  | 'FAILED';

// ─── IP Validation ────────────────────────────────────────────────────────────

// Valid format: NNN.NNN.NNN  (three 1–3-digit numeric segments)
function isValidIp(ip: string): boolean {
  const segs = ip.split('.');
  if (segs.length !== 3) return false;
  return segs.every(s => s !== '' && /^\d{1,3}$/.test(s));
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_LAN_DEVICES = [
  { id: 'lan-1', name: 'Epson TM-T82', address: '192.168.1' },
  { id: 'lan-2', name: 'Star TSP143', address: '192.168.2' },
  { id: 'lan-3', name: 'Bixolon SRP-350', address: '10.0.0' },
];

const MOCK_BT_DEVICES = [
  { id: 'bt-1', name: 'Epson TM-P80', address: 'BT:E4:3D:1A:9F:22' },
  { id: 'bt-2', name: 'Star SM-L200', address: 'BT:C2:8A:7E:4B:01' },
  { id: 'bt-3', name: 'Woosim WSP-R240', address: 'BT:A1:FF:3C:00:5D' },
];

const CORRECT_PIN = '1234';

// ─── Status badge ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<PrinterStatus, { color: string; bg: string; label: string }> = {
  CONNECTED: { color: 'var(--status-green-primary)', bg: 'var(--status-green-container)', label: 'Connected' },
  OFFLINE: { color: 'var(--status-red-primary)', bg: 'var(--status-red-container)', label: 'Not Connected' },
  CONNECTING: { color: 'var(--status-warning-primary)', bg: '#FFF8E1', label: 'Connecting…' },
};

function StatusBadge({ status }: { status: PrinterStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 'var(--radius-small)',
      backgroundColor: cfg.bg, fontSize: 12, fontWeight: 600,
      color: cfg.color, fontFamily: 'Lato, sans-serif', whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: cfg.color, flexShrink: 0 }} />
      {cfg.label}
    </span>
  );
}

function ConnectionBadge({ type }: { type: ConnectionType }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 'var(--radius-small)',
      backgroundColor: 'var(--feature-brand-container)',
      fontSize: 12, fontWeight: 600, color: 'var(--feature-brand-oncontainer)',
      fontFamily: 'Lato, sans-serif',
      border: '1px solid var(--feature-brand-container-darker)',
    }}>
      {type === 'LAN'
        ? <Wifi style={{ width: 12, height: 12 }} />
        : <Bluetooth style={{ width: 12, height: 12 }} />}
      {type === 'LAN' ? 'LAN / Wi-Fi' : 'Bluetooth'}
    </span>
  );
}

// ─── IP Input — tap each octet to enter via virtual numpad ───────────────────

function IpInput({ value, onChange, hasError }: {
  value: string;
  onChange: (v: string) => void;
  hasError?: boolean;
}) {
  const ctx = useVirtualInputContext();

  // Parse into 4 octets
  const parseOctets = (v: string): [string, string, string, string] => {
    const p = (v || '').split('.');
    return [p[0] ?? '', p[1] ?? '', p[2] ?? '', p[3] ?? ''];
  };

  const [octets, setOctets] = useState<[string, string, string, string]>(() => parseOctets(value));
  const lastEmittedRef = useRef<string>(value);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  useEffect(() => {
    if (value !== lastEmittedRef.current) {
      setOctets(parseOctets(value));
      lastEmittedRef.current = value;
    }
  }, [value]);

  const updateOctet = (idx: number, raw: string) => {
    // Keep only digits, max 3, clamp 0-255
    const cleaned = raw.replace(/\D/g, '').slice(0, 3);
    const num = Math.min(255, parseInt(cleaned) || 0);
    const val = cleaned === '' ? '' : String(num);
    const next = [...octets] as [string, string, string, string];
    next[idx] = val;
    setOctets(next);
    const joined = next.every(s => s === '') ? '' : next.join('.');
    lastEmittedRef.current = joined;
    onChange(joined);
  };

  const openOctet = (idx: number, anchorEl: HTMLElement) => {
    setActiveIdx(idx);
    ctx.openFor(
      'numeric',
      octets[idx],
      (val) => {
        // Only allow digits, max 3 chars, clamp 0-255
        const cleaned = val.replace(/\D/g, '').slice(0, 3);
        updateOctet(idx, cleaned);
      },
      anchorEl,
      () => setActiveIdx(null),
    );
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
      {([0, 1, 2, 3] as const).map(idx => (
        <React.Fragment key={idx}>
          {idx > 0 && (
            <span style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--neutral-onsurface-tertiary)',
              flexShrink: 0,
              userSelect: 'none',
              fontFamily: 'Lato, sans-serif',
            }}>.</span>
          )}
          <div
            onPointerDown={(e) => {
              e.preventDefault();
              openOctet(idx, e.currentTarget);
            }}
            style={{
              flex: 1,
              minWidth: 0,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              border: `1.5px solid ${
                hasError
                  ? 'var(--status-red-primary)'
                  : activeIdx === idx
                    ? 'var(--feature-brand-primary)'
                    : 'var(--neutral-line-outline)'
              }`,
              backgroundColor: hasError
                ? 'var(--status-red-container)'
                : activeIdx === idx
                  ? 'var(--feature-brand-container)'
                  : 'var(--neutral-surface-primary)',
              cursor: 'pointer',
              touchAction: 'none',
              transition: 'border-color 0.15s, background-color 0.15s',
              userSelect: 'none',
            }}
          >
            <span style={{
              fontFamily: 'Lato, sans-serif',
              fontSize: 16,
              fontWeight: 600,
              color: hasError
                ? 'var(--status-red-primary)'
                : octets[idx]
                  ? 'var(--neutral-onsurface-primary)'
                  : 'var(--neutral-onsurface-tertiary)',
            }}>
              {octets[idx] || '0'}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

// ─── PIN Input — tap to enter 4-digit PIN via virtual numpad ─────────────────

function PinInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ctx = useVirtualInputContext();
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);

  const digits = value.padEnd(4, ' ').split('').slice(0, 4);
  const filled = value.replace(/\s/g, '');

  const openNumpad = () => {
    if (!triggerRef.current) return;
    setIsOpen(true);
    ctx.openFor(
      'numeric',
      filled,
      (val) => {
        // Only allow digits, max 4
        const cleaned = val.replace(/\D/g, '').slice(0, 4);
        onChange(cleaned);
      },
      triggerRef.current,
      () => setIsOpen(false),
    );
  };

  return (
    <div
      ref={triggerRef}
      onPointerDown={(e) => { e.preventDefault(); openNumpad(); }}
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 12,
        cursor: 'pointer',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {([0, 1, 2, 3] as const).map(idx => (
        <div
          key={idx}
          style={{
            width: 60,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `2px solid ${digits[idx]?.trim() ? 'var(--feature-brand-primary)' : isOpen ? 'var(--feature-brand-primary)' : 'var(--neutral-line-outline)'}`,
            borderRadius: 'var(--radius-input)',
            backgroundColor: isOpen
              ? 'var(--feature-brand-container)'
              : 'var(--neutral-surface-primary)',
            transition: 'border-color 0.15s, background-color 0.15s',
          }}
        >
          {digits[idx]?.trim() ? (
            <div style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: 'var(--feature-brand-primary)',
            }} />
          ) : (
            <span style={{
              fontFamily: 'Lato, sans-serif',
              fontSize: 24,
              color: 'var(--neutral-line-outline)',
            }}>—</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Scan device row ──────────────────────────────────────────────────────────

function DeviceRow({
  device, selected, onClick,
}: {
  device: { id: string; name: string; address: string };
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 56, padding: '0 16px', width: '100%',
        borderRadius: 'var(--radius-input)',
        border: `1.5px solid ${selected ? 'var(--feature-brand-primary)' : 'var(--neutral-line-outline)'}`,
        backgroundColor: selected ? 'var(--feature-brand-container)' : 'transparent',
        cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 14, fontWeight: 600, fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)' }}>
          {device.name}
        </span>
        <span style={{ fontSize: 12, fontFamily: 'Lato, sans-serif', color: 'var(--muted-foreground)' }}>
          {device.address}
        </span>
      </div>
      {selected && <CheckCircle2 style={{ width: 20, height: 20, color: 'var(--feature-brand-primary)', flexShrink: 0 }} />}
    </button>
  );
}

// ─── Printer card ───────────────────────────────────────────���─────────────────

function PrinterCard({
  printer, onTestPrint, onRename, onDisconnect, onReconnect, onEdit, onRemove,
}: {
  printer: PrinterDevice;
  onTestPrint: () => Promise<boolean>;
  onRename: () => void;
  onDisconnect: () => void;
  onReconnect: () => Promise<boolean>;
  onEdit: (newIp: string, newName: string) => Promise<boolean>;
  onRemove: () => void;
}) {
  const { success: showSuccess, error: showError } = useSnackbar();

  const isActive = printer.status === 'CONNECTED';
  const isOffline = printer.status === 'OFFLINE';
  const isLan = printer.connectionType === 'LAN';

  // ── Test Print state
  const [isTestPrinting, setIsTestPrinting] = useState(false);

  // ── Disconnect confirmation
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false);

  // ── Reconnect confirmation
  const [showReconnectDialog, setShowReconnectDialog] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);

  // ── Edit (IP + Name) state
  const [showEdit, setShowEdit] = useState(false);
  const [editIp, setEditIp] = useState('');
  const [editName, setEditName] = useState('');
  const [editIpError, setEditIpError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleTestPrint = async () => {
    if (isTestPrinting) return;
    setIsTestPrinting(true);
    try {
      const ok = await onTestPrint();
      if (ok) showSuccess('Test print sent successfully');
      else showError('Test print failed. Check printer connection.');
    } finally {
      setIsTestPrinting(false);
    }
  };

  const handleReconnectConfirm = async () => {
    setIsReconnecting(true);
    try {
      const ok = await onReconnect();
      setShowReconnectDialog(false);
      if (ok) showSuccess(`${printer.name} reconnected successfully`);
      else showError(`Failed to reconnect ${printer.name}. Please try again.`);
    } finally {
      setIsReconnecting(false);
    }
  };

  const openEdit = () => {
    setEditIp(printer.address);
    setEditName(printer.name);
    setEditIpError(null);
    setShowEdit(true);
  };

  const handleSave = async () => {
    const trimmedIp = editIp.trim();
    // Step 1 – format check (instant feedback)
    if (!isValidIp(trimmedIp)) {
      setEditIpError('format');
      return;
    }
    setEditIpError(null);
    setIsSaving(true);
    // Step 2 – simulate connection attempt
    await new Promise(r => setTimeout(r, 1600));
    // Step 3 – only 222.222.222 succeeds
    if (trimmedIp !== '222.222.222') {
      setIsSaving(false);
      showError('Failed to connect, please input the correct IP Address');
      return;
    }
    const trimmedName = editName.trim() || printer.name;
    try {
      await onEdit(trimmedIp, trimmedName);
      setShowEdit(false);
      showSuccess('Printer updated and connected successfully');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: 'contents' }}>
      {/* ── Printer card body ── */}
      <div style={{
        backgroundColor: 'var(--neutral-surface-primary)',
        border: '1px solid var(--neutral-line-outline)',
        borderRadius: 'var(--radius-card)',
        padding: '20px 24px',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {/* Header row: name + badges + status */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--neutral-onsurface-primary)', fontFamily: 'Lato, sans-serif' }}>
                {printer.name}
              </span>
              <ConnectionBadge type={printer.connectionType} />
            </div>
            <span style={{ fontSize: 13, color: 'var(--muted-foreground)', fontFamily: 'Lato, sans-serif' }}>
              {isLan ? `IP: ${printer.address}` : printer.address}
            </span>
          </div>
          <StatusBadge status={printer.status} />
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'nowrap', overflowX: 'auto' }}>
          {/* Test Print — CONNECTED only */}
          {isActive && (
            <MainBtn
              variant="secondary" size="md"
              onClick={handleTestPrint}
              disabled={isTestPrinting}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0, opacity: isTestPrinting ? 0.7 : 1 }}
            >
              {isTestPrinting
                ? <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                : <Printer style={{ width: 16, height: 16 }} />}
              {isTestPrinting ? 'Printing…' : 'Test Print'}
            </MainBtn>
          )}

          {/* Edit — LAN + OFFLINE only */}
          {isLan && isOffline && (
            <MainBtn
              variant="secondary" size="md"
              onClick={openEdit}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
            >
              <Pencil style={{ width: 16, height: 16 }} />
              Edit
            </MainBtn>
          )}

          <MainBtn
            variant="secondary" size="md"
            onClick={onRename}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
          >
            <PenLine style={{ width: 16, height: 16 }} />
            Rename
          </MainBtn>

          {/* Disconnect (active) or Reconnect (offline) */}
          {isActive ? (
            <MainBtn
              variant="secondary" size="md"
              onClick={() => setShowDisconnectDialog(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
            >
              <WifiOff style={{ width: 16, height: 16 }} />
              Disconnect
            </MainBtn>
          ) : (
            <MainBtn
              variant="secondary" size="md"
              onClick={() => setShowReconnectDialog(true)}
              disabled={printer.status === 'CONNECTING'}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
            >
              <RefreshCw style={{ width: 16, height: 16 }} />
              Reconnect
            </MainBtn>
          )}

          <MainBtn
            variant="destructive" size="md"
            onClick={onRemove}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
          >
            <Trash2 style={{ width: 16, height: 16 }} />
            Remove
          </MainBtn>
        </div>
      </div>

      {/* ── Disconnect Confirmation Dialog ── */}
      <Dialog open={showDisconnectDialog} onOpenChange={v => { if (!v) setShowDisconnectDialog(false); }}>
        <DialogContent className="sm:max-w-[420px]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 700, fontFamily: 'Lato, sans-serif' }}>
              Disconnect Printer
            </DialogTitle>
          </DialogHeader>
          <div style={{ padding: '8px 0 4px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '16px 20px', marginBottom: 16,
              backgroundColor: 'var(--status-warning-container, #FFF8E1)',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--status-warning-primary)',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                backgroundColor: 'var(--neutral-surface-primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid var(--status-warning-primary)',
              }}>
                <WifiOff style={{ width: 22, height: 22, color: 'var(--status-warning-primary)' }} />
              </div>
              <p style={{ fontSize: 14, fontFamily: 'Lato, sans-serif', color: 'var(--muted-foreground)', margin: 0, lineHeight: 1.6 }}>
                Disconnecting <strong>{printer.name}</strong> will move it to the "Previously Added" list. You can reconnect it at any time.
              </p>
            </div>
          </div>
          <DialogFooter>
            <MainBtn variant="secondary" size="lg" onClick={() => setShowDisconnectDialog(false)} style={{ flex: 1 }}>
              Cancel
            </MainBtn>
            <MainBtn
              variant="destructive" size="lg"
              onClick={() => { setShowDisconnectDialog(false); onDisconnect(); }}
              style={{ flex: 1, display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              <WifiOff style={{ width: 16, height: 16 }} />
              Disconnect
            </MainBtn>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reconnect Confirmation Dialog ── */}
      <Dialog open={showReconnectDialog} onOpenChange={v => { if (!v && !isReconnecting) setShowReconnectDialog(false); }}>
        <DialogContent className="sm:max-w-[420px]" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 700, fontFamily: 'Lato, sans-serif' }}>
              Reconnect Printer
            </DialogTitle>
          </DialogHeader>
          {isReconnecting ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '32px 0' }}>
              <Loader2 style={{ width: 44, height: 44, color: 'var(--feature-brand-primary)', animation: 'spin 1s linear infinite' }} />
              <p style={{ fontSize: 15, fontWeight: 600, fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)', margin: 0 }}>
                Reconnecting to {printer.name}…
              </p>
              <p style={{ fontSize: 13, fontFamily: 'Lato, sans-serif', color: 'var(--muted-foreground)', margin: 0 }}>
                Please wait while we establish the connection.
              </p>
            </div>
          ) : (
            <div style={{ padding: '8px 0 4px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 20px', marginBottom: 16,
                backgroundColor: 'var(--feature-brand-container)',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--feature-brand-container-darker)',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                  backgroundColor: 'var(--neutral-surface-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--feature-brand-primary)',
                }}>
                  <RefreshCw style={{ width: 22, height: 22, color: 'var(--feature-brand-primary)' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <p style={{ fontSize: 14, fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)', margin: 0, fontWeight: 600 }}>
                    {printer.name}
                  </p>
                  <p style={{ fontSize: 13, fontFamily: 'Lato, sans-serif', color: 'var(--muted-foreground)', margin: 0 }}>
                    {isLan ? `IP: ${printer.address}` : printer.address}
                  </p>
                </div>
              </div>
              <p style={{ fontSize: 14, fontFamily: 'Lato, sans-serif', color: 'var(--muted-foreground)', margin: 0 }}>
                Confirm reconnection attempt to this printer?
              </p>
            </div>
          )}
          {!isReconnecting && (
            <DialogFooter>
              <MainBtn variant="secondary" size="lg" onClick={() => setShowReconnectDialog(false)} style={{ flex: 1 }}>
                Cancel
              </MainBtn>
              <MainBtn
                variant="primary" size="lg"
                onClick={handleReconnectConfirm}
                style={{ flex: 1, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <RefreshCw style={{ width: 16, height: 16 }} />
                Reconnect
              </MainBtn>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Edit Printer Dialog — LAN + OFFLINE only ── */}
      {isLan && (
        <Dialog open={showEdit} onOpenChange={v => { if (!v && !isSaving) setShowEdit(false); }}>
          <DialogContent
            className="sm:max-w-[440px]"
            aria-describedby={undefined}
            style={{
              display: 'flex', flexDirection: 'column',
              maxHeight: '90vh', overflow: 'hidden',
              width: '100%', boxSizing: 'border-box',
            }}
          >
            <DialogHeader style={{ flexShrink: 0 }}>
              <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 700, fontFamily: 'Lato, sans-serif' }}>
                Edit Printer
              </DialogTitle>
            </DialogHeader>

            <div style={{
              flex: 1, overflowY: 'auto', overflowX: 'hidden',
              width: '100%', boxSizing: 'border-box',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '12px 0 4px', width: '100%', boxSizing: 'border-box' }}>
                <p style={{ fontSize: 14, fontFamily: 'Lato, sans-serif', color: 'var(--muted-foreground)', margin: 0 }}>
                  Update details for this printer. Saving will attempt to reconnect using the new IP address.
                </p>

                {/* Printer Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)' }}>
                    Printer Name
                  </span>
                  <TextField
                    placeholder="e.g. Kitchen Printer"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    autoFocus
                    style={{ height: 48, borderRadius: 12, width: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                {/* IP Address */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', boxSizing: 'border-box' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)' }}>
                    IP Address <span style={{ color: 'var(--status-red-primary)' }}>*</span>
                  </span>
                  {/* Constrain IpInput width so it never exceeds dialog bounds */}
                  <div style={{ width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
                    <IpInput
                      value={editIp}
                      onChange={v => { setEditIp(v); if (editIpError) setEditIpError(null); }}
                      hasError={editIpError === 'format'}
                    />
                  </div>
                  {editIpError === 'format' ? (
                    <span style={{ fontSize: 12, fontFamily: 'Lato, sans-serif', color: 'var(--status-red-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <XCircle style={{ width: 13, height: 13, flexShrink: 0 }} />
                      Please enter a valid IP address (e.g. 222.222.222)
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, fontFamily: 'Lato, sans-serif', color: 'var(--muted-foreground)' }}>
                      Format: 111.111.111
                    </span>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter style={{ marginTop: 16, flexShrink: 0 }}>
              <MainBtn
                variant="secondary" size="lg"
                onClick={() => setShowEdit(false)}
                disabled={isSaving}
                style={{ flex: 1 }}
              >
                Cancel
              </MainBtn>
              <MainBtn
                variant="primary" size="lg"
                onClick={handleSave}
                disabled={isSaving || !editIp.trim()}
                style={{ flex: 1, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                {isSaving
                  ? <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                  : null}
                {isSaving ? 'Saving…' : 'Save'}
              </MainBtn>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// ─── Add Printer Dialog ───────────────────────────────────────────────────────

function AddPrinterDialog({
  open, onClose, onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (printer: Omit<PrinterDevice, 'id' | 'status'>) => void;
}) {
  const { error: showError } = useSnackbar();
  const [step, setStep] = useState<AddStep>('SELECT_TYPE');
  const [selectedType, setSelectedType] = useState<ConnectionType | null>(null);
  const [scanning, setScanning] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<{ id: string; name: string; address: string } | null>(null);
  const [manualIp, setManualIp] = useState('');
  const [manualIpError, setManualIpError] = useState<string | null>(null); // 'format' | null
  const [isManualConnecting, setIsManualConnecting] = useState(false);
  const [manualName, setManualName] = useState('');
  const [pin, setPin] = useState('');
  const [connectingName, setConnectingName] = useState('');

  useEffect(() => {
    if (open) {
      setStep('SELECT_TYPE');
      setSelectedType(null);
      setScanning(false);
      setSelectedDevice(null);
      setManualIp('');
      setManualIpError(null);
      setIsManualConnecting(false);
      setManualName('');
      setPin('');
    }
  }, [open]);

  const startScan = () => {
    setScanning(true);
    setSelectedDevice(null);
    setTimeout(() => setScanning(false), 1800);
  };

  useEffect(() => {
    if (step === 'LAN_SCAN' || step === 'BT_SCAN') startScan();
  }, [step]);

  const handleNext = () => {
    if (selectedType === 'LAN') setStep('LAN_SCAN');
    else setStep('BT_SCAN');
  };

  const doConnect = (name: string, connectionType: ConnectionType, address: string) => {
    setConnectingName(name);
    setStep('CONNECTING');
    setTimeout(() => {
      setStep('SUCCESS');
      setTimeout(() => {
        onAdd({ name, connectionType, address });
        onClose();
      }, 1200);
    }, 1600);
  };

  const handleLanConnect = () => {
    if (!selectedDevice) return;
    doConnect(selectedDevice.name, 'LAN', selectedDevice.address);
  };

  const handleManualConnect = async () => {
    const ip = manualIp.trim();
    // Step 1 – format check (instant)
    if (!isValidIp(ip)) {
      setManualIpError('format');
      return;
    }
    setManualIpError(null);
    setIsManualConnecting(true);
    // Step 2 – simulate connection attempt
    await new Promise(r => setTimeout(r, 1600));
    setIsManualConnecting(false);
    // Step 3 – only 111.111.111 succeeds
    if (ip !== '111.111.111') {
      showError('Failed to connect, please input the correct IP Address');
      return;
    }
    const name = manualName.trim() || `Printer (${ip})`;
    doConnect(name, 'LAN', ip);
  };

  const handleBtPairRequest = () => {
    if (!selectedDevice) return;
    setPin('');
    setStep('BT_PIN');
  };

  const handlePinConfirm = () => {
    if (pin === CORRECT_PIN) {
      doConnect(selectedDevice!.name, 'BLUETOOTH', selectedDevice!.address);
    } else {
      setStep('FAILED');
    }
  };

  const TITLES: Record<AddStep, string> = {
    SELECT_TYPE: 'Add Printer',
    LAN_SCAN: 'Add via LAN / Wi-Fi',
    LAN_MANUAL_FORM: 'Add New LAN / Wi-Fi',
    BT_SCAN: 'Add via Bluetooth',
    BT_PIN: 'Enter Pairing Code',
    CONNECTING: 'Connecting…',
    SUCCESS: 'Connected!',
    FAILED: 'Connection Failed',
  };

  // ── Step 1 ──
  const renderSelectType = () => (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 4, paddingBottom: 4 }}>
        <p style={{ fontSize: 14, color: 'var(--muted-foreground)', fontFamily: 'Lato, sans-serif', margin: 0 }}>
          Choose how to connect the printer to this device.
        </p>

        <SelectableCard
          selected={selectedType === 'LAN'}
          onClick={() => setSelectedType('LAN')}
          style={{
            width: '100%', flexDirection: 'row', gap: 16,
            padding: '18px 20px', borderRadius: 'var(--radius-card)',
            border: `1.5px solid ${selectedType === 'LAN' ? 'var(--feature-brand-primary)' : 'var(--neutral-line-outline)'}`,
            justifyContent: 'flex-start',
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 'var(--radius-small)', flexShrink: 0,
            backgroundColor: selectedType === 'LAN' ? 'var(--feature-brand-container-darker)' : 'var(--neutral-surface-grey-lighter)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Wifi style={{ width: 22, height: 22, color: 'var(--feature-brand-primary)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)' }}>
              LAN / Wi-Fi
            </span>
            <span style={{ fontSize: 13, fontFamily: 'Lato, sans-serif', color: 'var(--muted-foreground)' }}>
              Connect via network IP address
            </span>
          </div>
          {selectedType === 'LAN' && (
            <CheckCircle2 style={{ width: 20, height: 20, color: 'var(--feature-brand-primary)', flexShrink: 0 }} />
          )}
        </SelectableCard>

        <SelectableCard
          selected={selectedType === 'BLUETOOTH'}
          onClick={() => setSelectedType('BLUETOOTH')}
          style={{
            width: '100%', flexDirection: 'row', gap: 16,
            padding: '18px 20px', borderRadius: 'var(--radius-card)',
            border: `1.5px solid ${selectedType === 'BLUETOOTH' ? 'var(--feature-brand-primary)' : 'var(--neutral-line-outline)'}`,
            justifyContent: 'flex-start',
          }}
        >
          <div style={{
            width: 44, height: 44, borderRadius: 'var(--radius-small)', flexShrink: 0,
            backgroundColor: selectedType === 'BLUETOOTH' ? 'var(--feature-brand-container-darker)' : 'var(--neutral-surface-grey-lighter)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bluetooth style={{ width: 22, height: 22, color: 'var(--feature-brand-primary)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)' }}>
              Bluetooth
            </span>
            <span style={{ fontSize: 13, fontFamily: 'Lato, sans-serif', color: 'var(--muted-foreground)' }}>
              Pair via Bluetooth connection
            </span>
          </div>
          {selectedType === 'BLUETOOTH' && (
            <CheckCircle2 style={{ width: 20, height: 20, color: 'var(--feature-brand-primary)', flexShrink: 0 }} />
          )}
        </SelectableCard>
      </div>

      <DialogFooter style={{ marginTop: 8 }}>
        <MainBtn variant="secondary" size="lg" onClick={onClose} style={{ flex: 1 }}>Cancel</MainBtn>
        <MainBtn variant="primary" size="lg" disabled={!selectedType} onClick={handleNext} style={{ flex: 1 }}>
          Next
        </MainBtn>
      </DialogFooter>
    </>
  );

  // ── Step 2 LAN Scan ──
  const renderLanScan = () => (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)' }}>
            {scanning ? 'Scanning network…' : `${MOCK_LAN_DEVICES.length} printers found`}
          </span>
          <button
            onClick={startScan}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
              height: 36, padding: '0 14px', borderRadius: 'var(--radius-small)',
              border: '1px solid var(--neutral-line-outline)', backgroundColor: 'transparent',
              fontSize: 13, fontWeight: 600, fontFamily: 'Lato, sans-serif',
              color: 'var(--neutral-onsurface-primary)', cursor: 'pointer',
            }}
          >
            {scanning
              ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />
              : <RefreshCw style={{ width: 14, height: 14 }} />}
            Rescan
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 120 }}>
          {scanning ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120 }}>
              <Loader2 style={{ width: 28, height: 28, color: 'var(--feature-brand-primary)', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            MOCK_LAN_DEVICES.map(dev => (
              <DeviceRow
                key={dev.id}
                device={dev}
                selected={selectedDevice?.id === dev.id}
                onClick={() => setSelectedDevice(dev)}
              />
            ))
          )}
        </div>
      </div>
      <DialogFooter style={{ marginTop: 16 }}>
        <MainBtn variant="secondary" size="lg" onClick={() => setStep('SELECT_TYPE')} style={{ flex: 1 }}>
          Back
        </MainBtn>
        <MainBtn variant="secondary" size="lg" onClick={() => { setManualIp(''); setManualIpError(null); setIsManualConnecting(false); setManualName(''); setStep('LAN_MANUAL_FORM'); }} style={{ flex: 1 }}>
          Add Manually
        </MainBtn>
        <MainBtn variant="primary" size="lg" disabled={!selectedDevice} onClick={handleLanConnect} style={{ flex: 1 }}>
          Connect
        </MainBtn>
      </DialogFooter>
    </>
  );

  // ── Step 2b LAN Manual Form ──
  const renderLanManualForm = () => (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 4, width: '100%', boxSizing: 'border-box' }}>
        <p style={{ fontSize: 14, color: 'var(--muted-foreground)', fontFamily: 'Lato, sans-serif', margin: 0 }}>
          Enter the IP address of your printer on the local network.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)' }}>
            IP Address <span style={{ color: 'var(--status-red-primary)' }}>*</span>
          </span>
          <div style={{ width: '100%', boxSizing: 'border-box', overflow: 'hidden' }}>
            <IpInput
              value={manualIp}
              onChange={v => { setManualIp(v); if (manualIpError) setManualIpError(null); }}
              hasError={manualIpError === 'format'}
              autoFocus
            />
          </div>
          {manualIpError === 'format' ? (
            <span style={{ fontSize: 12, fontFamily: 'Lato, sans-serif', color: 'var(--status-red-primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <XCircle style={{ width: 13, height: 13, flexShrink: 0 }} />
              Please enter a valid IP address (e.g. 111.111.111)
            </span>
          ) : (
            <span style={{ fontSize: 12, fontFamily: 'Lato, sans-serif', color: 'var(--muted-foreground)' }}>
              Format: 111.111.111
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)' }}>
            Printer Name
          </span>
          <TextField
            placeholder="e.g. Kitchen Printer"
            value={manualName}
            onChange={e => setManualName(e.target.value)}
            style={{ height: 48, borderRadius: 12, width: '100%', boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <DialogFooter style={{ marginTop: 20 }}>
        <MainBtn
          variant="secondary" size="lg"
          onClick={() => setStep('LAN_SCAN')}
          disabled={isManualConnecting}
          style={{ flex: 1 }}
        >
          Back
        </MainBtn>
        <MainBtn
          variant="primary" size="lg"
          disabled={!manualIp.trim() || isManualConnecting}
          onClick={handleManualConnect}
          style={{ flex: 1, display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          {isManualConnecting
            ? <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
            : null}
          {isManualConnecting ? 'Connecting…' : 'Connect'}
        </MainBtn>
      </DialogFooter>
    </>
  );

  // ── Step 2 BT Scan ──
  const renderBtScan = () => (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)' }}>
            {scanning ? 'Searching for devices…' : `${MOCK_BT_DEVICES.length} devices found`}
          </span>
          <button
            onClick={startScan}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
              height: 36, padding: '0 14px', borderRadius: 'var(--radius-small)',
              border: '1px solid var(--neutral-line-outline)', backgroundColor: 'transparent',
              fontSize: 13, fontWeight: 600, fontFamily: 'Lato, sans-serif',
              color: 'var(--neutral-onsurface-primary)', cursor: 'pointer',
            }}
          >
            {scanning
              ? <Loader2 style={{ width: 14, height: 14, animation: 'spin 1s linear infinite' }} />
              : <RefreshCw style={{ width: 14, height: 14 }} />}
            Rescan
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 120 }}>
          {scanning ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120 }}>
              <Loader2 style={{ width: 28, height: 28, color: 'var(--feature-brand-primary)', animation: 'spin 1s linear infinite' }} />
            </div>
          ) : (
            MOCK_BT_DEVICES.map(dev => (
              <DeviceRow
                key={dev.id}
                device={dev}
                selected={selectedDevice?.id === dev.id}
                onClick={() => setSelectedDevice(dev)}
              />
            ))
          )}
        </div>
      </div>
      <DialogFooter style={{ marginTop: 16 }}>
        <MainBtn variant="secondary" size="lg" onClick={() => setStep('SELECT_TYPE')} style={{ flex: 1 }}>
          Back
        </MainBtn>
        <MainBtn variant="primary" size="lg" disabled={!selectedDevice} onClick={handleBtPairRequest} style={{ flex: 1 }}>
          Pair &amp; Connect
        </MainBtn>
      </DialogFooter>
    </>
  );

  // ── Step BT PIN ──
  const renderBtPin = () => (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 8 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            backgroundColor: 'var(--feature-brand-container)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bluetooth style={{ width: 24, height: 24, color: 'var(--feature-brand-primary)' }} />
          </div>
          <p style={{ fontSize: 14, fontFamily: 'Lato, sans-serif', color: 'var(--muted-foreground)', margin: 0, textAlign: 'center' }}>
            Enter the 4-digit pairing code for{' '}
            <strong style={{ color: 'var(--neutral-onsurface-primary)' }}>{selectedDevice?.name}</strong>
          </p>
        </div>
        <PinInput value={pin} onChange={setPin} />
      </div>
      <DialogFooter style={{ marginTop: 24 }}>
        <MainBtn variant="secondary" size="lg" onClick={() => setStep('BT_SCAN')} style={{ flex: 1 }}>
          Back
        </MainBtn>
        <MainBtn
          variant="primary" size="lg"
          disabled={pin.length < 4}
          onClick={handlePinConfirm}
          style={{ flex: 1 }}
        >
          Confirm
        </MainBtn>
      </DialogFooter>
    </>
  );

  // ── Connecting ──
  const renderConnecting = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 0' }}>
      <Loader2 style={{ width: 48, height: 48, color: 'var(--feature-brand-primary)', animation: 'spin 1s linear infinite' }} />
      <p style={{ fontSize: 16, fontWeight: 600, fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)', margin: 0, textAlign: 'center' }}>
        Connecting to {connectingName}…
      </p>
      <p style={{ fontSize: 14, fontFamily: 'Lato, sans-serif', color: 'var(--muted-foreground)', margin: 0, textAlign: 'center' }}>
        Please wait while we establish the connection.
      </p>
    </div>
  );

  // ── Success ──
  const renderSuccess = () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '40px 0' }}>
      <CheckCircle2 style={{ width: 56, height: 56, color: 'var(--status-green-primary)' }} />
      <p style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)', margin: 0 }}>
        Printer Connected!
      </p>
      <p style={{ fontSize: 14, fontFamily: 'Lato, sans-serif', color: 'var(--muted-foreground)', margin: 0 }}>
        {connectingName} is ready to use.
      </p>
    </div>
  );

  // ── Failed ──
  const renderFailed = () => (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '32px 0 24px' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          backgroundColor: 'var(--status-red-container)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <XCircle style={{ width: 32, height: 32, color: 'var(--status-red-primary)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <p style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)', margin: 0 }}>
            Connection Failed
          </p>
          <p style={{ fontSize: 14, fontFamily: 'Lato, sans-serif', color: 'var(--muted-foreground)', margin: 0, textAlign: 'center' }}>
            The pairing code you entered is incorrect. Please try again.
          </p>
        </div>
      </div>
      <DialogFooter>
        <MainBtn variant="secondary" size="lg" onClick={() => setStep('BT_SCAN')} style={{ flex: 1 }}>
          Cancel
        </MainBtn>
        <MainBtn variant="primary" size="lg" onClick={() => { setPin(''); setStep('BT_PIN'); }} style={{ flex: 1 }}>
          Try Again
        </MainBtn>
      </DialogFooter>
    </>
  );

  const renderStep = () => {
    switch (step) {
      case 'SELECT_TYPE': return renderSelectType();
      case 'LAN_SCAN': return renderLanScan();
      case 'LAN_MANUAL_FORM': return renderLanManualForm();
      case 'BT_SCAN': return renderBtScan();
      case 'BT_PIN': return renderBtPin();
      case 'CONNECTING': return renderConnecting();
      case 'SUCCESS': return renderSuccess();
      case 'FAILED': return renderFailed();
    }
  };

  const noClose = step === 'CONNECTING' || step === 'SUCCESS';

  return (
    <Dialog open={open} onOpenChange={v => { if (!v && !noClose) onClose(); }}>
      <DialogContent
        className="sm:max-w-[520px]"
        aria-describedby={undefined}
        style={{
          display: 'flex', flexDirection: 'column',
          maxHeight: '90vh', overflow: 'hidden',
          width: '100%', boxSizing: 'border-box',
        }}
      >
        <DialogHeader style={{ flexShrink: 0 }}>
          <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 700, fontFamily: 'Lato, sans-serif' }}>
            {TITLES[step]}
          </DialogTitle>
        </DialogHeader>
        <div style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          paddingTop: 4, width: '100%', boxSizing: 'border-box',
        }}>
          {renderStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Rename Dialog ────────────────────────────────────────────────────────────

function RenameDialog({ open, currentName, onClose, onSave }: {
  open: boolean; currentName: string; onClose: () => void; onSave: (n: string) => void;
}) {
  const [name, setName] = useState(currentName);
  useEffect(() => { if (open) setName(currentName); }, [open, currentName]);
  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-[420px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 700, fontFamily: 'Lato, sans-serif' }}>
            Rename Printer
          </DialogTitle>
        </DialogHeader>
        <div style={{ padding: '8px 0 16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{
              fontSize: 'var(--text-label)',
              fontWeight: 'var(--font-weight-semibold)',
              fontFamily: 'Lato, sans-serif',
              color: 'var(--neutral-onsurface-primary)',
            }}>
              Printer Name
            </span>
            <TextField
              placeholder="e.g. Kitchen Printer"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ height: 48 }}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <MainBtn variant="secondary" size="lg" onClick={onClose} style={{ flex: 1 }}>Cancel</MainBtn>
          <MainBtn variant="primary" size="lg" disabled={!name.trim()} onClick={() => onSave(name.trim())} style={{ flex: 1 }}>Save</MainBtn>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Remove Dialog ────────────────────────────────────────────────────────────

function RemoveDialog({ open, printerName, onClose, onConfirm }: {
  open: boolean; printerName: string; onClose: () => void; onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-[420px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle style={{ fontSize: 'var(--text-h3)', fontWeight: 700, fontFamily: 'Lato, sans-serif' }}>
            Remove Printer
          </DialogTitle>
        </DialogHeader>
        <div style={{ padding: '8px 0 16px' }}>
          <p style={{ fontSize: 15, fontFamily: 'Lato, sans-serif', color: 'var(--neutral-onsurface-primary)', margin: 0, lineHeight: 1.6 }}>
            Are you sure you want to remove <strong>{printerName}</strong>? This will disconnect the printer from the POS.
          </p>
        </div>
        <DialogFooter>
          <MainBtn variant="secondary" size="lg" onClick={onClose} style={{ flex: 1 }}>Cancel</MainBtn>
          <MainBtn variant="destructive" size="lg" onClick={onConfirm} style={{ flex: 1 }}>Remove</MainBtn>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function PrinterSettings() {
  const navigate = useNavigate();
  const snackbar = useSnackbar();
  const { setCurrentRole, setPosProfile } = useRestaurant();

  const [printers, setPrinters] = useState<PrinterDevice[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [renameTarget, setRenameTarget] = useState<PrinterDevice | null>(null);
  const [removeTarget, setRemoveTarget] = useState<PrinterDevice | null>(null);

  const handleAdd = (data: Omit<PrinterDevice, 'id' | 'status'>) => {
    setPrinters(prev => [...prev, { id: `printer-${Date.now()}`, status: 'CONNECTED', ...data }]);
  };

  const handleRename = (id: string, name: string) => {
    setPrinters(prev => prev.map(p => p.id === id ? { ...p, name } : p));
    setRenameTarget(null);
  };

  const handleRemove = (id: string) => {
    setPrinters(prev => prev.filter(p => p.id !== id));
    setRemoveTarget(null);
  };

  const handleDisconnect = (id: string) => {
    setPrinters(prev => prev.map(p => p.id === id ? { ...p, status: 'OFFLINE' } : p));
  };

  // Returns true on success, false on failure (70% success rate for demo)
  const handleReconnect = async (id: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 1800));
    const success = Math.random() > 0.3;
    if (success) {
      setPrinters(prev => prev.map(p => p.id === id ? { ...p, status: 'CONNECTED' } : p));
    }
    return success;
  };

  const handleSwitchToPOSEmptyMenu = () => {
    setPosProfile('POS_EMPTY_MENU');
    setCurrentRole('FOH');
    snackbar.success('Switched to POS Cashier (Empty Menu)');
    navigate('/');
  };

  const handleSwitchToPOS = () => {
    setPosProfile('POS_CASHIER');
    setCurrentRole('FOH');
    snackbar.success('Switched to POS Cashier');
    navigate('/');
  };

  const handleSwitchToKitchen = () => {
    setCurrentRole('KITCHEN');
    snackbar.success('Switched to Kitchen');
    navigate('/kitchen');
  };

  const handleSwitchToBar = () => {
    setCurrentRole('BAR');
    snackbar.success('Switched to Bar');
    navigate('/bar');
  };

  const handleLogout = () => {
    snackbar.success('Logged out successfully');
    navigate('/login');
  };

  // Returns true on success (70% success rate for demo)
  const handleTestPrint = async (_id: string): Promise<boolean> => {
    await new Promise(r => setTimeout(r, 1500));
    return Math.random() > 0.3;
  };

  // Updates IP + name; always succeeds (IP gate is enforced inside PrinterCard).
  const handleEdit = async (id: string, newIp: string, newName: string): Promise<boolean> => {
    setPrinters(prev => prev.map(p => p.id === id ? { ...p, address: newIp, name: newName, status: 'CONNECTED' } : p));
    return true;
  };

  const connectedPrinters = printers.filter(p => p.status === 'CONNECTED');
  const offlinePrinters = printers.filter(p => p.status === 'OFFLINE' || p.status === 'CONNECTING');

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--background)', fontFamily: 'Lato, sans-serif' }}>

      {/* ── Header ── */}
      <div style={{
        height: 72,
        backgroundColor: 'var(--card)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', gap: 16, flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{
                fontSize: 'var(--text-h3)', fontWeight: 700,
                color: 'var(--neutral-onsurface-primary)',
                fontFamily: 'Lato, sans-serif', margin: 0,
              }}>
                Printer Settings
              </h1>
              {printers.length > 0 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  padding: '3px 10px', borderRadius: 9999,
                  backgroundColor: 'var(--feature-brand-container)',
                  fontSize: 13, fontWeight: 600, color: 'var(--feature-brand-oncontainer)',
                  fontFamily: 'Lato, sans-serif',
                }}>
                  {printers.length} {printers.length === 1 ? 'printer' : 'printers'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <MainBtn
            variant="primary"
            size="md"
            onClick={() => setShowAdd(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
          >
            <Plus style={{ width: 18, height: 18 }} />
            Add Printer
          </MainBtn>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MainBtn
                size="lg"
                style={{ backgroundColor: '#e6f0ff', borderColor: '#b3d9ff', borderWidth: '1.5px', color: '#282828', fontWeight: 600 }}
                className="min-w-[56px]"
              >
                <Menu className="w-5 h-5" />
              </MainBtn>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuItem
                onClick={handleSwitchToPOSEmptyMenu}
                className="h-12 cursor-pointer"
                style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--neutral-surface-greylighter)'; e.currentTarget.style.color = 'var(--neutral-onsurface-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''; }}
              >
                <UtensilsCrossed className="w-5 h-5" />
                <span style={{ whiteSpace: 'nowrap' }}>POS Cashier (Empty Menu)</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSwitchToPOS}
                className="h-12 cursor-pointer"
                style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--neutral-surface-greylighter)'; e.currentTarget.style.color = 'var(--neutral-onsurface-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''; }}
              >
                <UtensilsCrossed className="w-5 h-5" />
                <span>POS Cashier</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSwitchToKitchen}
                className="h-12 cursor-pointer"
                style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--neutral-surface-greylighter)'; e.currentTarget.style.color = 'var(--neutral-onsurface-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''; }}
              >
                <ChefHat className="w-5 h-5" />
                <span>Kitchen</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSwitchToBar}
                className="h-12 cursor-pointer"
                style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--neutral-surface-greylighter)'; e.currentTarget.style.color = 'var(--neutral-onsurface-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''; }}
              >
                <Wine className="w-5 h-5" />
                <span>Bar</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="h-12 cursor-pointer"
                style={{ fontSize: 'var(--text-h3)', fontWeight: 'var(--font-weight-semibold)' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--neutral-surface-greylighter)'; e.currentTarget.style.color = 'var(--neutral-onsurface-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = ''; }}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── Body ── */}
      {printers.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <EmptyState
            title="No Printers Connected"
            subtitle="Add a printer to start printing receipts and KOTs"
          />
        </div>
      ) : (
        <ScrollArea style={{ flex: 1 }}>
          <div style={{ padding: 24, width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

              {/* Connected printers */}
              {connectedPrinters.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minWidth: 280 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: 'var(--muted-foreground)', fontFamily: 'Lato, sans-serif', whiteSpace: 'nowrap',
                    }}>
                      Currently Connected
                    </span>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '2px 8px', borderRadius: 9999,
                      backgroundColor: 'var(--status-green-container)',
                      fontSize: 11, fontWeight: 700, color: 'var(--status-green-primary)',
                      fontFamily: 'Lato, sans-serif',
                    }}>
                      {connectedPrinters.length}
                    </span>
                    <div style={{ flex: 1, height: 1, backgroundColor: 'var(--neutral-line-outline)' }} />
                  </div>
                  {connectedPrinters.map(printer => (
                    <PrinterCard
                      key={printer.id}
                      printer={printer}
                      onTestPrint={() => handleTestPrint(printer.id)}
                      onRename={() => setRenameTarget(printer)}
                      onDisconnect={() => handleDisconnect(printer.id)}
                      onReconnect={() => handleReconnect(printer.id)}
                      onEdit={(newIp, newName) => handleEdit(printer.id, newIp, newName)}
                      onRemove={() => setRemoveTarget(printer)}
                    />
                  ))}
                </div>
              )}

              {/* Offline / Previously Added */}
              {offlinePrinters.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minWidth: 280 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: 'var(--muted-foreground)', fontFamily: 'Lato, sans-serif', whiteSpace: 'nowrap',
                    }}>
                      Not Connected
                    </span>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center',
                      padding: '2px 8px', borderRadius: 9999,
                      backgroundColor: 'var(--status-red-container)',
                      fontSize: 11, fontWeight: 700, color: 'var(--status-red-primary)',
                      fontFamily: 'Lato, sans-serif',
                    }}>
                      {offlinePrinters.length}
                    </span>
                    <div style={{ flex: 1, height: 1, backgroundColor: 'var(--neutral-line-outline)' }} />
                  </div>
                  {offlinePrinters.map(printer => (
                    <PrinterCard
                      key={printer.id}
                      printer={printer}
                      onTestPrint={() => handleTestPrint(printer.id)}
                      onRename={() => setRenameTarget(printer)}
                      onDisconnect={() => handleDisconnect(printer.id)}
                      onReconnect={() => handleReconnect(printer.id)}
                      onEdit={(newIp, newName) => handleEdit(printer.id, newIp, newName)}
                      onRemove={() => setRemoveTarget(printer)}
                    />
                  ))}
                </div>
              )}

            </div>
          </div>
        </ScrollArea>
      )}

      {/* ── Dialogs ── */}
      <AddPrinterDialog open={showAdd} onClose={() => setShowAdd(false)} onAdd={handleAdd} />
      <RenameDialog
        open={!!renameTarget}
        currentName={renameTarget?.name ?? ''}
        onClose={() => setRenameTarget(null)}
        onSave={name => renameTarget && handleRename(renameTarget.id, name)}
      />
      <RemoveDialog
        open={!!removeTarget}
        printerName={removeTarget?.name ?? ''}
        onClose={() => setRemoveTarget(null)}
        onConfirm={() => removeTarget && handleRemove(removeTarget.id)}
      />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
