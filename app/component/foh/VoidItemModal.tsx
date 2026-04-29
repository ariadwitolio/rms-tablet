import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { MainBtn } from '../ui/MainBtn';
import { AlertTriangle } from 'lucide-react';
import { useSnackbar } from '../labamu/Snackbar';

interface VoidItemModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  onConfirm: (data: { reason: string; managerPin: string }) => void;
  onCancel: () => void;
}

export function VoidItemModal({
  open,
  onOpenChange,
  itemName,
  onConfirm,
  onCancel
}: VoidItemModalProps) {
  const snackbar = useSnackbar();
  const [reason, setReason] = useState('');
  const [managerPin, setManagerPin] = useState('');

  const handleConfirm = () => {
    // Validate inputs
    if (!reason.trim()) {
      snackbar.error('Please provide a reason for voiding');
      return;
    }
    if (!managerPin.trim()) {
      snackbar.error('Manager PIN is required');
      return;
    }

    onConfirm({ reason, managerPin });
    
    // Reset state
    setReason('');
    setManagerPin('');
  };

  const handleCancel = () => {
    setReason('');
    setManagerPin('');
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle style={{ fontSize: '20px', fontWeight: 'var(--font-weight-bold)' }}>
            Void Item
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Warning Message */}
          <div 
            className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20"
            style={{ borderRadius: 'var(--radius-card)' }}
          >
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--destructive)' }}>
                You are about to void:
              </p>
              <p style={{ fontSize: 'var(--text-p)', fontWeight: 'var(--font-weight-bold)' }}>
                {itemName}
              </p>
            </div>
          </div>

          {/* Void Reason */}
          <div className="space-y-2">
            <Label style={{ fontSize: '16px', fontWeight: 'var(--font-weight-regular)' }}>
              Reason for Void <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="e.g., Customer cancelled order, Kitchen error..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
              style={{ 
                borderRadius: 'var(--radius-input)', 
                fontSize: 'var(--text-p)',
                border: '1px solid var(--neutral-10)'
              }}
            />
          </div>

          {/* Manager PIN */}
          <div className="space-y-2">
            <Label style={{ fontSize: '16px', fontWeight: 'var(--font-weight-regular)' }}>
              Manager PIN <span className="text-destructive">*</span>
            </Label>
            <input
              type="password"
              placeholder="Enter manager PIN"
              value={managerPin}
              onChange={(e) => setManagerPin(e.target.value)}
              className="w-full px-4 py-3 border border-[var(--neutral-10)] bg-white rounded-[var(--radius-input)] outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              style={{ fontSize: 'var(--text-p)' }}
              maxLength={4}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <MainBtn
            onClick={handleCancel}
            variant="secondary"
            size="lg"
            className="flex-1"
          >
            Cancel
          </MainBtn>
          <MainBtn
            onClick={handleConfirm}
            variant="destructive"
            size="lg"
            className="flex-1"
          >
            Confirm Void
          </MainBtn>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
